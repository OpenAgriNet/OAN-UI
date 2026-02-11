import { useState } from "react";
import { ChevronDown, ChevronUp, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";
import { useThemeStore } from "@/hooks/store/theme";
import { THEMES, FAQ_DATA } from "@/components/screens-component/chat-screen/config";
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
	const { t } = useLanguage();
	const { theme, setTheme } = useThemeStore();
	const [faqOpen, setFaqOpen] = useState(true);
	const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({ "1": true });

	const toggleFaq = (id: string) => {
		setExpandedFaqs((prev) => ({
			...prev,
			[id]: !prev[id]
		}));
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right" 
				className="w-full sm:max-w-[50%] p-0 flex flex-col h-full bg-[#f1f3ff] dark:bg-[var(--background-dark)] border-l border-gray-200 dark:border-[var(--border-dark)]"
			>
				{/* Custom Header to match the design */}
				<div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 dark:border-[var(--border-dark)] bg-white dark:bg-[var(--headerBg-dark)]">
					<h2 className="text-xl font-bold text-gray-900 dark:text-[var(--headerText-dark)]">{t("settingsPage.title")}</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onOpenChange(false)}
						className="h-10 w-10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-indigo-50"
					>
						<X className="h-6 w-6" />
					</Button>
				</div>

				<div className="p-6 flex-1 overflow-y-auto space-y-8">
					{/* Theme Toggle */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("settingsPage.appearance")}</h3>
						<div className="flex gap-4">
							<button
								onClick={() => setTheme(THEMES.light)}
								className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-xl border-2 transition-all ${
									theme === THEMES.light
										? "border-[var(--primary)] text-[var(--primary)] bg-indigo-50/50 dark:bg-indigo-900/10"
										: "border-[#4F4F4F] dark:border-[#4F4F4F] text-gray-600 dark:text-gray-400 bg-[#FFFFFF0D] dark:bg-[#FFFFFF0D]"
								}`}
							>
								<Sun className={`h-5 w-5 ${theme === THEMES.light ? "text-[var(--primary)]" : "text-[#B0B0B0]"}`} />
								<span className="font-bold text-sm dark:text-[#B0B0B0]">{t("settingsPage.lightMode")}</span>
							</button>

							<button
								onClick={() => setTheme(THEMES.dark)}
								className={`flex-1 flex items-center justify-center gap-3 h-14 rounded-xl border-2 transition-all ${
									theme === THEMES.dark
										? "border-[var(--primary)] text-[var(--primary)] bg-indigo-50/50 dark:bg-indigo-900/10"
										: "border-gray-100 dark:border-gray-900 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50"
								}`}
							>
								<Moon className={`h-5 w-5 ${theme === THEMES.dark ? "text-[var(--primary)]" : "text-gray-400"}`} />
								<span className="font-bold text-sm">{t("settingsPage.darkMode")}</span>
							</button>
						</div>
					</div>

					{/* FAQ Section */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t("settingsPage.helpAndSupport")}</h3>
						<Collapsible
							open={faqOpen}
							onOpenChange={setFaqOpen}
							className="w-full border border-gray-200 dark:border-[var(--border-dark)] rounded-2xl overflow-hidden bg-white dark:bg-[var(--background-dark)] shadow-sm"
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
							<CollapsibleContent className="px-5 pb-5 space-y-4">
								<div className="border-t border-gray-100 dark:border-[var(--border-dark)] pt-5 space-y-4">
									{FAQ_DATA.map((faq, index) => (
										<div
											key={faq.id}
											className="border border-gray-100 dark:border-[var(--border-dark)] rounded-xl overflow-hidden"
										>
											<button
												onClick={() => toggleFaq(faq.id)}
												className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors"
											>
												<span className="font-bold text-gray-400 dark:text-gray-500 mt-0.5 min-w-[20px]">
													{index + 1}.
												</span>
												<span className="font-bold text-gray-900 dark:text-gray-100 flex-1 leading-snug">
													{faq.question}
												</span>
												{expandedFaqs[faq.id] ? (
													<ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
												) : (
													<ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
												)}
											</button>
											{expandedFaqs[faq.id] && (
												<div className="px-4 pb-4 space-y-4">
													{faq.image && (
														<div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
															<img
																src={faq.image}
																alt={faq.question}
																className="w-full h-full object-cover"
																onError={(e) => {
																	(e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop";
																}}
															/>
														</div>
													)}
													<p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
														{faq.answer}
													</p>
												</div>
											)}
										</div>
									))}
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				</div>
				
				<div className="p-6 border-t border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/30">
					<p className="text-xs text-center text-gray-400 dark:text-gray-500">
						Version 1.0.0 • {t("settingsPage.poweredBy")}
					</p>
				</div>
			</SheetContent>
		</Sheet>
	);
}
