import { describe, expect, it } from "vitest";

import { normalizeMathDelimiters } from "./math-delimiters";

describe("normalizeMathDelimiters", () => {
	it("converts escaped inline and block LaTeX delimiters in plain text", () => {
		const input = "Inline \\( a + b \\) and block: \\[ x^2 + y^2 = z^2 \\].";

		const output = normalizeMathDelimiters(input);

		expect(output).toBe(
			"Inline $a + b$ and block: \n$$\nx^2 + y^2 = z^2\n$$\n."
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
});
