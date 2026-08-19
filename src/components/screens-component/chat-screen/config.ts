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

// The 48 FAQ prompts are too long to scan as one flat list, so they are grouped
// into six themed sections rendered as collapsible boxes. The question `id` is
// the same across every language, so one id -> category map covers all of them.
export type FAQCategoryId =
	| "myData"
	| "breeding"
	| "health"
	| "feed"
	| "calf"
	| "management";

export const FAQ_CATEGORY_ORDER: FAQCategoryId[] = [
	"myData",
	"breeding",
	"health",
	"feed",
	"calf",
	"management",
];

export const FAQ_CATEGORY_LABELS: Record<FAQCategoryId, Record<LanguageCode, string>> = {
	myData: {
		en: "My Milk & Records",
		gu: "મારું દૂધ અને રેકોર્ડ",
		hi: "मेरा दूध और रिकॉर्ड",
		mr: "माझे दूध आणि नोंदी",
	},
	breeding: {
		en: "Breeding & Reproduction",
		gu: "પ્રજનન અને ગર્ભાધાન",
		hi: "प्रजनन और गर्भाधान",
		mr: "प्रजनन आणि गर्भाधान",
	},
	health: {
		en: "Health & Disease",
		gu: "આરોગ્ય અને રોગ",
		hi: "स्वास्थ्य और रोग",
		mr: "आरोग्य आणि आजार",
	},
	feed: {
		en: "Feed & Nutrition",
		gu: "આહાર અને પોષણ",
		hi: "आहार और पोषण",
		mr: "आहार आणि पोषण",
	},
	calf: {
		en: "Calf Care",
		gu: "વાછરડાની સંભાળ",
		hi: "बछड़े की देखभाल",
		mr: "वासराची काळजी",
	},
	management: {
		en: "Management & Schemes",
		gu: "વ્યવસ્થાપન અને યોજનાઓ",
		hi: "प्रबंधन और योजनाएं",
		mr: "व्यवस्थापन आणि योजना",
	},
};

const FAQ_CATEGORY_BY_ID: Record<string, FAQCategoryId> = {
	"1": "myData", "2": "myData", "3": "myData", "4": "myData", "5": "myData",
	"23": "myData", "25": "myData",

	"6": "breeding", "8": "breeding", "9": "breeding", "10": "breeding",
	"11": "breeding", "18": "breeding", "27": "breeding", "28": "breeding",
	"29": "breeding", "30": "breeding", "31": "breeding", "32": "breeding",
	"33": "breeding",

	"7": "health", "12": "health", "13": "health", "14": "health",
	"15": "health", "16": "health", "24": "health", "26": "health",
	"39": "health",

	"19": "feed", "22": "feed", "34": "feed", "35": "feed", "36": "feed",
	"37": "feed", "38": "feed",

	"17": "calf", "20": "calf", "40": "calf", "41": "calf", "42": "calf",

	"21": "management", "43": "management", "44": "management",
	"45": "management", "46": "management", "47": "management",
	"48": "management",
};

export type FAQGroup = {
	id: FAQCategoryId;
	label: string;
	items: FAQItem[];
};

// Groups the language's FAQ list into the six categories, preserving the
// original order within each. Categories with no items are dropped, and any
// item whose id is missing from the map falls back to "management" so a newly
// added question is still reachable.
export const getFAQGroups = (language: LanguageCode): FAQGroup[] => {
	const items = FAQ_DATA[language] || FAQ_DATA[DEFAULT_LANGUAGE];
	return FAQ_CATEGORY_ORDER.map((id) => ({
		id,
		label: FAQ_CATEGORY_LABELS[id][language] || FAQ_CATEGORY_LABELS[id].en,
		items: items.filter((item) => (FAQ_CATEGORY_BY_ID[item.id] ?? "management") === id),
	})).filter((group) => group.items.length > 0);
};

// FAQ items are tap-to-ask prompts: each question is sent to the chat agent
// on tap and answered live (no static answers).
const FAQ_GU: FAQItem[] = [
	{ id: "1", question: "છેલ્લા ૭ દિવસની મારી દૂધ ભરવાની વિગત આપો." },
	{ id: "2", question: "મે આજે અને ગઈકાલે કેટલું દૂધ ભરાવ્યું છે?  લિટર અને રૂપિયામાં કહો" },
	{ id: "3", question: "ગયા મહિના અને ચાલુ મહિના દરમિયાન મારી કુલ આવક અને કપાતની વિગતો બતાવો" },
	{ id: "4", question: "મારી માહિતી સાથે મારા પશુઓ અને દૂધ ઉત્પાદનની વિગત જણાવો" },
	{ id: "5", question: "મારા પશુઓની વિગતો આપો, જેમાં છેલ્લી AI (કૃત્રિમ ગર્ભાધાન) તારીખ અને સારવારના રેકોર્ડનો સમાવેશ કરો" },
	{ id: "6", question: "મારા પશુ માટે AI (કૃત્રિમ ગર્ભાધાન) ની વિઝિટ બુક કરો." },
	{ id: "7", question: "મારા કયા પશુઓનું રસીકરણ અથવા કૃમિનાશક દવા બાકી છે?" },
	{ id: "8", question: "વેતર આવેલ ગાય- ભેંસ ક્યારે ફેળવવી?" },
	{ id: "9", question: "વિયાણ બાદ ગાય/ભેંસને ફરી ક્યારે ફેળવવી?" },
	{ id: "10", question: "મેલી ન પડવાના કારણો શું છે?" },
	{ id: "11", question: "વિયાણ બાદ મેલી ક્યારે પડાવી જોઈએ?" },
	{ id: "12", question: "આઉનો સોજો કેવી રીતે અટકાવી શકાય?" },
	{ id: "13", question: "ખરવામોંવાસો અટકાવવા શું કરવું?" },
	{ id: "14", question: "આફરામાં ઘરગથ્થુ ઉપચાર શું છે?" },
	{ id: "15", question: "કરમિયા અટકાવવા શું કરવું?" },
	{ id: "16", question: "ઈતરડી નિયંત્રણ માટે શું કરવું?" },
	{ id: "17", question: "બચ્ચાઓને કરમિયાની દવા ક્યારે આપવી?" },
	{ id: "18", question: "ગાભણ પશુની માવજત કેવી રીતે કરવી?" },
	{ id: "19", question: "સાયલેજ એટલે શું?" },
	{ id: "20", question: "શિંગ ડામવા ક્યારે જોઈએ?" },
	{ id: "21", question: "કઈ ઓલાદના પશુ રાખવા જોઈએ?" },
	{ id: "22", question: "દૂધ વધારવા શું કરવું?" },
	{ id: "23", question: "આજે મારા દૂધનો ફેટ અને SNF કેટલો આવ્યો?" },
	{ id: "24", question: "મારું પશુ ખાવાનું ઓછું કરે તો શું કરવું?" },
	{ id: "25", question: "મારા પશુની અગાઉની સારવારની વિગતો બતાવો." },
	{ id: "26", question: "પશુને ચામડીનો રોગ થયો હોય તો શું કરવું?" },
	{ id: "27", question: "પશુ વેતરમાં આવ્યું છે કે નહીં તે કેવી રીતે ઓળખવું?" },
	{ id: "28", question: "AI કર્યા પછી ગર્ભ તપાસ ક્યારે કરાવવી?" },
	{ id: "29", question: "વારંવાર AI કરવા છતાં પશુ ગાભણ ન થાય તો શું કરવું?" },
	{ id: "30", question: "મારા કયા પશુની ગર્ભ તપાસ બાકી છે?" },
	{ id: "31", question: "કયા પશુની વિયાણની સંભવિત તારીખ નજીક છે?" },
	{ id: "32", question: "વિયાણના લક્ષણો કયા છે?" },
	{ id: "33", question: "વિયાણ સમયે તાત્કાલિક શું કરવું?" },
	{ id: "34", question: "વિયાણ પછી પશુને શું ખવડાવવું?" },
	{ id: "35", question: "મારા પશુ માટે દૈનિક ખોરાકનું પ્રમાણ કેટલું હોવું જોઈએ?" },
	{ id: "36", question: "ગાય અને ભેંસ માટે સંતુલિત આહાર કેવી રીતે બનાવવો?" },
	{ id: "37", question: "મિનરલ મિશ્રણ કેટલું અને ક્યારે આપવું?" },
	{ id: "38", question: "દૂધ આપતા પશુને કેટલું દાણ આપવું?" },
	{ id: "39", question: "મારા પશુનું આગામી રસીકરણ ક્યારે છે?" },
	{ id: "40", question: "નવજાત બચ્ચાને પ્રથમ દૂધ ક્યારે અને કેટલું આપવું?" },
	{ id: "41", question: "બચ્ચાને દાણ અને લીલો ચારો ક્યારથી શરૂ કરવો?" },
	{ id: "42", question: "બચ્ચાના રસીકરણ અને કૃમિનાશક દવાનો કાર્યક્રમ બતાવો." },
	{ id: "43", question: "પશુ શેડ સ્વચ્છ અને જીવાણુમુક્ત કેવી રીતે રાખવો?" },
	{ id: "44", question: "દૂધ દોહતી વખતે કઈ સ્વચ્છતા રાખવી?" },
	{ id: "45", question: "સ્વચ્છ દૂધ ઉત્પાદન માટે શું કરવું?" },
	{ id: "46", question: "સરકારની પશુપાલન યોજનાઓ વિશે જણાવો." },
	{ id: "47", question: "પશુપાલન માટે લોન અથવા સહાય કેવી રીતે મેળવી શકાય?" },
	{ id: "48", question: "ચોમાસામાં પશુની સંભાળ કેવી રીતે રાખવી?" },
];

const FAQ_EN: FAQItem[] = [
	{ id: "1", question: "Give me my milk collection and deduction details of last 7 days" },
	{ id: "2", question: "How much milk did I pour today & yesterday in Rs. and Ltrs?" },
	{ id: "3", question: "What is my total earning and deductions in previous & current month?" },
	{ id: "4", question: "Show me my profile with cattle and milk data" },
	{ id: "5", question: "Give me the details of my cattle including my last AI date and medical treatment records" },
	{ id: "6", question: "Book an AI appointment for my cattle" },
	{ id: "7", question: "Which of my animals are overdue for vaccinations or deworming?" },
	{ id: "8", question: "When should a cow/buffalo in heat be bred?" },
	{ id: "9", question: "When should a cow/buffalo be bred again after calving?" },
	{ id: "10", question: "What are the reasons for the retention of the afterbirth (placenta)?" },
	{ id: "11", question: "When should the placenta be removed after calving?" },
	{ id: "12", question: "How can mastitis (udder swelling) be prevented?" },
	{ id: "13", question: "What to do to prevent FMD?" },
	{ id: "14", question: "What are the home remedies for bloat?" },
	{ id: "15", question: "What to do to prevent worms?" },
	{ id: "16", question: "What to do for tick control?" },
	{ id: "17", question: "When should deworming medicine be given to calves?" },
	{ id: "18", question: "How to take care of a pregnant animal?" },
	{ id: "19", question: "What is Silage?" },
	{ id: "20", question: "When should dehorning (disbudding) be done?" },
	{ id: "21", question: "Which animal breeds should be kept?" },
	{ id: "22", question: "What to do to increase milk yield?" },
	{ id: "23", question: "What was the fat and SNF of my milk today?" },
	{ id: "24", question: "What should I do if my animal is eating less?" },
	{ id: "25", question: "Show me my animal's previous treatment details." },
	{ id: "26", question: "What should be done if an animal has a skin disease?" },
	{ id: "27", question: "How to identify whether an animal is in heat?" },
	{ id: "28", question: "When should pregnancy be checked after AI?" },
	{ id: "29", question: "What to do if an animal does not conceive despite repeated AI?" },
	{ id: "30", question: "Which of my animals have a pregnancy check pending?" },
	{ id: "31", question: "Which animal's expected calving date is near?" },
	{ id: "32", question: "What are the signs of calving?" },
	{ id: "33", question: "What should be done immediately at the time of calving?" },
	{ id: "34", question: "What should an animal be fed after calving?" },
	{ id: "35", question: "How much daily feed should my animal get?" },
	{ id: "36", question: "How to prepare a balanced diet for cows and buffaloes?" },
	{ id: "37", question: "How much mineral mixture should be given and when?" },
	{ id: "38", question: "How much concentrate feed should be given to a milking animal?" },
	{ id: "39", question: "When is my animal's next vaccination?" },
	{ id: "40", question: "When and how much colostrum (first milk) should be given to a newborn calf?" },
	{ id: "41", question: "When should concentrate feed and green fodder be started for a calf?" },
	{ id: "42", question: "Show the vaccination and deworming schedule for calves." },
	{ id: "43", question: "How to keep the cattle shed clean and germ-free?" },
	{ id: "44", question: "What hygiene should be maintained while milking?" },
	{ id: "45", question: "What should be done to produce clean milk?" },
	{ id: "46", question: "Tell me about government animal husbandry schemes." },
	{ id: "47", question: "How can I get a loan or subsidy for animal husbandry?" },
	{ id: "48", question: "How to take care of animals during the monsoon?" },
];

const FAQ_HI: FAQItem[] = [
	{ id: "1", question: "पिछले 7 दिनों में मेरे दूध संग्रह और कटौती का विवरण बताएं।" },
	{ id: "2", question: "मैंने आज और कल कितना दूध जमा कराया? रुपये और लीटर में बताएं।" },
	{ id: "3", question: "पिछले और चालू महीने में मेरी कुल आय और कटौती क्या है?" },
	{ id: "4", question: "मेरी प्रोफाइल के साथ पशुओं और दूध उत्पादन का डेटा दिखाएं।" },
	{ id: "5", question: "मेरे पशुओं का विवरण दें, जिसमें अंतिम AI तारीख और उपचार रिकॉर्ड शामिल हों।" },
	{ id: "6", question: "मेरे पशु के लिए AI अपॉइंटमेंट बुक करें।" },
	{ id: "7", question: "मेरे कौन से पशुओं का टीकाकरण या कृमिनाशन लंबित है?" },
	{ id: "8", question: "हीट में आई गाय/भैंस का गर्भाधान कब कराना चाहिए?" },
	{ id: "9", question: "ब्याने के बाद गाय/भैंस को दोबारा कब गर्भाधान कराना चाहिए?" },
	{ id: "10", question: "झिल्ली (आफ्टरबर्थ/प्लेसेंटा) रुकने के कारण क्या हैं?" },
	{ id: "11", question: "ब्याने के बाद प्लेसेंटा कब हटाना चाहिए?" },
	{ id: "12", question: "थन की सूजन (मास्टाइटिस) को कैसे रोका जा सकता है?" },
	{ id: "13", question: "खुरपका-मुंहपका (FMD) से बचाव के लिए क्या करें?" },
	{ id: "14", question: "अफरा की घरेलू उपचार विधियां क्या हैं?" },
	{ id: "15", question: "कृमियों की रोकथाम के लिए क्या करना चाहिए?" },
	{ id: "16", question: "टिक नियंत्रण के लिए क्या करना चाहिए?" },
	{ id: "17", question: "बछड़ों को कृमिनाशक दवा कब देनी चाहिए?" },
	{ id: "18", question: "गर्भित पशु की देखभाल कैसे करें?" },
	{ id: "19", question: "सायलेज क्या है?" },
	{ id: "20", question: "डीहॉर्निंग (सींग दागना) कब करना चाहिए?" },
	{ id: "21", question: "कौन सी नस्ल के पशु रखने चाहिए?" },
	{ id: "22", question: "दूध उत्पादन बढ़ाने के लिए क्या करना चाहिए?" },
	{ id: "23", question: "आज मेरे दूध का फैट और SNF कितना रहा?" },
	{ id: "24", question: "अगर मेरा पशु कम खा रहा हो तो क्या करना चाहिए?" },
	{ id: "25", question: "मेरे पशु के पिछले उपचार का विवरण दिखाएं।" },
	{ id: "26", question: "अगर पशु को त्वचा रोग हो जाए तो क्या करें?" },
	{ id: "27", question: "कैसे पहचानें कि पशु हीट में है या नहीं?" },
	{ id: "28", question: "AI के बाद गर्भ जांच कब करानी चाहिए?" },
	{ id: "29", question: "बार-बार AI के बाद भी पशु गर्भित न हो तो क्या करें?" },
	{ id: "30", question: "मेरे किन पशुओं की गर्भ जांच लंबित है?" },
	{ id: "31", question: "किस पशु की संभावित ब्याने की तारीख नजदीक है?" },
	{ id: "32", question: "ब्याने के लक्षण क्या हैं?" },
	{ id: "33", question: "ब्याने के समय तुरंत क्या करना चाहिए?" },
	{ id: "34", question: "ब्याने के बाद पशु को क्या खिलाना चाहिए?" },
	{ id: "35", question: "मेरे पशु का रोजाना चारा कितना होना चाहिए?" },
	{ id: "36", question: "गाय और भैंस के लिए संतुलित आहार कैसे बनाएं?" },
	{ id: "37", question: "मिनरल मिक्सचर कितना और कब देना चाहिए?" },
	{ id: "38", question: "दूध देने वाले पशु को कितना दाना देना चाहिए?" },
	{ id: "39", question: "मेरे पशु का अगला टीकाकरण कब है?" },
	{ id: "40", question: "नवजात बछड़े को पहला दूध (खीस) कब और कितना देना चाहिए?" },
	{ id: "41", question: "बछड़े को दाना और हरा चारा कब से शुरू कराना चाहिए?" },
	{ id: "42", question: "बछड़ों का टीकाकरण और कृमिनाशक कार्यक्रम दिखाएं।" },
	{ id: "43", question: "पशु शेड को साफ और कीटाणुरहित कैसे रखें?" },
	{ id: "44", question: "दूध दुहते समय कौन सी स्वच्छता रखनी चाहिए?" },
	{ id: "45", question: "स्वच्छ दूध उत्पादन के लिए क्या करना चाहिए?" },
	{ id: "46", question: "सरकारी पशुपालन योजनाओं के बारे में बताएं।" },
	{ id: "47", question: "पशुपालन के लिए लोन या सब्सिडी कैसे मिल सकती है?" },
	{ id: "48", question: "मानसून के दौरान पशुओं की देखभाल कैसे करें?" },
];

// Keep Marathi on English FAQs for now; Hindi now has dedicated localized FAQs.
export const FAQ_DATA: Record<LanguageCode, FAQItem[]> = {
	gu: FAQ_GU,
	en: FAQ_EN,
	hi: FAQ_HI,
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

