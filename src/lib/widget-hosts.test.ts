import { describe, expect, it } from "vitest";

import { getWidgetHost, WIDGET_HOST_ID_PATTERN } from "./widget-hosts";

describe("widget host registry", () => {
	it("accepts the registered Sarlaben host", () => {
		const host = getWidgetHost("AMULAI-HOST-6c48b031");

		expect(host).toMatchObject({
			partnerName: "Sarlaben",
			allowedOrigins: ["https://sarlaben.ai"]
		});
	});

	it("rejects malformed and unregistered host IDs", () => {
		expect(WIDGET_HOST_ID_PATTERN.test("AMULAI-HOST-1234abcd")).toBe(true);
		expect(getWidgetHost("AMULAI-HOST-1234abcd")).toBeNull();
		expect(getWidgetHost("partner_a")).toBeNull();
	});
});
