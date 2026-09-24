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
	/** AgriStack farmer ID once logged in. */
	farmerId?: string | null;
};

import { useLanguage } from "@/components/LanguageProvider";

/** Emoji for each quick-action icon name set by the chat store. */
const QUICK_ACTION_ICONS: Record<string, string> = {
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

export function WelcomePanel({
	onAction,
	actions,
	isAgriStackConnected = false,
	onConnectAgriStack,
	agriStackProfile,
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
			</div>

			{/* Ticker banners 2-4 live inside the welcome panel; variants 1 and 5 live in the layout. */}
			{env.uiTicker >= 2 && env.uiTicker <= 4 && <TickerBanner />}

			{showAgriStack ? (
				/* Not linked yet: invite the farmer to connect. */
				<div className="w-full max-w-2xl">
					<AgriStackCard onConnect={() => onConnectAgriStack?.()} />
				</div>
			) : agriStackProfile ? (
				/* Linked: confirm the link and show what we hold. */
				<AgriStackProfileCard
					farmerId={farmerId}
					farmerName={agriStackProfile.farmerName}
					village={agriStackProfile.village}
				/>
			) : null}

			{/* Randomly picked quick questions (generateQuickActions), in the AgriStack prompt box style. */}
			<div className="mt-3 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
				{actions.map((action) => (
					<Button
						key={action.id}
						variant="ghost"
						className="h-auto w-full cursor-pointer items-start justify-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 text-left whitespace-normal shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-transparent dark:bg-[#FFFFFF0D] dark:hover:bg-[#FFFFFF1A]"
						onClick={() => onAction(action.id)}
					>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-xl dark:bg-[#FFFFFF14]">
							{QUICK_ACTION_ICONS[action.icon] || "📄"}
						</span>
						<span className="text-base leading-snug font-semibold text-gray-900 dark:text-white">
							{action.title}
						</span>
					</Button>
				))}
			</div>
		</div>
	);
}
