import { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { Download, Expand, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { SoilHealthCardArtifact } from "@/lib/chat-artifacts";

const FRAME_CSP = [
	"default-src 'none'",
	"img-src data: blob:",
	"style-src 'unsafe-inline'",
	"font-src data:",
	"base-uri 'none'",
	"form-action 'none'",
	"frame-ancestors 'none'",
].join("; ");

export function buildSafeHtmlDocument(source: string): string {
	const clean = DOMPurify.sanitize(source, {
		FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input", "button", "textarea", "select", "link", "meta", "base"],
		FORBID_ATTR: ["srcset", "formaction"],
	});
	return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${FRAME_CSP}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
html{color:#17211b;background:#fff;font-family:Arial,"Noto Sans Gujarati",sans-serif;font-size:14px}
body{margin:0;padding:16px;overflow-wrap:anywhere}img{max-width:100%;height:auto}
table{width:100%;border-collapse:collapse}th,td{border:1px solid #d7ded9;padding:7px;text-align:left;vertical-align:top}
th{background:#f2f8f4}h1,h2,h3{color:#126333;line-height:1.25}a{color:#126333}
</style>
</head>
<body>${clean}</body>
</html>`;
}

function ReportFrame({ document, title, expanded = false }: { document: string; title: string; expanded?: boolean }) {
	return (
		<iframe
			title={title}
			sandbox=""
			referrerPolicy="no-referrer"
			srcDoc={document}
			className={expanded ? "h-[76vh] w-full rounded-lg border bg-white" : "h-[26rem] w-full rounded-lg border bg-white"}
		/>
	);
}

export function HtmlDocumentArtifact({ artifact }: { artifact: SoilHealthCardArtifact }) {
	const [expanded, setExpanded] = useState(false);
	const safeDocument = useMemo(() => buildSafeHtmlDocument(artifact.content), [artifact.content]);

	const download = () => {
		const blob = new Blob([safeDocument], { type: "text/html;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const anchor = window.document.createElement("a");
		anchor.href = url;
		anchor.download = `soil-health-card-${artifact.cycle}.html`;
		anchor.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="mt-3 overflow-hidden rounded-xl border border-green-200 bg-green-50/40">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-green-200 bg-white px-3 py-2.5">
				<div className="flex min-w-0 items-center gap-2">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
						<FileText className="h-4 w-4" />
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-semibold text-[#173C27]">{artifact.title}</p>
						<p className="text-xs text-muted-foreground">Cycle {artifact.cycle} · {artifact.source}</p>
					</div>
				</div>
				<div className="flex gap-1">
					<Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5 text-green-700" onClick={() => setExpanded(true)}>
						<Expand className="h-3.5 w-3.5" />
						Expand
					</Button>
					<Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5 text-green-700" onClick={download}>
						<Download className="h-3.5 w-3.5" />
						Download
					</Button>
				</div>
			</div>
			<div className="p-2"><ReportFrame document={safeDocument} title={`${artifact.title}, cycle ${artifact.cycle}`} /></div>

			<Dialog open={expanded} onOpenChange={setExpanded}>
				<DialogContent className="h-[94vh] max-w-[96vw] grid-rows-[auto_1fr] p-4 sm:max-w-6xl">
					<DialogHeader className="pr-10">
						<DialogTitle>{artifact.title}</DialogTitle>
						<DialogDescription>Cycle {artifact.cycle} · {artifact.source}</DialogDescription>
					</DialogHeader>
					<ReportFrame document={safeDocument} title={`${artifact.title}, expanded`} expanded />
				</DialogContent>
			</Dialog>
		</div>
	);
}
