/// <reference types="vite/client" />

declare module "uuid";

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_API_KEY?: string;
	readonly VITE_BHASHINI_API_KEY?: string;
	readonly VITE_STREAMING_ASR_ENABLED?: string;
	readonly VITE_VOICE_GATEWAY_URL?: string;
	readonly VITE_VOICE_GATEWAY_ENABLED?: string;
	readonly VITE_NOTIFICATION_API_URL?: string;
	readonly MODE?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
