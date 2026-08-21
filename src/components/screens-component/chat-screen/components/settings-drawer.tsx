import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/hooks/store/chat";
import { FAQGroups } from "@/components/screens-component/chat-screen/components/faq-groups";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
	Sheet,
	SheetContent,
} from "@/components/ui/sheet";

interface SettingsDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
	const { t, language } = useLanguage();
	const sendText = useChatStore((s) => s.sendText);
	const [faqOpen, setFaqOpen] = useState(true);

useEffect(() => {
		if (open) setFaqOpen(true);
	}, [open]);

	// FAQ items are quick prompts: tapping sends the question to the chat agent
	// (answered live with the farmer's own data) and closes the drawer.
	const askQuestion = (question: string) => {
		sendText(question, language);
		onOpenChange(false);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right" 
				className="w-full sm:max-w-[50%] p-0 flex flex-col h-full bg-background border-l border-gray-200 dark:border-gray-800"
				style={{ background: "linear-gradient(180deg, #FFF2F2 0%, #FFFFFF 100%)" }}
			>
				{/* Custom Header to match the design */}
				<div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
					<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("settingsPage.title")}</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onOpenChange(false)}
						className="h-10 w-10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-[#FFE2E2]"
					>
						<X className="h-6 w-6" />
					</Button>
				</div>

				<div className="p-6 flex-1 overflow-y-auto space-y-8">
					{/* FAQ Section */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("settingsPage.helpAndSupport")}</h3>
						<Collapsible
							open={faqOpen}
							onOpenChange={setFaqOpen}
							className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 shadow-sm"
						>
							<CollapsibleTrigger asChild>
								<button className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
									<span className="font-bold text-base text-gray-900 dark:text-gray-100">
										{t("settingsPage.faq")}
									</span>
									{faqOpen ? (
										<ChevronUp className="h-5 w-5 text-gray-500" />
									) : (
										<ChevronDown className="h-5 w-5 text-gray-500" />
									)}
								</button>
							</CollapsibleTrigger>
							<CollapsibleContent className="px-5 pb-5">
								<div className="border-t border-gray-100 dark:border-gray-900 pt-5">
									<FAQGroups variant="drawer" onAsk={askQuestion} />
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				</div>
				
				<div className="p-6 border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/30">
					<p className="text-xs text-center text-gray-400 dark:text-gray-500">
						Version 1.0.0 • Powered by Amul AI
					</p>
				</div>
			</SheetContent>
		</Sheet>
	);
}
