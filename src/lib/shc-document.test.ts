import { describe, expect, it } from "vitest";

import {
	isAllowedShcImageSource,
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
		expect(
			isAllowedShcImageSource("https://soilhealth.dac.gov.in/files/report/green.png")
		).toBe(true);
		expect(isAllowedShcImageSource("https://soilhealth.dac.gov.in/files/report/private.png")).toBe(false);
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
});
