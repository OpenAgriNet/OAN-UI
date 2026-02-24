import { useEffect } from "react";
import { useChatStore } from "@/hooks/store/chat";
import { MessageList } from "./message-list";
import { WelcomePanel } from "./welcome-panel";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components";
import { startAnonymousSessionIfNeeded } from "@/lib/anonymous-bootstrap";
import { authState } from "@/hooks/store/auth";

export function ChatShell() {
	const { language, t } = useLanguage();
	const { user, isLoading: isAuthLoading } = useAuth();
	const messages = useChatStore((s) => s.messages);
	const quickActions = useChatStore((s) => s.quickActions);
	const isAssistantTyping = useChatStore((s) => s.isAssistantTyping);
	const sendQuickAction = useChatStore((s) => s.sendQuickAction);
	const sendQuickReply = useChatStore((s) => s.sendQuickReply);
	const initializeSession = useChatStore((s) => s.initializeSession);
	const generateQuickActions = useChatStore((s) => s.generateQuickActions);
	const sessionId = useChatStore((s) => s.sessionId);

	const showWelcome = messages.length === 0;

	// If /chat is loaded directly and auth isn't set, ensure anonymous
	// bootstrap runs as a safety net (in addition to the root bootstrap).
	useEffect(() => {
		if (!authState().isAuthed()) {
			startAnonymousSessionIfNeeded();
		}
	}, []);

	useEffect(() => {
		if (!sessionId && user) {
			initializeSession(user);
		}
	}, [sessionId, initializeSession, user]);

	useEffect(() => {
		generateQuickActions(t);
	}, [t, generateQuickActions]);

	if (isAuthLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center bg-background">
				<Loader />
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<div className="min-h-0 flex-1">
				<MessageList
					messages={messages}
					isAssistantTyping={isAssistantTyping}
					onQuickReply={(payload) => sendQuickReply(payload, language)}
					welcome={
						showWelcome ? (
							<WelcomePanel actions={quickActions} onAction={(id) => sendQuickAction(id, language)} />
						) : null
					}
				/>
			</div>

			{/* {isListening ? (
				<div className="mx-auto w-full max-w-3xl px-2 pb-2 sm:px-4">
					<ListeningIndicator />
				</div>
			) : null} */}
		</div>
	);
}
