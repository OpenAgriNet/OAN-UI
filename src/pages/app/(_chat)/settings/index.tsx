import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/hooks/store/chat";
import { FAQGroups } from "@/components/screens-component/chat-screen/components/faq-groups";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible";

export default function SettingsPage() {
	const navigate = useNavigate();
	const { t, language } = useLanguage();
	const sendText = useChatStore((s) => s.sendText);
	const [faqOpen, setFaqOpen] = useState(true);

	// FAQ items are quick prompts: tapping sends the question to the chat agent
	// (answered live with the farmer's own data) and returns to the chat screen.
	const askQuestion = (question: string) => {
		sendText(question, language);
		navigate({ to: "/chat", search: (old) => old });
	};

	return (
		<div className="flex flex-col h-full bg-background transition-colors duration-300" style={{ background: "linear-gradient(180deg, #FFF2F2 0%, #FFFFFF 100%)" }}>
			{/* Settings Header */}
			<div className="flex items-center gap-4 px-4 h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate({ to: "/chat", search: (old) => old })}
					className="h-10 w-10 text-gray-900 dark:text-gray-100 hover:text-[#F65151] hover:bg-[#FFE2E2]"
				>
					<ArrowLeft className="h-6 w-6" />
				</Button>
				<h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t("settingsPage.title")}</h1>
			</div>

			<div className="p-5 flex-1 overflow-y-auto space-y-6">
				{/* Help & Support Section */}
				<div>
					<h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
						{t("settingsPage.helpAndSupport")}
					</h2>
				<Collapsible
					open={faqOpen}
					onOpenChange={setFaqOpen}
					className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950"
				>
					<CollapsibleTrigger asChild>
						<button className="w-full flex items-center justify-between px-5 py-4 text-left">
							<span className="font-medium text-base text-gray-900 dark:text-gray-100">
								{t("settingsPage.faq")}
							</span>
							{faqOpen ? (
								<ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
							) : (
								<ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
							)}
						</button>
					</CollapsibleTrigger>
					<CollapsibleContent className="px-5 pb-5">
						<div className="border-t border-gray-100 dark:border-gray-900 pt-5">
							<FAQGroups variant="page" onAsk={askQuestion} />
						</div>
					</CollapsibleContent>
				</Collapsible>
				</div>
			</div>
		</div>
	);
}
