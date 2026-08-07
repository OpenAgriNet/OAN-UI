import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";

import { chatRehypePlugins, chatRemarkPlugins } from "./markdown-plugins";

/**
 * Renders through the exact plugin configuration `CardBubble` uses, so these assertions describe
 * what a farmer sees rather than an intermediate string. Inputs marked "production" are taken
 * verbatim from two months of production chat.
 */
function render(body: string): string {
	return renderToStaticMarkup(
		createElement(ReactMarkdown, {
			remarkPlugins: chatRemarkPlugins,
			rehypePlugins: chatRehypePlugins,
			children: body
		})
	);
}

const isMath = (html: string) => html.includes('class="katex');

describe("assistant markdown rendering", () => {
	describe("maths renders", () => {
		it("renders production inline dollar maths", () => {
			const html = render("total fat is $15 \\times 4.8 = 720$ grams.");

			expect(isMath(html)).toBe(true);
			// No surviving `$` proves the delimiters were consumed. Leaving them visible is exactly
			// the "formula shows as raw LaTeX" regression that disabling single-dollar parsing caused.
			expect(html).not.toContain("$");
		});

		it("renders production percentage maths", () => {
			expect(isMath(render("ફેટ $2.6\\%$ છે."))).toBe(true);
		});

		it("renders block dollar maths as display maths", () => {
			const html = render("Formula:\n\n$$\n\\pi r^2\n$$\n");

			expect(html).toContain("katex-display");
		});
	});

	// The backend uses `\[...\]` for citations and source attributions, never for maths. These
	// must survive as plain text — rendering them as KaTeX produced unreadable, space-collapsed
	// output, which was the defect that drove several rounds of this PR.
	describe("citations stay literal", () => {
		it.each([
			["numeric markers", "પ્રજનન કરાવો. \\[1\\]\\[2\\]", "[1][2]"],
			["document id", "વરસાદ પછી. \\[doc-c3c9fec0ddfb\\]", "[doc-c3c9fec0ddfb]"],
			["source attribution", "Summary.\n\\[Source: Scientific herd nutrition guidelines\\]", "[Source: Scientific herd nutrition guidelines]"]
		])("renders %s as plain text", (_label, input, expected) => {
			const html = render(input);

			expect(isMath(html)).toBe(false);
			expect(html).toContain(expected);
		});

		it("does not swallow the prose between two citation markers", () => {
			const html = render(
				"પ્રજનન કરાવો. \\[1\\]\\[2\\] આ મહત્વનું છે અને દરરોજ આપો. \\[doc-56db97fcf363\\]"
			);

			expect(isMath(html)).toBe(false);
			expect(html).toContain("આ મહત્વનું છે અને દરરોજ આપો.");
		});

		it("keeps a citation containing an operator literal", () => {
			const html = render("Text. \\[Source: pH > 7 guidelines\\]");

			expect(isMath(html)).toBe(false);
			expect(html).toContain("[Source: pH &gt; 7 guidelines]");
		});
	});

	describe("code is never treated as maths", () => {
		it("keeps maths inside an inline code span literal", () => {
			const html = render("Use `$x^2$` in code.");

			expect(isMath(html)).toBe(false);
			expect(html).toContain("<code>$x^2$</code>");
		});

		it("keeps maths inside a fenced block literal", () => {
			expect(isMath(render("```\n$x^2$\n```"))).toBe(false);
		});

		it("keeps maths inside a fence indented up to three spaces literal", () => {
			const html = render("   ```\n$x^2$\n   ```\nAfter: $a^2$");

			expect(html).toContain("<pre>");
			// the fenced content stays literal while maths after the fence still renders
			expect(html).toContain("$x^2$");
			expect(isMath(html)).toBe(true);
		});
	});

	describe("surrounding markdown survives", () => {
		it("keeps a table intact when a cell contains maths", () => {
			const html = render("| A | B |\n|---|---|\n| Area | $\\pi r^2$ |\n| Milk | 5 L |");

			expect(html).toContain("<table>");
			expect((html.match(/<tr>/g) ?? []).length).toBe(3);
			expect(html).toContain("5 L");
			expect(isMath(html)).toBe(true);
		});

		it("keeps a list intact when an item contains maths", () => {
			const html = render("- Yield: $a+b$\n- Next bullet");

			expect((html.match(/<li>/g) ?? []).length).toBe(2);
			expect(html).toContain("Next bullet");
		});
	});

	describe("hostile model output is contained", () => {
		it("clamps oversized KaTeX dimensions", () => {
			const html = render("Note $\\rule{500em}{500em}$ end.");

			const oversized = [...html.matchAll(/[a-z-]+:([0-9.]+)em/g)].filter(
				(match) => Number(match[1]) > 50
			);
			expect(oversized).toHaveLength(0);
		});

		// KaTeX defaults to trust:false, so \href is inert. The URL still appears inside the MathML
		// <annotation> as plain text, which is harmless; what must never appear is a real link.
		it("does not emit a link for \\href", () => {
			const html = render("Note $\\href{javascript:alert(1)}{click}$ end.");

			expect(html).not.toContain("<a ");
			expect(html).not.toContain("href=");
		});
	});
});
