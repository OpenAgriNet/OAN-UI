import { describe, expect, it } from "vitest";

import { normalizeMathDelimiters } from "./math-delimiters";

describe("normalizeMathDelimiters", () => {
	it("converts escaped inline and inline-position block delimiters in plain text", () => {
		const input = "Inline \\( a + b \\) and block: \\[ x^2 + y^2 = z^2 \\].";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(
			"Inline $a + b$ and block: $$x^2 + y^2 = z^2$$."
		);
	});

	it("keeps escaped delimiters inside inline code spans literal", () => {
		const input = "Code `\\(a+b\\)` should stay literal, but \\(c+d\\) should render.";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe("Code `\\(a+b\\)` should stay literal, but $c+d$ should render.");
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
				"Outside fence: $x+y$"
			].join("\n")
		);
	});

	it("supports tilde-fenced blocks the same way as backtick fences", () => {
		const input = ["~~~md", "\\(a+b\\)", "~~~", "", "\\(m+n\\)"].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(["~~~md", "\\(a+b\\)", "~~~", "", "$m+n$"].join("\n"));
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

	it("escapes currency-like dollar pairs so they render literally", () => {
		const input = "Price moved from $5 to $10 today.";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe("Price moved from \\$5 to \\$10 today.");
	});

	it("leaves genuine single-dollar math alone", () => {
		const input = "For 4.8% fat that is $15 \\times 4.8 = 720$ grams.";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("leaves percentage math alone", () => {
		const input = "Fat is $2.6\\%$ today.";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("leaves block dollar math alone", () => {
		const input = "Formula:\n\n$$\n\\pi r^2\n$$\n";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	// The strings below are taken from two months of production chat, where every observed
	// `\[...\]` was a citation or a source attribution and none was display math.
	it("leaves numeric citation markers untouched", () => {
		const input = "પ્રજનન કરાવો. \\[1]\\[2]";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("leaves document citation markers untouched", () => {
		const input = "વરસાદ પછી એક વાર. \\[doc-c3c9fec0ddfb\\]";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("does not swallow prose between two citation markers", () => {
		const input =
			"પ્રજનન કરાવો. \\[1]\\[2] આ મહત્વનું છે અને દરરોજ આપો. \\[doc-56db97fcf363\\]";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("leaves a standalone source attribution untouched", () => {
		const input = ["Summary text.", "\\[Source: Scientific herd nutrition guidelines\\]"].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("still converts standalone block math that carries a math signal", () => {
		const input = ["Summary:", "\\[ x^2 + y^2 = z^2 \\]", "Done."].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(["Summary:", "$$", "x^2 + y^2 = z^2", "$$", "Done."].join("\n"));
	});
});
