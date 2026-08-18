/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ENABLE_DOCTOR_PERSONA_SELECTOR?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module 'uuid';
