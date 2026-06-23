import { Info } from "lucide-react";
import { type LanguageCode } from "../../config";

const BETA_LANGUAGE_NOTES: Partial<Record<LanguageCode, string>> = {
	bn: "প্রাথমিক অ্যাক্সেস: কিছু ভুল থাকতে পারে।",
	te: "ప్రారంభ ప్రాప్యత: కొన్ని తప్పులు ఉండవచ్చు.",
	mr: "प्रारंभिक प्रवेश: काही चुका असू शकतात.",
	ta: "ஆரம்ப அணுகல்: சில தவறுகள் இருக்கலாம்.",
	gu: "પ્રારંભિક ઍક્સેસ: કેટલીક ભૂલો હોઈ શકે છે.",
	kn: "ಆರಂಭಿಕ ಪ್ರವೇಶ: ಕೆಲವು ತಪ್ಪುಗಳು ಇರಬಹುದು.",
	ml: "ആദ്യകാല ആക്സസ്: ചില പിഴവുകൾ ഉണ്ടായേക്കാം.",
	as: "প্ৰাৰম্ভিক প্ৰৱেশ: কিছুমান ভুল থাকিব পাৰে।"
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
