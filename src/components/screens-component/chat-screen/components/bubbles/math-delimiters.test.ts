import { describe, expect, it } from "vitest";

import { normalizeMathDelimiters } from "./math-delimiters";

describe("normalizeMathDelimiters", () => {
	it("converts escaped inline and inline-position block delimiters in plain text", () => {
		const input = "Inline \\( a + b \\) and block: \\[ x^2 + y^2 = z^2 \\].";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(
			"Inline $$a + b$$ and block: $$x^2 + y^2 = z^2$$."
		);
	});

	it("keeps escaped delimiters inside inline code spans literal", () => {
		const input = "Code `\\(a+b\\)` should stay literal, but \\(c+d\\) should render.";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe("Code `\\(a+b\\)` should stay literal, but $$c+d$$ should render.");
	});

	it("keeps escaped delimiters inside fenced code blocks literal", () => {
		const input = [
			"```ts",
			"const formula = \"\\\\(a+b\\\\)\";",
			"```",
			"",
			"Outside fence: \\(x+y\\)"
		].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(
			[
				"```ts",
				"const formula = \"\\\\(a+b\\\\)\";",
				"```",
				"",
				"Outside fence: $$x+y$$"
			].join("\n")
		);
	});

	it("supports tilde-fenced blocks the same way as backtick fences", () => {
		const input = ["~~~md", "\\(a+b\\)", "~~~", "", "\\(m+n\\)"].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(["~~~md", "\\(a+b\\)", "~~~", "", "$$m+n$$"].join("\n"));
	});

	it("treats an unclosed fenced block as protected until end of message", () => {
		const input = ["```", "\\(a+b\\)"].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("emits block math with line breaks when escaped block math is standalone", () => {
		const input = ["Summary:", "\\[ x^2 + y^2 = z^2 \\]", "Done."].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(["Summary:", "$$", "x^2 + y^2 = z^2", "$$", "Done."].join("\n"));
	});

	it("keeps table row structure by converting escaped block math in-place", () => {
		const input = [
			"| Metric | Formula |",
			"| --- | --- |",
			"| Area | \\[ \\pi r^2 \\] |",
			"| Circumference | \\[ 2\\pi r \\] |"
		].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(
			[
				"| Metric | Formula |",
				"| --- | --- |",
				"| Area | $$\\pi r^2$$ |",
				"| Circumference | $$2\\pi r$$ |"
			].join("\n")
		);
	});

	it("keeps list structure by converting escaped block math in-place", () => {
		const input = ["- Yield: \\[ x = a+b \\]", "- Ratio: \\[ y = c+d \\]"].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(["- Yield: $$x = a+b$$", "- Ratio: $$y = c+d$$"].join("\n"));
	});

	it("leaves currency-like single-dollar prose untouched", () => {
		const input = "Price moved from $5 to $10 today.";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});
});
