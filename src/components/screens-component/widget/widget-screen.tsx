import { useCallback, useEffect, useMemo } from "react";

import { useLanguage } from "@/components/LanguageProvider";
import {
	ChatInput,
	type ChatInputPayload
} from "@/components/screens-component/chat-screen/components/chat-input";
import { MessageList } from "@/components/screens-component/chat-screen/components/message-list";
import { Toast } from "@/components/screens-component/chat-screen/components/toast";
import { CHAT_ASSISTANT } from "@/components/screens-component/chat-screen/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { useChatStore } from "@/hooks/store/chat";
import { getWidgetHost } from "@/lib/widget-hosts";

type WidgetScreenProps = {
	hostId: string;
};

function WidgetWelcome() {
	const { t } = useLanguage();

	return (
		<section className="mx-auto flex max-w-sm flex-col items-center gap-3 px-6 text-center">
			<Avatar className="size-16 shadow-sm">
				<AvatarImage src={CHAT_ASSISTANT.avatar} alt="Amul AI" className="object-contain" />
				<AvatarFallback>AI</AvatarFallback>
			</Avatar>
			<div className="flex flex-col gap-1.5">
				<h1 className="text-lg font-semibold text-foreground">Amul AI</h1>
				<p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
					{t("widget.welcome") as string}
				</p>
			</div>
		</section>
	);
}

export function WidgetScreen({ hostId }: WidgetScreenProps) {
	const host = getWidgetHost(hostId);
	const { language, t } = useLanguage();
	const { isLoading: isAuthLoading } = useAuth();
	const messages = useChatStore((state) => state.messages);
	const draft = useChatStore((state) => state.draft);
	const setDraft = useChatStore((state) => state.setDraft);
	const sendText = useChatStore((state) => state.sendText);
	const sendAudio = useChatStore((state) => state.sendAudio);
	const sendQuickReply = useChatStore((state) => state.sendQuickReply);
	const initializeSession = useChatStore((state) => state.initializeSession);
	const sessionId = useChatStore((state) => state.sessionId);
	const isListening = useChatStore((state) => state.isListening);
	const isTranscribing = useChatStore((state) => state.isTranscribing);
	const isAssistantTyping = useChatStore((state) => state.isAssistantTyping);
	const startListening = useChatStore((state) => state.startListening);
	const stopListening = useChatStore((state) => state.stopListening);
	const toastData = useChatStore((state) => state.toast);
	const setToast = useChatStore((state) => state.setToast);

	const advisoryQuestions = useMemo(() => {
		const translated = t("widget.advisoryQuestions");
		if (!Array.isArray(translated)) return [];
		return translated.slice(0, 5).map((question, index) => ({
			id: `widget-advisory-${index + 1}`,
			text: question,
			label: question
		}));
	}, [t]);

	useEffect(() => {
		document.title = host ? `Amul AI · ${host.partnerName}` : "Amul AI widget";
	}, [host]);

	useEffect(() => {
		if (!host || isAuthLoading || sessionId) return;
		initializeSession({
			is_guest_user: true,
			userType: "farmer",
			user_metadata: { name: `widget:${host.hostId}` }
		});
	}, [host, initializeSession, isAuthLoading, sessionId]);

	const closeToast = useCallback(() => setToast(null), [setToast]);

	if (!host) {
		return (
			<main className="flex h-svh items-center justify-center bg-background p-6 text-center">
				<div className="flex max-w-xs flex-col gap-2">
					<h1 className="text-base font-semibold text-foreground">Widget unavailable</h1>
					<p className="text-sm text-muted-foreground">This Amul AI host ID is not registered.</p>
				</div>
			</main>
		);
	}

	if (isAuthLoading) {
		return (
			<div className="flex h-svh items-center justify-center bg-background">
				<Loader />
			</div>
		);
	}

	const handleSend = async ({ text, voice }: ChatInputPayload) => {
		if (text.trim()) {
			await sendText(text, language);
			return;
		}
		if (voice) await sendAudio(voice, useChatStore.getState().sessionId ?? "", language);
	};

	return (
		<div
			className="flex h-svh w-full flex-col overflow-hidden bg-background text-foreground"
			data-widget-host-id={host.hostId}
		>
			{toastData ? (
				<Toast message={toastData.message} type={toastData.type} onClose={closeToast} />
			) : null}

			<main className="min-h-0 flex-1">
				{messages.length === 0 ? (
					<div className="flex h-full items-center justify-center">
						<WidgetWelcome />
					</div>
				) : (
					<MessageList
						messages={messages}
						isAssistantTyping={isAssistantTyping}
						onQuickReply={(payload) => sendQuickReply(payload, language)}
					/>
				)}
			</main>

			<ChatInput
				placeholder={t("inputPlaceholder") as string}
				value={draft}
				onValueChange={setDraft}
				onSend={handleSend}
				onVoiceStart={startListening}
				onVoiceStop={stopListening}
				isListening={isListening}
				isTranscribing={isTranscribing}
				isAssistantTyping={isAssistantTyping}
				suggestions={advisoryQuestions}
				onSuggestionClick={(question) => sendText(question, language)}
			/>
		</div>
	);
}
