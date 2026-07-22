import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, X, Camera, ImageIcon, Keyboard, SendHorizontal, Sparkles, AudioLines, Square } from "lucide-react";
import activeSend from "@/assets/activeSend.svg";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Suggestions } from "./suggestions";
import type { Suggestion } from "../api/suggestions-api";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useChatStore } from "@/hooks/store/chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { environment } from "@/lib/config/environment";

const MAX_CLIENT_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/jpg"]);

export type ChatInputPayload = {
	text: string;
	files: File[];
	mode?: "chat" | "pest_api";
	voice?: Blob | null;
	duration?: number;
};

export type ChatInputProps = {
	placeholder?: string;
	disabled?: boolean;
	value: string;
	onValueChange: (_value: string) => void;
	onSend: (_payload: ChatInputPayload) => void;
	onTypingChange?: (_isTyping: boolean) => void;
	onVoiceStart?: () => void;
	onVoiceStop?: () => void;
	/** End live streaming mic session (ALD/ASR) without sending a voice blob. */
	onEndMicSession?: () => void;
	micHint?: string;
	footerNote?: string;
	isListening?: boolean;
	isTranscribing?: boolean;
	/**
	 * Live voice-gateway path: PCM stream + ALD language lock + interim transcript.
	 * When false, MediaRecorder batch → sendAudio (gateway or REST).
	 */
	streamingMode?: boolean;
	/** Show “Please speak now” during warmup / ALD. */
	pleaseSpeakNow?: boolean;
	suggestions?: Suggestion[];
	onSuggestionClick?: (text: string) => void;
	/** Welcome landing: large mic is on the panel; hide the bar mic. */
	hideMicButton?: boolean;
};

export function ChatInput({
	placeholder = "Type a message…",
	disabled,
	value,
	onValueChange,
	onSend,
	onTypingChange,
	onVoiceStart,
	onVoiceStop,
	onEndMicSession,
	micHint,
	footerNote,
	isListening,
	isTranscribing,
	streamingMode = false,
	pleaseSpeakNow = false,
	suggestions = [],
	onSuggestionClick,
	hideMicButton = false
}: ChatInputProps) {
	const { t } = useLanguage();
	const { user } = useAuth();
	const setToast = useChatStore((s) => s.setToast);
	const micStartRequested = useChatStore((s) => s.micStartRequested);
	const clearMicStartRequest = useChatStore((s) => s.clearMicStartRequest);
	const micFinishRequested = useChatStore((s) => s.micFinishRequested);
	const clearMicFinishRequest = useChatStore((s) => s.clearMicFinishRequest);
	const isMobile = useIsMobile();
	const isUnauthenticated = !user;
	const [isPestDialogOpen, setIsPestDialogOpen] = useState(false);
	const [pestImage, setPestImage] = useState<File | null>(null);
	const [pestImagePreview, setPestImagePreview] = useState<string | null>(null);
	const [voice, setVoice] = useState<Blob | null>(null);
	const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused">("idle");
	const [recordingDuration, setRecordingDuration] = useState(0);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<BlobPart[]>([]);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const pestCameraInputRef = useRef<HTMLInputElement>(null);
	const pestGalleryInputRef = useRef<HTMLInputElement>(null);
	const taRef = useRef<HTMLTextAreaElement | null>(null);

	const canSend = useMemo(() => value.trim().length > 0 || !!voice, [value, voice]);
	// Batch STT locks the field while REST/gateway batch runs.
	// Streaming keeps the field open so live transcript can land.
	const isLoading = (!streamingMode && isTranscribing) || Boolean(disabled);
	const isPestSubmitDisabled = disabled || isLoading || isUnauthenticated || !pestImage;
	const maxLength = environment.chatMessageMaxLength ?? 4000;
	const charCount = value.length;
	const isNearLimit = charCount >= maxLength * 0.8;
	const isAtLimit = charCount >= maxLength;
	const showLiveMic = Boolean(isListening) || pleaseSpeakNow || recordingState !== "idle";

	// Clean up on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
			if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
				mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
			}
			if (pestImagePreview) {
				URL.revokeObjectURL(pestImagePreview);
			}
		};
	}, [pestImagePreview]);


	useEffect(() => {
		onTypingChange?.(value.trim().length > 0);
	}, [onTypingChange, value]);

	// Welcome-panel large mic (or any external trigger) starts the same recorder / stream
	useEffect(() => {
		if (!micStartRequested) return;
		clearMicStartRequest();
		if (disabled || isLoading || isUnauthenticated) return;
		if (streamingMode) {
			if (isListening) return;
			onVoiceStart?.();
			return;
		}
		if (recordingState !== "idle") return;
		void startRecording();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- startRecording is stable enough; avoid re-firing on each render
	}, [
		micStartRequested,
		clearMicStartRequest,
		disabled,
		isLoading,
		isUnauthenticated,
		recordingState,
		streamingMode,
		isListening,
		onVoiceStart
	]);

	// Second tap on welcome mic: stop stream (keep draft) or stop+send batch clip
	useEffect(() => {
		if (!micFinishRequested) return;
		clearMicFinishRequest();
		if (streamingMode) {
			onEndMicSession?.();
			onVoiceStop?.();
			return;
		}
		if (recordingState === "idle") return;
		finishRecordingAndSend();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		micFinishRequested,
		clearMicFinishRequest,
		recordingState,
		streamingMode,
		onEndMicSession,
		onVoiceStop
	]);

	useEffect(() => {
		if (!isPestDialogOpen) {
			setPestImage(null);
			setPestImagePreview((currentPreview) => {
				if (currentPreview) {
					URL.revokeObjectURL(currentPreview);
				}
				return null;
			});
		}
	}, [isPestDialogOpen]);

	async function startRecording() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream);
			chunksRef.current = [];

			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunksRef.current.push(e.data);
			};

			recorder.onstop = () => {
				stream.getTracks().forEach((t) => t.stop());
			};

			recorder.start();
			mediaRecorderRef.current = recorder;

			setRecordingState("recording");
			setRecordingDuration(0);
			onVoiceStart?.();

			timerRef.current = setInterval(() => {
				setRecordingDuration((prev) => prev + 1);
			}, 1000);
		} catch (error) {
			console.error("Failed to start recording:", error);
		}
	}

	function finishRecordingAndSend() {
		// Stop recorder if running or paused
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
			// Ensure tracks are stopped
			mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
		}

		if (timerRef.current) clearInterval(timerRef.current);

		// Allow small buffer for onstop to finalize chunks
		setTimeout(() => {
			const type = mediaRecorderRef.current?.mimeType || "audio/webm";
			const blob = new Blob(chunksRef.current, { type });
			if (blob.size > 0) {
				onSend({ text: "", files: [], voice: blob, duration: recordingDuration });
			}
			// Reset all state
			setRecordingState("idle");
			setRecordingDuration(0);
			chunksRef.current = [];
			onVoiceStop?.();
		}, 50);
	}

	function endStreamingMic() {
		onEndMicSession?.();
		onVoiceStop?.();
	}

	function toggleRecording() {
		if (streamingMode) {
			// Live ALD/ASR: start/stop stream; transcript already in the text field
			if (isListening || pleaseSpeakNow) {
				endStreamingMic();
				return;
			}
			onVoiceStart?.();
			return;
		}
		if (recordingState !== "idle") {
			finishRecordingAndSend();
			return;
		}
		void startRecording();
	}

	function openPestApiPicker() {
		pestCameraInputRef.current?.click();
	}

	function openPestGalleryPicker() {
		pestGalleryInputRef.current?.click();
	}

	function clearVoice() {
		setVoice(null);
	}

	function setPestFile(file: File) {
		setPestImage(file);
		setPestImagePreview((currentPreview) => {
			if (currentPreview) {
				URL.revokeObjectURL(currentPreview);
			}
			return URL.createObjectURL(file);
		});
	}

	function onPestFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!validateSelectedImage(file)) {
			e.target.value = "";
			return;
		}
		setPestFile(file);
		e.target.value = "";
	}

	function validateSelectedImage(file: File) {
		const fileType = file.type.toLowerCase();
		const validType = ACCEPTED_IMAGE_TYPES.has(fileType);
		if (!validType) {
			setToast({
				message: t("imageUpload.invalidFormat") as string,
				type: "error"
			});
			return false;
		}

		if (file.size > MAX_CLIENT_IMAGE_SIZE_BYTES) {
			setToast({
				message: t("imageUpload.imageTooLarge") as string,
				type: "error"
			});
			return false;
		}

		return true;
	}

	function removePestFile() {
		setPestImage(null);
		setPestImagePreview((currentPreview) => {
			if (currentPreview) {
				URL.revokeObjectURL(currentPreview);
			}
			return null;
		});
	}

	function submitPestImage() {
		if (!pestImage || isPestSubmitDisabled) return;

		const selectedImage = pestImage;
		setIsPestDialogOpen(false);
		onSend({ text: "", files: [selectedImage], mode: "pest_api" });
	}

	function submit() {
		if (!canSend || disabled || isLoading) return;
		// Send stops mic first (handoff §7.4)
		if (streamingMode && (isListening || pleaseSpeakNow)) {
			endStreamingMic();
		}
		onSend({ text: value.trim(), files: [], voice, mode: "chat" });
		onValueChange("");
		setVoice(null);
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	// Recording UI bar intentionally hidden — mic toggles start / stop+send.
	// Listening state is shown on the welcome large mic (or bar mic pulse).

	return (
		<div
			className={cn(
				"relative",
				hideMicButton
					? // Welcome: soft frosted dock over farm scene
						"border-t border-white/40 bg-gradient-to-t from-white/95 via-white/85 to-white/55 backdrop-blur-xl dark:border-slate-800/60 dark:from-slate-950/95 dark:via-slate-950/85 dark:to-slate-950/50"
					: // Chat: same surface as message area (config --background gradient)
						"border-t border-transparent dark:border-[var(--border-dark)]"
			)}
			style={
				hideMicButton
					? undefined
					: {
							// Match chat shell so footer doesn't look like a white strip
							background: "var(--background)"
						}
			}
		>
			<style>{`
				@keyframes float {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-5px); }
				}
				@keyframes earthquake {
					0%, 50%, 100% { transform: translate(0, 0) rotate(0deg); }
					10% { transform: translate(-1px, -1px) rotate(-15deg); }
					20% { transform: translate(1px, 1px) rotate(15deg); }
					30% { transform: translate(-1px, -1px) rotate(-15deg); }
					40% { transform: translate(1px, 1px) rotate(15deg); }
				}
				.animate-earthquake {
					animation: earthquake 1.3s ease-in-out infinite;
				}
				@keyframes transcribe-bar {
					0%, 100% { transform: scaleY(0.35); opacity: 0.55; }
					50% { transform: scaleY(1); opacity: 1; }
				}
				@keyframes transcribe-shimmer {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(100%); }
				}
			`}</style>
			<Dialog open={isPestDialogOpen} onOpenChange={setIsPestDialogOpen}>
				<DialogContent className="max-w-md overflow-hidden rounded-2xl p-0 gap-0 bg-white dark:bg-[var(--background)] border shadow-xl" showCloseButton={false}>
					{/* Warm amber header — softer than before */}
					<DialogHeader className="gap-0">
						<div className="bg-gradient-to-br from-amber-400 to-amber-500 px-6 py-5 text-white">
							<div className="flex items-center gap-2 mb-1">
								<Camera className="h-5 w-5 opacity-90" />
								<DialogTitle className="text-lg font-semibold">
									{t("pestApi.title") as string}
								</DialogTitle>
							</div>
							<DialogDescription className="text-amber-50/90 text-sm leading-relaxed">
								{t("pestApi.description") as string}
							</DialogDescription>
						</div>
					</DialogHeader>

					<div className="px-6 py-5 space-y-5">
						{/* Refined amber note with icon */}
						<div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-100">
							<svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
							</svg>
							{t("pestApi.note") as string}
						</div>

						{/* Photo section */}
						<div className="space-y-3">
							<p className="text-sm font-semibold text-foreground flex items-center gap-2">
								<span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
								{t("pestApi.photoLabel") as string}
							</p>

							{pestImagePreview ? (
								<div className="relative overflow-hidden rounded-xl border border-border bg-muted/30 shadow-sm">
									<img
										src={pestImagePreview}
										alt={pestImage?.name || "Crop image preview"}
										className="max-h-56 w-full object-contain p-3"
									/>
									<button
										type="button"
										onClick={removePestFile}
										className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							) : (
								<div className="rounded-xl border-2 border-dashed border-amber-200/70 bg-amber-50/30 px-4 py-8 transition-all hover:border-amber-300 hover:bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
									<div className={cn("flex items-center justify-center", isMobile ? "gap-8" : "gap-4 flex-col")}>
										{isMobile && (
											<button
												type="button"
												onClick={openPestApiPicker}
												className="group flex flex-col items-center gap-2.5"
											>
												<div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-300/80 bg-white text-amber-600 shadow-sm transition-all group-hover:border-amber-400 group-hover:bg-amber-50 group-hover:shadow-md group-hover:scale-105 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
													<Camera className="h-6 w-6" />
												</div>
												<span className="text-center text-sm font-medium text-foreground">
													{t("imageUpload.captureImage") as string}
												</span>
											</button>
										)}
										<button
											type="button"
											onClick={openPestGalleryPicker}
											className="group flex flex-col items-center gap-2.5"
										>
											<div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-300/80 bg-white text-amber-600 shadow-sm transition-all group-hover:border-amber-400 group-hover:bg-amber-50 group-hover:shadow-md group-hover:scale-105 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
												<ImageIcon className="h-6 w-6" />
											</div>
											<span className="text-center text-sm font-medium text-foreground">
												{t("imageUpload.selectFromGallery") as string}
											</span>
										</button>
									</div>
									<p className="mt-5 text-center text-xs text-muted-foreground/80">
										{t("imageUpload.imageFormatHint") as string}
									</p>
								</div>
							)}
						</div>

						<input
							ref={pestCameraInputRef}
							type="file"
							accept="image/jpeg,image/png,image/jpg"
							capture="environment"
							className="hidden"
							onChange={onPestFilePicked}
						/>
						<input
							ref={pestGalleryInputRef}
							type="file"
							accept="image/jpeg,image/png,image/jpg"
							className="hidden"
							onChange={onPestFilePicked}
						/>
					</div>

					{/* Footer buttons */}
					<DialogFooter className="border-t border-border/50 px-6 py-4 gap-3 sm:justify-end bg-muted/20">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsPestDialogOpen(false)}
							className="flex-1 sm:flex-none rounded-xl border-border/80 hover:bg-muted"
						>
							{t("pestApi.cancel") as string}
						</Button>
						<Button
							type="button"
							onClick={submitPestImage}
							disabled={isPestSubmitDisabled}
							className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:from-amber-600 hover:to-amber-700 hover:shadow-lg disabled:opacity-50 transition-all"
						>
							{t("pestApi.submit") as string}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>


			<div className="mx-auto w-full max-w-4xl px-3 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.85rem)] sm:px-5">
				<Suggestions
					suggestions={suggestions}
					onSuggestionClick={(text) => onSuggestionClick?.(text)}
					className="mb-2"
				/>
				{/* Voice preview row */}
				{voice && (
					<div className="mb-2 flex flex-wrap items-center gap-2">
						<Badge variant="secondary" className="gap-2">
							<span>Voice message</span>
							<button
								type="button"
								onClick={clearVoice}
								className="cursor-pointer rounded-sm p-0.5 hover:bg-muted"
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</Badge>
					</div>
				)}

				{/* Chat mode: large mic sits above the input; welcome keeps field-only row */}
				<div className={cn("flex w-full", !hideMicButton ? "flex-col items-center gap-3" : "flex-row items-center")}>
					{!hideMicButton && (
						<div className="relative z-10 flex flex-col items-center">
							{micHint && !value.trim() ? (
								<div className="mb-2 animate-[float_3s_ease-in-out_infinite]">
									<div className="relative whitespace-nowrap rounded-lg bg-[var(--secondary)] px-3 py-2 text-sm font-medium text-[var(--primary)] shadow-sm">
										{t("chatMicHint")}
										<div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[var(--secondary)]"></div>
									</div>
								</div>
							) : null}
							<button
								type="button"
								// Mic stays tappable during streaming connect/warmup
								disabled={
									disabled ||
									isUnauthenticated ||
									(!streamingMode && isLoading)
								}
								onClick={toggleRecording}
								className={cn(
									// Larger mic above the input in active chat
									"flex h-20 w-20 shrink-0 items-center justify-center rounded-full sm:h-24 sm:w-24",
									"text-white shadow-[0_10px_28px_rgba(6,3,141,0.38)]",
									"transition-transform duration-150 hover:scale-105 active:scale-95",
									"focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]/30",
									showLiveMic
										? "animate-pulse scale-105 bg-red-500 ring-4 ring-red-300/40 shadow-[0_10px_28px_rgba(239,68,68,0.4)]"
										: "bg-[var(--primary)] ring-4 ring-[var(--primary)]/15",
									disabled || isUnauthenticated || (!streamingMode && isLoading)
										? "cursor-not-allowed opacity-60"
										: "cursor-pointer"
								)}
								aria-label={
									showLiveMic
										? String(t("tapToStop"))
										: String(t("tapToSpeak"))
								}
							>
								{showLiveMic ? (
									<Square className="h-8 w-8 fill-white text-white sm:h-9 sm:w-9" strokeWidth={2.25} aria-hidden />
								) : (
									<Mic className="h-9 w-9 text-white sm:h-10 sm:w-10" strokeWidth={2.25} aria-hidden />
								)}
							</button>
							<div className="mt-1.5 flex flex-col items-center gap-0.5 text-center">
								{showLiveMic ? (
									<>
										<p className="text-xs font-medium text-[var(--primary)]">
											{streamingMode && pleaseSpeakNow
												? "Please speak now"
												: String(t("recordingListening"))}
										</p>
										<p className="text-sm font-bold text-red-600 dark:text-red-400">
											{String(t("tapToStop"))}
										</p>
									</>
								) : (
									<p className="text-xs font-semibold text-[var(--primary)]">
										{String(t("tapToSpeak"))}
									</p>
								)}
							</div>
						</div>
					)}

					{/* Voice → text progress (replaces plain spinner overlay) */}
					{isTranscribing ? (
						<div
							className={cn(
								"relative flex w-full min-h-[56px] items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3",
								"border-[var(--primary)]/20 bg-gradient-to-r from-[var(--primary)]/[0.06] via-white to-[var(--secondary)]/40",
								"shadow-[0_8px_28px_rgba(6,3,141,0.08)] dark:from-[var(--primary)]/20 dark:via-slate-900 dark:to-slate-900 dark:border-[var(--primary)]/30"
							)}
							role="status"
							aria-live="polite"
							aria-label="Transcribing your voice"
						>
							{/* Soft animated sheen */}
							<div
								className="pointer-events-none absolute inset-0 -translate-x-full animate-[transcribe-shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10"
								aria-hidden
							/>

							{/* Mic badge */}
							<div className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/25">
								<AudioLines className="h-5 w-5" strokeWidth={2.25} />
							</div>

							{/* Copy + waveform */}
							<div className="relative z-[1] min-w-0 flex-1">
								<p className="text-sm font-semibold text-[var(--primary)]">
									{String(t("transcribingTitle") || "Converting your voice…")}
								</p>
								<p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
									{String(t("transcribingSubtitle") || "This will only take a moment")}
								</p>
							</div>

							{/* Animated equalizer bars */}
							<div className="relative z-[1] flex h-8 items-end gap-[3px] pr-0.5" aria-hidden>
								{[0, 1, 2, 3, 4, 5, 6].map((i) => (
									<span
										key={i}
										className="w-[3.5px] rounded-full bg-[var(--primary)]/80 origin-bottom animate-[transcribe-bar_0.9s_ease-in-out_infinite]"
										style={{
											height: `${10 + (i % 4) * 5}px`,
											animationDelay: `${i * 0.1}s`
										}}
									/>
								))}
							</div>
						</div>
					) : (
						/* Composer shell — same look on welcome and in-chat */
						<div
							className={cn(
								"relative flex min-h-[52px] w-full min-w-0 items-stretch overflow-hidden rounded-2xl border bg-white transition-all duration-200 dark:bg-[var(--inputBg-dark)]",
								"border-slate-200/90 shadow-[0_8px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.03]",
								"focus-within:border-[var(--primary)]/40 focus-within:shadow-[0_10px_36px_rgba(6,3,141,0.12)] focus-within:ring-[var(--primary)]/15",
								"dark:border-slate-700 dark:ring-white/[0.04]",
								isLoading || isUnauthenticated ? "cursor-not-allowed bg-slate-50/90 opacity-90 dark:bg-slate-900/50" : ""
							)}
						>
							{/* Keyboard cue — matches welcome input */}
							{!isLoading && (
								<div className="flex shrink-0 items-center pl-3.5 text-slate-400 dark:text-slate-500" aria-hidden>
									<Keyboard className="h-5 w-5" strokeWidth={1.75} />
								</div>
							)}

							<Textarea
								ref={taRef}
								value={value}
								onChange={(e) => {
									const newValue = e.target.value;
									if (newValue.length <= maxLength) {
										onValueChange(newValue);
										return;
									}
									onValueChange(newValue.slice(0, maxLength));
								}}
								onKeyDown={onKeyDown}
								disabled={disabled || isLoading || isUnauthenticated}
								placeholder={(isLoading || isUnauthenticated) ? "" : placeholder}
								className={cn(
									"flex-1 min-w-0 max-h-[140px] min-h-[52px] resize-none border-0 bg-transparent px-3 py-[14px] text-[15px] leading-6 shadow-none sm:px-4",
									"focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none",
									"placeholder:text-slate-400 placeholder:leading-6 dark:text-[var(--inputText-dark)] dark:placeholder:text-slate-500",
									"break-words whitespace-pre-wrap overflow-y-auto block",
									disabled || isLoading || isUnauthenticated ? "cursor-not-allowed" : ""
								)}
							/>
							{isNearLimit && (
								<span
									className={cn(
										"absolute bottom-1.5 right-16 text-[10px] leading-none opacity-60 select-none pointer-events-none",
										isAtLimit ? "text-red-500 opacity-90" : "text-muted-foreground"
									)}
								>
									{charCount}/{maxLength}
								</span>
							)}

							{/* Send control — same pill treatment as welcome */}
							<div className="flex shrink-0 items-center pr-1.5 pl-0.5">
								<Button
									type="button"
									size="icon"
									onClick={submit}
									disabled={!canSend || disabled || isLoading}
									aria-label="Send"
									className={cn(
										"h-10 w-10 rounded-xl shadow-none transition-all duration-200",
										canSend && !isLoading
											? "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 hover:scale-[1.03] cursor-pointer"
											: "bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed dark:bg-white/10 dark:text-slate-500"
									)}
								>
									{canSend && !isLoading ? (
										<img
											src={activeSend}
											alt=""
											className="h-4 w-4 animate-earthquake brightness-0 invert"
										/>
									) : (
										<SendHorizontal className="h-4 w-4" strokeWidth={2} />
									)}
								</Button>
							</div>
						</div>
					)}
				</div>

				{footerNote ? (
					<div className="mt-2.5 flex items-center justify-center gap-1.5 px-2 text-center">
						<Sparkles
							className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500"
							strokeWidth={2}
							aria-hidden
						/>
						<p className="text-[11px] leading-snug text-slate-500 sm:text-xs dark:text-slate-400">
							{footerNote}
						</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
