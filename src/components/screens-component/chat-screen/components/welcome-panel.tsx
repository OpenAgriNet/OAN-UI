import { Sprout } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CHAT_ASSISTANT } from "../config";
import { QuickAction } from "@/hooks/store/chat";
import { TickerBanner } from "./ticker-designs";
import { env } from "@/config/env";
import { AgriStackCard } from "./agristack-card";
import { AgriStackProfileCard } from "./agristack-profile-card";

type WelcomePanelProps = {
	onAction: (id: string) => void;
	actions: QuickAction[];
	/** Whether the farmer has linked their AgriStack profile. */
	isAgriStackConnected?: boolean;
	onConnectAgriStack?: () => void;
	/** Farmer details fetched from AgriStack, shown once linked. */
	agriStackProfile?: { farmerName?: string; village?: string };
	/** Sends an arbitrary prompt to the assistant (used by the AgriStack cards). */
	onAsk?: (prompt: string) => void;
	/** AgriStack farmer ID once logged in. */
	farmerId?: string | null;
};

import { useLanguage } from "@/components/LanguageProvider";

/** The two fixed prompts offered alongside the AgriStack card. */
const AGRISTACK_PROMPTS = ["schemes", "crops"] as const;

export function WelcomePanel({
	onAction,
	actions,
	isAgriStackConnected = false,
	onConnectAgriStack,
	agriStackProfile,
	onAsk,
	farmerId
}: WelcomePanelProps) {
	const { t } = useLanguage();
	const showAgriStack = !isAgriStackConnected;

	return (
		<div className="flex w-full flex-col items-center px-4 py-8">
			{/* Logo & Greeting */}
			<div className="mb-8 flex flex-col items-center gap-4 text-center">
				<Avatar className="h-30 w-30">
					<AvatarImage
						src={CHAT_ASSISTANT.avatar}
						alt={CHAT_ASSISTANT.name}
						className="object-contain"
					/>
					<AvatarFallback className="bg-transparent text-2xl font-bold text-[var(--primary)]">
						{CHAT_ASSISTANT.name.slice(0, 1)}
					</AvatarFallback>
				</Avatar>

				<div className="space-y-1">
					<div className="text-2xl font-semibold text-[var(--primary)]">{t("appTitle")}</div>
					<div className="text-xl font-medium text-black dark:text-[#F6F6F6]">{t("welcome")}</div>
				</div>

				{farmerId ? (
					<p className="text-xs text-muted-foreground">Farmer ID: {farmerId}</p>
				) : null}
			</div>

			{/* Ticker banners 2-4 live inside the welcome panel; variants 1 and 5 live in the layout. */}
			{env.uiTicker >= 2 && env.uiTicker <= 4 && <TickerBanner />}

			{showAgriStack ? (
				/* Not linked yet: invite the farmer to connect, and offer the two
				   prompts that only pay off once their profile is linked. */
				<div className="flex w-full max-w-2xl flex-col gap-3">
					<AgriStackCard onConnect={() => onConnectAgriStack?.()} />

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{AGRISTACK_PROMPTS.map((key) => (
							<Button
								key={key}
								variant="ghost"
								className="h-auto w-full cursor-pointer items-start justify-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 text-left whitespace-normal shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-transparent dark:bg-[#FFFFFF0D] dark:hover:bg-[#FFFFFF1A]"
								onClick={() => onAsk?.(String(t(`agristack.questions.${key}.prompt`)))}
							>
								<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] dark:bg-[#FFFFFF14]">
									<Sprout className="size-5 text-[var(--primary)] dark:text-white" />
								</span>
								<span className="flex flex-col gap-1">
									<span className="text-base leading-snug font-semibold text-gray-900 dark:text-white">
										{t(`agristack.questions.${key}.title`)}
									</span>
									<span className="text-sm leading-snug font-normal text-gray-500 dark:text-gray-400">
										{t(`agristack.questions.${key}.description`)}
									</span>
								</span>
							</Button>
						))}
					</div>
				</div>
			) : agriStackProfile ? (
				/* Linked: confirm the link and show what we hold. */
				<AgriStackProfileCard
					farmerName={agriStackProfile.farmerName}
					village={agriStackProfile.village}
				/>
			) : (
				/* Cards List (Full width as per image 1) */
				<div className="flex w-full max-w-2xl flex-col gap-3">
					{actions.map((action) => {
						// Map icons from store to emojis for the UI match
						const iconMap: Record<string, string> = {
							tractor: "🚜",
							cow: "🐮",
							wheat: "🌾",
							cloud: "☁️",
							money: "💰",
							document: "📄",
							insurance: "📝",
							alert: "💬",
							bank: "🏦",
							search: "🔍",
							soil: "🪴",
							card: "💳"
						};
						const icon = iconMap[action.icon] || "📄";

						return (
							<Button
								key={action.id}
								variant="ghost"
								className="h-auto w-full cursor-pointer justify-start gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 text-left whitespace-normal shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md sm:px-6 sm:py-6 dark:border-transparent dark:bg-[#FFFFFF0D] dark:hover:bg-[#FFFFFF1A]"
								onClick={() => onAction(action.id)}
							>
								<div className="shrink-0 text-2xl sm:text-3xl">{icon}</div>
								<span className="text-base leading-snug font-medium text-gray-900 dark:text-white">
									{action.title}
								</span>
							</Button>
						);
					})}
				</div>
			)}
		</div>
	);
}
