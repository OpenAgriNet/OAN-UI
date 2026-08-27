export const SHC_ASSET_ORIGIN = "https://soilhealth.dac.gov.in";
export const SHC_REPORT_ASSET_ROOT = `${SHC_ASSET_ORIGIN}/files/report/`;
export const LOCAL_SHC_REPORT_ASSET_ROOT = "/shc-assets/";
const SHC_REPORT_ASSET_NAMES = new Set([
	"SHCLogo.png",
	"green.png",
	"yellow.png",
	"orange.png",
	"red.png",
	"grey.png"
]);
const INLINE_RASTER_IMAGE_RE = /^data:image\/(?:gif|jpe?g|png|webp);base64,/i;

export const SHC_FRAME_CSP = [
	"default-src 'none'",
	`img-src data: ${SHC_ASSET_ORIGIN}`,
	"style-src 'unsafe-inline'",
	"font-src data:",
	"base-uri 'none'",
	"form-action 'none'",
	"frame-ancestors 'none'"
].join("; ");

export function isAllowedShcImageSource(source: string): boolean {
	const value = source.trim();
	if (INLINE_RASTER_IMAGE_RE.test(value)) return true;
	try {
		const url = new URL(value);
		if (url.origin !== SHC_ASSET_ORIGIN || url.search || url.hash) return false;
		const prefix = "/files/report/";
		return url.pathname.startsWith(prefix) && SHC_REPORT_ASSET_NAMES.has(url.pathname.slice(prefix.length));
	} catch {
		return false;
	}
}

export function rewriteShcAssetUrlsForPdf(document: string): string {
	return document.replaceAll(SHC_REPORT_ASSET_ROOT, LOCAL_SHC_REPORT_ASSET_ROOT);
}
