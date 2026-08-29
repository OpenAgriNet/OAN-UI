import { describe, expect, it } from "vitest";

import {
	CHAT_ARTIFACTS_END,
	CHAT_ARTIFACTS_START,
	parseChatWire,
} from "./chat-artifacts";

function artifactFrame(content = "<html><body><table><tr><td>pH 7</td></tr></table></body></html>") {
	const payload = {
		version: 1,
		artifacts: [
			{
				id: "shc-txn-1",
				kind: "soil_health_card",
				title: "Soil Health Card",
				media_type: "text/html",
				content,
				source: "Bharat Vistaar",
				cycle: "2024-25",
			},
		],
	};
	return `${CHAT_ARTIFACTS_START}${Buffer.from(JSON.stringify(payload), "utf8").toString("base64")}${CHAT_ARTIFACTS_END}`;
}

describe("chat artifact wire parser", () => {
	it("separates the assistant prose from a terminal SHC document", () => {
		const parsed = parseChatWire(`Your card is ready.${artifactFrame()}`);

		expect(parsed.text).toBe("Your card is ready.");
		expect(parsed.artifacts).toHaveLength(1);
		expect(parsed.artifacts[0]!.cycle).toBe("2024-25");
		expect(parsed.artifacts[0]!.content).toContain("pH 7");
		expect(parsed.pendingFrame).toBe(false);
	});

	it("holds a frame split across network chunks out of visible chat text", () => {
		const frame = artifactFrame();
		const split = "Your card is ready.\n__CHAT_ART";
		const partial = parseChatWire(split);

		expect(partial.text).toBe("Your card is ready.");
		expect(partial.pendingFrame).toBe(true);
		expect(parseChatWire(`Your card is ready.${frame}`).artifacts).toHaveLength(1);
	});

	it("cannot be terminated by delimiter-looking provider HTML", () => {
		const parsed = parseChatWire(`Ready.${artifactFrame(`<p>${CHAT_ARTIFACTS_END}</p>)`)}`);

		expect(parsed.artifacts).toHaveLength(1);
		expect(parsed.artifacts[0]!.content).toContain(CHAT_ARTIFACTS_END);
	});

	it("continues to parse the existing suggestions frame", () => {
		const parsed = parseChatWire('Answer.__SUGGESTIONS__["One","Two"]__END_SUGGESTIONS__');

		expect(parsed.text).toBe("Answer.");
		expect(parsed.suggestions).toEqual(["One", "Two"]);
	});
});
