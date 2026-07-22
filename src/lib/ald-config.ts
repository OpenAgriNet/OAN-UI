import type { LanguageCode } from "@/components/screens-component/chat-screen/config";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/components/screens-component/chat-screen/config";

/** App languages wired for ALD + ASR (matches config.json). */
export const ALD_APP_LANGUAGES: LanguageCode[] = [
	"hi",
	"en",
	"bn",
	"te",
	"mr",
	"ta",
	"gu",
	"kn",
	"ml",
	"as",
];

/**
 * ISO / Bhashini language codes → app language.
 * Includes ISO 639-3 and script-code fallbacks (knda→kn, telu→te, …).
 */
export const ALD_LANG_MAP: Record<string, LanguageCode> = {
	hi: "hi",
	hin: "hi",
	hindi: "hi",
	deva: "hi",
	en: "en",
	eng: "en",
	english: "en",
	latn: "en",
	bn: "bn",
	ben: "bn",
	beng: "bn",
	bengali: "bn",
	bangla: "bn",
	te: "te",
	tel: "te",
	telu: "te",
	telugu: "te",
	mr: "mr",
	mar: "mr",
	marathi: "mr",
	ta: "ta",
	tam: "ta",
	taml: "ta",
	tamil: "ta",
	gu: "gu",
	guj: "gu",
	gujarati: "gu",
	kn: "kn",
	kan: "kn",
	knda: "kn",
	kannada: "kn",
	ml: "ml",
	mal: "ml",
	mlym: "ml",
	malayalam: "ml",
	as: "as",
	asm: "as",
	assamese: "as",
};

export function normalizeAldLanguage(code?: string | null): LanguageCode | null {
	if (!code) return null;
	const key = code.trim().toLowerCase().split(/[-_]/)[0] || "";
	if (!key) return null;
	if (key in LANGUAGES) return key as LanguageCode;
	return ALD_LANG_MAP[key] ?? null;
}

export function resolveAldLanguage(
	code?: string | null,
	fallback: LanguageCode = DEFAULT_LANGUAGE
): LanguageCode {
	return normalizeAldLanguage(code) ?? fallback;
}
