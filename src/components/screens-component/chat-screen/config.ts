import rootConfigData from "../../../../config.json";
const rootConfig = rootConfigData as any;

// ============================================================================
// LANGUAGE CONFIGURATION
// ============================================================================

export type LanguageCode = "en" | "hi" | "mr" | "gu" | "bn" | "pa";

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

// The FAQ prompts are too long to scan as one flat list, so they are grouped
// into themed sections rendered as collapsible boxes. The question `id` is
// the same across every language, so one id -> category map covers all of them.
export type FAQCategoryId =
	| "myData"
	| "breeding"
	| "health"
	| "feed"
	| "calf"
	| "management"
	| "agri";

export const FAQ_CATEGORY_ORDER: FAQCategoryId[] = [
	"myData",
	"breeding",
	"health",
	"feed",
	"calf",
	"management",
	"agri",
];

export const FAQ_CATEGORY_LABELS: Record<FAQCategoryId, Record<LanguageCode, string>> = {
	myData: {
		en: "My Milk & Records",
		gu: "મારું દૂધ અને રેકોર્ડ",
		hi: "मेरा दूध और रिकॉर्ड",
		mr: "माझे दूध आणि नोंदी",
		bn: "আমার দুধ ও রেকর্ড",
		pa: "ਮੇਰਾ ਦੁੱਧ ਅਤੇ ਰਿਕਾਰਡ",
	},
	breeding: {
		en: "Breeding & Reproduction",
		gu: "પ્રજનન અને ગર્ભાધાન",
		hi: "प्रजनन और गर्भाधान",
		mr: "प्रजनन आणि गर्भाधान",
		bn: "প্রজনন ও গর্ভধারণ",
		pa: "ਪ੍ਰਜਨਨ ਅਤੇ ਗਰਭਦਾਨ",
	},
	health: {
		en: "Health & Disease",
		gu: "આરોગ્ય અને રોગ",
		hi: "स्वास्थ्य और रोग",
		mr: "आरोग्य आणि आजार",
		bn: "স্বাস্থ্য ও রোগ",
		pa: "ਸਿਹਤ ਅਤੇ ਰੋਗ",
	},
	feed: {
		en: "Feed & Nutrition",
		gu: "આહાર અને પોષણ",
		hi: "आहार और पोषण",
		mr: "आहार आणि पोषण",
		bn: "খাদ্য ও পুষ্টি",
		pa: "ਖੁਰਾਕ ਅਤੇ ਪੋਸ਼ਣ",
	},
	calf: {
		en: "Calf Care",
		gu: "વાછરડાની સંભાળ",
		hi: "बछड़े की देखभाल",
		mr: "वासराची काळजी",
		bn: "বাছুরের যত্ন",
		pa: "ਵੱਛੇ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ",
	},
	management: {
		en: "Management & Schemes",
		gu: "વ્યવસ્થાપન અને યોજનાઓ",
		hi: "प्रबंधन और योजनाएं",
		mr: "व्यवस्थापन आणि योजना",
		bn: "ব্যবস্থাপনা ও প্রকল্প",
		pa: "ਪ੍ਰਬੰਧਨ ਅਤੇ ਸਕੀਮਾਂ",
	},
	agri: {
		en: "Farming & Crops",
		gu: "ખેતી અને પાક",
		hi: "खेती और फसल",
		mr: "शेती आणि पीक",
		bn: "চাষবাস ও ফসল",
		pa: "ਖੇਤੀ ਅਤੇ ਫ਼ਸਲਾਂ",
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

	// Bharat Vistaar farming questions (AMUL-53), ids 49-68.
	"49": "agri", "50": "agri", "51": "agri", "52": "agri", "53": "agri",
	"54": "agri", "55": "agri", "56": "agri", "57": "agri", "58": "agri",
	"59": "agri", "60": "agri", "61": "agri", "62": "agri", "63": "agri",
	"64": "agri", "65": "agri", "66": "agri", "67": "agri", "68": "agri",
};

export type FAQGroup = {
	id: FAQCategoryId;
	label: string;
	items: FAQItem[];
};

// Groups the language's FAQ list into the categories above, preserving the
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
	// Bharat Vistaar farming questions (AMUL-53).
	{ id: "49", question: "મારી જમીનનું આરોગ્ય પત્રક (સોઈલ હેલ્થ કાર્ડ – SHC) કેવી રીતે કઢાવવું?" },
	{ id: "50", question: "આજે જૂનાગઢ નજીકના યાર્ડમાં મગફળી (Groundnut) નો ભાવ શું છે?" },
	{ id: "51", question: "મારી જમીન માટે કયો પાક સૌથી વધુ અનુકૂળ છે?" },
	{ id: "52", question: "જમીનમાં કુદરતી રીતે નાઇટ્રોજનનું પ્રમાણ વધારવા માટે શું કરવું?" },
	{ id: "53", question: "જમીનની ફળદ્રુપતા વધારવા માટે કયું ખાતર અને કેટલા પ્રમાણમાં વાપરવું?" },
	{ id: "54", question: "ખારાશવાળી જમીનમાં કયો પાક લઈ શકાય?" },
	{ id: "55", question: "ગ્રીનહાઉસ અને પોલીહાઉસ શું છે? તેના ફાયદા જણાવો." },
	{ id: "56", question: "ગ્રીનહાઉસ અને પોલીહાઉસ માટે સરકાર દ્વારા કરવામાં આવતી સહાય વિશે જણાવો." },
	{ id: "57", question: "રાસાયણિક ખાતરને બદલે જૈવિક (ઓર્ગેનિક) ખાતર કેવી રીતે વાપરવું? તેનાથી શું ફાયદો થાય?" },
	{ id: "58", question: "ઓછા પાણીમાં વધુ પાક કેવી રીતે લેવો?" },
	{ id: "59", question: "મગફળીની વાવણી માટે યોગ્ય સમય ક્યારે છે?" },
	{ id: "60", question: "આવતા અઠવાડિયે વરસાદની શક્યતા છે કે નહીં?" },
	{ id: "61", question: "ફુલાવર (Cauliflower) આણંદ નજીક કયા યાર્ડમાં મળે?" },
	{ id: "62", question: "મારા વિસ્તારની નજીકની મંડી/યાર્ડમાં આજે ઘઉંનો ભાવ શું છે?" },
	{ id: "63", question: "પ્રધાનમંત્રી પાક વીમા યોજના હેઠળ દાવો કેવી રીતે કરવો?" },
	{ id: "64", question: "કિસાન ક્રેડિટ કાર્ડ માટે અરજી કેવી રીતે કરવી?" },
	{ id: "65", question: "પ્રધાનમંત્રી કૃષિ સિંચાઈ યોજનાનો લાભ કેવી રીતે મળે?" },
	{ id: "66", question: "કૃષિ યાંત્રિકીકરણ યોજના હેઠળ સબસિડી કેવી રીતે મળે?" },
	{ id: "67", question: "ઓર્ગેનિક રીતે જીવાત નિયંત્રણ કેવી રીતે કરવું?" },
	{ id: "68", question: "ગાય આધારિત ઓર્ગેનિક રીતે ખેતી કરવાના શું લાભ છે?" },
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
	// Bharat Vistaar farming questions (AMUL-53).
	{ id: "49", question: "How do I get my Soil Health Card (SHC)?" },
	{ id: "50", question: "What is today's groundnut price at the yard near Junagadh?" },
	{ id: "51", question: "Which crop is best suited to my land?" },
	{ id: "52", question: "How can I increase nitrogen in the soil naturally?" },
	{ id: "53", question: "Which fertiliser should I use to improve soil fertility, and how much?" },
	{ id: "54", question: "Which crop can be grown in saline soil?" },
	{ id: "55", question: "What are greenhouses and polyhouses? Tell me their benefits." },
	{ id: "56", question: "Tell me about the government subsidy available for greenhouses and polyhouses." },
	{ id: "57", question: "How do I use organic manure instead of chemical fertiliser, and what are the benefits?" },
	{ id: "58", question: "How can I grow more crop with less water?" },
	{ id: "59", question: "When is the right time to sow groundnut?" },
	{ id: "60", question: "Is there a chance of rain next week?" },
	{ id: "61", question: "Which yard near Anand has cauliflower?" },
	{ id: "62", question: "What is today's wheat price at the mandi/yard nearest to me?" },
	{ id: "63", question: "How do I file a claim under the Pradhan Mantri Fasal Bima Yojana?" },
	{ id: "64", question: "How do I apply for a Kisan Credit Card?" },
	{ id: "65", question: "How can I benefit from the Pradhan Mantri Krishi Sinchayee Yojana?" },
	{ id: "66", question: "How do I get a subsidy under the Krishi Yantrikikaran (farm mechanisation) scheme?" },
	{ id: "67", question: "How do I control pests organically?" },
	{ id: "68", question: "What are the benefits of cow-based organic farming?" },
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
	// Bharat Vistaar farming questions (AMUL-53).
	{ id: "49", question: "मेरा मृदा स्वास्थ्य कार्ड (सॉइल हेल्थ कार्ड – SHC) कैसे बनवाएं?" },
	{ id: "50", question: "आज जूनागढ़ के पास वाले यार्ड में मूंगफली का भाव क्या है?" },
	{ id: "51", question: "मेरी जमीन के लिए कौन सी फसल सबसे उपयुक्त है?" },
	{ id: "52", question: "मिट्टी में प्राकृतिक रूप से नाइट्रोजन कैसे बढ़ाएं?" },
	{ id: "53", question: "मिट्टी की उर्वरता बढ़ाने के लिए कौन सा खाद और कितनी मात्रा में डालें?" },
	{ id: "54", question: "खारी (लवणीय) जमीन में कौन सी फसल ली जा सकती है?" },
	{ id: "55", question: "ग्रीनहाउस और पॉलीहाउस क्या हैं? इनके फायदे बताएं।" },
	{ id: "56", question: "ग्रीनहाउस और पॉलीहाउस के लिए सरकार द्वारा दी जाने वाली सहायता के बारे में बताएं।" },
	{ id: "57", question: "रासायनिक खाद की जगह जैविक (ऑर्गेनिक) खाद कैसे इस्तेमाल करें? इससे क्या फायदा होता है?" },
	{ id: "58", question: "कम पानी में ज्यादा फसल कैसे लें?" },
	{ id: "59", question: "मूंगफली की बुवाई का सही समय कब है?" },
	{ id: "60", question: "अगले हफ्ते बारिश की संभावना है या नहीं?" },
	{ id: "61", question: "फूलगोभी आणंद के पास किस यार्ड में मिलती है?" },
	{ id: "62", question: "मेरे इलाके की नजदीकी मंडी/यार्ड में आज गेहूं का भाव क्या है?" },
	{ id: "63", question: "प्रधानमंत्री फसल बीमा योजना के तहत दावा कैसे करें?" },
	{ id: "64", question: "किसान क्रेडिट कार्ड के लिए आवेदन कैसे करें?" },
	{ id: "65", question: "प्रधानमंत्री कृषि सिंचाई योजना का लाभ कैसे मिलेगा?" },
	{ id: "66", question: "कृषि यंत्रीकरण योजना के तहत सब्सिडी कैसे मिलेगी?" },
	{ id: "67", question: "जैविक तरीके से कीट नियंत्रण कैसे करें?" },
	{ id: "68", question: "गाय आधारित जैविक खेती करने के क्या लाभ हैं?" },
];

const FAQ_BN: FAQItem[] = [
	{ id: "1", question: "গত 7 দিনের আমার দুধ জমা ও কাটতির বিবরণ দিন।" },
	{ id: "2", question: "আজ ও গতকাল আমি কত দুধ জমা দিয়েছি? টাকা ও লিটারে বলুন।" },
	{ id: "3", question: "গত মাস ও চলতি মাসে আমার মোট আয় ও কাটতি কত?" },
	{ id: "4", question: "আমার প্রোফাইলসহ পশু ও দুধ উৎপাদনের তথ্য দেখান।" },
	{ id: "5", question: "আমার পশুদের বিবরণ দিন, শেষ AI-এর তারিখ ও চিকিৎসার রেকর্ডসহ।" },
	{ id: "6", question: "আমার পশুর জন্য AI অ্যাপয়েন্টমেন্ট বুক করুন।" },
	{ id: "7", question: "আমার কোন কোন পশুর টিকা বা কৃমিনাশক বাকি আছে?" },
	{ id: "8", question: "হিটে আসা (ডাকে আসা) গরু/মহিষকে কখন পাল দেওয়াতে হবে?" },
	{ id: "9", question: "বাছুর হওয়ার পর গরু/মহিষকে আবার কখন পাল দেওয়াতে হবে?" },
	{ id: "10", question: "ফুল (গর্ভফুল) আটকে থাকার কারণ কী?" },
	{ id: "11", question: "বাছুর হওয়ার পর ফুল কখন সরাতে হবে?" },
	{ id: "12", question: "ওলানফোলা (ম্যাস্টাইটিস) কীভাবে প্রতিরোধ করা যায়?" },
	{ id: "13", question: "খুরা রোগ (FMD) প্রতিরোধে কী করবেন?" },
	{ id: "14", question: "পেট ফাঁপার ঘরোয়া প্রতিকার কী?" },
	{ id: "15", question: "কৃমি প্রতিরোধে কী করা উচিত?" },
	{ id: "16", question: "এঁটুলি (টিক) নিয়ন্ত্রণে কী করা উচিত?" },
	{ id: "17", question: "বাছুরদের কৃমিনাশক ওষুধ কখন দেওয়া উচিত?" },
	{ id: "18", question: "গাভিন পশুর যত্ন কীভাবে নেবেন?" },
	{ id: "19", question: "সাইলেজ কী?" },
	{ id: "20", question: "শিং পোড়ানো (ডিহর্নিং) কখন করা উচিত?" },
	{ id: "21", question: "কোন জাতের পশু রাখা উচিত?" },
	{ id: "22", question: "দুধের উৎপাদন বাড়াতে কী করা উচিত?" },
	{ id: "23", question: "আজ আমার দুধের ফ্যাট ও SNF কত এসেছে?" },
	{ id: "24", question: "আমার পশু কম খেলে কী করব?" },
	{ id: "25", question: "আমার পশুর আগের চিকিৎসার বিবরণ দেখান।" },
	{ id: "26", question: "পশুর চর্মরোগ হলে কী করা উচিত?" },
	{ id: "27", question: "পশু হিটে (ডাকে) এসেছে কি না কীভাবে বুঝবেন?" },
	{ id: "28", question: "AI করার পর কখন গর্ভ পরীক্ষা করাতে হবে?" },
	{ id: "29", question: "বারবার AI করার পরও পশু গাভিন না হলে কী করবেন?" },
	{ id: "30", question: "আমার কোন কোন পশুর গর্ভ পরীক্ষা বাকি আছে?" },
	{ id: "31", question: "কোন পশুর বাছুর হওয়ার সম্ভাব্য তারিখ কাছে এসেছে?" },
	{ id: "32", question: "বাছুর হওয়ার লক্ষণগুলো কী?" },
	{ id: "33", question: "বাছুর হওয়ার সময় সঙ্গে সঙ্গে কী করা উচিত?" },
	{ id: "34", question: "বাছুর হওয়ার পর পশুকে কী খাওয়ানো উচিত?" },
	{ id: "35", question: "আমার পশুর দৈনিক খাবারের পরিমাণ কত হওয়া উচিত?" },
	{ id: "36", question: "গরু ও মহিষের জন্য সুষম খাদ্য কীভাবে তৈরি করবেন?" },
	{ id: "37", question: "মিনারেল মিক্সচার কতটা ও কখন দেওয়া উচিত?" },
	{ id: "38", question: "দুধেল পশুকে কতটা দানাদার খাবার দেওয়া উচিত?" },
	{ id: "39", question: "আমার পশুর পরবর্তী টিকা কবে?" },
	{ id: "40", question: "সদ্যোজাত বাছুরকে প্রথম দুধ (শালদুধ) কখন ও কতটা দেওয়া উচিত?" },
	{ id: "41", question: "বাছুরকে দানাদার খাবার ও কাঁচা ঘাস কখন থেকে দেওয়া শুরু করবেন?" },
	{ id: "42", question: "বাছুরের টিকা ও কৃমিনাশকের সময়সূচি দেখান।" },
	{ id: "43", question: "গোয়ালঘর পরিষ্কার ও জীবাণুমুক্ত কীভাবে রাখবেন?" },
	{ id: "44", question: "দুধ দোয়ানোর সময় কী কী পরিচ্ছন্নতা বজায় রাখা উচিত?" },
	{ id: "45", question: "পরিষ্কার দুধ উৎপাদনের জন্য কী করা উচিত?" },
	{ id: "46", question: "সরকারি পশুপালন প্রকল্প সম্পর্কে বলুন।" },
	{ id: "47", question: "পশুপালনের জন্য ঋণ বা ভর্তুকি কীভাবে পাওয়া যায়?" },
	{ id: "48", question: "বর্ষাকালে পশুর যত্ন কীভাবে নেবেন?" },
	// Bharat Vistaar farming questions (AMUL-53).
	{ id: "49", question: "আমার মাটির স্বাস্থ্য কার্ড (সয়েল হেলথ কার্ড – SHC) কীভাবে পাব?" },
	{ id: "50", question: "আজ জুনাগড়ের কাছের ইয়ার্ডে চিনাবাদামের দাম কত?" },
	{ id: "51", question: "আমার জমির জন্য কোন ফসল সবচেয়ে উপযুক্ত?" },
	{ id: "52", question: "মাটিতে প্রাকৃতিকভাবে নাইট্রোজেন কীভাবে বাড়াবেন?" },
	{ id: "53", question: "মাটির উর্বরতা বাড়াতে কোন সার কতটা ব্যবহার করব?" },
	{ id: "54", question: "লবণাক্ত জমিতে কোন ফসল চাষ করা যায়?" },
	{ id: "55", question: "গ্রিনহাউস ও পলিহাউস কী? এর সুবিধাগুলো বলুন।" },
	{ id: "56", question: "গ্রিনহাউস ও পলিহাউসের জন্য সরকারি ভর্তুকি সম্পর্কে বলুন।" },
	{ id: "57", question: "রাসায়নিক সারের বদলে জৈব সার কীভাবে ব্যবহার করব, আর এর সুবিধা কী?" },
	{ id: "58", question: "কম জলে কীভাবে বেশি ফসল ফলাব?" },
	{ id: "59", question: "চিনাবাদাম বোনার সঠিক সময় কখন?" },
	{ id: "60", question: "আগামী সপ্তাহে বৃষ্টির সম্ভাবনা আছে কি?" },
	{ id: "61", question: "আণন্দের কাছে কোন ইয়ার্ডে ফুলকপি পাওয়া যায়?" },
	{ id: "62", question: "আমার এলাকার সবচেয়ে কাছের মান্ডি/ইয়ার্ডে আজ গমের দাম কত?" },
	{ id: "63", question: "প্রধানমন্ত্রী ফসল বিমা যোজনায় দাবি কীভাবে করব?" },
	{ id: "64", question: "কিষাণ ক্রেডিট কার্ডের জন্য কীভাবে আবেদন করব?" },
	{ id: "65", question: "প্রধানমন্ত্রী কৃষি সিঁচাই যোজনার সুবিধা কীভাবে পাব?" },
	{ id: "66", question: "কৃষি যান্ত্রিকীকরণ প্রকল্পে ভর্তুকি কীভাবে পাব?" },
	{ id: "67", question: "জৈব পদ্ধতিতে পোকামাকড় নিয়ন্ত্রণ কীভাবে করব?" },
	{ id: "68", question: "গরু-ভিত্তিক জৈব চাষের সুবিধা কী?" },
];

const FAQ_MR: FAQItem[] = [
	{ id: "1", question: "गेल्या 7 दिवसांतील माझ्या दूध संकलनाचा आणि कपातीचा तपशील सांगा." },
	{ id: "2", question: "आज आणि काल मी किती दूध घातले? रुपये आणि लिटरमध्ये सांगा." },
	{ id: "3", question: "गेल्या आणि चालू महिन्यात माझे एकूण उत्पन्न व कपात किती?" },
	{ id: "4", question: "माझ्या प्रोफाइलसह जनावरे आणि दूध उत्पादनाची माहिती दाखवा." },
	{ id: "5", question: "माझ्या जनावरांचा तपशील द्या, शेवटच्या रेतनाची तारीख आणि उपचारांच्या नोंदींसह." },
	{ id: "6", question: "माझ्या जनावरासाठी कृत्रिम रेतनाची भेट नोंदवा." },
	{ id: "7", question: "माझ्या कोणत्या जनावरांचे लसीकरण किंवा जंतनाशक बाकी आहे?" },
	{ id: "8", question: "माजावर आलेल्या गाई/म्हशीला कधी भरवावे?" },
	{ id: "9", question: "वितल्यानंतर गाई/म्हशीला पुन्हा कधी भरवावे?" },
	{ id: "10", question: "वार अडकून राहण्याची कारणे कोणती?" },
	{ id: "11", question: "वितल्यानंतर वार कधी पडली पाहिजे?" },
	{ id: "12", question: "कासदाह (मस्टायटिस) कसा टाळावा?" },
	{ id: "13", question: "लाळ्या खुरकूत (FMD) रोखण्यासाठी काय करावे?" },
	{ id: "14", question: "आफऱ्यावर घरगुती उपाय कोणते?" },
	{ id: "15", question: "जंत होऊ नयेत म्हणून काय करावे?" },
	{ id: "16", question: "गोचीड नियंत्रणासाठी काय करावे?" },
	{ id: "17", question: "वासरांना जंतनाशक औषध कधी द्यावे?" },
	{ id: "18", question: "गाभण जनावराची काळजी कशी घ्यावी?" },
	{ id: "19", question: "मुरघास म्हणजे काय?" },
	{ id: "20", question: "शिंग खुडणे (डिहॉर्निंग) कधी करावे?" },
	{ id: "21", question: "कोणत्या जातीची जनावरे ठेवावीत?" },
	{ id: "22", question: "दूध उत्पादन वाढवण्यासाठी काय करावे?" },
	{ id: "23", question: "आज माझ्या दुधाचे फॅट आणि SNF किती आले?" },
	{ id: "24", question: "माझे जनावर कमी खात असेल तर काय करावे?" },
	{ id: "25", question: "माझ्या जनावरावर झालेल्या आधीच्या उपचारांचा तपशील दाखवा." },
	{ id: "26", question: "जनावराला त्वचेचा आजार झाल्यास काय करावे?" },
	{ id: "27", question: "जनावर माजावर आले आहे की नाही हे कसे ओळखावे?" },
	{ id: "28", question: "रेतन केल्यानंतर गर्भ तपासणी कधी करावी?" },
	{ id: "29", question: "वारंवार रेतन करूनही जनावर गाभण राहत नसेल तर काय करावे?" },
	{ id: "30", question: "माझ्या कोणत्या जनावरांची गर्भ तपासणी बाकी आहे?" },
	{ id: "31", question: "कोणत्या जनावराची विण्याची संभाव्य तारीख जवळ आली आहे?" },
	{ id: "32", question: "जनावर विण्याची लक्षणे कोणती?" },
	{ id: "33", question: "जनावर वितानाच लगेच काय करावे?" },
	{ id: "34", question: "वितल्यानंतर जनावराला काय खाऊ घालावे?" },
	{ id: "35", question: "माझ्या जनावराचा रोजचा आहार किती असावा?" },
	{ id: "36", question: "गाय आणि म्हशीसाठी संतुलित आहार कसा तयार करावा?" },
	{ id: "37", question: "खनिज मिश्रण किती आणि कधी द्यावे?" },
	{ id: "38", question: "दुधाळ जनावराला किती खुराक द्यावा?" },
	{ id: "39", question: "माझ्या जनावराचे पुढचे लसीकरण कधी आहे?" },
	{ id: "40", question: "नवजात वासराला चीक कधी आणि किती द्यावा?" },
	{ id: "41", question: "वासराला खुराक आणि हिरवा चारा कधीपासून द्यायला सुरुवात करावी?" },
	{ id: "42", question: "वासरांच्या लसीकरण आणि जंतनाशकाचे वेळापत्रक दाखवा." },
	{ id: "43", question: "गोठा स्वच्छ आणि निर्जंतुक कसा ठेवावा?" },
	{ id: "44", question: "दूध काढताना कोणती स्वच्छता पाळावी?" },
	{ id: "45", question: "स्वच्छ दूध उत्पादनासाठी काय करावे?" },
	{ id: "46", question: "सरकारी पशुपालन योजनांबद्दल सांगा." },
	{ id: "47", question: "पशुपालनासाठी कर्ज किंवा अनुदान कसे मिळवावे?" },
	{ id: "48", question: "पावसाळ्यात जनावरांची काळजी कशी घ्यावी?" },
	// Bharat Vistaar farming questions (AMUL-53).
	{ id: "49", question: "माझे मृदा आरोग्य पत्रक (सॉइल हेल्थ कार्ड – SHC) कसे मिळवावे?" },
	{ id: "50", question: "आज जुनागढजवळच्या बाजार समितीत भुईमुगाचा भाव किती आहे?" },
	{ id: "51", question: "माझ्या जमिनीसाठी कोणते पीक सर्वात योग्य आहे?" },
	{ id: "52", question: "जमिनीतील नत्र नैसर्गिकरीत्या कसे वाढवावे?" },
	{ id: "53", question: "जमिनीची सुपीकता वाढवण्यासाठी कोणते खत किती वापरावे?" },
	{ id: "54", question: "क्षारपड जमिनीत कोणती पिके घेता येतील?" },
	{ id: "55", question: "ग्रीनहाऊस आणि पॉलिहाऊस म्हणजे काय? त्याचे फायदे सांगा." },
	{ id: "56", question: "ग्रीनहाऊस आणि पॉलिहाऊससाठीच्या सरकारी अनुदानाबद्दल सांगा." },
	{ id: "57", question: "रासायनिक खतांऐवजी सेंद्रिय खत कसे वापरावे आणि त्याचे फायदे काय?" },
	{ id: "58", question: "कमी पाण्यात जास्त उत्पादन कसे घ्यावे?" },
	{ id: "59", question: "भुईमूग पेरण्याची योग्य वेळ कोणती?" },
	{ id: "60", question: "पुढील आठवड्यात पाऊस पडण्याची शक्यता आहे का?" },
	{ id: "61", question: "आणंदजवळ कोणत्या बाजार समितीत फ्लॉवर मिळतो?" },
	{ id: "62", question: "माझ्या भागातील जवळच्या बाजार समितीत आज गव्हाचा भाव किती आहे?" },
	{ id: "63", question: "प्रधानमंत्री पीक विमा योजनेत दावा कसा करावा?" },
	{ id: "64", question: "किसान क्रेडिट कार्डसाठी अर्ज कसा करावा?" },
	{ id: "65", question: "प्रधानमंत्री कृषी सिंचन योजनेचा लाभ कसा घ्यावा?" },
	{ id: "66", question: "कृषी यांत्रिकीकरण योजनेत अनुदान कसे मिळवावे?" },
	{ id: "67", question: "सेंद्रिय पद्धतीने कीड नियंत्रण कसे करावे?" },
	{ id: "68", question: "गोआधारित सेंद्रिय शेतीचे फायदे काय आहेत?" },
];

const FAQ_PA: FAQItem[] = [
	{ id: "1", question: "ਪਿਛਲੇ 7 ਦਿਨਾਂ ਦੇ ਮੇਰੇ ਦੁੱਧ ਅਤੇ ਕਟੌਤੀ ਦਾ ਵੇਰਵਾ ਦੱਸੋ।" },
	{ id: "2", question: "ਅੱਜ ਅਤੇ ਕੱਲ੍ਹ ਮੈਂ ਕਿੰਨਾ ਦੁੱਧ ਪਾਇਆ? ਰੁਪਏ ਅਤੇ ਲੀਟਰ ਵਿੱਚ ਦੱਸੋ।" },
	{ id: "3", question: "ਪਿਛਲੇ ਅਤੇ ਚਾਲੂ ਮਹੀਨੇ ਮੇਰੀ ਕੁੱਲ ਆਮਦਨ ਤੇ ਕਟੌਤੀ ਕਿੰਨੀ ਹੈ?" },
	{ id: "4", question: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ ਸਮੇਤ ਪਸ਼ੂਆਂ ਅਤੇ ਦੁੱਧ ਉਤਪਾਦਨ ਦਾ ਡਾਟਾ ਵਿਖਾਓ।" },
	{ id: "5", question: "ਮੇਰੇ ਪਸ਼ੂਆਂ ਦਾ ਵੇਰਵਾ ਦਿਓ, ਪਿਛਲੇ ਗਰਭਦਾਨ ਦੀ ਤਾਰੀਖ਼ ਅਤੇ ਇਲਾਜ ਦੇ ਰਿਕਾਰਡ ਸਮੇਤ।" },
	{ id: "6", question: "ਮੇਰੇ ਪਸ਼ੂ ਲਈ ਗਰਭਦਾਨ ਦੀ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ।" },
	{ id: "7", question: "ਮੇਰੇ ਕਿਹੜੇ ਪਸ਼ੂਆਂ ਦਾ ਟੀਕਾਕਰਨ ਜਾਂ ਕਿਰਮ ਨਾਸ਼ਕ ਬਾਕੀ ਹੈ?" },
	{ id: "8", question: "ਹੇਹੇ ਵਿੱਚ ਆਈ ਗਾਂ/ਮੱਝ ਨੂੰ ਕਦੋਂ ਗਰਭਦਾਨ ਕਰਵਾਈਏ?" },
	{ id: "9", question: "ਸੂਣ ਤੋਂ ਬਾਅਦ ਗਾਂ/ਮੱਝ ਨੂੰ ਦੁਬਾਰਾ ਕਦੋਂ ਗਰਭਦਾਨ ਕਰਵਾਈਏ?" },
	{ id: "10", question: "ਜੇਰ ਨਾ ਪੈਣ ਦੇ ਕੀ ਕਾਰਨ ਹਨ?" },
	{ id: "11", question: "ਸੂਣ ਤੋਂ ਬਾਅਦ ਜੇਰ ਕਦੋਂ ਪੈ ਜਾਣੀ ਚਾਹੀਦੀ ਹੈ?" },
	{ id: "12", question: "ਥਣੈਲੇ ਤੋਂ ਕਿਵੇਂ ਬਚਾਅ ਕਰੀਏ?" },
	{ id: "13", question: "ਮੂੰਹ-ਖੁਰ ਰੋਗ (FMD) ਰੋਕਣ ਲਈ ਕੀ ਕਰੀਏ?" },
	{ id: "14", question: "ਅਫਾਰੇ ਦਾ ਘਰੇਲੂ ਇਲਾਜ ਕੀ ਹੈ?" },
	{ id: "15", question: "ਕਿਰਮਾਂ ਤੋਂ ਬਚਾਅ ਲਈ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?" },
	{ id: "16", question: "ਚਿੱਚੜਾਂ ਦੀ ਰੋਕਥਾਮ ਲਈ ਕੀ ਕਰੀਏ?" },
	{ id: "17", question: "ਵੱਛਿਆਂ ਨੂੰ ਕਿਰਮ ਨਾਸ਼ਕ ਦਵਾਈ ਕਦੋਂ ਦੇਈਏ?" },
	{ id: "18", question: "ਗੱਭਣ ਪਸ਼ੂ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ ਕਿਵੇਂ ਕਰੀਏ?" },
	{ id: "19", question: "ਸਾਈਲੇਜ ਕੀ ਹੁੰਦਾ ਹੈ?" },
	{ id: "20", question: "ਸਿੰਗ ਦਾਗਣਾ (ਡੀਹਾਰਨਿੰਗ) ਕਦੋਂ ਕਰਵਾਈਏ?" },
	{ id: "21", question: "ਕਿਹੜੀ ਨਸਲ ਦੇ ਪਸ਼ੂ ਰੱਖਣੇ ਚਾਹੀਦੇ ਹਨ?" },
	{ id: "22", question: "ਦੁੱਧ ਦਾ ਉਤਪਾਦਨ ਵਧਾਉਣ ਲਈ ਕੀ ਕਰੀਏ?" },
	{ id: "23", question: "ਅੱਜ ਮੇਰੇ ਦੁੱਧ ਦਾ ਫੈਟ ਅਤੇ SNF ਕਿੰਨਾ ਆਇਆ?" },
	{ id: "24", question: "ਮੇਰਾ ਪਸ਼ੂ ਘੱਟ ਖਾਵੇ ਤਾਂ ਕੀ ਕਰੀਏ?" },
	{ id: "25", question: "ਮੇਰੇ ਪਸ਼ੂ ਦੇ ਪਿਛਲੇ ਇਲਾਜ ਦਾ ਵੇਰਵਾ ਵਿਖਾਓ।" },
	{ id: "26", question: "ਪਸ਼ੂ ਨੂੰ ਚਮੜੀ ਦਾ ਰੋਗ ਹੋ ਜਾਵੇ ਤਾਂ ਕੀ ਕਰੀਏ?" },
	{ id: "27", question: "ਪਸ਼ੂ ਹੇਹੇ ਵਿੱਚ ਆਇਆ ਹੈ ਜਾਂ ਨਹੀਂ, ਕਿਵੇਂ ਪਛਾਣੀਏ?" },
	{ id: "28", question: "ਗਰਭਦਾਨ ਤੋਂ ਬਾਅਦ ਗਰਭ ਦੀ ਜਾਂਚ ਕਦੋਂ ਕਰਵਾਈਏ?" },
	{ id: "29", question: "ਵਾਰ-ਵਾਰ ਗਰਭਦਾਨ ਦੇ ਬਾਵਜੂਦ ਪਸ਼ੂ ਗੱਭਣ ਨਾ ਹੋਵੇ ਤਾਂ ਕੀ ਕਰੀਏ?" },
	{ id: "30", question: "ਮੇਰੇ ਕਿਹੜੇ ਪਸ਼ੂਆਂ ਦੀ ਗਰਭ ਜਾਂਚ ਬਾਕੀ ਹੈ?" },
	{ id: "31", question: "ਕਿਹੜੇ ਪਸ਼ੂ ਦੇ ਸੂਣ ਦੀ ਸੰਭਾਵੀ ਤਾਰੀਖ਼ ਨੇੜੇ ਆ ਗਈ ਹੈ?" },
	{ id: "32", question: "ਪਸ਼ੂ ਦੇ ਸੂਣ ਦੇ ਲੱਛਣ ਕੀ ਹਨ?" },
	{ id: "33", question: "ਪਸ਼ੂ ਦੇ ਸੂਣ ਵੇਲੇ ਤੁਰੰਤ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?" },
	{ id: "34", question: "ਸੂਣ ਤੋਂ ਬਾਅਦ ਪਸ਼ੂ ਨੂੰ ਕੀ ਖੁਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?" },
	{ id: "35", question: "ਮੇਰੇ ਪਸ਼ੂ ਦੀ ਰੋਜ਼ਾਨਾ ਖੁਰਾਕ ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?" },
	{ id: "36", question: "ਗਾਂ ਅਤੇ ਮੱਝ ਲਈ ਸੰਤੁਲਿਤ ਖੁਰਾਕ ਕਿਵੇਂ ਬਣਾਈਏ?" },
	{ id: "37", question: "ਖਣਿਜ ਮਿਸ਼ਰਣ ਕਿੰਨਾ ਅਤੇ ਕਦੋਂ ਦੇਈਏ?" },
	{ id: "38", question: "ਦੁੱਧ ਦੇਣ ਵਾਲੇ ਪਸ਼ੂ ਨੂੰ ਕਿੰਨਾ ਦਾਣਾ ਦੇਈਏ?" },
	{ id: "39", question: "ਮੇਰੇ ਪਸ਼ੂ ਦਾ ਅਗਲਾ ਟੀਕਾਕਰਨ ਕਦੋਂ ਹੈ?" },
	{ id: "40", question: "ਨਵਜੰਮੇ ਵੱਛੇ ਨੂੰ ਬਹੁਲੀ ਕਦੋਂ ਅਤੇ ਕਿੰਨੀ ਦੇਈਏ?" },
	{ id: "41", question: "ਵੱਛੇ ਨੂੰ ਦਾਣਾ ਅਤੇ ਹਰਾ ਚਾਰਾ ਕਦੋਂ ਤੋਂ ਦੇਣਾ ਸ਼ੁਰੂ ਕਰੀਏ?" },
	{ id: "42", question: "ਵੱਛਿਆਂ ਦੇ ਟੀਕਾਕਰਨ ਅਤੇ ਕਿਰਮ ਨਾਸ਼ਕ ਦੀ ਸਮਾਂ-ਸਾਰਣੀ ਵਿਖਾਓ।" },
	{ id: "43", question: "ਵਾੜਾ ਸਾਫ਼ ਅਤੇ ਕੀਟਾਣੂ ਰਹਿਤ ਕਿਵੇਂ ਰੱਖੀਏ?" },
	{ id: "44", question: "ਧਾਰ ਕੱਢਣ ਵੇਲੇ ਕਿਹੜੀ ਸਫ਼ਾਈ ਰੱਖਣੀ ਚਾਹੀਦੀ ਹੈ?" },
	{ id: "45", question: "ਸਾਫ਼ ਦੁੱਧ ਪੈਦਾ ਕਰਨ ਲਈ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?" },
	{ id: "46", question: "ਸਰਕਾਰੀ ਪਸ਼ੂ ਪਾਲਣ ਸਕੀਮਾਂ ਬਾਰੇ ਦੱਸੋ।" },
	{ id: "47", question: "ਪਸ਼ੂ ਪਾਲਣ ਲਈ ਕਰਜ਼ਾ ਜਾਂ ਸਬਸਿਡੀ ਕਿਵੇਂ ਮਿਲਦੀ ਹੈ?" },
	{ id: "48", question: "ਬਰਸਾਤ ਦੇ ਮੌਸਮ ਵਿੱਚ ਪਸ਼ੂਆਂ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ ਕਿਵੇਂ ਕਰੀਏ?" },
	// Bharat Vistaar farming questions (AMUL-53).
	{ id: "49", question: "ਮੈਂ ਆਪਣਾ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ (ਸੌਇਲ ਹੈਲਥ ਕਾਰਡ – SHC) ਕਿਵੇਂ ਲਵਾਂ?" },
	{ id: "50", question: "ਅੱਜ ਜੂਨਾਗੜ੍ਹ ਨੇੜੇ ਦੀ ਮੰਡੀ ਵਿੱਚ ਮੂੰਗਫਲੀ ਦਾ ਭਾਅ ਕੀ ਹੈ?" },
	{ id: "51", question: "ਮੇਰੀ ਜ਼ਮੀਨ ਲਈ ਕਿਹੜੀ ਫ਼ਸਲ ਸਭ ਤੋਂ ਢੁਕਵੀਂ ਹੈ?" },
	{ id: "52", question: "ਮਿੱਟੀ ਵਿੱਚ ਨਾਈਟ੍ਰੋਜਨ ਕੁਦਰਤੀ ਤਰੀਕੇ ਨਾਲ ਕਿਵੇਂ ਵਧਾਈਏ?" },
	{ id: "53", question: "ਮਿੱਟੀ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਵਧਾਉਣ ਲਈ ਕਿਹੜੀ ਖਾਦ ਕਿੰਨੀ ਪਾਈਏ?" },
	{ id: "54", question: "ਕੱਲਰ ਵਾਲੀ ਜ਼ਮੀਨ ਵਿੱਚ ਕਿਹੜੀਆਂ ਫ਼ਸਲਾਂ ਹੋ ਸਕਦੀਆਂ ਹਨ?" },
	{ id: "55", question: "ਗਰੀਨਹਾਊਸ ਅਤੇ ਪੌਲੀਹਾਊਸ ਕੀ ਹਨ? ਇਨ੍ਹਾਂ ਦੇ ਫ਼ਾਇਦੇ ਦੱਸੋ।" },
	{ id: "56", question: "ਗਰੀਨਹਾਊਸ ਅਤੇ ਪੌਲੀਹਾਊਸ ਲਈ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਬਾਰੇ ਦੱਸੋ।" },
	{ id: "57", question: "ਰਸਾਇਣਕ ਖਾਦਾਂ ਦੀ ਥਾਂ ਜੈਵਿਕ ਖਾਦ ਕਿਵੇਂ ਵਰਤੀਏ ਅਤੇ ਇਸ ਦੇ ਕੀ ਫ਼ਾਇਦੇ ਹਨ?" },
	{ id: "58", question: "ਘੱਟ ਪਾਣੀ ਨਾਲ ਵੱਧ ਪੈਦਾਵਾਰ ਕਿਵੇਂ ਲਈਏ?" },
	{ id: "59", question: "ਮੂੰਗਫਲੀ ਬੀਜਣ ਦਾ ਸਹੀ ਸਮਾਂ ਕਿਹੜਾ ਹੈ?" },
	{ id: "60", question: "ਅਗਲੇ ਹਫ਼ਤੇ ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ?" },
	{ id: "61", question: "ਆਣੰਦ ਨੇੜੇ ਕਿਹੜੀ ਮੰਡੀ ਵਿੱਚ ਫੁੱਲ ਗੋਭੀ ਮਿਲਦੀ ਹੈ?" },
	{ id: "62", question: "ਮੇਰੇ ਇਲਾਕੇ ਦੀ ਨੇੜਲੀ ਮੰਡੀ ਵਿੱਚ ਅੱਜ ਕਣਕ ਦਾ ਭਾਅ ਕੀ ਹੈ?" },
	{ id: "63", question: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫ਼ਸਲ ਬੀਮਾ ਯੋਜਨਾ ਵਿੱਚ ਦਾਅਵਾ ਕਿਵੇਂ ਕਰੀਏ?" },
	{ id: "64", question: "ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਲਈ ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇਈਏ?" },
	{ id: "65", question: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕ੍ਰਿਸ਼ੀ ਸਿੰਚਾਈ ਯੋਜਨਾ ਦਾ ਲਾਭ ਕਿਵੇਂ ਲਈਏ?" },
	{ id: "66", question: "ਖੇਤੀ ਮਸ਼ੀਨੀਕਰਨ ਸਕੀਮ ਵਿੱਚ ਸਬਸਿਡੀ ਕਿਵੇਂ ਮਿਲਦੀ ਹੈ?" },
	{ id: "67", question: "ਜੈਵਿਕ ਤਰੀਕੇ ਨਾਲ ਕੀੜਿਆਂ ਦੀ ਰੋਕਥਾਮ ਕਿਵੇਂ ਕਰੀਏ?" },
	{ id: "68", question: "ਗਊ ਆਧਾਰਿਤ ਜੈਵਿਕ ਖੇਤੀ ਦੇ ਕੀ ਫ਼ਾਇਦੇ ਹਨ?" },
];

// Every supported language now has dedicated localized FAQs.
export const FAQ_DATA: Record<LanguageCode, FAQItem[]> = {
	gu: FAQ_GU,
	en: FAQ_EN,
	hi: FAQ_HI,
	bn: FAQ_BN,
	mr: FAQ_MR,
	pa: FAQ_PA,
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

