import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CHAT_ASSISTANT } from "../config";
import { QuickAction } from "@/hooks/store/chat";

/* eslint-disable no-unused-vars */
type WelcomePanelProps = {
	onAction: (id: string) => void;
	actions: QuickAction[];
};
/* eslint-enable no-unused-vars */

import { useLanguage } from "@/components/LanguageProvider";

export function WelcomePanel({ onAction, actions }: WelcomePanelProps) {
	const { t } = useLanguage();
	return (
		<div className="flex w-full flex-col items-center px-4 py-8">
			{/* Logo & Greeting */}
			<div className="mb-8 flex flex-col items-center gap-4 text-center">
				<Avatar className="h-30 w-30">
					<AvatarImage src={CHAT_ASSISTANT.avatar} alt={CHAT_ASSISTANT.name} className="object-contain" />
					<AvatarFallback className="bg-transparent text-2xl font-bold text-[var(--primary)]">
						{CHAT_ASSISTANT.name.slice(0, 1)}
					</AvatarFallback>
				</Avatar>
				
				<div className="space-y-1">
					<div className="text-2xl font-semibold text-[var(--primary)]">
						{t("appTitle")}
					</div>
					<div className="text-xl font-medium text-black dark:text-[#F6F6F6]">
						{t("welcome")}
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
						cloud: "🪴"
					};
					const icon = iconMap[action.icon] || "📄";

					return (
						<Button
							key={action.id}
							variant="ghost"
							className="h-auto w-full cursor-pointer justify-start gap-4 rounded-2xl border border-gray-100 dark:border-transparent bg-white dark:bg-[#FFFFFF0D] px-4 py-4 sm:px-6 sm:py-6 shadow-sm hover:bg-gray-50 dark:hover:bg-[#FFFFFF1A] hover:shadow-md transition-all duration-200 whitespace-normal text-left"
							onClick={() => onAction(action.id)}
						>
							<div className="text-2xl sm:text-3xl shrink-0">
								{icon}
							</div>
							<span className="text-base font-medium text-gray-900 dark:text-white leading-snug">
								{action.title}
							</span>
						</Button>
					);
				})}
			</div>
		</div>
	);
}
