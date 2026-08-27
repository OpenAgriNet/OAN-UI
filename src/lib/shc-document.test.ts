import { describe, expect, it } from "vitest";

import {
	isAllowedShcImageSource,
	prepareShcDocumentForPdf,
	rewriteShcAssetUrlsForPdf,
	SHC_ASSET_ORIGIN,
	SHC_FRAME_CSP
} from "./shc-document";

describe("Soil Health Card document policy", () => {
	it("allows images only from inline sources and the official SHC host", () => {
		expect(SHC_FRAME_CSP).toContain(`img-src data: ${SHC_ASSET_ORIGIN}`);
		expect(SHC_FRAME_CSP).not.toContain("img-src https:");
		expect(SHC_FRAME_CSP).toContain("default-src 'none'");
		expect(isAllowedShcImageSource("data:image/jpeg;base64,AA==")).toBe(true);
		expect(isAllowedShcImageSource("https://soilhealth.dac.gov.in/files/report/green.png")).toBe(
			true
		);
		expect(isAllowedShcImageSource("https://soilhealth.dac.gov.in/files/report/private.png")).toBe(
			false
		);
		expect(isAllowedShcImageSource("https://example.com/tracker.png")).toBe(false);
		expect(isAllowedShcImageSource("javascript:alert(1)")).toBe(false);
	});

	it("routes official report artwork through the same-origin PDF proxy", () => {
		const html = [
			'<img src="https://soilhealth.dac.gov.in/files/report/SHCLogo.png">',
			'<img src="https://soilhealth.dac.gov.in/files/report/green.png">',
			'<img src="https://example.com/unrelated.png">'
		].join("");

		const rewritten = rewriteShcAssetUrlsForPdf(html);

		expect(rewritten).toContain('src="/shc-assets/SHCLogo.png"');
		expect(rewritten).toContain('src="/shc-assets/green.png"');
		expect(rewritten).toContain('src="https://example.com/unrelated.png"');
	});

	it("moves the provider recommendation note into a full-width table row", () => {
		const html = `<!doctype html><html><head></head><body>
			<div class="recommendation-section">
				<h2>Recommendation</h2>
				<table class="recommendations">
					<thead><tr><th>Crop</th><th>Fertilizer Combination-1</th></tr></thead>
					<span style="text-transform: none">Note: Choose one fertilizer option.</span>
					<tbody></tbody>
				</table>
			</div>
		</body></html>`;

		const prepared = prepareShcDocumentForPdf(html);

		expect(prepared).toContain("<tr data-shc-pdf-recommendation-note>");
		expect(prepared).toMatch(
			/<th colspan="4" style="[^"]*padding:10px 8px!important[^"]*">Note: Choose one fertilizer option.<\/th>/
		);
		expect(prepared.indexOf("data-shc-pdf-recommendation-note")).toBeLessThan(
			prepared.indexOf("<th>Crop</th>")
		);
		expect(prepared).toContain("No crop-specific fertilizer recommendation is listed");
		expect(prepared).toContain("data-shc-pdf-layout");
		expect(prepared).not.toMatch(/<\/thead>\s*<span[\s\S]*?<tbody>/i);
	});

	it("keeps populated recommendation rows without adding the empty-card message", () => {
		const html = `<html><head></head><body><table class="recommendations">
			<thead><tr><th>Crop</th></tr></thead>
			<span>Note: Choose one option.</span>
			<tbody><tr><td>Wheat</td></tr></tbody>
		</table></body></html>`;

		const prepared = prepareShcDocumentForPdf(html);

		expect(prepared).toContain("Wheat");
		expect(prepared).not.toContain("No crop-specific fertilizer recommendation is listed");
	});

	it("normalizes a recommendation note already foster-parented by the browser", () => {
		const html = `<html><head></head><body><div class="recommendation-section">
			<span style="text-transform: none">Note: Choose one option.</span>
			<table class="recommendations"><thead><tr><th>Crop</th></tr></thead><tbody></tbody></table>
		</div></body></html>`;

		const prepared = prepareShcDocumentForPdf(html);

		expect(prepared).toMatch(/<th colspan="4" style="[^"]*">Note: Choose one option.<\/th>/);
		expect(prepared).not.toContain('<span style="text-transform: none">Note:');
	});
});
