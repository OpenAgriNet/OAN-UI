import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { Download, Expand, FileText, LoaderCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import type { SoilHealthCardArtifact } from "@/lib/chat-artifacts";
import {
	isAllowedShcImageSource,
	rewriteShcAssetUrlsForPdf,
	SHC_FRAME_CSP
} from "@/lib/shc-document";

const PDF_OPTIONS = {
	margin: [8, 8, 8, 8] as [number, number, number, number],
	enableLinks: false,
	image: { type: "jpeg" as const, quality: 0.98 },
	html2canvas: {
		allowTaint: false,
		backgroundColor: "#ffffff",
		imageTimeout: 15_000,
		logging: false,
		scale: 2,
		useCORS: true
	},
	jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const }
};

export function buildSafeHtmlDocument(source: string): string {
	const clean = DOMPurify.sanitize(source, {
		FORBID_TAGS: [
			"script",
			"iframe",
			"object",
			"embed",
			"form",
			"input",
			"button",
			"textarea",
			"select",
			"svg",
			"image",
			"video",
			"audio",
			"source",
			"link",
			"meta",
			"base"
		],
		FORBID_ATTR: ["srcset", "formaction"]
	});
	const template = window.document.createElement("template");
	template.innerHTML = clean;
	for (const image of template.content.querySelectorAll("img[src]")) {
		if (!isAllowedShcImageSource(image.getAttribute("src") ?? "")) {
			image.remove();
		}
	}
	// CSS resource URLs and imports would bypass the img[src] allow-list during
	// local PDF rendering. SHC's required presentation CSS has neither.
	for (const style of template.content.querySelectorAll("style")) {
		if (/@import|url\s*\(|\\/i.test(style.textContent ?? "")) style.remove();
	}
	for (const element of template.content.querySelectorAll<HTMLElement>("[style]")) {
		if (/url\s*\(|\\/i.test(element.getAttribute("style") ?? "")) {
			element.removeAttribute("style");
		}
	}
	const safeContent = template.innerHTML;
	return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${SHC_FRAME_CSP}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
html{color:#17211b;background:#fff;font-family:Arial,"Noto Sans Gujarati",sans-serif;font-size:14px}
body{margin:0;padding:16px;overflow-wrap:anywhere}img{max-width:100%;height:auto}
table{width:100%;border-collapse:collapse}th,td{border:1px solid #d7ded9;padding:7px;text-align:left;vertical-align:top}
th{background:#f2f8f4}h1,h2,h3{color:#126333;line-height:1.25}a{color:#126333}
</style>
</head>
<body>${safeContent}</body>
</html>`;
}

export async function renderHtmlDocumentToPdf(document: string): Promise<Blob> {
	// Keep the sizeable renderer out of the initial chat bundle. The sanitized
	// report is rendered locally; private SHC HTML is never sent to a converter.
	const { default: html2pdf } = await import("html2pdf.js");
	// The government asset server returns a non-standard CORS header. Route its
	// fixed report artwork through the same-origin UI proxy so canvas can include
	// it in the PDF. The in-app iframe still loads it directly inside its sandbox.
	const pdfDocument = rewriteShcAssetUrlsForPdf(document);
	const result = await html2pdf().set(PDF_OPTIONS).from(pdfDocument).outputPdf("blob");
	if (!(result instanceof Blob)) {
		throw new Error("PDF renderer did not return a file");
	}
	return result;
}

function saveBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const anchor = window.document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function ReportFrame({
	document,
	title,
	expanded = false
}: {
	document: string;
	title: string;
	expanded?: boolean;
}) {
	return (
		<iframe
			title={title}
			sandbox=""
			referrerPolicy="no-referrer"
			srcDoc={document}
			className={
				expanded
					? "h-[76vh] w-full rounded-lg border bg-white"
					: "h-[26rem] w-full rounded-lg border bg-white"
			}
		/>
	);
}

export function HtmlDocumentArtifact({ artifact }: { artifact: SoilHealthCardArtifact }) {
	const [expanded, setExpanded] = useState(false);
	const [visible, setVisible] = useState(true);
	const [exporting, setExporting] = useState(false);
	const [exportError, setExportError] = useState<string | null>(null);
	const safeDocument = useMemo(() => buildSafeHtmlDocument(artifact.content), [artifact.content]);

	const exportPdf = async () => {
		if (exporting) return;
		setExporting(true);
		setExportError(null);
		try {
			const pdf = await renderHtmlDocumentToPdf(safeDocument);
			saveBlob(pdf, `soil-health-card-${artifact.cycle}.pdf`);
		} catch (error) {
			console.error("Failed to export Soil Health Card PDF", error);
			setExportError("PDF export failed. Please try again.");
		} finally {
			setExporting(false);
		}
	};

	if (!visible) {
		return (
			<div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-white px-3 py-2.5">
				<div className="flex min-w-0 items-center gap-2">
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
						<FileText className="h-4 w-4" />
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-semibold text-[#173C27]">{artifact.title}</p>
						<p className="text-xs text-muted-foreground">Report closed</p>
					</div>
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="h-8 shrink-0 border-green-200 text-green-700"
					onClick={() => setVisible(true)}
				>
					Show report
				</Button>
			</div>
		);
	}

	return (
		<div className="mt-3 overflow-hidden rounded-xl border border-green-200 bg-green-50/40">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-green-200 bg-white px-3 py-2.5">
				<div className="flex min-w-0 items-center gap-2">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
						<FileText className="h-4 w-4" />
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-semibold text-[#173C27]">{artifact.title}</p>
						<p className="text-xs text-muted-foreground">
							Cycle {artifact.cycle} · {artifact.source}
						</p>
					</div>
				</div>
				<div className="flex gap-1">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-8 gap-1.5 text-green-700"
						onClick={() => setExpanded(true)}
					>
						<Expand className="h-3.5 w-3.5" />
						Expand
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-8 gap-1.5 text-green-700"
						onClick={exportPdf}
						disabled={exporting}
					>
						{exporting ? (
							<LoaderCircle className="h-3.5 w-3.5 animate-spin" />
						) : (
							<Download className="h-3.5 w-3.5" />
						)}
						{exporting ? "Creating PDF" : "Export PDF"}
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-foreground"
						onClick={() => {
							setExpanded(false);
							setVisible(false);
						}}
						aria-label="Close report"
						title="Close report"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<div className="p-2">
				<ReportFrame document={safeDocument} title={`${artifact.title}, cycle ${artifact.cycle}`} />
			</div>
			{exportError ? (
				<p className="px-3 pb-2 text-xs text-red-700" role="alert">
					{exportError}
				</p>
			) : null}

			<Dialog open={expanded} onOpenChange={setExpanded}>
				<DialogContent className="h-[94vh] max-w-[96vw] grid-rows-[auto_1fr] p-4 sm:max-w-6xl">
					<DialogHeader className="pr-10">
						<DialogTitle>{artifact.title}</DialogTitle>
						<DialogDescription>
							Cycle {artifact.cycle} · {artifact.source}
						</DialogDescription>
					</DialogHeader>
					<ReportFrame document={safeDocument} title={`${artifact.title}, expanded`} expanded />
				</DialogContent>
			</Dialog>
		</div>
	);
}
