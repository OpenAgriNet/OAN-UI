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
const RECOMMENDATION_TABLE_RE =
	/<table\b(?=[^>]*\bclass\s*=\s*(?:"[^"]*\brecommendations\b[^"]*"|'[^']*\brecommendations\b[^']*'))[^>]*>[\s\S]*?<\/table>/gi;
const RECOMMENDATION_NOTE_RE = /<span\b[^>]*>\s*(Note:[\s\S]*?)<\/span>/i;
const FOSTERED_RECOMMENDATION_NOTE_RE =
	/<span\b[^>]*>\s*(Note:[\s\S]*?)<\/span>\s*(<table\b(?=[^>]*\bclass\s*=\s*(?:"[^"]*\brecommendations\b[^"]*"|'[^']*\brecommendations\b[^']*'))[^>]*>[\s\S]*?<\/table>)/gi;
const EMPTY_TABLE_BODY_RE = /(<tbody\b[^>]*>)\s*(<\/tbody>)/i;
const TABLE_HEAD_OPEN_RE = /<thead\b[^>]*>/i;

const SHC_PDF_LAYOUT_STYLE = `<style data-shc-pdf-layout>
.recommendation-section{display:flow-root!important;text-transform:none!important}
.recommendation-section>h2{line-height:1.3!important;margin:8px 0 5px!important;text-transform:uppercase!important}
table.recommendations{break-inside:avoid!important;margin:0!important;page-break-inside:avoid!important}
table.recommendations th,table.recommendations td{height:auto!important;line-height:1.3!important;overflow-wrap:break-word!important;position:static!important;white-space:normal!important}
table.recommendations tr[data-shc-pdf-recommendation-note] th{background:#f2f8f4!important;color:#17211b!important;font:normal normal normal 9px/14px Arial,"Noto Sans Gujarati",sans-serif!important;padding:8px!important;text-align:left!important;text-transform:none!important;white-space:normal!important}
</style>`;

function recommendationNoteRow(noteContent: string): string {
	return `<tr data-shc-pdf-recommendation-note>
<th colspan="4" style="background:#f2f8f4!important;color:#17211b!important;font:normal normal normal 9px/14px Arial,'Noto Sans Gujarati',sans-serif!important;padding:10px 8px!important;text-align:left!important;text-transform:none!important;white-space:normal!important;">${noteContent.trim()}</th>
</tr>`;
}

function insertRecommendationNoteRow(table: string, noteContent: string): string {
	if (table.includes("data-shc-pdf-recommendation-note")) return table;
	return table.replace(
		TABLE_HEAD_OPEN_RE,
		(thead) => `${thead}${recommendationNoteRow(noteContent)}`
	);
}

const EMPTY_RECOMMENDATION_ROW = `<tr data-shc-pdf-empty-recommendation>
<td colspan="4" style="background:#fff;color:#17211b;font-size:8px;line-height:1.4;padding:6px;text-align:left;text-transform:none;">
No crop-specific fertilizer recommendation is listed on this card.
</td>
</tr>`;

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
		return (
			url.pathname.startsWith(prefix) &&
			SHC_REPORT_ASSET_NAMES.has(url.pathname.slice(prefix.length))
		);
	} catch {
		return false;
	}
}

export function rewriteShcAssetUrlsForPdf(document: string): string {
	return document.replaceAll(SHC_REPORT_ASSET_ROOT, LOCAL_SHC_REPORT_ASSET_ROOT);
}

/**
 * Make provider-owned SHC markup deterministic for the canvas PDF renderer.
 *
 * The current provider report puts its recommendation note directly inside a
 * table between `thead` and `tbody`. That is invalid HTML: browsers repair it
 * using table foster-parenting, while html2canvas can paint the note on top of
 * the header. Put the note in a real, full-width table row so the renderer must
 * reserve its height, and make an empty recommendation table explicit instead
 * of leaving a misleading blank body.
 */
export function prepareShcDocumentForPdf(document: string): string {
	const withLocalAssets = rewriteShcAssetUrlsForPdf(document);
	const withFosteredNotesRepaired = withLocalAssets.replace(
		FOSTERED_RECOMMENDATION_NOTE_RE,
		(_match, noteContent: string, table: string) => insertRecommendationNoteRow(table, noteContent)
	);
	const withNormalizedRecommendations = withFosteredNotesRepaired.replace(
		RECOMMENDATION_TABLE_RE,
		(table) => {
			const note = table.match(RECOMMENDATION_NOTE_RE);
			const noteContent = note?.[1]?.trim();
			let normalizedTable = note ? table.replace(note[0], "") : table;
			if (noteContent) {
				normalizedTable = insertRecommendationNoteRow(normalizedTable, noteContent);
			}
			if (EMPTY_TABLE_BODY_RE.test(normalizedTable)) {
				normalizedTable = normalizedTable.replace(
					EMPTY_TABLE_BODY_RE,
					`$1${EMPTY_RECOMMENDATION_ROW}$2`
				);
			}
			return normalizedTable;
		}
	);

	return withNormalizedRecommendations.replace(/<\/head>/i, `${SHC_PDF_LAYOUT_STYLE}</head>`);
}
