import { Info } from "lucide-react";
import { type LanguageCode } from "../../config";

const BETA_LANGUAGE_NOTES: Partial<Record<LanguageCode, string>> = {
	bn: "বেটা রিলিজ: ভাষা অনুবাদ পরীক্ষাধীন। কিছু ভুল থাকতে পারে।",
	te: "బీటా విడుదల: భాషా అనువాదం పరీక్షలో ఉంది. కొన్ని లోపాలు ఉండవచ్చు.",
	mr: "बीटा रिलीज: भाषेचे भाषांतर चाचणीमध्ये आहे. काही त्रुटी असू शकतात.",
	ta: "பீட்டா வெளியீடு: மொழிபெயர்ப்பு சோதனையில் உள்ளது. சில பிழைகள் இருக்கலாம்.",
	gu: "બેટા રિલીઝ: ભાષા અનુવાદ પરીક્ષણ હેઠળ છે. કેટલીક ભૂલો હોઈ શકે છે.",
	kn: "ಬೀಟಾ ಬಿಡುಗಡೆ: ಭಾಷಾ ಅನುವಾದ ಪರೀಕ್ಷೆಯಲ್ಲಿದೆ. ಕೆಲವು ದೋಷಗಳು ಇರಬಹುದು.",
	ml: "ബീറ്റ റിലീസ്: ഭാഷാ വിവർത്തനം പരീക്ഷണത്തിലാണ്. ചില പിശകുകൾ ഉണ്ടായേക്കാം.",
	as: "বেটা মুক্তি: ভাষা অনুবাদ পৰীক্ষাধীন। কিছুমান ভুল থাকিব পাৰে।"
};

export function BetaLanguageNote({ language }: { readonly language?: LanguageCode }) {
	if (!language) return null;

	const note = BETA_LANGUAGE_NOTES[language];

	if (!note) return null;

	return (
		<div className="mt-3 flex items-start gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[11px] leading-snug text-[var(--primary)] dark:bg-indigo-900/20 dark:text-indigo-300">
			<Info className="mt-px h-3 w-3 shrink-0" />
			<span>{note}</span>
		</div>
	);
}
