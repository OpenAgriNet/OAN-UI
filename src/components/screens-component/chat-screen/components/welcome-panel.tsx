import { ChevronRight, Mic, Square } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CHAT_ASSISTANT } from "../config";
import type { QuickAction } from "@/hooks/store/chat";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";

type WelcomePanelProps = {
	onAction: (id: string) => void;
	actions: QuickAction[];
	onMicClick?: () => void;
	micDisabled?: boolean;
	isListening?: boolean;
};

const iconMap: Record<string, { emoji: string; bg: string; text: string }> = {
	tractor: { emoji: "🚜", bg: "bg-emerald-50", text: "text-emerald-600" },
	cow: { emoji: "🐮", bg: "bg-amber-50", text: "text-amber-600" },
	wheat: { emoji: "🌾", bg: "bg-yellow-50", text: "text-yellow-700" },
	cloud: { emoji: "☁️", bg: "bg-sky-50", text: "text-sky-600" },
	money: { emoji: "💰", bg: "bg-green-50", text: "text-green-600" },
	document: { emoji: "📄", bg: "bg-blue-50", text: "text-blue-600" },
	insurance: { emoji: "📝", bg: "bg-violet-50", text: "text-violet-600" },
	alert: { emoji: "💬", bg: "bg-orange-50", text: "text-orange-600" },
	bank: { emoji: "🏦", bg: "bg-indigo-50", text: "text-indigo-600" },
	search: { emoji: "🔍", bg: "bg-slate-50", text: "text-slate-600" },
	soil: { emoji: "🪴", bg: "bg-lime-50", text: "text-lime-700" },
	card: { emoji: "💳", bg: "bg-cyan-50", text: "text-cyan-600" }
};

export function WelcomePanel({
	onAction,
	actions,
	onMicClick,
	micDisabled,
	isListening
}: WelcomePanelProps) {
	const { t } = useLanguage();

	return (
		/* Background is painted on ChatLayout so it continues under the input bar */
		<div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
			<div className="relative z-10 flex h-full min-h-0 flex-col items-center justify-between px-4 py-6 sm:px-6 sm:py-8">
				{/* Top spacer keeps vertical balance on tall screens */}
				<div className="hidden shrink-0 sm:block sm:h-2" />

				{/* Avatar + greeting + large mic */}
				<div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 text-center sm:gap-5">
					<div className="flex flex-col items-center gap-2 sm:gap-3">
						<div className="rounded-full bg-white/90 p-1 shadow-md ring-2 ring-white/80 dark:bg-slate-900/80 dark:ring-slate-700">
							<Avatar className="h-20 w-20 sm:h-24 sm:w-24">
								<AvatarImage
									src={CHAT_ASSISTANT.avatar}
									alt={CHAT_ASSISTANT.name}
									className="object-cover"
								/>
								<AvatarFallback className="bg-transparent text-2xl font-bold text-[var(--primary)]">
									{CHAT_ASSISTANT.name.slice(0, 1)}
								</AvatarFallback>
							</Avatar>
						</div>

						<div className="space-y-0.5">
							<h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] sm:text-4xl">
								{t("appTitle") as string}
							</h1>
							<p className="text-sm font-medium text-slate-600 dark:text-slate-300 sm:text-base">
								{t("assistantRole") as string}
							</p>
						</div>

						<p className="max-w-md px-2 text-base font-semibold leading-snug text-slate-800 dark:text-slate-100 sm:text-lg sm:leading-relaxed">
							{t("welcome") as string}
						</p>
					</div>

					{/* Large voice-first mic */}
					<div className="flex flex-col items-center gap-3 pt-1 sm:pt-2">
						<button
							type="button"
							onClick={onMicClick}
							disabled={micDisabled}
							aria-label={
								isListening
									? String(t("tapToStop"))
									: String(t("tapToSpeak"))
							}
							aria-pressed={isListening}
							className={cn(
								"group relative flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full sm:h-28 sm:w-28",
								"text-white shadow-[0_8px_32px_rgba(6,3,141,0.35)]",
								"transition-transform duration-200 hover:scale-105 active:scale-95",
								"focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/30",
								"disabled:cursor-not-allowed disabled:hover:scale-100",
								micDisabled && "opacity-50",
								isListening
									? "scale-105 bg-red-500 shadow-[0_8px_40px_rgba(239,68,68,0.45)]"
									: "bg-[var(--primary)]",
								!micDisabled && "cursor-pointer"
							)}
						>
							{/* Soft pulse rings */}
							<span
								className={cn(
									"pointer-events-none absolute inset-0 rounded-full opacity-50",
									isListening
										? "animate-ping bg-red-400/40 [animation-duration:1.1s]"
										: "animate-ping bg-[var(--primary)]/25 [animation-duration:2.4s] opacity-40"
								)}
								aria-hidden
							/>
							<span
								className={cn(
									"pointer-events-none absolute -inset-2 rounded-full border-2 sm:-inset-3",
									isListening ? "border-red-300/50" : "border-[var(--primary)]/20"
								)}
								aria-hidden
							/>
							<span
								className={cn(
									"pointer-events-none absolute -inset-4 rounded-full border sm:-inset-5",
									isListening ? "border-red-200/40" : "border-[var(--primary)]/10"
								)}
								aria-hidden
							/>

							<div className="relative z-10 flex flex-col items-center gap-0.5">
								{isListening ? (
									<Square className="h-7 w-7 fill-white text-white sm:h-9 sm:w-9" strokeWidth={2.25} />
								) : (
									<>
										<Mic className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2.25} />
										{/* Mini waveform hint */}
										<div className="mt-0.5 flex h-3 items-end justify-center gap-[3px]" aria-hidden>
											{[4, 8, 12, 7, 5].map((h, i) => (
												<span
													key={i}
													className="w-[3px] rounded-full bg-white/90"
													style={{ height: `${h}px` }}
												/>
											))}
										</div>
									</>
								)}
							</div>
						</button>

						<div className="flex flex-col items-center gap-0.5 px-3 text-center">
							{isListening ? (
								<>
									<p className="text-sm font-semibold text-[var(--primary)] sm:text-base">
										{String(t("recordingListening"))}
									</p>
									<p className="text-sm font-bold text-red-600 sm:text-base dark:text-red-400">
										{String(t("tapToStop"))}
									</p>
								</>
							) : (
								<p className="text-sm font-semibold text-[var(--primary)] sm:text-base">
									{String(t("tapToSpeak"))}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Horizontal suggestion chips (3) */}
				<div className="w-full max-w-4xl shrink-0 pt-4 sm:pt-6">
					<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
						{actions.slice(0, 3).map((action) => {
							const style = iconMap[action.icon] || iconMap.document;
							return (
								<Button
									key={action.id}
									variant="ghost"
									className={cn(
										"h-auto w-full cursor-pointer justify-start gap-3 rounded-2xl border border-white/80",
										"bg-white/95 px-3.5 py-3 text-left whitespace-normal shadow-md backdrop-blur-sm",
										"transition-all duration-200 hover:bg-white hover:shadow-lg",
										"dark:border-slate-700/80 dark:bg-slate-900/90 dark:hover:bg-slate-900"
									)}
									onClick={() => onAction(action.id)}
								>
									<div
										className={cn(
											"flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg",
											style?.bg,
											style?.text
										)}
									>
										{style?.emoji || "📄"}
									</div>
									<span className="min-w-0 flex-1 text-sm leading-snug font-medium text-slate-800 dark:text-slate-100">
										{action.title}
									</span>
									<ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
								</Button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
