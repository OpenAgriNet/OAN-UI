export const WIDGET_HOST_ID_PATTERN = /^AMULAI-HOST-[0-9a-f]{8}$/;

export type WidgetHostConfig = {
	hostId: string;
	partnerName: string;
	allowedOrigins: readonly string[];
	enabledScopes: readonly string[];
};

const WIDGET_HOSTS: Record<string, WidgetHostConfig> = {
	"AMULAI-HOST-6c48b031": {
		hostId: "AMULAI-HOST-6c48b031",
		partnerName: "Sarlaben",
		allowedOrigins: ["https://sarlaben.ai"],
		enabledScopes: ["advisory:ask", "voice:input"]
	}
};

export function getWidgetHost(hostId: string): WidgetHostConfig | null {
	if (!WIDGET_HOST_ID_PATTERN.test(hostId)) return null;
	return WIDGET_HOSTS[hostId] ?? null;
}
