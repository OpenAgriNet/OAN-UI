import rootConfigData from "../../../../config.json";
const rootConfig = rootConfigData as any;

// ============================================================================
// LANGUAGE CONFIGURATION
// ============================================================================

export type LanguageCode = "en" | "hi" | "mr" | "gu";

export type Language = {
	code: LanguageCode;
	name: string;
	nativeName: string;
	icon: string;
};

export const LANGUAGES: Record<LanguageCode, Language> = rootConfig.languages.reduce((acc: any, lang: any) => {
	acc[lang.code as LanguageCode] = lang as Language;
	return acc;
}, {} as Record<LanguageCode, Language>);

export const DEFAULT_LANGUAGE: LanguageCode = rootConfig.defaultLanguage as LanguageCode || "en";

// ============================================================================
// CHAT CONFIGURATION
// ============================================================================
// CHAT CONFIGURATION
// ============================================================================

export const CHAT_ASSISTANT = {
	name: "Amul AI",
	avatar: rootConfig.icons.assistant
};

export const CHAT_USER = {
	name: "",
	avatar: rootConfig.icons.user
};


// Helper function to get text for current language
// Deprecated: use useLanguage().t instead.
export const getLanguageText = (languageCode: LanguageCode): any => {
	return (rootConfig.languageTexts as any)[languageCode];
};

export type FAQItem = {
	id: string;
	question: string;
	answer: string;
	image?: string;
};

export const FAQ_DATA: Record<LanguageCode, FAQItem[]> = {
	gu: [
		{ id: "1", question: "વેતર આવેલ ગાય- ભેંસ ક્યારે ફેળવવી?", answer: "" },
		{ id: "2", question: "વિયાણ બાદ ગાય/ભેંસને ફરી ક્યારે ફેળવવી?", answer: "" },
		{ id: "3", question: "મેલી ન પડવાના કારણો શું છે?", answer: "" },
		{ id: "4", question: "વિયાણ બાદ મેલી ક્યારે પડાવી જોઈએ?", answer: "" },
		{ id: "5", question: "આઉનો સોજો કેવી રીતે અટકાવી શકાય?", answer: "" },
		{ id: "6", question: "ખરવામોંવાસો અટકાવવા શું કરવું?", answer: "" },
		{ id: "7", question: "આફરામાં ઘરગથ્થુ ઉપચાર શું છે?", answer: "" },
		{ id: "8", question: "કરમિયા અટકાવવા શું કરવું?", answer: "" },
		{ id: "9", question: "ઈતરડી નિયંત્રણ માટે શું કરવું?", answer: "" },
		{ id: "10", question: "બચ્ચાઓને કરમિયાની દવા ક્યારે આપવી?", answer: "" },
		{ id: "11", question: "ગાભણ પશુની માવજત કેવી રીતે કરવી?", answer: "" },
		{ id: "12", question: "સાયલેજ એટલે શું?", answer: "" },
		{ id: "13", question: "શિંગ ડામવા ક્યારે જોઈએ?", answer: "" },
		{ id: "14", question: "કઈ ઓલાદના પશુ રાખવા જોઈએ?", answer: "" },
		{ id: "15", question: "દૂધ વધારવા શું કરવું?", answer: "" },
	],
	en: [
		{ id: "1", question: "When should a cow/buffalo in heat be bred?", answer: "" },
		{ id: "2", question: "When should a cow/buffalo be bred again after calving?", answer: "" },
		{ id: "3", question: "What are the reasons for the retention of the afterbirth (placenta)?", answer: "" },
		{ id: "4", question: "When should the placenta be removed after calving?", answer: "" },
		{ id: "5", question: "How can mastitis (udder swelling) be prevented?", answer: "" },
		{ id: "6", question: "What to do to prevent FMD?", answer: "" },
		{ id: "7", question: "What are the home remedies for bloat?", answer: "" },
		{ id: "8", question: "What to do to prevent worms?", answer: "" },
		{ id: "9", question: "What to do for tick control?", answer: "" },
		{ id: "10", question: "When should deworming medicine be given to calves?", answer: "" },
		{ id: "11", question: "How to take care of a pregnant animal?", answer: "" },
		{ id: "12", question: "What is Silage?", answer: "" },
		{ id: "13", question: "When should dehorning (disbudding) be done?", answer: "" },
		{ id: "14", question: "Which animal breeds should be kept?", answer: "" },
		{ id: "15", question: "What to do to increase milk yield?", answer: "" },
	],
	hi: [
		{ id: "1", question: "When should a cow/buffalo in heat be bred?", answer: "" },
		{ id: "2", question: "When should a cow/buffalo be bred again after calving?", answer: "" },
		{ id: "3", question: "What are the reasons for the retention of the afterbirth (placenta)?", answer: "" },
		{ id: "4", question: "When should the placenta be removed after calving?", answer: "" },
		{ id: "5", question: "How can mastitis (udder swelling) be prevented?", answer: "" },
		{ id: "6", question: "What to do to prevent FMD?", answer: "" },
		{ id: "7", question: "What are the home remedies for bloat?", answer: "" },
		{ id: "8", question: "What to do to prevent worms?", answer: "" },
		{ id: "9", question: "What to do for tick control?", answer: "" },
		{ id: "10", question: "When should deworming medicine be given to calves?", answer: "" },
		{ id: "11", question: "How to take care of a pregnant animal?", answer: "" },
		{ id: "12", question: "What is Silage?", answer: "" },
		{ id: "13", question: "When should dehorning (disbudding) be done?", answer: "" },
		{ id: "14", question: "Which animal breeds should be kept?", answer: "" },
		{ id: "15", question: "What to do to increase milk yield?", answer: "" },
	],
	mr: [
		{ id: "1", question: "When should a cow/buffalo in heat be bred?", answer: "" },
		{ id: "2", question: "When should a cow/buffalo be bred again after calving?", answer: "" },
		{ id: "3", question: "What are the reasons for the retention of the afterbirth (placenta)?", answer: "" },
		{ id: "4", question: "When should the placenta be removed after calving?", answer: "" },
		{ id: "5", question: "How can mastitis (udder swelling) be prevented?", answer: "" },
		{ id: "6", question: "What to do to prevent FMD?", answer: "" },
		{ id: "7", question: "What are the home remedies for bloat?", answer: "" },
		{ id: "8", question: "What to do to prevent worms?", answer: "" },
		{ id: "9", question: "What to do for tick control?", answer: "" },
		{ id: "10", question: "When should deworming medicine be given to calves?", answer: "" },
		{ id: "11", question: "How to take care of a pregnant animal?", answer: "" },
		{ id: "12", question: "What is Silage?", answer: "" },
		{ id: "13", question: "When should dehorning (disbudding) be done?", answer: "" },
		{ id: "14", question: "Which animal breeds should be kept?", answer: "" },
		{ id: "15", question: "What to do to increase milk yield?", answer: "" },
	],
};

export const THEMES = {
	light: "light",
	dark: "dark"
} as const;

export type Theme = keyof typeof THEMES;

// ============================================================================
// ICON CONFIGURATION
// ============================================================================

export const ICONS = {
	language: "अ",
	settings: "Settings",
	bell: "Bell",
	user: "User",
	chevronDown: "ChevronDown",
	microphone: "Mic",
	send: "Send",
	play: "Play",
	pause: "Pause",
	copy: "Copy",
	thumbsUp: "ThumbsUp",
	thumbsDown: "ThumbsDown"
} as const;

// ============================================================================
// FONT CONFIGURATION
// ============================================================================

export const FONTS = {
	primary: "system-ui, -apple-system, sans-serif",
	heading: "system-ui, -apple-system, sans-serif",
	mono: "monospace",
	sizes: {
		xs: "0.75rem",
		sm: "0.875rem",
		base: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
		"2xl": "1.5rem",
		"3xl": "1.875rem"
	}
} as const;

// ============================================================================
// COLOR CONFIGURATION
// ============================================================================

export const COLORS = {
	primary: {
		main: "#22c55e",
		light: "#86efac",
		dark: "#16a34a",
		contrast: "#ffffff"
	},
	secondary: {
		main: "#f3f4f6",
		light: "#ffffff",
		dark: "#e5e7eb",
		contrast: "#000000"
	},
	accent: {
		green: "#22c55e",
		lightGreen: "#d1fae5",
		white: "#ffffff",
		gray: "#6b7280",
		lightGray: "#f9fafb"
	},
	status: {
		success: "#22c55e",
		error: "#ef4444",
		warning: "#f59e0b",
		info: "#3b82f6"
	}
} as const;

