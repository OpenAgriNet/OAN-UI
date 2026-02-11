import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, ChevronUp, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/hooks/store/theme";
import { THEMES, FAQ_DATA } from "@/components/screens-component/chat-screen/config";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import { useChatStore } from "@/hooks/store/chat";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible";

export default function SettingsPage() {
	const navigate = useNavigate();
	const { theme, setTheme } = useThemeStore();
	const { t, language } = useLanguage();
	const faqItems = FAQ_DATA[language] || FAQ_DATA["en"];
	const [faqOpen, setFaqOpen] = useState(true);
	const setDraft = useChatStore((s) => s.setDraft);

	const handleFaqClick = (question: string) => {
		setDraft(question);
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
				{/* Appearance Section */}
				<div>
					<h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
						{t("settingsPage.appearance")}
					</h2>
					<div className="flex gap-4">
					<button
						onClick={() => setTheme(THEMES.light)}
						className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl border-2 transition-all ${
							theme === THEMES.light
								? "border-[#00a651] text-[#00a651] bg-white dark:bg-gray-900"
								: "border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950"
						}`}
					>
						<Sun className={`h-5 w-5 ${theme === THEMES.light ? "text-[#00a651]" : "text-gray-400 dark:text-gray-500"}`} />
						<span className="font-semibold text-sm">{t("settingsPage.lightMode")}</span>
					</button>

					<button
						onClick={() => setTheme(THEMES.dark)}
						className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl border-2 transition-all ${
							theme === THEMES.dark
								? "border-[#00a651] text-[#00a651] bg-white dark:bg-gray-900"
								: "border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950"
						}`}
					>
						<Moon className={`h-5 w-5 ${theme === THEMES.dark ? "text-[#00a651]" : "text-gray-400 dark:text-gray-500"}`} />
						<span className="font-semibold text-sm">{t("settingsPage.darkMode")}</span>
					</button>
					</div>
				</div>

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
					<CollapsibleContent className="px-5 pb-5 space-y-3">
						<div className="border-t border-gray-100 dark:border-gray-900 pt-5 space-y-3">
							{faqItems.map((faq, index) => (
								<button
									key={faq.id}
									onClick={() => handleFaqClick(faq.question)}
									className="w-full flex items-start gap-3 px-4 py-4 text-left border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
								>
									<span className="font-bold text-gray-900 dark:text-gray-100 mt-0.5 min-w-[20px]">
										{index + 1}.
									</span>
									<span className="font-medium text-gray-900 dark:text-gray-100 flex-1 leading-snug">
										{faq.question}
									</span>
								</button>
							))}
						</div>
					</CollapsibleContent>
				</Collapsible>
				</div>
			</div>
		</div>
	);
}
