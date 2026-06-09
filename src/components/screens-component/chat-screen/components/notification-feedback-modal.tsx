import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquareWarning, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_FEEDBACK_LENGTH = 200;

export type NotificationFeedbackReason =
	| "not_relevant"
	| "incorrect"
	| "hard_to_understand"
	| "too_late"
	| "other";

type NotificationFeedbackModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (reason: NotificationFeedbackReason, message: string) => void;
};

export function NotificationFeedbackModal({ open, onClose, onSubmit }: NotificationFeedbackModalProps) {
	const feedbackOptions: { id: NotificationFeedbackReason; label: string }[] = [
		{ id: "not_relevant", label: "Not relevant to me" },
		{ id: "incorrect", label: "Information looks incorrect" },
		{ id: "hard_to_understand", label: "Hard to understand" },
		{ id: "too_late", label: "Notification came too late" },
		{ id: "other", label: "Other" }
	];

	const [selectedReason, setSelectedReason] = useState<NotificationFeedbackReason>("not_relevant");
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!open) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [open]);

	if (!open) return null;

	const resetAndClose = () => {
		setSelectedReason("not_relevant");
		setMessage("");
		onClose();
	};

	const handleSubmit = () => {
		const selectedLabel = feedbackOptions.find((option) => option.id === selectedReason)?.label;
		onSubmit(selectedReason, message.trim() || selectedLabel || selectedReason);
		setSelectedReason("not_relevant");
		setMessage("");
	};

	return createPortal(
		<div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/55 px-0 sm:items-center sm:px-4">
			<button
				type="button"
				className="absolute inset-0 h-full w-full cursor-default"
				onClick={resetAndClose}
				aria-label="Close notification feedback"
			/>

			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="notification-feedback-title"
				className="relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl duration-300 animate-in slide-in-from-bottom-4 dark:bg-[#1F1F1F] sm:rounded-3xl sm:slide-in-from-bottom-0 sm:zoom-in-95"
			>
				<div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-6 pb-4 pt-6 dark:border-gray-800">
					<div className="flex items-start gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-300">
							<MessageSquareWarning className="h-5 w-5" />
						</div>
						<div>
							<h2 id="notification-feedback-title" className="text-base font-bold text-gray-900 dark:text-white">
								Why was this notification not helpful?
							</h2>
							<p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
								Your feedback helps us improve future notifications.
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={resetAndClose}
						className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
						aria-label="Close"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto">
					<div className="space-y-2 px-6 py-5">
						{feedbackOptions.map((option) => (
							<button
								key={option.id}
								type="button"
								onClick={() => setSelectedReason(option.id)}
								className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
									selectedReason === option.id
										? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200"
										: "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-[#3D3D3D] dark:bg-[#FFFFFF0D] dark:text-gray-200 dark:hover:bg-gray-800"
								}`}
							>
								<span>{option.label}</span>
								<span className={`h-4 w-4 rounded-full border ${
									selectedReason === option.id
										? "border-red-500 bg-red-500 shadow-[inset_0_0_0_3px_white] dark:shadow-[inset_0_0_0_3px_#1F1F1F]"
										: "border-gray-300 dark:border-gray-600"
								}`} />
							</button>
						))}
					</div>

					<div className="px-6 pb-6">
						<label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-200">
							Anything else? <span className="font-normal text-gray-400">(optional)</span>
						</label>
						<textarea
							value={message}
							onChange={(event) => setMessage(event.target.value.slice(0, MAX_FEEDBACK_LENGTH))}
							maxLength={MAX_FEEDBACK_LENGTH}
							placeholder="Tell us more about what was wrong..."
							className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:border-[var(--border-dark)] dark:bg-[var(--inputBg-dark)] dark:text-white dark:placeholder:text-gray-400"
							rows={4}
							style={{ fontStyle: message ? "normal" : "italic" }}
						/>
						<p className="mt-2 text-right text-xs text-gray-400 dark:text-gray-500">
							{message.length}/{MAX_FEEDBACK_LENGTH}
						</p>
					</div>
				</div>

				<div className="flex shrink-0 gap-3 border-t border-gray-100 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-gray-800">
					<Button
						type="button"
						onClick={resetAndClose}
						variant="outline"
						className="h-11 flex-1 cursor-pointer rounded-xl border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleSubmit}
						className="h-11 flex-1 cursor-pointer rounded-xl bg-[var(--primary)] text-sm font-semibold text-white shadow-none hover:bg-[var(--primary)]/90"
					>
						Submit
					</Button>
				</div>
			</div>
		</div>,
		document.body
	);
}
