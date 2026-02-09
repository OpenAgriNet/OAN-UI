export const environment = {
  /** API base URL; set at build time via VITE_API_BASE_URL (e.g. by CI). */
  apiUrl: (import.meta.env.VITE_API_BASE_URL as string) || 'https://dev-amulmitra.amul.com',
  maintenanceMode: false,
  guestUserLimit: 10,
  /** Provider identifiers for TTS and transcription services. */
  ttsProvider: (import.meta.env.VITE_TTS_PROVIDER as string) || 'bhashini',
  transcriptionProvider: (import.meta.env.VITE_TRANSCRIPTION_PROVIDER as string) || 'bhashini',
};
