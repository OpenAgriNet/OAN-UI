export type ChatPersona = "farmer" | "doctor";

export function normalizeChatPersona(value: unknown): ChatPersona {
	return typeof value === "string" && value.toLowerCase() === "doctor" ? "doctor" : "farmer";
}

// The doctor experience ships behind VITE_ENABLE_DOCTOR_PERSONA_SELECTOR. With
// the flag off the persona is pinned to "farmer", so a JWT that happens to
// carry user_type=doctor cannot flip the header title, the welcome copy, or
// the persona sent to the API on a build where the toggle is hidden.
export function resolveChatPersona(rawUserType: unknown, selectorEnabled: boolean): ChatPersona {
	return selectorEnabled ? normalizeChatPersona(rawUserType) : "farmer";
}
