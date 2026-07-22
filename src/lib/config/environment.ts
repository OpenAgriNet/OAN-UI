import { env } from "@/config/env";

export const environment = {
  apiUrl: env.apiBaseUrl || "https://dev-vistaar.da.gov.in",
  notificationApiUrl: import.meta.env.VITE_NOTIFICATION_API_URL || "https://registry-sandbox-vistaar.da.gov.in/notification-api",
  // notificationApiUrl:"http://localhost:8081",
  maintenanceMode: false,
  guestUserLimit: 10,
  suggestionsDisabled: true,
  chatMessageMaxLength: 1000,
  bhashiniApiKey: env.bhashiniApiKey,
  streamingAsrEnabled: env.streamingAsrEnabled,
  voiceGatewayUrl: env.voiceGatewayUrl,
  voiceGatewayEnabled: env.voiceGatewayEnabled,
};

/** True when mic should use live ALD/ASR via voice-gateway (not MediaRecorder batch). */
export function isStreamingVoiceEnabled(): boolean {
  return (
    Boolean(environment.streamingAsrEnabled) &&
    Boolean(environment.voiceGatewayEnabled) &&
    Boolean(environment.voiceGatewayUrl?.trim())
  );
}
