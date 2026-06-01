import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";
import type { FeedbackReason } from "./feedback-modal";

type NotificationFeedbackModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (reason: FeedbackReason, message: string) => void;
};

export function NotificationFeedbackModal({ open, onClose, onSubmit }: NotificationFeedbackModalProps) {
	const { t } = useLanguage();
	const feedbackOptions: { id: FeedbackReason; label: string | string[] }[] = [
		{ id: "incorrect", label: t("feedback.reasons.incorrect") },
		{ id: "not_helpful", label: t("feedback.reasons.not_helpful") },
		{ id: "irrelevant", label: t("feedback.reasons.irrelevant") },
		{ id: "inappropriate", label: t("feedback.reasons.inappropriate") },
		{ id: "other", label: t("feedback.reasons.other") }
	];

	const [selectedReason, setSelectedReason] = useState<FeedbackReason>("incorrect");
	const [message, setMessage] = useState("");

	if (!open) return null;

	const resetAndClose = () => {
		setSelectedReason("incorrect");
		setMessage("");
		onClose();
	};

	const handleSubmit = () => {
		const selectedLabel = feedbackOptions.find((option) => option.id === selectedReason)?.label;
		const fallbackMessage = typeof selectedLabel === "string" ? selectedLabel : selectedReason;
		onSubmit(selectedReason, message.trim() || fallbackMessage);
		setSelectedReason("incorrect");
		setMessage("");
	};

	return (
		<div className="fixed inset-0 z-[130] flex items-end justify-center sm:items-center">
			<div className="absolute inset-0 bg-black/50" onClick={resetAndClose} />

			<div className="relative flex w-full max-w-md flex-col rounded-t-3xl bg-white shadow-xl duration-300 animate-in slide-in-from-bottom-4 dark:bg-[#1F1F1F] sm:max-h-[90vh] sm:rounded-3xl sm:slide-in-from-bottom-0">
				<div className="flex shrink-0 items-center justify-between px-6 pb-4 pt-6">
					<h2 className="text-lg font-bold text-gray-900 dark:text-white">{t("feedback.title")}</h2>
					<button
						type="button"
						onClick={resetAndClose}
						className="cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
						aria-label="Close"
					>
						<X className="h-6 w-6 text-gray-500" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto">
					<div className="px-6 pb-4">
						<p className="text-xs text-gray-600 dark:text-gray-300">{t("feedback.description")}</p>
					</div>

					<div className="space-y-2 px-6 pb-4">
						{feedbackOptions.map((option) => (
							<button
								key={option.id}
								type="button"
								onClick={() => setSelectedReason(option.id)}
								className={`w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
									selectedReason === option.id
										? "bg-yellow-400 text-gray-900"
										: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-[#3D3D3D] dark:bg-[#FFFFFF0D] dark:text-gray-200 dark:hover:bg-gray-800"
								}`}
							>
								{option.label}
							</button>
						))}
					</div>

					<div className="px-6 pb-6">
						<label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-200">
							{t("feedback.messageLabel")}
						</label>
						<textarea
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							placeholder={typeof t("feedback.placeholder") === "string" ? t("feedback.placeholder") as string : "Or tell us more about the issue..."}
							className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:border-[var(--border-dark)] dark:bg-[var(--inputBg-dark)] dark:text-white dark:placeholder:text-gray-400"
							rows={4}
							style={{ fontStyle: message ? "normal" : "italic" }}
						/>
					</div>
				</div>

				<div className="flex shrink-0 gap-3 px-6 pb-6">
					<Button
						type="button"
						onClick={resetAndClose}
						variant="outline"
						className="h-11 flex-1 cursor-pointer rounded-xl border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
					>
						{t("feedback.cancel")}
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						className="h-11 flex-1 cursor-pointer rounded-xl bg-[var(--primary)] text-sm font-semibold text-white shadow-none hover:bg-[var(--primary)]/90"
					>
						{t("feedback.submit")}
					</Button>
				</div>
			</div>
		</div>
	);
}
