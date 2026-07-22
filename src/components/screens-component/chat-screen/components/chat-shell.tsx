import { useEffect } from "react";
import { useChatStore } from "@/hooks/store/chat";
import { MessageList } from "./message-list";
import { WelcomePanel } from "./welcome-panel";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components";

const lockImg = "/assets/lockImg.svg";

export function ChatShell() {
	const { language, t } = useLanguage();
	const { user, isLoading: isAuthLoading } = useAuth();
	const messages = useChatStore((s) => s.messages);
	const quickActions = useChatStore((s) => s.quickActions);
	const isAssistantTyping = useChatStore((s) => s.isAssistantTyping);
	const isInputLocked = useChatStore((s) => s.isInputLocked);
	const isTranscribing = useChatStore((s) => s.isTranscribing);
	const isListening = useChatStore((s) => s.isListening);
	const sendQuickAction = useChatStore((s) => s.sendQuickAction);
	const sendQuickReply = useChatStore((s) => s.sendQuickReply);
	const initializeSession = useChatStore((s) => s.initializeSession);
	const generateQuickActions = useChatStore((s) => s.generateQuickActions);
	const requestMicStart = useChatStore((s) => s.requestMicStart);
	const requestMicFinish = useChatStore((s) => s.requestMicFinish);
	const sessionId = useChatStore((s) => s.sessionId);

	const showWelcome = messages.length === 0;
	const isUnauthenticated = !user;

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
				{isUnauthenticated && showWelcome ? (
					<div className="flex h-full items-center justify-center p-4">
						<div
							style={{
								padding: "1px",
								background: "var(--primary)",
								borderRadius: "24px",
								width: "100%",
								maxWidth: "350px"
							}}
						>
							<div
								style={{
									background: "var(--brand-900)",
									borderRadius: "23px",
									overflow: "hidden",
									position: "relative"
								}}
								className="w-full"
							>
								<div
									style={{ backgroundColor: "rgba(128, 128, 128, 0.08)" }}
									className="flex w-full flex-col items-center space-y-6 p-10 text-center"
								>
									<img src={lockImg} alt="Locked" className="h-16 w-16" />

									<div className="space-y-2">
										<h1 className="text-2xl font-bold text-foreground">{t("auth.loginRequired")}</h1>
										<p className="text-sm font-normal leading-relaxed text-muted-foreground px-2">
											{t("auth.loginPrompt")}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : showWelcome ? (
					/* Full-bleed voice-first landing (farm bg + large mic) */
					<WelcomePanel
						actions={quickActions}
						onAction={(id) => sendQuickAction(id, language, t)}
						onMicClick={() => {
							// Tap once to start; tap again to stop + send (no recording bar)
							if (isListening) {
								requestMicFinish();
							} else {
								requestMicStart();
							}
						}}
						micDisabled={isInputLocked || isTranscribing}
						isListening={isListening}
					/>
				) : (
					<MessageList
						messages={messages}
						isAssistantTyping={isAssistantTyping}
						onQuickReply={(payload) => sendQuickReply(payload, language, t)}
					/>
				)}
			</div>
		</div>
	);
}
