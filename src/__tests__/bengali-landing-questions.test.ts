import { describe, expect, it } from "vitest";

import translationsJson from "../../translations/bn.json";

type BengaliTranslations = {
	pinnedQuestions: string[];
	fixedQuestions: string[];
};

const translations = translationsJson as BengaliTranslations;

describe("Bengali landing questions", () => {
	it("keeps all six chat-triggering questions populated", () => {
		expect(translations.pinnedQuestions).toHaveLength(2);
		expect(translations.fixedQuestions).toHaveLength(4);
		expect(
			[...translations.pinnedQuestions, ...translations.fixedQuestions]
				.every(question => question.trim().length > 0)
		).toBe(true);
	});

	it("makes the earnings question explicitly about supported milk records", () => {
		expect(translations.fixedQuestions[0]).toContain("দুধ বিক্রি");
	});
});
