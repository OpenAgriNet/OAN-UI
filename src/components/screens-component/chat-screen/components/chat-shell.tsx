import { useEffect } from "react";
import { useChatStore, type QuickAction } from "@/hooks/store/chat";
import { MessageList } from "./message-list";
import { WelcomePanel } from "./welcome-panel";
import type { ChatMessage } from "./bubbles/chat-types";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components";
import { startAnonymousSessionIfNeeded } from "@/lib/anonymous-bootstrap";
import { authState } from "@/hooks/store/auth";

// Stable empty list for the question-list view, so MessageList's effects
// (scroll-to-top, telemetry) don't re-run on every store update while it shows.
const NO_MESSAGES: ChatMessage[] = [];

export function ChatShell() {
	const { language, t } = useLanguage();
	const { user, isLoading: isAuthLoading } = useAuth();
	const messages = useChatStore((s) => s.messages);
	const quickActions = useChatStore((s) => s.quickActions);
	const isAssistantTyping = useChatStore((s) => s.isAssistantTyping);
	const showQuestionList = useChatStore((s) => s.showQuestionList);
	const sendQuickAction = useChatStore((s) => s.sendQuickAction);
	const sendQuickReply = useChatStore((s) => s.sendQuickReply);
	const initializeSession = useChatStore((s) => s.initializeSession);
	const generateQuickActions = useChatStore((s) => s.generateQuickActions);
	const sessionId = useChatStore((s) => s.sessionId);
	const persona = useChatStore((s) => s.persona);

	// AMUL-78: the welcome list also comes back over an existing conversation
	// (header back button / pill above the input). The messages stay in the
	// store, and picking a question sends it into the same chat.
	const showWelcome = messages.length === 0 || showQuestionList;
	const handleWelcomeAction = (action: QuickAction) => {
		if (action.kind === "open_faq_panel") {
			window.dispatchEvent(new CustomEvent("open-faq-panel"));
			return;
		}
		sendQuickAction(action.id, language);
	};

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
			<div className="flex h-full w-full items-center justify-center bg-white">
				<Loader />
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<div className="min-h-0 flex-1">
				<MessageList
					messages={showWelcome ? NO_MESSAGES : messages}
					isAssistantTyping={!showWelcome && isAssistantTyping}
					onQuickReply={(payload) => sendQuickReply(payload, language)}
					welcome={
						showWelcome ? (
							<WelcomePanel actions={quickActions} onAction={handleWelcomeAction} persona={persona} />
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
