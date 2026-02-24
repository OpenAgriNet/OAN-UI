import { useState } from "react";
import { X, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";
import { useChatStore } from "@/hooks/store/chat";
import { setupAudioRecording, stopRecording } from "@/lib/audio-utils";
import { useRef } from "react";

export type FeedbackReason =
	| "incorrect"
	| "not_helpful"
	| "irrelevant"
	| "inappropriate"
	| "other";

type FeedbackModalProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (reason: FeedbackReason, message: string) => void;
};

export function FeedbackModal({ open, onClose, onSubmit }: FeedbackModalProps) {
	const { language, t } = useLanguage();
	
	const FEEDBACK_OPTIONS = [
		{ id: "incorrect", label: t("feedback.reasons.incorrect") },
		{ id: "not_helpful", label: t("feedback.reasons.not_helpful") },
		{ id: "irrelevant", label: t("feedback.reasons.irrelevant") },
		{ id: "inappropriate", label: t("feedback.reasons.inappropriate") },
		{ id: "other", label: t("feedback.reasons.other") }
	];

	const playTTS = useChatStore((s) => s.playTTS);
	const sessionId = useChatStore((s) => s.sessionId);

	const [selectedReason, setSelectedReason] = useState<any>("incorrect");
	const [message, setMessage] = useState("");
	const [isRecording, setIsRecording] = useState(false);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const animationFrameRef = useRef<number | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const dataRef = useRef<Uint8Array | null>(null);

	const handleListen = async () => {
		if (!message) return;
		try {
			await playTTS(message, language);
		} catch (error) {
			console.error("TTS error in feedback:", error);
		}
	};

	const toggleRecording = async () => {
		if (isRecording) {
			stopRecording(setIsRecording, timerRef, animationFrameRef, mediaRecorderRef, streamRef, analyserRef, dataRef);
		} else {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				streamRef.current = stream;
				setIsRecording(true);
				setupAudioRecording(stream, mediaRecorderRef, (text) => {
					setMessage(prev => prev ? `${prev} ${text}` : text);
				}, sessionId, language);
			} catch (error) {
				console.error("Mic access error:", error);
			}
		}
	};

	if (!open) return null;

	const handleSubmit = () => {
		onSubmit(selectedReason, message);
		// Reset form
		setSelectedReason("incorrect");
		setMessage("");
	};

	const handleCancel = () => {
		onClose();
		// Reset form
		setSelectedReason("incorrect");
		setMessage("");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={handleCancel}
			/>

			{/* Modal */}
			<div className="relative w-full max-w-md sm:max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300 flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
					<h2 className="text-lg font-bold text-gray-900">{t("feedback.title")}</h2>
					<button
						onClick={handleCancel}
						className="rounded-full p-1 hover:bg-gray-100 transition-colors cursor-pointer"
					>
						<X className="h-6 w-6 text-gray-500" />
					</button>
				</div>

				{/* Scrollable Content */}
				<div className="overflow-y-auto flex-1 sm:px-0">
					{/* Subtitle */}
					<div className="px-6 pb-4">
						<p className="text-xs text-gray-600">
							{t("feedback.description")}
						</p>
					</div>

					{/* Feedback Options */}
					<div className="px-6 pb-4 space-y-2">
						{FEEDBACK_OPTIONS.map((option: any) => (
							<button
								key={option.id}
								onClick={() => setSelectedReason(option.id)}
								className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer ${
									selectedReason === option.id
										? "bg-yellow-400 text-gray-900"
										: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
								}`}
							>
								{option.label}
							</button>
						))}
					</div>

					{/* Message Section */}
					<div className="px-6 pb-6">
						<label className="block text-sm font-semibold text-gray-900 mb-2">
							{t("feedback.messageLabel")}
						</label>
						<div className="relative">
							<textarea
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder={t("feedback.placeholder") as string}
								className="w-full px-4 py-3 pr-24 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
								rows={4}
								style={{ fontStyle: message ? "normal" : "italic" }}
							/>
							<div className="absolute right-3 bottom-3 flex gap-1">
								<button 
									type="button"
									onClick={handleListen}
									disabled={!message}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 disabled:opacity-30 cursor-pointer"
									title="Listen to feedback text"
								>
									<Volume2 className="h-5 w-5" />
								</button>
								<button 
									type="button"
									onClick={toggleRecording}
									className={`p-2 rounded-full transition-colors cursor-pointer ${isRecording ? "bg-red-100 text-red-500 animate-pulse" : "hover:bg-gray-100 text-gray-400"}`}
									title={isRecording ? "Stop recording" : "Record voice feedback"}
								>
									<Mic className="h-5 w-5" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3 px-6 pb-6 flex-shrink-0">
					<Button
						onClick={handleCancel}
						variant="outline"
						className="flex-1 h-11 cursor-pointer rounded-xl border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 text-sm"
					>
						{t("feedback.cancel")}
					</Button>
					<Button
						onClick={handleSubmit}
						className="flex-1 h-11 cursor-pointer rounded-xl bg-[#FFE2E2] hover:bg-[#ffcccc] text-[#F65151] font-semibold shadow-none text-sm"
					>
						{t("feedback.submit")}
					</Button>
				</div>
			</div>
		</div>
	);
}
