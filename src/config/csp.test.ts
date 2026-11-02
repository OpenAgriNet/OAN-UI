import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
	vi.unstubAllGlobals();
	vi.unstubAllEnvs();
	vi.resetModules();
});

function mockDocument(content: string | undefined, production = true) {
	vi.stubEnv("PROD", production);
	vi.stubGlobal("document", {
		querySelector: vi.fn().mockReturnValue(content === undefined ? null : { content })
	});
	vi.stubGlobal("window", {});
}

describe("CSP style nonce", () => {
	it("passes the response nonce to Radix and its scroll-lock dependency", async () => {
		const nonce = "0123456789abcdef0123456789abcdef";
		mockDocument(nonce);

		const { cspNonce } = await import("./csp");

		expect(cspNonce).toBe(nonce);
		expect(window.__webpack_nonce__).toBe(nonce);
		expect(document.querySelector).toHaveBeenCalledWith('meta[name="csp-nonce"]');
	});

	it.each([undefined, "__CSP_NONCE__", "", "short", "x".repeat(32), '"><script>'])(
		"rejects an invalid production nonce: %s",
		async (nonce) => {
			mockDocument(nonce);

			await expect(import("./csp")).rejects.toThrow("Missing or invalid CSP nonce");
			expect(window.__webpack_nonce__).toBeUndefined();
		}
	);

	it.each([undefined, "__CSP_NONCE__"])("allows Vite development without a nonce: %s", async (nonce) => {
		mockDocument(nonce, false);

		const { cspNonce } = await import("./csp");

		expect(cspNonce).toBeUndefined();
		expect(window.__webpack_nonce__).toBeUndefined();
	});
});
