import { describe, expect, it } from "vitest";

import { normalizeChatPersona } from "./chat-persona";
import { parseBooleanFlag } from "./config/environment";

describe("chat persona", () => {
	it("normalizes signed doctor claims and defaults unknown values to farmer", () => {
		expect(normalizeChatPersona("doctor")).toBe("doctor");
		expect(normalizeChatPersona("DOCTOR")).toBe("doctor");
		expect(normalizeChatPersona("admin")).toBe("farmer");
		expect(normalizeChatPersona(undefined)).toBe("farmer");
	});

	it("enables the selector only for explicit true-like values", () => {
		expect(parseBooleanFlag("true")).toBe(true);
		expect(parseBooleanFlag("1")).toBe(true);
		expect(parseBooleanFlag("off")).toBe(false);
		expect(parseBooleanFlag(undefined)).toBe(false);
	});
});
