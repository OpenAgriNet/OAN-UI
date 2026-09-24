import { describe, expect, it } from "vitest";
import { extractAgriStackProfile, extractFarmerId, hasFarmerConsent } from "@/lib/agristack-callback";

/** Wraps an AgriStack callback body the way the backend's /api/callback/status returns it. */
const statusResponse = (body: unknown) => ({ callbackSessionId: "S1", status: "received", body });

const withConsent = {
	status: "success",
	statusCode: 200,
	consentId: 8,
	consentName: "CONTINUE WITH CONSENT",
	consentDate: "2026-09-16T13:46:34.799Z",
	message: "Success with consent",
	stateLgdCode: null,
	data: {
		farmerData: {
			centralId: "30187009346",
			farmerAadhaarHash: "a2c703b6d4a1d085bb8442c7d84df7075a2bd00341747e1362c3141f77ab5c6f",
			frNameEn: "Manohar Singh",
			landData: [{ villageLgdCode: 432681, villageName: "Raisara" }]
		},
		landData: [],
		sessionId: "Dynamic_ID"
	}
};

const withoutConsent = {
	status: "success",
	statusCode: 200,
	consentId: 8,
	consentName: "CONTINUE WITHOUT CONSENT",
	consentDate: "2026-09-16T13:43:26.771Z",
	message: "Success without consent",
	stateLgdCode: 22,
	data: { farmerData: { centralId: "30187009346" }, landData: [], sessionId: "Dynamic_ID" }
};

describe("agristack callback payloads", () => {
	it("with consent: farmer ID, name and village", () => {
		const response = statusResponse(withConsent);
		expect(hasFarmerConsent(response)).toBe(true);
		expect(extractFarmerId(response)).toBe("30187009346");
		expect(extractAgriStackProfile(response)).toEqual({ farmerName: "Manohar Singh", village: "Raisara" });
	});

	it("without consent: farmer ID only", () => {
		const response = statusResponse(withoutConsent);
		expect(hasFarmerConsent(response)).toBe(false);
		expect(extractFarmerId(response)).toBe("30187009346");
		expect(extractAgriStackProfile(response)).toBeNull();
	});

	it("without consent: name is not shown even if the payload carries it", () => {
		const leaky = { ...withConsent, consentName: "CONTINUE WITHOUT CONSENT" };
		expect(extractAgriStackProfile(statusResponse(leaky))).toBeNull();
	});

	it("missing consentName is treated as no consent", () => {
		const { consentName: _omit, ...noConsentField } = withConsent;
		expect(extractAgriStackProfile(statusResponse(noConsentField))).toBeNull();
	});
});

describe("agristack callback extraction", () => {
	it("reads top-level farmerId from the status response", () => {
		expect(extractFarmerId({ status: "received", farmerId: "F-1", body: {} })).toBe("F-1");
	});

	it("reads fields nested in the stored callback body", () => {
		const response = {
			status: "received",
			body: { consentName: "CONTINUE WITH CONSENT", data: { sessionId: "S1", farmer_id: "F-2", farmerName: "Sita Devi", villageName: "Khairagarh" } }
		};
		expect(extractFarmerId(response)).toBe("F-2");
		expect(extractAgriStackProfile(response)).toEqual({ farmerName: "Sita Devi", village: "Khairagarh" });
	});

	it("reads JSON-encoded farmer data (provider backend catalog tag format)", () => {
		const response = {
			status: "received",
			body: {
				consentName: "CONTINUE WITH CONSENT",
				tags: [
					{
						list: [
							{
								value: JSON.stringify({ frCentralId: "CG-99", farmerNameEng: "Ramu", village: "Bemetara" })
							}
						]
					}
				]
			}
		};
		expect(extractFarmerId(response)).toBe("CG-99");
		expect(extractAgriStackProfile(response)).toEqual({ farmerName: "Ramu", village: "Bemetara" });
	});

	it("returns null when nothing is present", () => {
		const response = { status: "received", body: "plain text" };
		expect(extractFarmerId(response)).toBeNull();
		expect(extractAgriStackProfile(response)).toBeNull();
	});
});
