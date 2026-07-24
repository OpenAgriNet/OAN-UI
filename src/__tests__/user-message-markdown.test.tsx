import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/LanguageProvider", () => ({
	useLanguage: () => ({ language: "en" }),
}));

import { TextBubble } from "@/components/screens-component/chat-screen/components/bubbles/text-bubble";

describe("user message rendering", () => {
	it("renders Markdown links as literal user-authored text", () => {
		const text = "Open [the farm guide](https://example.com/guide)";
		const html = renderToStaticMarkup(
			<TextBubble
				message={{
					id: "user-message",
					role: "user",
					type: "text",
					createdAt: "2026-07-22T00:00:00.000Z",
					text,
				}}
			/>
		);

		expect(html).not.toContain("<a");
		expect(html).toContain("[the farm guide](https://example.com/guide)");
	});

	it("continues to render Markdown links in assistant messages", () => {
		const html = renderToStaticMarkup(
			<TextBubble
				message={{
					id: "assistant-message",
					role: "assistant",
					type: "text",
					createdAt: "2026-07-22T00:00:00.000Z",
					text: "Open [the farm guide](https://example.com/guide)",
				}}
			/>
		);

		expect(html).toContain('<a href="https://example.com/guide"');
	});
});
