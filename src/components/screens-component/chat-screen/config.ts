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
		{
			id: "1",
			question: "વેતર આવેલ ગાય- ભેંસ ક્યારે ફેળવવી?",
			answer: `વિયાણ પછી ફરીથી ફળવવાનો સમય:
વિયાણ પછી ગાય-ભેંસને ઓછામાં ઓછા બે માસ (60 દિવસ) સુધી ફળવવું નહીં. આ જરૂરી છે કારણ કે વિયાણ પછી ગર્ભાશય વધેલું હોય છે અને તેને પોતાના મૂળ કદમાં પાછો આવવા માટે સમય જરૂરી છે. આ સમયગાળા દરમિયાન ગર્ભાશયમાં રહેલા કચરા અથવા ચેપ પણ સાફ થાય છે. આથી પ્રજનન કાર્ય માટે બે માસનો આરામનો સમય આવશ્યક છે.

સામાન્ય રીતે પશુ વિયાણ પછી 45 દિવસમાં વેતરમાં આવે છે. પરંતુ પહેલા વેતરને છોડીને, બીજા વેતરમાં અથવા વિયાણના 60 થી 90 દિવસમાં બીજદાન કરાવવું યોગ્ય રહે છે. નફાકારક ડેરી વ્યવસાય માટે, પશુએ વિયાણના 60-90 દિવસમાં ગર્ભધારણ કરવું જોઈએ.

જો પશુ વિયાણ પછી 60-70 દિવસમાં વેતરમાં ન આવે તો તાત્કાલિક પશુચિકિત્સકની સલાહ લો અને જરૂરી તપાસ તથા સારવાર કરાવો.`,
		},
		{
			id: "2",
			question: "વિયાણ બાદ ગાય/ભેંસને ફરી ક્યારે ફેળવવી?",
			answer: `વિયાણ પછી ફરીથી ફળવવાનો સમય:
વિયાણ પછી ગાય-ભેંસને ઓછામાં ઓછા બે માસ (60 દિવસ) સુધી ફળવવું નહીં. આ જરૂરી છે કારણ કે વિયાણ પછી ગર્ભાશય વધેલું હોય છે અને તેને પોતાના મૂળ કદમાં પાછો આવવા માટે સમય લાગે છે. આ સમયગાળા દરમિયાન ગર્ભાશયમાં રહેલા કચરા અથવા ચેપ પણ સાફ થાય છે.

સામાન્ય રીતે પશુ વિયાણ પછી 45 દિવસમાં વેતરમાં આવે છે, પરંતુ પહેલા વેતરને છોડીને બીજા વેતરમાં અથવા વિયાણના 60 થી 90 દિવસમાં બીજદાન કરાવવું યોગ્ય રહે છે. નફાકારક ડેરી વ્યવસાય માટે આદર્શ વિયાણ ગાળો જાળવવા, પશુએ વિયાણના 60-90 દિવસમાં ગર્ભધારણ કરવું જોઈએ.

મહત્વનું: જો પશુ વિયાણ પછી 60-70 દિવસમાં વેતરમાં ન આવે તો તાત્કાલિક પશુચિકિત્સકની સલાહ લો અને જરૂરી તપાસ તથા સારવાર કરાવો.`,
		},
		{
			id: "3",
			question: "મેલી ન પડવાના કારણો શું છે?",
			answer: `મેલી ન પડવાના મુખ્ય કારણો:
1. કેલ્શિયમની અસંતુલિત માત્રા: વિયાણ સમયે પશુના શરીરમાં કેલ્શિયમનું અસંતુલન થવાથી નબળાઈ આવે છે અને ગર્ભાશયના સ્નાયુઓ નબળા પડે છે.

2. યોગ્ય કસરતનો અભાવ: ગર્ભાવસ્થાના છેલ્લા 8-9 માસમાં યોગ્ય કસરત ન થવાથી શરીરના પાછળના ભાગના સ્નાયુઓ સંકોચાય છે અને ગર્ભાશયના સ્નાયુઓ નબળા હોય તો મેલી અટકી શકે છે.

3. વધુ ઉંમરના પશુઓ: વૃદ્ધ ગાય-ભેંસોમાં મેલી ન પડવાની શક્યતા વધારે હોય છે.

4. મુશ્કેલ વિયાણ: કઠિન પ્રસવ હોય તેવા પશુઓમાં મેલી ન પડવાની સમસ્યા વધારે જોવા મળે છે.

5. હોર્મોન સમસ્યા: ઓક્સીટોસીન હોર્મોનનો અપૂરતો સ્રાવ થવાથી મેલી બહાર નીકળતી નથી.

6. ગર્ભાશયમાં ચેપ: વિયાણ દરમિયાન પર્યાવરણમાંથી બેક્ટેરિયા ગર્ભાશયમાં પ્રવેશ કરી શકે છે, જેથી ગર્ભાશયની દિવાલોમાં સોજો આવે અને મેલી રોકાય છે.

સામાન્ય માહિતી: સામાન્ય રીતે વિયાણ પછી 4-6 કલાકમાં મેલી પડી જાય છે. જો 12 કલાક પછી પણ ન પડે તો તેને રિટેન્ડ પ્લેસેન્ટા કહે છે.`,
		},
		{
			id: "4",
			question: "વિયાણ બાદ મેલી ક્યારે પડાવી જોઈએ?",
			answer: `મહત્વપૂર્ણ: મેલી જાતે પડાવવી નહીં
વિયાણ પછી મેલી સામાન્ય રીતે 3 થી 8 કલાકમાં આપોઆપ પડી જાય છે. જો 12 કલાક પછી પણ મેલી ન પડે તો તેને રિટેન્ડ પ્લેસેન્ટા (માટી ન ખસવી) કહે છે.

ખૂબ જ મહત્વપૂર્ણ સાવચેતી:
મેલી જાતે ખેંચીને કાઢવી જોઈએ નહીં - આ ખૂબ જોખમી છે
જબરદસ્તીથી મેલી પડાવવાથી ગંભીર રક્તસ્રાવ થઈ શકે છે
ગર્ભાશયની નાજુક દિવાલોને નુકસાન થાય છે
ચેપ અને પરુ થવાની શક્યતા વધે છે
પશુના મૃત્યુ સુધી થઈ શકે છે

યોગ્ય પદ્ધતિ:
24 કલાક સુધી: પશુચિકિત્સકની સલાહ વિના મેલી હાથ લગાડવી નહીં. સંશોધન પ્રમાણે 60% પશુઓમાં મેલી 12-24 કલાકમાં આપોઆપ પડી જાય છે.

24 કલાક પછી: જો મેલી ન પડે તો તાત્કાલિક પશુચિકિત્સકનો સંપર્ક કરો. પશુચિકિત્સક:
ગર્ભાશયમાં દવા આપશે જે સુરક્ષિત રીતે મેલી પડાવવામાં મદદ કરે
જરૂર મુજબ એન્ટીબાયોટિક્સ આપશે
યોગ્ય સારવાર આપશે`,
		},
		{
			id: "5",
			question: "આઉનો સોજો કેવી રીતે અટકાવી શકાય?",
			answer: `આઉનો સોજો (માસ્ટાઇટિસ) અટકાવવા માટે નીચેના મહત્વપૂર્ણ પગલાં અપનાવો: દૂધ દોહતાં પહેલાં હાથ સારી રીતે ધોઈ સાફ કરો. આઉને સ્વચ્છ પાણીથી ધોઈ શુષ્ક કપડાથી લૂછો. દોહણ પહેલાં દરેક આંચળમાંથી પ્રથમ બે-ત્રણ ધાર દૂધ અલગ વાસણમાં કાઢી ફેંકી દો. પૂર્ણ હાથની પદ્ધતિથી દોહન કરો, અંગૂઠો બહાર રાખો. દોહન પછી આઉ સંપૂર્ણ ખાલી કરો, બાકી દૂધ ન રહેવા દો. દોહન પછી આંચળને જંતુનાશક દ્રાવણમાં બોળો (ટીટ-ડિપ પદ્ધતિ). પશુશાળાને સ્વચ્છ અને શુષ્ક રાખો, સારું ફ્લોરિંગ રાખો. આઉમાં કોઈ ઈજા થાય તો તાત્કાલિક સારવાર કરાવો. સંક્રમિત પશુને છેલ્લે દોહો, અલગ દૂધ એકત્રિત કરો. દૂધના વાસણો સ્વચ્છ રાખો, સૂર્યપ્રકાશમાં સૂકવો. નિયમિત કેલિફોર્નિયા માસ્ટાઇટિસ ટેસ્ટ (સીએમટી) કરાવો. સુકા ગાળા દરમિયાન ડ્રાય કાઉ થેરેપી અપનાવો. પશુઓને સંતુલિત આહાર, ખનીજ મિશ્રણ અને સ્વચ્છ પાણી આપો. આ પગલાં અપનાવીને આઉનો સોજો અટકાવી શકાય, દૂધ ઉત્પાદનમાં ઘટાડો રોકી શકાય અને આર્થિક નુકસાન ટાળી શકાય.`,
		},
		{
			id: "6",
			question: "ખરવામોંવાસો અટકાવવા શું કરવું?",
			answer: `વાછરડાંમાં ઝાડા (ખરવા/મોવાસા) અટકાવવા માટેની અસરકારક રીતો:

જન્મ પછીની તાત્કાલિક સંભાળ: જન્મ પછી અડધા કલાકથી એક કલાકમાં વાછરડાને શરીરના વજનના ૧૦% પ્રમાણે (૨-૩ લિટર) ખીરૂ આપવું અત્યંત જરૂરી છે. ખીરૂમાં રોગપ્રતિકારક શક્તિ વધારતા તત્વો ૫ ગણા વધારે હોય છે, જે વાછરડાને રોગોથી બચાવે છે. પ્રથમ ત્રણ દિવસ સુધી નિયમિત ખીરૂ પાજવું.

સ્વચ્છતા જાળવો: વાછરડાંને શુષ્ક, સ્વચ્છ અને સુવાવળુ વાતાવરણમાં રાખવા. દૂધ પાતી વખતે સ્વચ્છ વાસણ વાપરવું અને આખોરાનું દૂધ ચુવાડવા પહેલાં આંચળની સ્વચ્છતા જરૂરી છે. વાછરડાંની વાડીમાં અઠવાડિયામાં બે વખત ૦.૫% કિનાલ (૫૦ મિલી કિનાલ + ૧૦ લિટર પાણી) નો છંટકાવ કરવો.

યોગ્ય આહાર અને રાખવાની રીત: વાછરડાને શરીરના વજનના ૮-૧૦% પ્રમાણે દૂધ આપવું. સવાર-સાંજના ખવડાવા વચ્ચે ૧૨ કલાકનો અંતર રાખવો. વધારે દૂધ આપવાથી પણ ઝાડા થઈ શકે છે. વાછરડાંને એકબીજાથી અલગ રાખવા કારણ કે તેઓ એકબીજાની નાભિ ચાટે છે, જેથી ચેપ ફેલાય છે.

ચેપ રોકવા: ચેપ રોકવા માટે ૧૫ દિવસના અંતરે ત્રણ દિવસ સુધી દૂધ સાથે એન્ટીબાયોટિક આપવી. નાભિને આયોડિનના ટિંકચરથી સાફ કરવી. વાછરડાને દૂધ પીધા પછી મોં સૂકા કપડાથી સાફ કરી થોડું મીઠું ચાટવા દેવું.

જો ઝાડા શરૂ થાય તો તાત્કાલિક પશુચિકિત્સકની સલાહ લેવી અને ઇલેક્ટ્રોલાઇટ સોલ્યુશન (૧ લિટર ગરમ પાણીમાં ગ્લુકોઝ ૫ ચમચી + ખાવાનો સોડા ૧ ચમચી + મીઠું ૧ ચમચી) દરરોજ ૨-૪ લિટર આપવું.`,
		},
		{
			id: "7",
			question: "આફરામાં ઘરગથ્થુ ઉપચાર શું છે?",
			answer: `આફરા (ગેસ આફરો) એ એક ગંભીર સ્થિતિ છે જેમાં પશુના પેટમાં ગેસ ભરાઈ જાય છે. મારે તમને આ વિશે તાત્કાલિક ઘરગથ્થુ ઉપચાર અને સાવચેતી વિશે માર્ગદર્શન આપવા છે.

આફરાના લક્ષણો: પશુની ડાબી બાજુ (પેટ) ફૂલી જાય અને ઢોલ જેવો અવાજ આવે. પશુ બેચેન થાય, પેટને પગ મારે, પડે-ઊભું થાય, જીભ બહાર નીકળે, અને શ્વાસ લેવામાં મુશ્કેલી થાય. ગંભીર સ્થિતિમાં પશુ મૃત્યુ પામી શકે છે.

તાત્કાલિક ઘરગથ્થુ ઉપચાર: મિશ્રણ તૈયાર કરો: 500 ગ્રામ ખાદ્ય તેલ (મગફળી, તલ, અથવા કપાસીયા તેલ) લો અને તેમાં 25 ગ્રામ હીંગ પાવડર, 50 ગ્રામ અજમો પાવડર, 50 ગ્રામ સંચળ (ખડક મીઠું), અને 50 ગ્રામ સૂંઠ (સૂકું આદુ) પાવડર મિક્સ કરો. જો શક્ય હોય તો 20-30 મિલી ટર્પેન્ટાઈન તેલ પણ ઉમેરી શકો. આ મિશ્રણ નળી દ્વારા આપો અને પશુને ચાલવા માટે પ્રોત્સાહન આપો.

વૈકલ્પિક ઘરગથ્થુ ઉપાય: પશુને નારિયેળ તેલ (300-500 મિલી) પીવડાવો, અથવા ડિટરજન્ટનું એક ટેબલસ્પૂન અડધા લિટર પાણીમાં ઓગાળીને આપો. હળવા આફરામાં 4-6 કેળાં પાન પણ ખવડાવી શકો છો.

મહત્વપૂર્ણ સાવચેતી: પશુને બેસવા ન દો, પાણી પીવડાવો નહીં, અને પશુને સંતુલિત રાખો. પેટ પર હળવી મસાજ કરો, ગળા વિસ્તાર ઘસો, અને મુખમાં નાની લાકડી મૂકીને જીભ હલાવવા પ્રોત્સાહન આપો. જો સ્થિતિ ગંભીર હોય, તાત્કાલિક પશુચિકિત્સકનો સંપર્ક કરો.`,
		},
		{
			id: "8",
			question: "કરમિયા અટકાવવા શું કરવું?",
			answer: `કરમિયા (પેટના કીડા) પશુઓને ગંભીર નુકસાન પહોંચાડે છે. મારે તમને કરમિયા અટકાવવાના અસરકારક ઉપાયો વિશે માર્ગદર્શન આપવા છે.

કરમિયાના લક્ષણો: પશુ ઓછું ખોરાક લે, દૂધ ઉત્પાદનમાં 10-20% ઘટાડો, શરીરનું વજન ઘટે, વાળ ખરબચડા અને પડતા થાય, પાતળા ઝાડા, નબળી વૃદ્ધિ, પેટ ફુલાવો, અને જડબા નીચે સોજો આવે. વાછરડાંઓમાં કરમિયાથી 30-40% મૃત્યુદર થઈ શકે છે.

નિયમિત કૃમિનાશક દવા શેડ્યુલ: વાછરડાં માટે: પ્રથમ ડોઝ 20-22 દિવસની ઉંમરે, તે પછી દર મહિને 6 મહિના સુધી. પુખ્ત પશુઓ માટે: વર્ષમાં બે વખત - ચોમાસા પહેલાં (મે-જૂન) અને ચોમાસા પછી (ઓગસ્ટ-સપ્ટેમ્બર). વિયાણ પહેલાં 15 દિવસ આગળ કૃમિનાશક દવા આપો.

અટકાવવાના ઉપાયો: પશુઘરોમાં સ્વચ્છતા જાળવો, છાણ તાત્કાલિક દૂર કરો, અને પશુનો મળ ખાડામાં સંગ્રહ કરો જેથી જમીન સાથે સંપર્ક ન થાય. ચોમાસાની શરૂઆતમાં અને પહેલાં નીચાણવાળા વિસ્તારોમાં પશુઓને ચરાવો નહીં. કૃમિનાશક દવા આપતા પહેલાં 24 કલાક સુધી ખોરાક બંધ રાખો. પશુઘરને દર મહિને જંતુનાશક દવાથી છંટકાવ કરો.

લાભો: નિયમિત કૃમિનાશક દવાથી દૂધ ઉત્પાદનમાં 10-15% વધારો, પાચનશક્તિ અને પ્રજનન કાર્યક્ષમતામાં સુધારો, અને રોગ પ્રતિકારક શક્તિ વધે છે. હંમેશા પશુચિકિત્સકની સલાહ લઈને યોગ્ય કૃમિનાશક દવા (એલ્બેન્ડાઝોલ, આઇવરમેક્ટિન) આપો.`,
		},
		{
			id: "9",
			question: "ઈતરડી નિયંત્રણ માટે શું કરવું?",
			answer: `ઈતરડી પશુઓને ગંભીર નુકસાન પહોંચાડે છે અને થાઈલેરીયોસીસ, બેબેસીયોસીસ જેવા જીવલેણ રોગો ફેલાવે છે. મારે તમને ઈતરડી નિયંત્રણના અસરકારક ઉપાયો વિશે માર્ગદર્શન આપવા છે.

ઈતરડીના નુકસાન: એક પુખ્ત ઈતરડી લગભગ 3,000 ઈંડા મૂકે છે અને 400 કિલોના પશુ પર 100 ઈતરડી દરરોજ 1 લિટર લોહી ચૂસી શકે છે. આના કારણે દૂધ ઉત્પાદનમાં 20% ઘટાડો, વજનમાં ઘટાડો, નબળાઇ, અને રક્તાલ્પતા થાય છે.

નિયંત્રણના પ્રાથમિક ઉપાયો: નવા ખરીદેલા પશુઓને ટોળામાં મેળવતા પહેલાં સંપૂર્ણ ઈતરડી મુક્ત કરો. પશુના શરીર પર નિયમિત અંતરાલે ઈતરડીનાશક દવા (ડેલ્ટામેથ્રિન, સાયપરમેથ્રિન) નો ઉપયોગ કરો - 50 મિલી દવાને 15 લિટર પાણીમાં ભેળવીને સ્પ્રે કરો.

પશુઘરનું વ્યવસ્થાપન: પશુઘરની દિવાલો અને ફ્લોરમાંની તિરાડોમાં ઈતરડીનાશક દવા છંટકાવ કરો. છાણના ઢગલા અને ઘાસ-ચારાના સ્ટેક પશુઘરથી દૂર રાખો. પશુઘરની આસપાસ અનાવશ્યક વનસ્પતિ દૂર કરો. માટી ખોદીને ઉપરનો સ્તર પલટાવો જેથી સૂર્યપ્રકાશથી ઈતરડીના વિકાસ ચક્રમાં વિક્ષેપ પડે.

રસીકરણ: થાઈલેરીયોસીસ માટે 3 મહિનાથી વધુ ઉંમરના વિદેશી અને સંકર પશુઓને જીવનમાં એક વખત રસી આપો. ઈતરડીનાશક દવાનું જૂથ વારંવાર બદલો જેથી પ્રતિકાર ન વિકસે. લીંબુ તેલ અથવા લીમડાનું તેલ કુદરતી ઈતરડી નિવારક તરીકે નિયમિત ઉપયોગ કરી શકાય.`,
		},
		{
			id: "10",
			question: "બચ્ચાઓને કરમિયાની દવા ક્યારે આપવી?",
			answer: `બચ્ચાઓમાં કરમિયા (પેટના કીડા) મોટા પ્રમાણમાં મૃત્યુદર અને આરોગ્ય સમસ્યાઓનું કારણ બને છે. યોગ્ય સમયે કરમિયાની દવા આપવી અત્યંત જરૂરી છે.

પ્રથમ ડોઝ અને આવર્તન: બચ્ચાને પ્રથમ કરમિયાની દવા 20-22 દિવસની ઉંમરે આપવી જોઈએ. કેટલાક નિષ્ણાતો 10 દિવસની ઉંમરે પણ સૂચવે છે. તે પછી, બચ્ચું 6 મહિનાનું થાય ત્યાં સુધી દર 2 મહિને નિયમિત રીતે દવા આપવી જોઈએ. 6 મહિના પછી, વર્ષમાં બે વખત (દર 6 મહિને) દવા આપવી આવશ્યક છે - એક વાર વરસાદ પહેલાં અને એક વાર વરસાદ પછી.

વય પ્રમાણે ડોઝ:
1 મહિના સુધી: 2 નાની ગોળીઓ (300 mg)
2-4 મહિના: 3 નાની ગોળીઓ (450 mg)
5-8 મહિના: 4 નાની ગોળીઓ (600 mg)
8 મહિનાથી 2 વર્ષ: 1 મોટી ગોળી (1.5 g)
2 વર્ષથી વધુ: 2 મોટી ગોળી (3 g)

મહત્વપૂર્ણ લાભો: નિયમિત કરમિયાનાશક દવાથી બચ્ચાઓમાં મૃત્યુદર 30-40% ઘટાડી શકાય છે. બચ્ચાઓ તંદુરસ્ત રહે છે, તેમનો વિકાસ યોગ્ય રીતે થાય છે, રોગપ્રતિકારક શક્તિ વધે છે, અને પછીથી દૂધ ઉત્પાદનમાં 10-15% સુધી વધારો થાય છે. તેથી પશુચિકિત્સકની સલાહથી યોગ્ય સમયે કરમિયાની દવા આપવી જરૂરી છે.`,
		},
		{
			id: "11",
			question: "ગાભણ પશુની માવજત કેવી રીતે કરવી?",
			answer: `ગાભણ પશુની યોગ્ય માવજત આરોગ્ય અને ઉત્પાદકતા માટે અત્યંત જરૂરી છે. મારે તમને આ વિશે વિગતવાર માર્ગદર્શન આપવા છે.

પોષણ વ્યવસ્થા: ગર્ભાવસ્થાના પ્રથમ છ માસ દરમિયાન સામાન્ય પોષણ પૂરતું છે, પરંતુ છેલ્લા ત્રણ માસમાં ભ્રૂણનો 60-70% વિકાસ થાય છે. સાતમા મહિનાથી શરૂ કરીને, વસૂકેલી ગાભણ ગાય-ભેંસને રોજ 2 થી 2.5 કિલો સંતુલિત દાણ આપો. દર 15-20 દિવસે 500 ગ્રામ વધારીને વિયાણ સમયે 3-4 કિલો સુધી પહોંચાડો. આ પદ્ધતિ "સ્ટીમિંગ અપ" તરીકે ઓળખાય છે. દરરોજ 15-20 કિલો લીલો ચારો, 4-5 કિલો સૂકો ચારો, 50 ગ્રામ ખનીજ તત્વો મિશ્રણ, અને 30 ગ્રામ મીઠું આપો.

રહેણાંક વ્યવસ્થા: ગાભણ પશુને સ્વચ્છ, સૂકા, સારા વેન્ટિલેશન અને સૂર્યપ્રકાશ સાથેના સ્થળે રાખો. છેલ્લા બે મહિનામાં પશુને બીમાર પશુઓથી અલગ રાખો, લાંબા અંતર માટે ચરવા ન લઈ જાઓ, અને સમતલ જમીન પર રાખો. વિયાણના 4-5 દિવસ પહેલાં અલગ, સાફ વિસ્તારમાં ખસેડો.

વસૂકેલો ગાળો: સાતમા મહિનાના પુરા થયા પછી 15 દિવસમાં દૂધ બંધ કરો. આ 50-70 દિવસનો વિશ્રામ કાળ પાહોની પેશીઓને આરામ આપે છે અને આગળના દુધાળ ગાળામાં વધુ દૂધ ઉત્પાદન માટે તૈયારી કરે છે.

સામાન્ય સંભાળ: દિવસમાં ત્રણ થી ચાર વખત 75-80 લિટર સ્વચ્છ પાણી આપો. ઉનાળામાં દિવસમાં બે વખત ઠંડા પાણીથી નહાવવાની વ્યવસ્થા કરો. ત્રીજા અને આઠમા મહિનામાં કૃમિનાશક દવા આપો. વિયાણના છેલ્લા 1-2 દિવસ દરમિયાન કાળજીપૂર્વક નિરીક્ષણ કરો.

આ પદ્ધતિ અપનાવવાથી સરળ વિયાણ, તંદુરસ્ત પાડું, વધુ દૂધ ઉત્પાદન, અને પશુની સારી તંદુરસ્તી સુનિશ્ચિત થાય છે.`,
		},
		{
			id: "12",
			question: "સાયલેજ એટલે શું?",
			answer: `સાયલેજ એટલે લીલા ચારાને હવા વગરના (એનારોબિક) વાતાવરણમાં લાંબા સમય સુધી આથવણી દ્વારા સાચવી રાખવાની પદ્ધતિ. સરળ ભાષામાં કહીએ તો, સાયલેજ એ લીલા ચારાનું અથાણું છે.

સાયલેજ શા માટે બનાવવું? વરસાદી મોસમમાં જ્યારે લીલો ચારો વધુ પડતો હોય અને તેને સૂકવી શકાતો ન હોય ત્યારે સાયલેજ બનાવીને તેને સાચવી શકાય છે. ઉનાળામાં જ્યારે લીલા ચારાની અછત હોય ત્યારે આ સાયલેજ પશુઓને ખવડાવી શકાય છે.

સાયલેજ માટે યોગ્ય પાકો: જુવાર, મકાઈ, બાજરી, ઓટ્સ, હાઈબ્રિડ નેપિયર જેવા કાર્બોહાઈડ્રેટ બહુવાળા પાકો સાયલેજ માટે શ્રેષ્ઠ છે. લીલા ચારાને 50% ફૂલ આવ્યા પછી કાપીને સાયલેજ બનાવવું જોઈએ. લીલા ચારામાં 60-70% ભેજ હોવું જોઈએ.

સાયલેજ બનાવવાની પદ્ધતિ: લીલા ચારાને 4-5 સેન્ટિમીટરના નાના ટુકડામાં કાપો. 100 કિલો લીલા ચારામાં 1% મીઠું અને 3% ગોળની રસી ઉમેરો. સાયલો પિટમાં સ્તર પ્રમાણે ભરીને દબાવો જેથી હવા ન રહે. પ્લાસ્ટિક શીટ અને 30 સેન્ટિમીટર માટી વડે હવાચુસ્ત સીલ કરો. 45-60 દિવસમાં સાયલેજ તૈયાર થઈ જશે.

સારા સાયલેજના ગુણધર્મો: સાયલેજનો રંગ હળવો પીળાશ પડતો લીલો હોવો જોઈએ, થોડી ખાટી-મીઠી સુગંધ હોવી જોઈએ, ફૂગ અને દુર્ગંધ વગરનું હોવું જોઈએ, અને pH મૂલ્ય 4.2 કરતાં ઓછું હોવું જોઈએ.`,
		},
		{
			id: "13",
			question: "શિંગ ડામવા ક્યારે જોઈએ?",
			answer: `વાછરડાંના શિંગ ડામવાની યોગ્ય ઉંમર અને પદ્ધતિ તેમના આરોગ્ય અને વ્યવસ્થાપન માટે મહત્વપૂર્ણ છે. મારે તમને આ વિશે વિગતવાર માર્ગદર્શન આપવા છે.

શિંગ ડામવાની યોગ્ય ઉંમર: કેનેડિયન વેટરનરી મેડિકલ એસોસિએશન અનુસાર, જરૂરી હોય તો જન્મના પ્રથમ મહિનામાં શિંગ ડામવું જોઈએ. આદર્શ રીતે 1-2 અઠવાડિયાની ઉંમરે શિંગ ડામવાથી શ્રેષ્ઠ પરિણામો મળે છે. 8 અઠવાડિયા કરતાં ઓછી ઉંમરના વાછરડાંમાં ચેપ અને ગૂંચવણોનું જોખમ ઓછું રહે છે, કારણ કે શિંગની કળી હજુ ખોપરીની હાડકા સાથે જોડાયેલી નથી હોતી.

શિંગ ડામવાની પદ્ધતિઓ: ગરમ લોખંડની સળિયા વડે વાછરડાંને 12 અઠવાડિયા સુધીની ઉંમરે શિંગ ડામી શકાય છે. શિંગની કળીની આસપાસના વાળ કાપીને પેરાફિન જેલી લગાવો. ગરમ લોખંડની સળિયાને લાલ રંગ થાય ત્યાં સુધી ગરમ કરો અને શિંગની કળી પર 10-15 સેકંડ માટે ઘૂમાવતા હળવા દબાણ સાથે લગાવો. જ્યારે શિંગની આસપાસ તાંબાના રંગનું વર્તુળ બને ત્યારે બંધ કરો.

મહત્વપૂર્ણ સૂચનો: પશુચિકિત્સકની સલાહથી સ્થાનિક એનેસ્થેસિયા અને પીડાનાશક દવા આપવી જરૂરી છે. શિંગ ડામ્યા પછી 30-60 મિનિટ સુધી રક્તસ્રાવ માટે નિરીક્ષણ કરો. ઘા પર જંતુનાશક લગાવો અને 10-14 દિવસ સુધી ચેપની નિશાનીઓ માટે તપાસ કરો. ઉનાળા અને પાનખરમાં માખીઓનું જોખમ વધુ હોય છે, તેથી વસંત અથવા શિયાળામાં શિંગ ડામવું શ્રેષ્ઠ છે.`,
		},
		{
			id: "14",
			question: "કઈ ઓલાદના પશુ રાખવા જોઈએ?",
			answer: `પશુપાલનમાં કઈ ઓલાદના પશુ રાખવા તે તમારા સંસાધનો, હવામાન અને બજારની માંગ પર આધાર રાખે છે. મારે તમને આ વિશે સંપૂર્ણ માર્ગદર્શન આપવા છે.

દેશી ઓલાદના પશુઓ: ગુજરાતમાં ગાયની ગીર અને કાંકરેજ તથા ભેંસની સુરતી, મહેસાણી, જાફરાબાદી, બન્ની અને મુર્રાહ ઓલાદ મુખ્ય છે. દેશી ઓલાદો આપણી હવામાનમાં સારી રીતે અનુકૂળ થાય છે, રોગો સામે પ્રતિકારક શક્તિ ધરાવે છે અને ઓછા ખોરાકમાં પણ દૂધ આપી શકે છે. ભેંસનું દૂધ ચરબીયુક્ત હોવાથી જ્યાં ચરબીની ટકાવારીને આધારે ભાવ મળતો હોય ત્યાં ભેંસ રાખવી લાભદાયી છે.

સંકર ઓલાદના પશુઓ: જ્યાં સારા સંસાધનો, યોગ્ય હવામાન અને આરોગ્ય સુવિધાઓ ઉપલબ્ધ હોય ત્યાં જર્સી અથવા હોલ્સ્ટીન ફ્રીઝીયન (HF) સંકર ગાયો રાખી શકાય. આ ઓલાદો વધુ દૂધ આપે છે પરંતુ તેમને સારી સંભાળ, સંતુલિત આહાર અને યોગ્ય વાતાવરણની જરૂર રહે છે. 50% સુધીના વિદેશી જીનો ધરાવતી સંકર ઓલાદ આપણી પરિસ્થિતિમાં શ્રેષ્ઠ પરિણામ આપે છે.

પસંદગીના મુદ્દાઓ: પ્રથમ અથવા બીજા દૂધાળ ગાળામાં હોય તેવા પશુ પસંદ કરો. પશુની દેખાવ સારી હોવી જોઈએ - તેજસ્વી આંખો, સીધી મજબૂત પીઠ, સારી આકારનું પાહો અને શાંત સ્વભાવ. ઉચ્ચ દૂધ ઉત્પાદન આપતી ઓલાદ પસંદ કરો - ગીર 2200-2700 લિટર, મહેસાણી ભેંસ 1700-1800 લિટર અને સંકર ગાયો 2500-5500 લિટર પ્રતિ દૂધાળ ગાળો આપી શકે છે.`,
		},
		{
			id: "15",
			question: "દૂધ વધારવા શું કરવું?",
			answer: `દૂધ વધારવા માટે તમારે સંતુલિત આહાર, યોગ્ય વ્યવસ્થાપન અને આરોગ્ય સંભાળ પર ધ્યાન આપવું જરૂરી છે. મારે તમને આ વિશે સંપૂર્ણ માર્ગદર્શન આપવા છે.

સંતુલિત આહાર આપો: દૂધાળા પશુને દરરોજ 6 કિલો સૂકો ચારો અને 15-20 કિલો લીલો ચારો આપો. દરેક લિટર દૂધ માટે વધારાનું 500 ગ્રામ સંતુલિત દાણામિશ્રણ આપવું જોઈએ - ભેંસને 50% અને ગાયને 40% દૂધ ઉત્પાદનના પ્રમાણમાં. શરીર નિભાવ માટે વધારાના 1-1.5 કિલો દાણ આપો. દાણામિશ્રણમાં 20-22% પ્રોટીન અને 65-70% કુલ પાચ્ય પોષકતત્વો હોવા જોઈએ.

ખનિજ તત્વો અને પાણી: દરરોજ 30-50 ગ્રામ ખનીજ મિશ્રણ આપો. આનાથી દૂધ ઉત્પાદન 10-15% વધે છે અને પ્રજનન ક્ષમતા સુધરે છે. પર્યાપ્ત પાણી પૂરું પાડો - દરરોજ 75-80 લિટર અને દરેક લિટર દૂધ માટે વધારાના 2.5 લિટર.

યોગ્ય સંભાળ અને વ્યવસ્થાપન: પશુને રોજ સ્નાન કરાવો અથવા દોહણ પહેલાં સાફ કરો. આનાથી લોહીનું પરિભ્રમણ સુધરે અને દૂધ ઉત્પાદન વધે. સમયસર કૃમિનાશક દવા આપો, રસીકરણ કરાવો અને પશુનું નિયમિત આરોગ્ય નિરીક્ષણ કરો. ઉનાળામાં છાંયો અને પર્યાપ્ત હવાની ગોઠવણ કરો.

પ્રોબાયોટીક્સ અને ખાસ ફીડ: દૂધ વધારવા માટે બાયપાસ પ્રોટીન ફીડ, યુરિયા મોલાસીસ મિનરલ બ્લોક અને મીઠાના પથ્થર રાખો. સંયુક્ત પશુ ખોરાક આપવાથી દૂધ ઉત્પાદન વધે અને ખર્ચ ઘટે.`,
		},
	],
	en: [
		{
			id: "1",
			question: "When should a cow/buffalo in heat be bred?",
			answer: `Time to breed again after calving:
Do not breed cows and buffaloes for at least two months (60 days) after calving. This is necessary because the uterus is enlarged after calving and it needs time to return to its original size. During this period, any waste or infection in the uterus is also cleared. Hence, a two-month rest period is necessary for reproduction.

Usually, the animal comes into heat within 45 days after calving. But it is advisable to get inseminated in the second calving or within 60 to 90 days of calving, except for the first calving. For a profitable dairy business, the animal should conceive within 60-90 days of calving.

If the animal does not come into heat within 60-70 days after calving, consult a veterinarian immediately and get the necessary examination and treatment done.`,
		},
		{
			id: "2",
			question: "When should a cow/buffalo be bred again after calving?",
			answer: `Time to re-breed after calving:
Do not breed cows and buffaloes for at least two months (60 days) after calving. This is necessary because the uterus is enlarged after calving and it takes time to return to its original size. During this period, any waste or infection in the uterus is also cleared.

Usually, the animal comes into heat within 45 days after calving, but it is advisable to skip the first calving and get inseminated in the second calving or within 60 to 90 days of calving. To maintain the ideal calving period for a profitable dairy business, the animal should conceive within 60-90 days of calving.

Important: If the animal does not come into heat within 60-70 days after calving, consult a veterinarian immediately and get the necessary examination and treatment done.`,
		},
		{
			id: "3",
			question: "What are the reasons for the retention of the afterbirth (placenta)?",
			answer: `Main reasons for retention of placenta:
1. Imbalanced calcium levels: Calcium imbalance in the animal's body during calving causes weakness and weakens the uterine muscles.

2. Lack of proper exercise: Lack of proper exercise in the last 8-9 months of pregnancy causes the muscles of the back of the body to contract and if the uterine muscles are weak, calving can be stopped.

3. Older animals: Older cows and buffaloes are more likely to have retained placenta.

4. Difficult calving: The problem of retained placenta is more common in animals that have had difficult births.

5. Hormone problems: Due to insufficient secretion of the hormone oxytocin, the placenta does not come out.

6. Infection in the uterus: During calving, bacteria from the environment can enter the uterus, causing swelling in the walls of the uterus and stopping the placenta from being expelled.

General information: Usually the placenta falls off within 4-6 hours after delivery. If it does not fall off even after 12 hours, it is called retained placenta.`,
		},
		{
			id: "4",
			question: "When should the placenta be removed after calving?",
			answer: `Important: Do not pull out the placenta yourself
The placenta usually falls off on its own within 3 to 8 hours after delivery. If the placenta does not fall off even after 12 hours, it is called a retained placenta.

Very important precaution:
Do not pull out the placenta yourself - this is very dangerous
Forcing the placenta can cause severe bleeding
Damage the delicate walls of the uterus
Increases the chance of infection and pus
Can even lead to the death of the animal

Proper method:
Up to 24 hours: Do not touch the placenta without consulting a veterinarian. According to research, in 60% of animals, the placenta falls off on its own within 12-24 hours.

After 24 hours: If the placenta does not fall off, contact a veterinarian immediately. The veterinarian will:
Inject medication into the uterus to help the placenta release safely
Give antibiotics as needed
Provide appropriate treatment`,
		},
		{
			id: "5",
			question: "How can mastitis (udder swelling) be prevented?",
			answer: `To prevent mastitis, take the following important steps: Wash your hands thoroughly before milking. Wash the udder with clean water and wipe it with a dry cloth. Before milking, remove the first two to three edges of milk from each udder into a separate container. Milk with the full hand method, keeping your thumb outside. Empty the udder completely after milking, leaving no milk remaining. Dip the udder in a disinfectant solution after milking (teat-dip method). Keep the animal house clean and dry, have good flooring. If there is any injury to the udder, get it treated immediately. Milk the infected animal last, collect the milk separately. Keep the milking vessels clean, dry in sunlight. Get regular California Mastitis Test (CMT) done. Adopt dry cow therapy during the dry period. Feed the animals a balanced diet, mineral mixture and clean water. By adopting these steps, udder swelling can be prevented, reduction in milk production can be prevented and economic losses can be avoided.`,
		},
		{
			id: "6",
			question: "What to do to prevent FMD?",
			answer: `Effective ways to prevent diarrhea (kharva/movasa) in calves:

Immediate post-natal care: It is very important to give 10% of the calf's body weight (2-3 liters) of colostrum within half an hour to an hour after birth. Colostrum contains 5 times more immune-boosting elements, which protect the calf from diseases. Feed colostrum regularly for the first three days.

Maintain hygiene: Keep the calves in a dry, clean and airy environment. Use clean utensils while milking and clean the udder before sucking the milk of the calf. Spray 0.5% Kinal (50 ml Kinal + 10 liters of water) twice a week in the calf's pen.

Proper diet and keeping: Give milk to the calf according to 8-10% of the body weight. Keep a gap of 12 hours between morning and evening feeding. Giving too much milk can also cause diarrhea. Keep calves separate from each other because they lick each other's navels, which spreads the infection.

Prevention of infection: To prevent infection, give antibiotics with milk for three days at a distance of 15 days. Clean the navel with tincture of iodine. After drinking milk, wipe the calf's mouth with a dry cloth and let it lick some salt.

If diarrhea starts, immediately consult a veterinarian and give electrolyte solution (5 teaspoons of glucose in 1 liter of warm water + 1 teaspoon of baking soda + 1 teaspoon of salt) 2-4 liters daily.`,
		},
		{
			id: "7",
			question: "What are the home remedies for bloat?",
			answer: `Gas bloat is a serious condition in which the stomach of an animal is filled with gas. Here is guidance on immediate home remedies and precautions for this.

Symptoms of bloat: The left side of the animal (stomach) swells and makes a drum-like sound. The animal becomes restless, kicks its stomach, falls and stands, the tongue protrudes, and has difficulty breathing. In severe cases, the animal may die.

Immediate home remedies: Prepare a mixture: Take 500 grams of edible oil (groundnut, sesame, or cottonseed oil) and mix 25 grams of asafoetida powder, 50 grams of ajwain powder, 50 grams of rock salt, and 50 grams of dried ginger powder in it. If possible, you can also add 20-30 ml of turpentine oil. Give this mixture through a tube and encourage the animal to walk.

Alternative home remedies: Give the animal coconut oil (300-500 ml), or one tablespoon of detergent dissolved in half a liter of water. You can also feed 4-6 banana leaves in a light meal.

Important precautions: Do not let the animal sit, do not give water, and keep the animal balanced. Gently massage the abdomen, rub the throat area, and encourage tongue movement by placing a small stick in the mouth. If the condition is severe, contact a veterinarian immediately.`,
		},
		{
			id: "8",
			question: "What to do to prevent worms?",
			answer: `Worms (stomach worms) cause serious harm to animals. Here is guidance on effective ways to prevent worms.

Symptoms of worms: Low feed intake, 10-20% reduction in milk production, loss of body weight, rough and falling hair, thin diarrhea, poor growth, abdominal distension, and swelling under the jaw. Worms can cause 30-40% mortality in calves.

Regular deworming schedule: For calves: First dose at 20-22 days of age, then every month for 6 months. For adult animals: Twice a year - before monsoon (May-June) and after monsoon (August-September). Give deworming 15 days before calving.

Prevention measures: Maintain cleanliness in the animal houses, remove dung immediately, and store animal feces in pits so that it does not come into contact with the soil. Do not graze cattle in low-lying areas during and before the onset of monsoon. Withhold feed for 24 hours before administering deworming medication. Spray the livestock house with insecticide every month.

Benefits: Regular deworming increases milk production by 10-15%, improves digestion and reproductive efficiency, and increases immunity. Always give appropriate deworming medication (albendazole, ivermectin) after consulting a veterinarian.`,
		},
		{
			id: "9",
			question: "What to do for tick control?",
			answer: `Ticks cause serious damage to livestock and spread deadly diseases like theileriosis, babesiosis. Here is guidance on effective methods of tick control.

Damages of ticks: An adult tick lays about 3,000 eggs and 100 ticks can suck 1 liter of blood per day on a 400 kg animal. This causes 20% reduction in milk production, weight loss, weakness, and anemia.

Primary control measures: Free all ticks before introducing newly purchased animals into the herd. Use tickicides (deltamethrin, cypermethrin) on the animal's body at regular intervals - spray 50 ml of the drug in 15 liters of water.

Animal housing management: Spray tickicides in the cracks in the walls and floors of the animal housing. Keep manure piles and haystacks away from the animal house. Remove unnecessary vegetation around the animal house. Dig up the soil and turn over the top layer so that sunlight interrupts the development cycle of the tick.

Vaccination: Vaccinate exotic and hybrid animals above 3 months of age for theileriosis once in their life. Change the group of ticks frequently to prevent resistance from developing. Lemon oil or neem oil can be used regularly as a natural tick deterrent.`,
		},
		{
			id: "10",
			question: "When should deworming medicine be given to calves?",
			answer: `Worms (stomach worms) cause a large amount of mortality and health problems in calves. It is very important to give worm medicine at the right time.

First dose and frequency: Calves should be given the first worm medicine at the age of 20-22 days. Some experts also suggest at the age of 10 days. After that, the medicine should be given regularly every 2 months till the calf is 6 months old. After 6 months, the medicine must be given twice a year (every 6 months) - once before the rains and once after the rains.

Dosage according to age:
Up to 1 month: 2 small tablets (300 mg)
2-4 months: 3 small tablets (450 mg)
5-8 months: 4 small tablets (600 mg)
8 months to 2 years: 1 large tablet (1.5 g)
More than 2 years: 2 large tablets (3 g)

Important benefits: Regular worm medicine can reduce the mortality rate in calves by 30-40%. The calves remain healthy, develop properly, have increased immunity, and later on, milk production increases by 10-15%. Therefore, it is necessary to give deworming medicine at the right time with the advice of a veterinarian.`,
		},
		{
			id: "11",
			question: "How to take care of a pregnant animal?",
			answer: `Proper care of pregnant animals is essential for health and productivity. Here is detailed guidance on this.

Nutritional management: Normal nutrition is sufficient during the first six months of pregnancy, but 60-70% of the fetus develops in the last three months. Starting from the seventh month, feed 2 to 2.5 kg of balanced grain to the pregnant cow and buffalo daily. Increase by 500 gm every 15-20 days to reach 3-4 kg at the time of calving. This method is known as "steaming up". Give 15-20 kg of green fodder, 4-5 kg of dry fodder, 50 gm of mineral mixture, and 30 gm of salt daily.

Housing management: Keep the pregnant animal in a clean, dry, well-ventilated and sunny place. Keep the animal separate from sick animals in the last two months, do not take it for grazing for long distances, and keep it on level ground. Move to a separate, clean area 4-5 days before calving.

Dry period: Stop milking 15 days after the completion of the seventh month. This 50-70 day rest period gives rest to the udder tissues and prepares for more milk production in the next milking period.

General care: Provide 75-80 liters of clean water three to four times a day. Arrange for bathing with cold water twice a day in summer. Give deworming medicine in the third and eighth months. Monitor carefully during the last 1-2 days of calving.

Adopting this method ensures easy calving, healthy calf, more milk production, and good health of the animal.`,
		},
		{
			id: "12",
			question: "What is Silage?",
			answer: `Silage is a method of preserving green fodder by fermentation in an anaerobic environment for a long time. In simple terms, silage is a pickle of green fodder.

Why make silage? In the rainy season, when there is excess green fodder and it cannot be dried, it can be preserved by making silage. In summer, when there is shortage of green fodder, this silage can be fed to animals.

Crops suitable for silage: Crops rich in carbohydrates like sorghum, maize, millet, oats, hybrid Napier are best for silage. Green fodder should be cut and made into silage after 50% flowering. Green fodder should have 60-70% moisture.

Method of making silage: Cut the green fodder into small pieces of 4-5 centimeters. Add 1% salt and 3% jaggery to 100 kg of green fodder. Fill the silo pit in layers and press it so that there is no air. Seal it airtight with a plastic sheet and 30 centimeters of soil. The silage will be ready in 45-60 days.

Properties of good silage: The color of the silage should be light yellowish green, have a slightly sour-sweet aroma, be free from mold and bad odor, and the pH value should be less than 4.2.`,
		},
		{
			id: "13",
			question: "When should dehorning (disbudding) be done?",
			answer: `The correct age and method of dehorning calves is important for their health and management. Here is detailed guidance on this.

Correct age for dehorning: According to the Canadian Veterinary Medical Association, dehorning should be done within the first month of birth if necessary. Ideally, dehorning at 1-2 weeks of age gives the best results. Calves under 8 weeks of age are at a lower risk of infection and complications, as the horn bud is not yet attached to the skull bone.

Dehorning methods: Calves can be dehorned up to 12 weeks of age with a hot iron rod. Trim the hair around the horn bud and apply paraffin jelly. Heat the hot iron rod until it turns red and apply gentle pressure to the horn bud for 10-15 seconds. Stop when a copper-colored ring forms around the horn.

Important notes: It is necessary to administer local anesthesia and painkillers as advised by your veterinarian. Monitor for bleeding for 30-60 minutes after dehorning. Apply a disinfectant to the wound and check for signs of infection for 10-14 days. The risk of flies is highest in summer and fall, so it is best to dehorn in spring or winter.`,
		},
		{
			id: "14",
			question: "Which animal breeds should be kept?",
			answer: `Which breed of cattle to keep in animal husbandry depends on your resources, weather and market demand. Here is complete guidance on this.

Native breeds of cattle: In Gujarat, Gir and Kankrej breeds of cows and Surti, Mehsani, Jafrabadi, Banni and Murrah breeds of buffalo are the main ones. Native breeds adapt well to our climate, are resistant to diseases and can give milk even with less food. Since buffalo milk is fatty, it is beneficial to keep buffaloes where the price is based on the percentage of fat.

Crossbred cattle: Jersey or Holstein Friesian (HF) crossbred cows can be kept where good resources, suitable weather and health facilities are available. These breeds give more milk but they need good care, balanced diet and suitable environment. Crossbred breeds with up to 50% foreign genes give the best results in our conditions.

Selection points: Choose animals that are in their first or second lactation. The animal should have good appearance - bright eyes, straight strong back, well-shaped flanks and calm temperament. Choose breeds that give high milk production - Gir can give 2200-2700 liters, Mehsani buffalo 1700-1800 liters and crossbred cows can give 2500-5500 liters per lactation.`,
		},
		{
			id: "15",
			question: "What to do to increase milk yield?",
			answer: `To increase milk, you need to pay attention to balanced diet, proper management and health care. Here is complete guidance on this.

Give balanced diet: Give 6 kg dry fodder and 15-20 kg green fodder to the dairy animal daily. For every liter of milk, an additional 500 g of balanced grain mixture should be given - 50% for buffalo and 40% for cow in proportion to milk production. Give an additional 1-1.5 kg of grain for body maintenance. The grain mixture should contain 20-22% protein and 65-70% total digestible nutrients.

Minerals and water: Give 30-50 g of mineral mixture daily. This increases milk production by 10-15% and improves reproductive capacity. Provide adequate water - 75-80 liters daily and an additional 2.5 liters for every liter of milk.

Proper care and management: Bathe the animal daily or clean it before milking. This improves blood circulation and increases milk production. Give timely deworming medicine, get vaccinated and check the health of the animal regularly. Arrange shade and adequate ventilation in summer.

Probiotics and special feed: To increase milk, keep bypass protein feed, urea molasses mineral block and salt stones. Feeding combined animal feed increases milk production and reduces costs.`,
		},
	],
	hi: [
		{
			id: "1",
			question: "When should a cow/buffalo in heat be bred?",
			answer: `Time to breed again after calving:
Do not breed cows and buffaloes for at least two months (60 days) after calving. This is necessary because the uterus is enlarged after calving and it needs time to return to its original size. During this period, any waste or infection in the uterus is also cleared. Hence, a two-month rest period is necessary for reproduction.

Usually, the animal comes into heat within 45 days after calving. But it is advisable to get inseminated in the second calving or within 60 to 90 days of calving, except for the first calving. For a profitable dairy business, the animal should conceive within 60-90 days of calving.

If the animal does not come into heat within 60-70 days after calving, consult a veterinarian immediately and get the necessary examination and treatment done.`,
		},
		{ id: "2", question: "When should a cow/buffalo be bred again after calving?", answer: "Do not breed cows and buffaloes for at least two months (60 days) after calving. Usually, the animal comes into heat within 45 days after calving, but it is advisable to skip the first heat and get inseminated in the second heat or within 60 to 90 days of calving. If the animal does not come into heat within 60-70 days after calving, consult a veterinarian immediately." },
		{ id: "3", question: "What are the reasons for the retention of the afterbirth (placenta)?", answer: "Main reasons include: imbalanced calcium levels, lack of proper exercise in the last 8-9 months of pregnancy, older animals, difficult calving, hormone problems (insufficient oxytocin), and infection in the uterus. Usually the placenta falls off within 4-6 hours after delivery. If it does not fall off even after 12 hours, it is called retained placenta." },
		{ id: "4", question: "When should the placenta be removed after calving?", answer: "Do not pull out the placenta yourself - this is very dangerous. The placenta usually falls off on its own within 3 to 8 hours. Up to 24 hours: Do not touch the placenta without consulting a veterinarian. After 24 hours: If the placenta does not fall off, contact a veterinarian immediately." },
		{ id: "5", question: "How can mastitis (udder swelling) be prevented?", answer: "Wash hands before milking, wash the udder with clean water, discard first 2-3 squirts, use full hand milking method, empty udder completely, use teat-dip method after milking, keep animal house clean and dry, get regular CMT tests done, and adopt dry cow therapy during the dry period." },
		{ id: "6", question: "What to do to prevent FMD?", answer: "Give colostrum within half an hour of birth, maintain hygiene, keep calves in dry and clean environment, give milk at 8-10% of body weight, keep calves separate, clean navel with tincture of iodine, and consult a veterinarian if diarrhea starts." },
		{ id: "7", question: "What are the home remedies for bloat?", answer: "Prepare a mixture of 500g edible oil with asafoetida, ajwain, rock salt, and dried ginger powder. Give through a tube and encourage walking. Alternatively, give coconut oil (300-500 ml). Do not let the animal sit, do not give water. If severe, contact a veterinarian immediately." },
		{ id: "8", question: "What to do to prevent worms?", answer: "For calves: First dose at 20-22 days, then monthly for 6 months. For adults: Twice yearly - before and after monsoon. Maintain cleanliness, remove dung immediately, do not graze in low-lying areas during monsoon. Regular deworming increases milk production by 10-15%." },
		{ id: "9", question: "What to do for tick control?", answer: "Free all ticks before introducing new animals. Use tickicides (deltamethrin, cypermethrin) regularly. Spray cracks in walls and floors. Keep manure piles away. Vaccinate for theileriosis. Use neem oil as natural deterrent." },
		{ id: "10", question: "When should deworming medicine be given to calves?", answer: "First dose at 20-22 days of age, then every 2 months until 6 months old. After 6 months, twice a year - once before and once after rains. Regular deworming can reduce mortality by 30-40% and increase milk production by 10-15%." },
		{ id: "11", question: "How to take care of a pregnant animal?", answer: "From the 7th month, give 2-2.5 kg balanced grain daily, increasing by 500g every 15-20 days. Keep in clean, dry, well-ventilated place. Stop milking 15 days after 7th month. Provide 75-80 liters of clean water daily. Give deworming in 3rd and 8th months." },
		{ id: "12", question: "What is Silage?", answer: "Silage is preserved green fodder made by anaerobic fermentation. Best crops: sorghum, maize, millet, oats, hybrid Napier. Cut into 4-5 cm pieces, add 1% salt and 3% jaggery, press into silo pit, seal airtight. Ready in 45-60 days." },
		{ id: "13", question: "When should dehorning (disbudding) be done?", answer: "Ideally at 1-2 weeks of age. Calves under 8 weeks have lower risk of complications. Use hot iron rod method with local anesthesia. Monitor for bleeding 30-60 minutes after. Best done in spring or winter to avoid fly problems." },
		{ id: "14", question: "Which animal breeds should be kept?", answer: "Depends on resources, weather and market demand. Native breeds (Gir, Kankrej cows; Surti, Mehsani buffalo) adapt well to local climate. Crossbred Jersey or HF cows give more milk but need better care. Choose animals in first or second lactation with good appearance." },
		{ id: "15", question: "What to do to increase milk yield?", answer: "Give 6 kg dry fodder and 15-20 kg green fodder daily. Add 500g grain per liter of milk. Give 30-50g mineral mixture daily. Provide 75-80 liters water. Bathe daily, deworm timely, get vaccinated. Use bypass protein feed and mineral blocks." },
	],
	mr: [
		{
			id: "1",
			question: "When should a cow/buffalo in heat be bred?",
			answer: `Time to breed again after calving:
Do not breed cows and buffaloes for at least two months (60 days) after calving. This is necessary because the uterus is enlarged after calving and it needs time to return to its original size. During this period, any waste or infection in the uterus is also cleared. Hence, a two-month rest period is necessary for reproduction.

Usually, the animal comes into heat within 45 days after calving. But it is advisable to get inseminated in the second calving or within 60 to 90 days of calving, except for the first calving. For a profitable dairy business, the animal should conceive within 60-90 days of calving.

If the animal does not come into heat within 60-70 days after calving, consult a veterinarian immediately and get the necessary examination and treatment done.`,
		},
		{ id: "2", question: "When should a cow/buffalo be bred again after calving?", answer: "Do not breed cows and buffaloes for at least two months (60 days) after calving. Usually, the animal comes into heat within 45 days after calving, but it is advisable to skip the first heat and get inseminated in the second heat or within 60 to 90 days of calving. If the animal does not come into heat within 60-70 days after calving, consult a veterinarian immediately." },
		{ id: "3", question: "What are the reasons for the retention of the afterbirth (placenta)?", answer: "Main reasons include: imbalanced calcium levels, lack of proper exercise in the last 8-9 months of pregnancy, older animals, difficult calving, hormone problems (insufficient oxytocin), and infection in the uterus. Usually the placenta falls off within 4-6 hours after delivery. If it does not fall off even after 12 hours, it is called retained placenta." },
		{ id: "4", question: "When should the placenta be removed after calving?", answer: "Do not pull out the placenta yourself - this is very dangerous. The placenta usually falls off on its own within 3 to 8 hours. Up to 24 hours: Do not touch the placenta without consulting a veterinarian. After 24 hours: If the placenta does not fall off, contact a veterinarian immediately." },
		{ id: "5", question: "How can mastitis (udder swelling) be prevented?", answer: "Wash hands before milking, wash the udder with clean water, discard first 2-3 squirts, use full hand milking method, empty udder completely, use teat-dip method after milking, keep animal house clean and dry, get regular CMT tests done, and adopt dry cow therapy during the dry period." },
		{ id: "6", question: "What to do to prevent FMD?", answer: "Give colostrum within half an hour of birth, maintain hygiene, keep calves in dry and clean environment, give milk at 8-10% of body weight, keep calves separate, clean navel with tincture of iodine, and consult a veterinarian if diarrhea starts." },
		{ id: "7", question: "What are the home remedies for bloat?", answer: "Prepare a mixture of 500g edible oil with asafoetida, ajwain, rock salt, and dried ginger powder. Give through a tube and encourage walking. Alternatively, give coconut oil (300-500 ml). Do not let the animal sit, do not give water. If severe, contact a veterinarian immediately." },
		{ id: "8", question: "What to do to prevent worms?", answer: "For calves: First dose at 20-22 days, then monthly for 6 months. For adults: Twice yearly - before and after monsoon. Maintain cleanliness, remove dung immediately, do not graze in low-lying areas during monsoon. Regular deworming increases milk production by 10-15%." },
		{ id: "9", question: "What to do for tick control?", answer: "Free all ticks before introducing new animals. Use tickicides (deltamethrin, cypermethrin) regularly. Spray cracks in walls and floors. Keep manure piles away. Vaccinate for theileriosis. Use neem oil as natural deterrent." },
		{ id: "10", question: "When should deworming medicine be given to calves?", answer: "First dose at 20-22 days of age, then every 2 months until 6 months old. After 6 months, twice a year - once before and once after rains. Regular deworming can reduce mortality by 30-40% and increase milk production by 10-15%." },
		{ id: "11", question: "How to take care of a pregnant animal?", answer: "From the 7th month, give 2-2.5 kg balanced grain daily, increasing by 500g every 15-20 days. Keep in clean, dry, well-ventilated place. Stop milking 15 days after 7th month. Provide 75-80 liters of clean water daily. Give deworming in 3rd and 8th months." },
		{ id: "12", question: "What is Silage?", answer: "Silage is preserved green fodder made by anaerobic fermentation. Best crops: sorghum, maize, millet, oats, hybrid Napier. Cut into 4-5 cm pieces, add 1% salt and 3% jaggery, press into silo pit, seal airtight. Ready in 45-60 days." },
		{ id: "13", question: "When should dehorning (disbudding) be done?", answer: "Ideally at 1-2 weeks of age. Calves under 8 weeks have lower risk of complications. Use hot iron rod method with local anesthesia. Monitor for bleeding 30-60 minutes after. Best done in spring or winter to avoid fly problems." },
		{ id: "14", question: "Which animal breeds should be kept?", answer: "Depends on resources, weather and market demand. Native breeds (Gir, Kankrej cows; Surti, Mehsani buffalo) adapt well to local climate. Crossbred Jersey or HF cows give more milk but need better care. Choose animals in first or second lactation with good appearance." },
		{ id: "15", question: "What to do to increase milk yield?", answer: "Give 6 kg dry fodder and 15-20 kg green fodder daily. Add 500g grain per liter of milk. Give 30-50g mineral mixture daily. Provide 75-80 liters water. Bathe daily, deworm timely, get vaccinated. Use bypass protein feed and mineral blocks." },
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

