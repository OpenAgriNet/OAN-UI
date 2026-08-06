import { describe, expect, it } from "vitest";

import { normalizeMathDelimiters } from "./math-delimiters";

describe("normalizeMathDelimiters", () => {
	it("converts escaped inline and inline-position block delimiters in plain text", () => {
		const input = "Inline \\( a + b \\) and block: \\[ \\pi r^2 \\].";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe("Inline $a + b$ and block: $$\\pi r^2$$.");
	});

	// Deliberate trade-off: `\[...\]` around pure-ASCII maths stays literal, because requiring a
	// LaTeX control sequence is the only thing that reliably tells a formula apart from a citation.
	// No response has been observed using this form; mangled citations were a live defect.
	it("leaves block delimiters around pure-ASCII maths literal", () => {
		const input = ["Summary:", "\\[ x^2 + y^2 = z^2 \\]", "Done."].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
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

	it("emits block math with line breaks when standalone block math is a LaTeX formula", () => {
		const input = ["Summary:", "\\[ \\pi r^2 \\]", "Done."].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(["Summary:", "$$", "\\pi r^2", "$$", "Done."].join("\n"));
	});

	it("keeps table row structure by converting block math in-place", () => {
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

	it("keeps list structure by converting block math in-place", () => {
		const input = ["- Yield: \\[ x = a\\cdot b \\]", "- Ratio: \\[ y = c\\cdot d \\]"].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(["- Yield: $$x = a\\cdot b$$", "- Ratio: $$y = c\\cdot d$$"].join("\n"));
	});

	// `$...$` and `$$...$$` belong entirely to remark-math. The normalizer must not touch them:
	// responses use `$...$` for maths constantly, and rewriting it is what made formulas render
	// as raw LaTeX source.
	it("leaves single-dollar math untouched", () => {
		const input = "For 4.8% fat that is $15 \\times 4.8 = 720$ grams.";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("leaves dollar prose untouched, including currency", () => {
		const input = "Price moved from $5 to $10 today.";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("leaves block dollar math untouched", () => {
		const input = "Formula:\n\n$$\n\\pi r^2\n$$\n";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	// The strings below are taken from two months of production chat, where every observed
	// `\[...\]` was a citation or a source attribution and none was display math.
	it("leaves numeric citation markers untouched", () => {
		const input = "પ્રજનન કરાવો. \\[1\\]\\[2\\]";

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
			"પ્રજનન કરાવો. \\[1\\]\\[2\\] આ મહત્વનું છે અને દરરોજ આપો. \\[doc-56db97fcf363\\]";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("leaves a standalone source attribution untouched", () => {
		const input = ["Summary text.", "\\[Source: Scientific herd nutrition guidelines\\]"].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	// A bare operator is not a math signal: citation text routinely contains one.
	it.each([
		["greater-than", "Text. \\[Source: pH > 7 guidelines\\]"],
		["underscore", "See \\[doc_milk_yield\\]"],
		["plus", "See \\[Source: A+ dairy handbook\\]"],
		["equals", "See \\[Source: yield = high handbook\\]"]
	])("leaves a citation containing a bare %s operator untouched", (_label, input) => {
		const output = normalizeMathDelimiters(input);

		expect(output).toBe(input);
	});

	it("protects a fenced block indented by up to three spaces", () => {
		const input = ["   ```", "\\(a+b\\)", "   ```", "Outside: \\(c+d\\)"].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(["   ```", "\\(a+b\\)", "   ```", "Outside: $c+d$"].join("\n"));
	});

	it("recognises a closing fence indented by up to three spaces", () => {
		const input = ["```", "code", "   ```", "Outside: \\(c+d\\)"].join("\n");

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(["```", "code", "   ```", "Outside: $c+d$"].join("\n"));
	});
});
