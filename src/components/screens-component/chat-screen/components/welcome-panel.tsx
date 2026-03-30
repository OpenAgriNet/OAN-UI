import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CHAT_ASSISTANT } from "../config";
import { QuickAction, useChatStore } from "@/hooks/store/chat";
import amulText from "@/assets/amulText.svg";

/* eslint-disable no-unused-vars */
type WelcomePanelProps = {
	onAction: (id: string) => void;
	actions: QuickAction[];
};
/* eslint-enable no-unused-vars */

import { useLanguage } from "@/components/LanguageProvider";

export function WelcomePanel({ onAction, actions }: WelcomePanelProps) {
	const { t } = useLanguage();
	const translationPipeline = useChatStore((s) => s.translationPipeline);

	const baseWelcome = t("welcome") as string;
	const welcomeText =
		translationPipeline === "oss_translate"
			? baseWelcome.replace("AI Agent Sarlaben", "AI Agent Sarlaben (OSS)")
			: baseWelcome;
	return (
		<div className="flex w-full flex-col items-center px-4 py-8">
			{/* Logo & Greeting */}
			<div className="mb-8 flex flex-col items-center gap-4 text-center">
				<div className="relative animate-smart-pulsate">
					<Avatar className="h-24 w-24">
						<AvatarImage src={CHAT_ASSISTANT.avatar} alt={CHAT_ASSISTANT.name} className="object-contain" />
						<AvatarFallback className="bg-transparent text-2xl font-bold text-[#F65151]">
							{CHAT_ASSISTANT.name.slice(0, 1)}
						</AvatarFallback>
					</Avatar>
				</div>
				
				<div className="space-y-4">
					<img src={amulText} alt="Amul AI" className="h-10 mx-auto object-contain" />
					<div className="text-xl font-medium text-foreground whitespace-pre-line">
						{welcomeText}
					</div>
				</div>
			</div>

			{/* Cards List (Full width as per image 1) */}
			<div className="flex w-full flex-col gap-3 max-w-2xl">
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
							className="h-auto w-full cursor-pointer justify-start gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 sm:px-6 sm:py-6 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 whitespace-normal text-left"
							onClick={() => onAction(action.id)}
						>
							<div className="text-2xl sm:text-3xl shrink-0">
								{icon}
							</div>
							<span className="text-base font-medium text-gray-900 leading-snug">
								{action.title}
							</span>
						</Button>
					);
				})}
			</div>
		</div>
	);
}
