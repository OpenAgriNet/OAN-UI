/**
 * Reads farmer details out of the backend's /api/callback/status response.
 *
 * The AgriStack callback body is stored as-is by the backend, so field names and
 * nesting vary by payload. Values may also arrive as JSON-encoded strings (the
 * provider backend serialises farmerData/landData that way), so those are
 * searched too.
 */

export type AgriStackProfile = {
	farmerName?: string;
	village?: string;
};

const FARMER_ID_KEYS = ["farmerId", "farmer_id", "frCentralId", "centralId"];
const FARMER_NAME_KEYS = ["farmerName", "farmer_name", "farmerNameEng", "farmerNameEn", "frNameEn"];
const VILLAGE_KEYS = ["village", "villageName", "village_name", "villageNameEng", "villageNameEn"];

const MAX_DEPTH = 12;

function findString(node: unknown, keys: string[], depth = 0): string | null {
	if (depth > MAX_DEPTH || node == null) return null;

	if (typeof node === "string") {
		const trimmed = node.trim();
		if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
		try {
			return findString(JSON.parse(trimmed), keys, depth + 1);
		} catch {
			return null;
		}
	}

	if (Array.isArray(node)) {
		for (const item of node) {
			const found = findString(item, keys, depth + 1);
			if (found) return found;
		}
		return null;
	}

	if (typeof node !== "object") return null;

	const record = node as Record<string, unknown>;
	// Direct keys at this level win over anything nested deeper.
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) return value.trim();
		if (typeof value === "number") return String(value);
	}
	for (const value of Object.values(record)) {
		const found = findString(value, keys, depth + 1);
		if (found) return found;
	}
	return null;
}

export function extractFarmerId(statusResponse: unknown): string | null {
	return findString(statusResponse, FARMER_ID_KEYS);
}

/**
 * AgriStack sends consentName "CONTINUE WITH CONSENT" or "CONTINUE WITHOUT CONSENT".
 * Only an explicit "with consent" counts; anything else (including missing) is treated as no consent.
 */
export function hasFarmerConsent(statusResponse: unknown): boolean {
	const consentName = findString(statusResponse, ["consentName"]);
	return consentName?.toUpperCase() === "CONTINUE WITH CONSENT";
}

/** Name and village, only when the farmer gave consent. Without consent only the farmer ID is used. */
export function extractAgriStackProfile(statusResponse: unknown): AgriStackProfile | null {
	if (!hasFarmerConsent(statusResponse)) return null;
	const farmerName = findString(statusResponse, FARMER_NAME_KEYS) ?? undefined;
	const village = findString(statusResponse, VILLAGE_KEYS) ?? undefined;
	return farmerName || village ? { farmerName, village } : null;
}
