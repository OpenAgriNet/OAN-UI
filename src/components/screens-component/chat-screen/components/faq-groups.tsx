import { useState } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { getFAQGroups } from "@/components/screens-component/chat-screen/config";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible";

interface FAQGroupsProps {
	// Called with the tapped question; the caller sends it to the chat agent and
	// closes/navigates away from whichever surface is hosting the list.
	onAsk: (question: string) => void;
	// The drawer and the standalone settings page carry slightly different type
	// weights and border shades; keep both rather than restyle either surface.
	variant?: "drawer" | "page";
}

// The 48 FAQ prompts split into six themed boxes, each collapsed by default so
// the list is scannable. Only one category is open at a time.
export function FAQGroups({ onAsk, variant = "page" }: FAQGroupsProps) {
	const { language } = useLanguage();
	const groups = getFAQGroups(language);
	const [openId, setOpenId] = useState<string | null>(null);

	const isDrawer = variant === "drawer";

	return (
		<div className="space-y-3">
			{groups.map((group) => {
				const open = openId === group.id;
				return (
					<Collapsible
						key={group.id}
						open={open}
						onOpenChange={(next) => setOpenId(next ? group.id : null)}
						className={`w-full border rounded-xl overflow-hidden bg-white dark:bg-gray-950 ${
							isDrawer
								? "border-gray-100 dark:border-gray-900"
								: "border-gray-200 dark:border-gray-800"
						}`}
					>
						<CollapsibleTrigger asChild>
							<button className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
								<span className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex-1">
									{group.label}
								</span>
								<span className="text-xs font-medium text-gray-400 dark:text-gray-500">
									{group.items.length}
								</span>
								{open ? (
									<ChevronUp className="h-4 w-4 text-gray-500 flex-shrink-0" />
								) : (
									<ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
								)}
							</button>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<div className="px-4 pb-4 pt-1 space-y-2 border-t border-gray-100 dark:border-gray-900">
								{group.items.map((faq) => (
									<button
										key={faq.id}
										onClick={() => onAsk(faq.question)}
										className={`w-full flex items-start gap-3 px-3 py-3 text-left border rounded-xl transition-colors ${
											isDrawer
												? "border-gray-100 dark:border-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-900/30"
												: "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
										}`}
									>
										<span className={`flex-1 leading-snug text-gray-900 dark:text-gray-100 ${
											isDrawer ? "font-bold" : "font-medium"
										}`}>
											{faq.question}
										</span>
										<Send className="h-4 w-4 text-[#F65151] flex-shrink-0 mt-0.5" />
									</button>
								))}
							</div>
						</CollapsibleContent>
					</Collapsible>
				);
			})}
		</div>
	);
}
