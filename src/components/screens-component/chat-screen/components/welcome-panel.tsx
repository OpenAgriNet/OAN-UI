import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactIcon } from "./contact-icon";
import { QuickAction } from "@/hooks/store/chat";
import type { ChatPersona } from "@/lib/chat-persona";

/* eslint-disable no-unused-vars */
type WelcomePanelProps = {
	onAction: (action: QuickAction) => void;
	actions: QuickAction[];
	persona?: ChatPersona;
};
/* eslint-enable no-unused-vars */

import { useLanguage } from "@/components/LanguageProvider";

export function WelcomePanel({ onAction, actions, persona = "farmer" }: WelcomePanelProps) {
	const { t } = useLanguage();
	const isDoctor = persona === "doctor";

	// Last line of the welcome text is the contact ("call / WhatsApp") line and
	// gets the configurable call+chat icon (see config.json `contactIcon`).
	const welcomeLines = (isDoctor
		? "Veterinary clinical decision support\nAsk a cattle or buffalo clinical question."
		: (t("welcome") as string))
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
	const introLines = welcomeLines.slice(0, -1);
	const contactLine = welcomeLines[welcomeLines.length - 1];
	// Anchor the icon to the phone number itself (per design mock), not the
	// start of the sentence. Matches Gujarati and Latin digits, with hyphens.
	const numberMatch = contactLine?.match(/[0-9૦-૯][0-9૦-૯-]{7,}/);
	return (
		<div className="flex w-full flex-col items-center px-2 py-1.5 sm:px-4 sm:py-4">
			{/* Greeting. AMUL-72 moved the animated logo and the "Amul AI" wordmark
			    into the sticky header, and tightened the type scale on phones, so
			    the question list below starts near the top of a mobile screen. */}
			<div className="mb-1.5 text-center sm:mb-4">
				<div className="text-xs leading-snug font-medium text-foreground sm:text-xl sm:leading-normal">
					{introLines.map((line) => (
						<div key={line}>{line}</div>
					))}
					{contactLine && (isDoctor ? (
						<div>{contactLine}</div>
					) : numberMatch?.index !== undefined ? (
						<div>
							{contactLine.slice(0, numberMatch.index)}
							<span className="inline-flex items-center gap-1.5 whitespace-nowrap align-middle">
								<ContactIcon className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
								<span>{numberMatch[0]}</span>
							</span>
							{contactLine.slice(numberMatch.index + numberMatch[0].length)}
						</div>
					) : (
						<div className="flex items-center justify-center gap-2">
							<ContactIcon className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
							<span>{contactLine}</span>
						</div>
					))}
				</div>
			</div>

			{/* Cards List (Full width as per image 1) */}
			{!isDoctor && <div className="flex w-full flex-col gap-1 max-w-2xl sm:gap-2">
				{actions.map((action) => {
					// Map icons from store to emojis for the UI match
					const iconMap: Record<string, string> = {
						cow: "🐮",
						wheat: "💰",
						cloud: "🪴",
						health: "🐄",
						nutrition: "🥛",
						vaccination: "💉",
						schemes: "🏛️"
					};
					const icon = iconMap[action.icon] || "📄";

					return (
						<Button
							key={action.id}
							variant="ghost"
							className="h-auto w-full cursor-pointer justify-start gap-2.5 rounded-xl border border-gray-100 bg-white px-3 py-1 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 whitespace-normal text-left sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-2"
							onClick={() => onAction(action)}
						>
							<div className="text-base leading-none shrink-0 sm:text-xl">
								{icon}
							</div>
							<span className="flex-1 text-sm font-medium text-gray-900 leading-tight sm:text-base sm:leading-snug">
								{action.title}
							</span>
							{/* Only the FAQ-opener card is marked: the other cards send their prompt
							    straight to the agent, this one opens the settings FAQ list. Same
							    icon/size/colour as the FAQ rows in settings-drawer.tsx. */}
							{/* Wrapped in a span on purpose: the Button `size: default` variant
							    carries `has-[>svg]:px-3`, so a bare <svg> child would shrink this
							    card's padding and shift it left of the other cards. */}
							{action.kind === "open_faq_panel" && (
								<span className="shrink-0">
									<Send className="h-4 w-4 text-[#F65151]" />
								</span>
							)}
						</Button>
					);
				})}
			</div>}
		</div>
	);
}
