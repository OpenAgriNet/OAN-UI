import { ChatHeader } from "@/components/screens-component/layouts/chat-header";
import { ChatInput, type ChatInputPayload } from "@/components/screens-component/chat-screen/components/chat-input";
import { CHAT_USER, type LanguageCode } from "@/components/screens-component/chat-screen/config";
import { useChatStore } from "@/hooks/store/chat";
import { Outlet } from "@tanstack/react-router";
import { useLanguage } from "@/components/LanguageProvider";
import { useCallback, useState, useEffect, useRef } from "react";
import { Toast } from "@/components/screens-component/chat-screen/components/toast";
import { SettingsDrawer } from "@/components/screens-component/chat-screen/components/settings-drawer";
// import { LocationPermissionDialog } from "@/components/screens-component/chat-screen/components/location-permission-dialog";
import apiService from "@/lib/api-service";
import { cn } from "@/lib/utils";
import { useStreamingAsr } from "@/hooks/use-streaming-asr";
import { isStreamingVoiceEnabled } from "@/lib/config/environment";

const ONE_DAY = 24 * 60 * 60 * 1000;

function getCachedLocation() {
	const cached = localStorage.getItem("user_location");
	if (!cached) return null;

	try {
		const parsed = JSON.parse(cached) as { latitude: number; longitude: number; timestamp: number };
		if (Date.now() - parsed.timestamp >= ONE_DAY) {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

function ChatLayout() {
	const sessionId = useChatStore((s) => s.sessionId);
	const clearChat = useChatStore((s) => s.clearChat);
	const draft = useChatStore((s) => s.draft);
	const setDraft = useChatStore((s) => s.setDraft);
	const sendText = useChatStore((s) => s.sendText);
	const sendAudio = useChatStore((s) => s.sendAudio);
	const sendImage = useChatStore((s) => s.sendImage);
	const isListening = useChatStore((s) => s.isListening);
	const isTranscribing = useChatStore((s) => s.isTranscribing);
	const isInputLocked = useChatStore((s) => s.isInputLocked);
	const startListening = useChatStore((s) => s.startListening);
	const stopListening = useChatStore((s) => s.stopListening);
	const suggestions = useChatStore((s) => s.suggestions);
	const messages = useChatStore((s) => s.messages);
	const toastData = useChatStore((s) => s.toast);
	const setToast = useChatStore((s) => s.setToast);
	const fetchLocation = useChatStore((s) => s.fetchLocation);

	const { language, setLanguage, t } = useLanguage();
	const [settingsOpen, setSettingsOpen] = useState(false);
	// const [showLocationPrompt, setShowLocationPrompt] = useState(false);

	const streamingEnabled = isStreamingVoiceEnabled();
	/** Text typed before mic open — preserved as prefix while streaming. */
	const draftPrefixRef = useRef("");
	const wasListeningRef = useRef(false);

	const streaming = useStreamingAsr({
		onLanguageLocked: (lang: LanguageCode) => {
			if (lang && lang !== language) {
				setLanguage(lang);
			}
		},
		onTranscriptChange: (streamedText) => {
			const prefix = draftPrefixRef.current.trimEnd();
			const next = prefix
				? streamedText
					? `${prefix} ${streamedText}`.replace(/\s{2,}/g, " ")
					: prefix
				: streamedText;
			setDraft(next);
		},
		onError: (message) => {
			setToast({ message: message || "Voice recognition failed", type: "error" });
			stopListening();
		},
	});

	const endMicSession = useCallback(() => {
		if (streaming.enabled) {
			streaming.stop();
		}
		stopListening();
	}, [streaming, stopListening]);

	const handleVoiceStart = useCallback(() => {
		draftPrefixRef.current = useChatStore.getState().draft ?? "";
		startListening();
		if (streaming.enabled) {
			void streaming.start().catch((err) => {
				console.error("Streaming ASR start failed:", err);
				stopListening();
			});
		}
	}, [startListening, stopListening, streaming]);

	const handleVoiceStop = useCallback(() => {
		endMicSession();
	}, [endMicSession]);

	// Only tear down streaming on true→false listening (handoff: avoid cancel during connect)
	const streamingStop = streaming.stop;
	const streamingIsActive = streaming.isActive;
	useEffect(() => {
		const was = wasListeningRef.current;
		wasListeningRef.current = isListening;
		if (was && !isListening && streamingIsActive) {
			streamingStop();
		}
	}, [isListening, streamingIsActive, streamingStop]);

	useEffect(() => {
		const cachedLocation = getCachedLocation();
		if (cachedLocation) {
			apiService.setLocationData({
				latitude: cachedLocation.latitude,
				longitude: cachedLocation.longitude,
			});
			void useChatStore.getState().fetchNotifications();
		}

		navigator.permissions?.query({ name: "geolocation" }).then((result) => {
			if (result.state === "granted") {
				if (cachedLocation) {
					return;
				}
				fetchLocation();
			} else if (result.state === "prompt") {
				if (cachedLocation) {
					return;
				}
				// setShowLocationPrompt(true);
				fetchLocation(undefined, { trackBrowserDecision: true });
			}
			// "denied" — skip silently
		}).catch(() => {
			if (cachedLocation) {
				return;
			}
			// setShowLocationPrompt(true);
			fetchLocation(undefined, { trackBrowserDecision: true });
		});
	}, [fetchLocation]);

	const handleCloseToast = useCallback(() => {
		setToast(null);
	}, [setToast]);

	const isWelcome = messages.length === 0;

	return (
		<div 
			className="flex h-svh w-full flex-col overflow-hidden text-foreground relative"
			style={{ background: isWelcome ? undefined : "var(--background)" }}
		>
			{/* Full-bleed farm scene under header when chat is empty */}
			{isWelcome && (
				<div
					className="pointer-events-none absolute inset-0 top-16 z-0 bg-cover bg-center bg-no-repeat"
					style={{ backgroundImage: "url(/assets/farm-welcome-bg.jpg)" }}
					aria-hidden
				/>
			)}
			{isWelcome && (
				<div
					className="pointer-events-none absolute inset-0 top-16 z-0 bg-gradient-to-b from-white/50 via-white/20 to-white/75 dark:from-slate-950/65 dark:via-slate-950/40 dark:to-slate-950/85"
					aria-hidden
				/>
			)}
			{toastData && (
				<Toast
					message={toastData.message}
					type={toastData.type}
					onClose={handleCloseToast}
				/>
			)}
			<ChatHeader
				title={t("appTitle") as string}
				subtitle="Government assistance and agriculture insights"
				rightAvatarUrl={CHAT_USER.avatar}
				rightLabel={CHAT_USER.name}
				onClearChat={clearChat}
				onOpenSettings={() => setSettingsOpen(true)}
				onBack={() => window.history.back()}
			/>
			{/* Only this area can scroll (via ChatShell/MessageList) */}
			<main className="relative z-10 min-h-0 flex-1 bg-transparent">
				<Outlet />
			</main>
			<div
				className={cn("relative z-20", isWelcome && "bg-transparent")}
				style={isWelcome ? undefined : { background: "var(--background)" }}
			>
				<ChatInput
					disabled={isInputLocked}
					placeholder={
						(isWelcome
							? (t("inputPlaceholderWelcome") as string)
							: (t("inputPlaceholder") as string)) || (t("inputPlaceholder") as string)
					}
					value={draft}
					onValueChange={setDraft}
					onSend={async (payload: ChatInputPayload) => {
						// Send stops mic first
						if (streamingEnabled && (isListening || streaming.isActive)) {
							endMicSession();
						}
						const { text, voice, files, mode } = payload;
						if (files && files.length > 0) {
							const imageFile = files[0];
							if (!imageFile) return;
							try {
								void mode;
								await sendImage(imageFile, language, t);
							} catch (error) {
								console.error(error);
							}
						} else if (text.trim()) {
							sendText(text, language, t);
						} else if (voice) {
							// Batch MediaRecorder path (gateway or REST inside sendAudio)
							try {
								await sendAudio(voice, sessionId || "", language, setLanguage);
							} catch (error) {
								console.error(error);
							}
						}
					}}
					onVoiceStart={handleVoiceStart}
					onVoiceStop={handleVoiceStop}
					onEndMicSession={endMicSession}
					isListening={isListening || streaming.isActive || streaming.isConnecting}
					isTranscribing={isTranscribing}
					streamingMode={streamingEnabled}
					pleaseSpeakNow={
						streamingEnabled &&
						(streaming.pleaseSpeakNow ||
							streaming.isConnecting ||
							(isListening &&
								!streaming.streamedText &&
								(streaming.phase === "connecting" ||
									streaming.phase === "warmup" ||
									streaming.phase === "detecting" ||
									streaming.phase === "idle")))
					}
					suggestions={isWelcome ? [] : suggestions}
					onSuggestionClick={(text: string) => sendText(text, language, t)}
					micHint={undefined}
					// Welcome has the large center mic only — never show a second footer mic there.
					// Footer mic appears only after the conversation starts (bot/user messages).
					hideMicButton={isWelcome}
					footerNote={t("disclaimerText") as string}
				/>
			</div>

			<SettingsDrawer
				open={settingsOpen}
				onOpenChange={setSettingsOpen}
			/>

			{/* Custom location permission popup disabled — using native browser prompt instead
			{showLocationPrompt && (
				<LocationPermissionDialog
					onAllow={() => {
						apiService.trackUiTelemetryEvent({
							event_name: "location_allowed",
							category: "location",
							metadata: {
								action: "allow"
							}
						});
						setShowLocationPrompt(false);
						fetchLocation(undefined, { trackBrowserDecision: true });
					}}
					onDismiss={(reason) => {
						apiService.trackUiTelemetryEvent({
							event_name: "location_denied",
							category: "location",
							metadata: {
								action: "deny",
								reason
							}
						});
						setShowLocationPrompt(false);
					}}
				/>
			)}
			*/}

		</div>
	);
}

export default ChatLayout;
