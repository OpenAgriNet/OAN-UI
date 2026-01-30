import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, ThumbsDown, ThumbsUp, Volume2 } from "lucide-react";
import { CardMessage } from "./chat-types";
import { FeedbackModal } from "../feedback-modal";
import { useChatStore } from "@/hooks/store/chat";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function CardBubble({ message }: { readonly message: CardMessage }) {
	const { language } = useLanguage();
	const playTTS = useChatStore((s) => s.playTTS);
	const submitFeedback = useChatStore((s) => s.submitMessageFeedback);
	const setToast = useChatStore((s) => s.setToast);

	const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleListen = async () => {
		try {
			await playTTS(message.body, language);
		} catch (error) {
			console.error("TTS play failed:", error);
		}
	};

	const handleThumbsUp = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			await submitFeedback(message.id, true);
		} catch (error) {
			console.error("Thumbs up failed:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleThumbsDown = () => {
		setFeedbackModalOpen(true);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(message.body);
			setToast({ message: "The message has been copied to your clipboard", type: "success" });
		} catch (error) {
			console.error(error);
			setToast({ message: "Failed to copy to clipboard. Please try again", type: "error" });
		}
	};

	const handleFeedbackSubmit = async (
		reason: string,
		feedbackMessage: string
	) => {
		setIsSubmitting(true);
		setFeedbackModalOpen(false);

		try {
			await submitFeedback(message.id, false, reason, feedbackMessage);
		} catch (error) {
			console.error("Feedback submission failed:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// AI Messages are always cards in this design
	return (
		<>
			<div className="w-full max-w-[95%] sm:max-w-[90%] mb-8">
				<Card className="relative rounded-2xl border-none bg-white p-4 shadow-sm overflow-hidden">
					{/* Content */}
					<div>
						{message.title ? (
							<div className="mb-2 text-base font-bold">{message.title}</div>
						) : null}

						<div className={cn("text-base leading-relaxed text-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 whitespace-pre-wrap break-words", message.isError && "text-red-500")}>
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								components={{
									strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
									a: ({ node, ...props }) => (
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 underline hover:text-blue-800"
											{...props}
										/>
									),
								}}
							>
								{message.body}
							</ReactMarkdown>
						</div>

						{/* Action Chips */}
						{message.actions?.length ? (
							<div className="mt-3 flex flex-wrap gap-2 pt-1">
								{message.actions.map((a) => (
									<Button
										key={a.id}
										variant="outline"
										className="h-8 rounded-full border-green-200 bg-white px-4 text-xs font-medium text-green-700 hover:bg-green-50"
									>
										{a.label}
									</Button>
								))}
							</div>
						) : null}
					</div>

					{/* Footer Row */}
					{message.showListenRow && (
						<div className="flex flex-col gap-3">
							<div className="mx-[-1rem] h-px bg-gray-200 dark:bg-green-800/20" />
							<div className="flex items-center justify-start -ml-3">
							<div className="flex items-center gap-0">
								<Button
									variant="ghost"
									className="group h-10 gap-2 rounded-none pl-6 pr-4 text-sm font-bold text-[#019444] transition-all hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 cursor-pointer"
									onClick={handleListen}
								>
									<Volume2 className="h-4 w-4 text-[#F65151] group-hover:scale-110 transition-transform" />
									<span className="text-[#F65151]">Listen</span>
								</Button>

								<div className="h-5 w-px self-center bg-gray-200 dark:bg-green-800/30" />

								<Button
									variant="ghost"
									size="icon"
									className="flex-1 h-10 w-12 rounded-none text-foreground/60 transition-all hover:bg-green-50 hover:text-[#F65151] dark:text-gray-400 dark:hover:bg-green-900/30 dark:hover:text-green-300 cursor-pointer"
									title="Copy"
									onClick={handleCopy}
								>
									<Copy className="h-4 w-4 text-[#F65151]" />
								</Button>

								<div className="h-5 w-px self-center bg-gray-200 dark:bg-green-800/30" />

								<Button
									variant="ghost"
									size="icon"
									className="flex-1 h-10 w-12 rounded-none text-foreground/60 transition-all hover:bg-green-50 hover:text-[#F65151] dark:text-gray-400 dark:hover:bg-green-900/30 dark:hover:text-green-300 cursor-pointer"
									title="Helpful"
									onClick={handleThumbsUp}
									disabled={isSubmitting}
								>
									<ThumbsUp className="h-4 w-4 text-[#F65151]" />
								</Button>

								<div className="h-5 w-px self-center bg-gray-200 dark:bg-green-800/30" />

								<Button
									variant="ghost"
									size="icon"
									className="flex-1 h-10 w-12 rounded-none text-foreground/60 transition-all hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 cursor-pointer"
									title="Not Helpful"
									onClick={handleThumbsDown}
									disabled={isSubmitting}
								>
									<ThumbsDown className="h-4 w-4 text-[#F65151]" />
								</Button>
							</div>
							</div>
						</div>
					)}
				</Card>
			</div>

			{/* Feedback Modal */}
			<FeedbackModal
				open={feedbackModalOpen}
				onClose={() => setFeedbackModalOpen(false)}
				onSubmit={handleFeedbackSubmit}
			/>
		</>
	);
}
