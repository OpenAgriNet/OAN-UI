export type ChatPersona = "farmer" | "doctor";

export function normalizeChatPersona(value: unknown): ChatPersona {
	return typeof value === "string" && value.toLowerCase() === "doctor" ? "doctor" : "farmer";
}
