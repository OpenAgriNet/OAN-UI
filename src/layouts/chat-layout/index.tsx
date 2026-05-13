import { ChatHeader } from "@/components/screens-component/layouts/chat-header";
import { ChatInput, type ChatInputPayload } from "@/components/screens-component/chat-screen/components/chat-input";
import { CHAT_USER } from "@/components/screens-component/chat-screen/config";
import { useChatStore } from "@/hooks/store/chat";
import { Outlet } from "@tanstack/react-router";
import { useLanguage } from "@/components/LanguageProvider";
import { useCallback, useEffect, useState } from "react";
import { Toast } from "@/components/screens-component/chat-screen/components/toast";
import { SettingsDrawer } from "@/components/screens-component/chat-screen/components/settings-drawer";

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

	const { language, t } = useLanguage();
	const [settingsOpen, setSettingsOpen] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined" || !navigator.geolocation) {
			return;
		}

		let cancelled = false;

		const requestLocation = () => {
			if (!cancelled) fetchLocation(t);
		};

		// If the Permissions API is available, check the current state first.
		// - "granted"  → fetch silently (no prompt shown to user)
		// - "prompt"   → actively request so the browser shows the permission dialog
		// - "denied"   → skip (user has blocked it; don't bother)
		if (navigator.permissions?.query) {
			void navigator.permissions
				.query({ name: "geolocation" as PermissionName })
				.then((status) => {
					if (status.state === "granted" || status.state === "prompt") {
						requestLocation();
					}
				})
				.catch(() => {
					// Fallback: just try — the browser will show its own prompt.
					requestLocation();
				});
		} else {
			// Permissions API not available — request directly.
			requestLocation();
		}

		return () => {
			cancelled = true;
		};
	}, [fetchLocation, t]);

	const handleCloseToast = useCallback(() => {
		setToast(null);
	}, [setToast]);

	return (
		<div 
			className="flex h-svh w-full flex-col overflow-hidden text-foreground relative"
			style={{ background: 'var(--background)' }}
		>
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
			<main className="min-h-0 flex-1 bg-transparent">
				<Outlet />
			</main>
			<div className="relative z-20">
				<ChatInput
					disabled={isInputLocked}
					placeholder={t("inputPlaceholder") as string}
					value={draft}
					onValueChange={setDraft}
					onSend={async (payload: ChatInputPayload) => {
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
							try {
								await sendAudio(voice, sessionId || '', language);
							} catch (error) {
								console.error(error);
							}
						}
					}}
					onVoiceStart={startListening}
					onVoiceStop={stopListening}
					isListening={isListening}
					isTranscribing={isTranscribing}
					suggestions={suggestions}
					onSuggestionClick={(text: string) => sendText(text, language, t)}
					micHint={messages.length > 0 ? undefined : (t("chatMicHint") as string)}
					footerNote={t("disclaimerText") as string}
				/>
			</div>

			<SettingsDrawer 
				open={settingsOpen} 
				onOpenChange={setSettingsOpen} 
			/>
		</div>
	);
}

export default ChatLayout;
