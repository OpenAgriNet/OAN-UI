import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import Lottie from "lottie-react";
import micAmul from "@/assets/micAmul.svg";
import sendAmul from "@/assets/sendAmul.svg";
import sendIcon from "@/assets/send.svg";
import loadingAnim from "@/assets/Loading.json";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RecordingControls } from "./recording-controls";
import { Suggestions } from "./suggestions";
import type { Suggestion } from "../api/suggestions-api";

export type ChatInputPayload = {
	text: string;
	files: File[];
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
	micHint?: string;
	footerNote?: string;
	isListening?: boolean;
	isTranscribing?: boolean;
	isAssistantTyping?: boolean;
	suggestions?: Suggestion[];
	onSuggestionClick?: (text: string) => void;
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
	micHint,
	footerNote,
	isListening,
	isTranscribing,
	isAssistantTyping,
	suggestions = [],
	onSuggestionClick
}: ChatInputProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [voice, setVoice] = useState<Blob | null>(null);
	const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused">("idle");
	const [recordingDuration, setRecordingDuration] = useState(0);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<BlobPart[]>([]);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const taRef = useRef<HTMLTextAreaElement | null>(null);

	const canSend = useMemo(() => value.trim().length > 0 || files.length > 0 || !!voice, [value, files, voice]);
	const isLoading = isTranscribing || isAssistantTyping;

	// Clean up on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
			if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
				mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
			}
		};
	}, []);

	useEffect(() => {
		onTypingChange?.(value.trim().length > 0);
	}, [value]);

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
				const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
				setAudioBlob(blob);
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

	function pauseRecording() {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
			mediaRecorderRef.current.requestData();
			const mimeType = mediaRecorderRef.current.mimeType;
			setTimeout(() => {
				const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
				setAudioBlob(blob);
				mediaRecorderRef.current?.pause();
				setRecordingState("paused");
				if (timerRef.current) clearInterval(timerRef.current);
			}, 100);
		}
	}

	function resumeRecording() {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
			mediaRecorderRef.current.resume();
			setRecordingState("recording");
			timerRef.current = setInterval(() => {
				setRecordingDuration((prev) => prev + 1);
			}, 1000);
		}
	}

	function stopRecording() {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			if (timerRef.current) clearInterval(timerRef.current);
			onVoiceStop?.();
		}
	}

	function cancelRecording() {
		stopRecording();
		setRecordingState("idle");
		setAudioBlob(null);
		setRecordingDuration(0);
		chunksRef.current = [];
	}

	function finishRecordingAndSend() {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
		}

		if (timerRef.current) clearInterval(timerRef.current);

		setTimeout(() => {
			const type = mediaRecorderRef.current?.mimeType || "audio/webm";
			const blob = new Blob(chunksRef.current, { type });
			if (blob.size > 0) {
				onSend({ text: "", files: [], voice: blob, duration: recordingDuration });
			}
			setRecordingState("idle");
			setAudioBlob(null);
			setRecordingDuration(0);
			chunksRef.current = [];
			onVoiceStop?.();
		}, 50);
	}

	function onFilesPicked(e: React.ChangeEvent<HTMLInputElement>) {
		const list = e.target.files ? Array.from(e.target.files) : [];
		if (list.length) setFiles((prev) => [...prev, ...list]);
		e.target.value = "";
	}

	function removeFile(idx: number) {
		setFiles((prev) => prev.filter((_, i) => i !== idx));
	}

	function clearVoice() {
		setVoice(null);
	}

	function submit() {
		if (!canSend || disabled || isLoading) return;
		onSend({ text: value.trim(), files, voice });
		onValueChange("");
		setFiles([]);
		setVoice(null);
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	if (recordingState !== "idle") {
		return (
			<div className="relative bg-[#FFFFFF] backdrop-blur supports-[backdrop-filter]:bg-[#FFFFFF] border-t border-[#E3E3E3]">
				<div className="mx-auto w-full max-w-3xl px-2 py-2 sm:px-4">
					<RecordingControls
						state={recordingState}
						duration={recordingDuration}
						audioBlob={audioBlob}
						onPause={pauseRecording}
						onResume={resumeRecording}
						onDelete={cancelRecording}
						onSend={finishRecordingAndSend}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-transparent backdrop-blur supports-[backdrop-filter]:bg-transparent border-t border-[#E3E3E3]">
			<div className="mx-auto w-full max-w-3xl px-2 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] sm:px-4">
				<Suggestions
					suggestions={suggestions}
					onSuggestionClick={(text) => onSuggestionClick?.(text)}
					className="mb-2"
				/>
				{(files.length > 0 || voice) && (
					<div className="mb-2 flex flex-wrap items-center gap-2">
						{files.map((f, idx) => (
							<Badge key={`${f.name}-${idx}`} variant="secondary" className="gap-1">
								<span className="max-w-[14rem] truncate">{f.name}</span>
								<button
									type="button"
									onClick={() => removeFile(idx)}
									className="rounded-sm cursor-pointer p-0.5 hover:bg-muted"
									aria-label="Remove file"
								>
									<X className="h-3.5 w-3.5" />
								</button>
							</Badge>
						))}

						{voice && (
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
						)}
					</div>
				)}

				<div className="flex items-center gap-2">
					<div className="relative">
						{micHint ? (
							<div className="absolute bottom-full left-0 mb-3 animate-[float_3s_ease-in-out_infinite]">
								<div className="relative whitespace-nowrap rounded-lg brand-gradient-soft px-3 py-2 text-sm font-medium text-black shadow-sm">
									{micHint}
									<div className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 brand-gradient-soft"></div>
								</div>
								<style>{`
									@keyframes float {
										0%, 100% { transform: translateY(0); }
										50% { transform: translateY(-5px); }
									}
								`}</style>
							</div>
						) : null}
						<Button
							type="button"
							size="icon"
							disabled={disabled || isLoading}
							onClick={startRecording}
							className={cn(
								"h-11 w-11 shrink-0 rounded-full text-black bg-[#ABFFA9] hover:bg-[#ABFFA9]/90 shadow-md",
								isListening ? "animate-pulse" : "",
								disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
							)}
							aria-label="Record voice"
						>
							<img src={micAmul} alt="Mic" className="h-6 w-6" />
						</Button>
					</div>

					<div
						className={cn(
							"flex flex-1 min-h-12 min-w-0 items-stretch gap-2 rounded-[16px] border bg-white shadow-sm transition-colors duration-200 relative",
							canSend ? "border-black" : "border-gray-300",
							isLoading ? "bg-gray-50 opacity-80 cursor-not-allowed" : ""
						)}
					>
						{isLoading && (
							<div className="absolute inset-0 z-10 flex items-center ml-4 justify-start bg-white rounded-[16px]">
								<div className="flex items-center gap-1">
									<div className="h-8 w-8">
										<Lottie animationData={loadingAnim} loop={true} />
									</div>
									<span className="text-base italic text-gray-500">
										{isTranscribing ? "Transcribing..." : "Loading..."}
									</span>
								</div>
							</div>
						)}
						<Textarea
							ref={taRef}
							value={value}
							onChange={(e) => onValueChange(e.target.value)}
							onKeyDown={onKeyDown}
							disabled={disabled || isLoading}
							placeholder={isLoading ? "" : placeholder}
							className={cn(
								"flex-1 min-w-0 max-h-[140px] min-h-[48px] mx-4 resize-none border-0 bg-transparent px-0 py-3 text-base shadow-none",
								"focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none",
								"placeholder:text-gray-400",
								"break-words whitespace-pre-wrap overflow-y-auto block",
								disabled || isLoading ? "cursor-not-allowed" : ""
							)}
						/>

						<div
							className={cn(
								"flex w-12 items-stretch justify-center transition-colors duration-200",
								"rounded-r-[16px] rounded-l-none",
								canSend && !isLoading ? "brand-gradient" : "bg-gray-200"
							)}
						>
							<Button
								type="button"
								size="icon"
								variant="ghost"
								className={cn(
									"h-full w-12 rounded-r-[16px] rounded-l-none hover:bg-transparent shadow-none",
									"focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none",
									canSend && !isLoading ? "text-white cursor-pointer" : "text-gray-500 cursor-not-allowed"
								)}
								onClick={submit}
								disabled={!canSend || disabled || isLoading}
								aria-label="Send"
							>
								<img
									src={canSend && !isLoading ? sendAmul : sendIcon}
									alt="Send"
									className={cn(
										"h-5 w-5",
										canSend && !isLoading ? "animate-earthquake" : ""
									)}
								/>
							</Button>
						</div>

						<input
							ref={fileInputRef}
							type="file"
							className="hidden"
							multiple
							onChange={onFilesPicked}
						/>
					</div>

				</div>

				{footerNote ? (
					<div className="mt-3 text-center text-[13px] text-muted-foreground">{footerNote}</div>
				) : null}

			</div>
		</div>
	);
}
