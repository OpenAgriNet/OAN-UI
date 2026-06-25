import FingerprintJS from "@fingerprintjs/fingerprintjs";

const ensureChromiumDevtoolsMetricsReporter = () => {
	if (typeof window === "undefined") return;

	const chromiumWindow = window as Window & {
		__chromium_devtools_metrics_reporter?: unknown;
	};

	if (typeof chromiumWindow.__chromium_devtools_metrics_reporter !== "function") {
		chromiumWindow.__chromium_devtools_metrics_reporter = () => undefined;
	}
};

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

		ensureChromiumDevtoolsMetricsReporter();
		const fp = await FingerprintJS.load();
		const result = await fp.get();
		return result.visitorId || null;
	} catch (error) {
		console.warn("Failed to resolve fingerprint id", error);
		return null;
	}
};
