import { useEffect } from "react";
import { useChatStore } from "@/hooks/store/chat";
import { MessageList } from "./message-list";
import { WelcomePanel } from "./welcome-panel";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components";
import { Button } from "@/components/ui/button";

const lockImg = "/assets/lockImg.svg";
const AGRISTACK_LOGIN_URL = "https://betafr.agristack.gov.in/farmer-registry-api-cg-qa-bh-21/bharat/v1/api/service/login";

export function ChatShell() {
	const { language, t } = useLanguage();
	const { user, isLoading: isAuthLoading } = useAuth();
	const messages = useChatStore((s) => s.messages);
	const quickActions = useChatStore((s) => s.quickActions);
	const isAssistantTyping = useChatStore((s) => s.isAssistantTyping);
	const sendQuickAction = useChatStore((s) => s.sendQuickAction);
	const sendQuickReply = useChatStore((s) => s.sendQuickReply);
	const initializeSession = useChatStore((s) => s.initializeSession);
	const ensureSessionId = useChatStore((s) => s.ensureSessionId);
	const setSessionIdValue = useChatStore((s) => s.setSessionIdValue);
	const clearSessionIdValue = useChatStore((s) => s.clearSessionIdValue);
	const setAgriStackLoggedIn = useChatStore((s) => s.setAgriStackLoggedIn);
	const setLoggedInFarmerId = useChatStore((s) => s.setLoggedInFarmerId);
	const loggedInFarmerId = useChatStore((s) => s.loggedInFarmerId);
	const generateQuickActions = useChatStore((s) => s.generateQuickActions);
	const sessionId = useChatStore((s) => s.sessionId);

	const showWelcome = messages.length === 0;
	const isUnauthenticated = !user;

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const callbackSessionId = params.get("callbackSessionId") || params.get("session_id");

		const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
		const isHardReload = nav?.type === "reload";
		if (isHardReload && !callbackSessionId) {
			clearSessionIdValue();
			setAgriStackLoggedIn(false);
			setLoggedInFarmerId(null);
		}

		if (callbackSessionId) {
			setSessionIdValue(callbackSessionId);
			setAgriStackLoggedIn(true);
		}
	}, [clearSessionIdValue, setSessionIdValue, setAgriStackLoggedIn, setLoggedInFarmerId]);

	useEffect(() => {
		if (!sessionId && user) {
			initializeSession(user);
		}
	}, [sessionId, initializeSession, user]);

	useEffect(() => {
		generateQuickActions(t);
	}, [t, generateQuickActions]);

	const loginWithAgriStack = () => {
		setAgriStackLoggedIn(false);
		setLoggedInFarmerId(null);
		const sid = ensureSessionId();
		const loginUrl = new URL(AGRISTACK_LOGIN_URL);
		loginUrl.searchParams.set("session_id", sid);
		window.location.href = loginUrl.toString();
	};

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
										{loggedInFarmerId ? (
											<p className="text-xs text-muted-foreground">Farmer ID: {loggedInFarmerId}</p>
										) : null}
										<Button onClick={loginWithAgriStack} className="mt-3">
											Login with AgriStack
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<MessageList
						messages={messages}
						isAssistantTyping={isAssistantTyping}
						onQuickReply={(payload) => sendQuickReply(payload, language, t)}
						welcome={
							showWelcome ? (
								<WelcomePanel
									actions={quickActions}
									onAction={(id) => sendQuickAction(id, language, t)}
									onLoginWithAgriStack={loginWithAgriStack}
									farmerId={loggedInFarmerId}
								/>
							) : null
						}
					/>
				)}
			</div>
		</div>
	);
}
