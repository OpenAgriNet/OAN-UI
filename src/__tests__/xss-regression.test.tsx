import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SafeMarkdown } from "@/components/screens-component/chat-screen/components/bubbles/safe-markdown";
import { neutralizeHtmlMarkup } from "@/lib/security/html";

const xssPayload = `<iframe srcdoc="<img src=1 onerror=alert('XSS')>"></iframe>`;

describe("chat markdown XSS regression", () => {
	it("neutralizes HTML-like chat input before send", () => {
		expect(neutralizeHtmlMarkup(xssPayload)).toBe(
			"&lt;iframe srcdoc=&quot;&lt;img src=1 onerror=alert(&#x27;XSS&#x27;)&gt;&quot;&gt;&lt;/iframe&gt;"
		);
	});

	it("does not alter normal comparison text", () => {
		expect(neutralizeHtmlMarkup("soil pH < 5.5 needs lime")).toBe("soil pH < 5.5 needs lime");
	});

	it("renders submitted HTML as text instead of DOM nodes", () => {
		const html = renderToStaticMarkup(<SafeMarkdown>{xssPayload}</SafeMarkdown>);

		expect(html).not.toContain("<iframe");
		expect(html).not.toContain("<img");
		expect(html).toContain("&lt;iframe");
		expect(html).toContain("srcdoc=&quot;");
	});
});
