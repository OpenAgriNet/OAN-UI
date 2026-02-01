export const environment = {
  apiUrl: (import.meta.env.VITE_API_BASE_URL as string) || 'https://dev-amulmitra.amul.com',
  maintenanceMode: false,
  guestUserLimit: 10,
  /** When true, use voice-oan-api: no auth, /api/voice/, limited features (no suggest/transcribe/TTS/feedback) */
  voiceOanMode: import.meta.env.VITE_VOICE_OAN_MODE === 'true',
};
