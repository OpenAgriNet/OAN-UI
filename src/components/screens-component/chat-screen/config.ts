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
	// Optional: data-query FAQ items are sent to the chat agent on tap (answered
	// live with the farmer's own data) and carry no static answer.
	answer?: string;
	image?: string;
};

// FAQ items are tap-to-ask prompts: each question is sent to the chat agent
// on tap and answered live (no static answers).
const FAQ_GU: FAQItem[] = [
	{ id: "1", question: "આજે મારા દૂધનો ફેટ અને SNF કેટલો આવ્યો?" },
	{ id: "2", question: "મારું પશુ ખાવાનું ઓછું કરે તો શું કરવું?" },
	{ id: "3", question: "મારા પશુની અગાઉની સારવારની વિગતો બતાવો." },
	{ id: "4", question: "પશુને ચામડીનો રોગ થયો હોય તો શું કરવું?" },
	{ id: "5", question: "પશુ વેતરમાં આવ્યું છે કે નહીં તે કેવી રીતે ઓળખવું?" },
	{ id: "6", question: "AI કર્યા પછી ગર્ભ તપાસ ક્યારે કરાવવી?" },
	{ id: "7", question: "વારંવાર AI કરવા છતાં પશુ ગાભણ ન થાય તો શું કરવું?" },
	{ id: "8", question: "મારા કયા પશુની ગર્ભ તપાસ બાકી છે?" },
	{ id: "9", question: "કયા પશુની વિયાણની સંભવિત તારીખ નજીક છે?" },
	{ id: "10", question: "વિયાણના લક્ષણો કયા છે?" },
	{ id: "11", question: "વિયાણ સમયે તાત્કાલિક શું કરવું?" },
	{ id: "12", question: "વિયાણ પછી પશુને શું ખવડાવવું?" },
	{ id: "13", question: "મારા પશુ માટે દૈનિક ખોરાકનું પ્રમાણ કેટલું હોવું જોઈએ?" },
	{ id: "14", question: "ગાય અને ભેંસ માટે સંતુલિત આહાર કેવી રીતે બનાવવો?" },
	{ id: "15", question: "મિનરલ મિશ્રણ કેટલું અને ક્યારે આપવું?" },
	{ id: "16", question: "દૂધ આપતા પશુને કેટલું દાણ આપવું?" },
	{ id: "17", question: "મારા પશુનું આગામી રસીકરણ ક્યારે છે?" },
	{ id: "18", question: "નવજાત બચ્ચાને પ્રથમ દૂધ ક્યારે અને કેટલું આપવું?" },
	{ id: "19", question: "બચ્ચાને દાણ અને લીલો ચારો ક્યારથી શરૂ કરવો?" },
	{ id: "20", question: "બચ્ચાના રસીકરણ અને કૃમિનાશક દવાનો કાર્યક્રમ બતાવો." },
	{ id: "21", question: "પશુ શેડ સ્વચ્છ અને જીવાણુમુક્ત કેવી રીતે રાખવો?" },
	{ id: "22", question: "દૂધ દોહતી વખતે કઈ સ્વચ્છતા રાખવી?" },
	{ id: "23", question: "સ્વચ્છ દૂધ ઉત્પાદન માટે શું કરવું?" },
	{ id: "24", question: "સરકારની પશુપાલન યોજનાઓ વિશે જણાવો." },
	{ id: "25", question: "પશુપાલન માટે લોન અથવા સહાય કેવી રીતે મેળવી શકાય?" },
	{ id: "26", question: "ચોમાસામાં પશુની સંભાળ કેવી રીતે રાખવી?" },
];

const FAQ_EN: FAQItem[] = [
	{ id: "1", question: "What was the fat and SNF of my milk today?" },
	{ id: "2", question: "What should I do if my animal is eating less?" },
	{ id: "3", question: "Show me my animal's previous treatment details." },
	{ id: "4", question: "What should be done if an animal has a skin disease?" },
	{ id: "5", question: "How to identify whether an animal is in heat?" },
	{ id: "6", question: "When should pregnancy be checked after AI?" },
	{ id: "7", question: "What to do if an animal does not conceive despite repeated AI?" },
	{ id: "8", question: "Which of my animals have a pregnancy check pending?" },
	{ id: "9", question: "Which animal's expected calving date is near?" },
	{ id: "10", question: "What are the signs of calving?" },
	{ id: "11", question: "What should be done immediately at the time of calving?" },
	{ id: "12", question: "What should an animal be fed after calving?" },
	{ id: "13", question: "How much daily feed should my animal get?" },
	{ id: "14", question: "How to prepare a balanced diet for cows and buffaloes?" },
	{ id: "15", question: "How much mineral mixture should be given and when?" },
	{ id: "16", question: "How much concentrate feed should be given to a milking animal?" },
	{ id: "17", question: "When is my animal's next vaccination?" },
	{ id: "18", question: "When and how much colostrum (first milk) should be given to a newborn calf?" },
	{ id: "19", question: "When should concentrate feed and green fodder be started for a calf?" },
	{ id: "20", question: "Show the vaccination and deworming schedule for calves." },
	{ id: "21", question: "How to keep the cattle shed clean and germ-free?" },
	{ id: "22", question: "What hygiene should be maintained while milking?" },
	{ id: "23", question: "What should be done to produce clean milk?" },
	{ id: "24", question: "Tell me about government animal husbandry schemes." },
	{ id: "25", question: "How can I get a loan or subsidy for animal husbandry?" },
	{ id: "26", question: "How to take care of animals during the monsoon?" },
];

// hi/mr previously carried English content; keep them on the English list.
export const FAQ_DATA: Record<LanguageCode, FAQItem[]> = {
	gu: FAQ_GU,
	en: FAQ_EN,
	hi: FAQ_EN,
	mr: FAQ_EN,
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

