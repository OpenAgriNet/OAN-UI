import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const getFingerprintId = async (): Promise<string | null> => {
	try {
		const cached = localStorage.getItem("fingerprint_context");
		if (cached) {
			const parsed = JSON.parse(cached);
			const deviceId = parsed?.data?.device_id;
			if (typeof deviceId === "string" && deviceId.trim()) {
				return deviceId;
			}
		}

		const fp = await FingerprintJS.load();
		const result = await fp.get();
		return result.visitorId || null;
	} catch (error) {
		console.warn("Failed to resolve fingerprint id", error);
		return null;
	}
};
