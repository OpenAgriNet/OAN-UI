function asBool(value: unknown): boolean {
	if (typeof value === "boolean") return value;
	if (value == null) return false;
	const normalized = String(value).trim().toLowerCase();
	return normalized === "true" || normalized === "1" || normalized === "yes";
}

export const env = {
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
	apiKey: import.meta.env.VITE_API_KEY as string,
	mode: import.meta.env.MODE as string,
	/** Bhashini / MeitY API key (used by gateway server-side; kept for client config parity). */
	bhashiniApiKey: (import.meta.env.VITE_BHASHINI_API_KEY as string) || "",
	/** When true, prefer streaming ASR + ALD via voice gateway for mic. */
	streamingAsrEnabled: asBool(import.meta.env.VITE_STREAMING_ASR_ENABLED),
	/** WebSocket URL for Kenpath voice gateway (ALD + ASR). */
	voiceGatewayUrl: (import.meta.env.VITE_VOICE_GATEWAY_URL as string) || "",
	/** Master switch for voice-gateway path. */
	voiceGatewayEnabled: asBool(import.meta.env.VITE_VOICE_GATEWAY_ENABLED)
};

// if (!env.apiBaseUrl) throw new Error("Missing VITE_API_BASE_URL");
// if (!env.apiKey) throw new Error("Missing VITE_API_KEY");
