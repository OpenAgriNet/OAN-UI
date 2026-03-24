import { ChatHeader } from "@/components/screens-component/layouts/chat-header";
import { ChatInput, type ChatInputPayload } from "@/components/screens-component/chat-screen/components/chat-input";
import { CHAT_ASSISTANT, CHAT_USER } from "@/components/screens-component/chat-screen/config";
import { useChatStore } from "@/hooks/store/chat";
import { Outlet } from "@tanstack/react-router";
import { useLanguage } from "@/components/LanguageProvider";
import { useCallback, useState, useEffect } from "react";
import { Toast } from "@/components/screens-component/chat-screen/components/toast";
import { SettingsDrawer } from "@/components/screens-component/chat-screen/components/settings-drawer";
import { ProfileDialog } from "@/components/screens-component/profile/profile-dialog";
import { FarmerAlert } from "@/components/screens-component/chat-screen/components/farmer-alert";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/apis/profile";

function ChatLayout() {
	const sessionId = useChatStore((s) => s.sessionId);
	const clearChat = useChatStore((s) => s.clearChat);
	const draft = useChatStore((s) => s.draft);
	const setDraft = useChatStore((s) => s.setDraft);
	const sendText = useChatStore((s) => s.sendText);
	const sendAudio = useChatStore((s) => s.sendAudio);
	const isListening = useChatStore((s) => s.isListening);
	const isTranscribing = useChatStore((s) => s.isTranscribing);
	const isAssistantTyping = useChatStore((s) => s.isAssistantTyping);
	const startListening = useChatStore((s) => s.startListening);
	const stopListening = useChatStore((s) => s.stopListening);
	const suggestions = useChatStore((s) => s.suggestions);
	const messages = useChatStore((s) => s.messages);
	const toastData = useChatStore((s) => s.toast);
	const setToast = useChatStore((s) => s.setToast);
	const fetchLocation = useChatStore((s) => s.fetchLocation);

	const { language, t } = useLanguage();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);

	const { user } = useAuth();
	const { data: profileData } = useUserProfile();

	const isAnonymous = !user || user.is_guest_user || user.username === "Anonymous User";
	const displayName = isAnonymous ? "" : user?.username || "";

	// Determine alert state
	const showWarningAlert =
		!isAnonymous &&
		profileData &&
		(profileData.status === "error" || profileData.status === "not_found");

	useEffect(() => {
		fetchLocation(t);
	}, [fetchLocation, t]);

	const handleCloseToast = useCallback(() => {
		setToast(null);
	}, [setToast]);

	return (
		<div className="flex h-svh w-full flex-col overflow-hidden layout-gradient text-foreground relative">
			{toastData && (
				<Toast
					message={toastData.message}
					type={toastData.type}
					onClose={handleCloseToast}
				/>
			)}
			<ChatHeader
				title={CHAT_ASSISTANT.name}
				subtitle="Government assistance and agriculture insights"
				leftAvatarUrl={CHAT_ASSISTANT.avatar}
				rightAvatarUrl={CHAT_USER.avatar}
				rightLabel={displayName}
				onClearChat={clearChat}
				onOpenProfile={() => setProfileOpen(true)}
				onOpenSettings={() => setSettingsOpen(true)}
				onBack={() => window.history.back()}
			/>

			{/* Alert cards */}
			{showWarningAlert && profileData.status === "error" && (
				<FarmerAlert
					variant="error"
					message="Your session may have expired. Please reload the app and sign in again."
					actionLabel="Reload"
					onAction={() => window.location.reload()}
					dismissible={false}
				/>
			)}
			{showWarningAlert && profileData.status === "not_found" && (
				<FarmerAlert
					variant="warning"
					message="We couldn't fetch your farm data. Some features may be limited."
				/>
			)}

			{/* Only this area can scroll (via ChatShell/MessageList) */}
			<main className="min-h-0 flex-1 bg-transparent">
				<Outlet />
			</main>
			<div className="relative z-20">
				<ChatInput
					placeholder={t("inputPlaceholder") as string}
					value={draft}
					onValueChange={setDraft}
					onSend={async (payload: ChatInputPayload) => {
						const { text, voice } = payload;
						if (text.trim()) {
							sendText(text, language);
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
					isAssistantTyping={isAssistantTyping}
					suggestions={suggestions}
					onSuggestionClick={(text: string) => sendText(text, language)}
					micHint={messages.length > 0 ? undefined : (t("chatMicHint") as string)}
					footerNote={t("disclaimerText") as string}
				/>
			</div>

			<SettingsDrawer
				open={settingsOpen}
				onOpenChange={setSettingsOpen}
			/>

			<ProfileDialog
				open={profileOpen}
				onOpenChange={setProfileOpen}
			/>
		</div>
	);
}

export default ChatLayout;
