import { describe, expect, it } from "vitest";
import { joinApiUrl, normalizeApiBaseUrl, splitPathAndSuffix } from "./join-api-url";

describe("normalizeApiBaseUrl", () => {
	it("strips trailing slashes", () => {
		expect(normalizeApiBaseUrl("/api/")).toBe("/api");
		expect(normalizeApiBaseUrl("https://x.com/api///")).toBe("https://x.com/api");
	});
});

describe("joinApiUrl", () => {
	it("joins base /api with chat segment", () => {
		expect(joinApiUrl("/api", "chat")).toBe("/api/chat");
	});

	it("tolerates slashes in segments", () => {
		expect(joinApiUrl("/api", "/chat/")).toBe("/api/chat");
		expect(joinApiUrl("/api/", "chat")).toBe("/api/chat");
	});

	it("avoids duplicate /api when base is already /api", () => {
		expect(joinApiUrl("/api", "chat")).toBe("/api/chat");
	});

	it("joins empty base to path starting with api", () => {
		expect(joinApiUrl("", "api", "chat")).toBe("/api/chat");
	});

	it("joins root-style base", () => {
		expect(joinApiUrl("/", "api", "chat")).toBe("/api/chat");
	});

	it("joins nested paths", () => {
		expect(joinApiUrl("/api", "feedback/positive")).toBe("/api/feedback/positive");
	});

	it("joins full https base", () => {
		expect(joinApiUrl("https://example.com/api", "chat")).toBe("https://example.com/api/chat");
	});
});

describe("splitPathAndSuffix", () => {
	it("splits query from path", () => {
		const { pathname, suffix } = splitPathAndSuffix("auth/v1/token?grant_type=password");
		expect(pathname).toBe("auth/v1/token");
		expect(suffix).toBe("?grant_type=password");
	});
});
