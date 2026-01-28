import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import deleteIcon from "@/assets/delete.svg";
import micAmul from "@/assets/micAmul.svg";
import sendAmul from "@/assets/sendAmul.svg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import { CHAT_ASSISTANT } from "@/components/screens-component/chat-screen/config";

type RecordingState = "recording" | "paused";

interface RecordingControlsProps {
	state: RecordingState;
	duration: number; // in seconds
	audioBlob: Blob | null;
	onPause: () => void;
	onResume: () => void;
	onDelete: () => void;
	onSend: () => void;
}

export function RecordingControls({
	state,
	duration,
	audioBlob,
	onPause,
	onResume,
	onDelete,
	onSend,
}: RecordingControlsProps) {
	const { t } = useLanguage();
	const [playbackTime, setPlaybackTime] = useState(0);
	const [isPlayingPreview, setIsPlayingPreview] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const [audioUrl, setAudioUrl] = useState<string | null>(null);

	// Reset playback when switching back to recording
	useEffect(() => {
		if (state === "recording") {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}
			setIsPlayingPreview(false);
			setPlaybackTime(0);
		}
	}, [state]);

	useEffect(() => {
		if (audioBlob) {
			const url = URL.createObjectURL(audioBlob);
			setAudioUrl(url);
			return () => URL.revokeObjectURL(url);
		} else {
			setAudioUrl(null);
		}
	}, [audioBlob]);

	function formatTime(sec: number) {
		const m = Math.floor(sec / 60);
		const s = Math.floor(sec % 60);
		return `${m}:${s.toString().padStart(2, "0")}`;
	}

	function togglePreview() {
		if (!audioRef.current) return;
		if (isPlayingPreview) {
			audioRef.current.pause();
		} else {
			audioRef.current.play().catch(e => console.error("Playback failed", e));
		}
	}

	return (
		<div className="flex w-full flex-col items-center gap-4 pb-2 pt-6">
			{/* Hidden Audio for Preview */}
			{audioUrl && (
				<audio
					ref={audioRef}
					src={audioUrl}
					onPlay={() => setIsPlayingPreview(true)}
					onPause={() => setIsPlayingPreview(false)}
					onTimeUpdate={(e) => setPlaybackTime(e.currentTarget.currentTime)}
					onEnded={() => {
						setIsPlayingPreview(false);
						setPlaybackTime(0);
					}}
					className="hidden"
				/>
			)}

			{/* Top Pill Status - Absolute Positioned on the border */}
			<div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform">
				<div className="whitespace-nowrap rounded-full bg-red-50 px-6 py-1.5 text-xs font-medium text-[#F65151] shadow-sm border border-red-100">
					{t("recordingListening", { botName: CHAT_ASSISTANT.name })}
				</div>
			</div>

			{/* Waveform Area */}
			<div className="flex w-full items-center justify-between px-2">
				{state === "paused" && (
					<Button
						variant="ghost"
						size="icon"
						onClick={togglePreview}
						className="mr-2 cursor-pointer h-8 w-8 text-black hover:bg-transparent"
					>
						{isPlayingPreview ? (
							<Pause className="h-5 w-5 fill-current" />
						) : (
							<Play className="h-5 w-5 fill-current" />
						)}
					</Button>
				)}

				<div className="flex h-12 flex-1 items-center justify-center gap-[3px] overflow-hidden px-4">
					{Array.from({ length: 45 }).map((_, i) => {
						// Reduced maximum height for a cleaner look
						const height = 10 + Math.random() * 30;
						return (
							<div
								key={i}
								className={cn(
									"w-[4px] rounded-full bg-black transition-all duration-75",
									state === "recording" ? "animate-pulse" : ""
								)}
								style={{ height: `${height}%` }}
							/>
						);
					})}
				</div>

				<span className="ml-2 min-w-[36px] text-right text-sm font-medium text-muted-foreground">
					{formatTime(state === "paused" && isPlayingPreview ? playbackTime : duration)}
				</span>
			</div>

			{/* Bottom Controls */}
			<div className="flex w-full items-center justify-between px-4">
				{/* Left: Delete */}
				<Button
					variant="ghost"
					size="icon"
					onClick={onDelete}
					className="h-10 w-10 cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600"
				>
					<img src={deleteIcon} alt="Delete" className="h-6 w-6" />
				</Button>

				{/* Center: Pause/Resume */}
				{state === "recording" ? (
					<Button
						variant="ghost"
						size="icon"
						onClick={onPause}
						className="h-12 w-12 cursor-pointer rounded-full bg-[#FF5C00] text-black hover:bg-[#FF5C00]/90 animate-pulsate"
					>
						<Pause className="h-5 w-5 fill-current" />
					</Button>
				) : (
					<Button
						variant="ghost"
						size="icon"
						onClick={onResume}
						className="h-12 w-12 cursor-pointer rounded-full bg-[#FF5C00] text-black hover:bg-[#FF5C00]/90"
					>
						<img src={micAmul} alt="Mic" className="h-6 w-6" />
					</Button>
				)}

				{/* Right: Send */}
				<Button
					size="icon"
					onClick={onSend}
					className={cn(
						"flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white shadow-lg hover:bg-[#00a651]/90 brand-gradient"
					)}
				>
					<img
						src={sendAmul}
						alt="Send"
						className={cn(
							"h-5 w-5 animate-earthquake"
						)}
					/>

				</Button>
			</div>
		</div>
	);
}
