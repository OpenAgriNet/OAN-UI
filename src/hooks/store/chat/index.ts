import { create } from "zustand";
import type { ChatMessage, TextMessage } from "@/components/screens-component/chat-screen/components/bubbles/chat-types";

import { fetchSuggestions, type Suggestion } from "@/components/screens-component/chat-screen/api/suggestions-api";
import apiService from "@/lib/api-service";
import * as telemetry from "@/lib/telemetry";
import { randomPick, shuffle, filterVariableValues } from "@/lib/qa-utils";
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from "@/hooks/store/auth";
import type { ToastType } from "@/components/screens-component/chat-screen/components/toast";

import enData from "../../../../translations/en.json";
import guData from "../../../../translations/gu.json";
import hiData from "../../../../translations/hi.json";

const translations: Record<string, any> = {
	en: enData,
	gu: guData,
	hi: hiData,
	mr: enData
};

// Static set of QA templates and the variable placeholders they need
const QA_TEMPLATES: Array<{ key: string; vars?: string[] }> = [
  { key: "qa.market.price.today", vars: ["crop", "market"] },
  { key: "qa.market.price.modal", vars: ["crop", "district"] },
  { key: "qa.weather.forecast.5day" },
  { key: "qa.crop.weeds.management_practices", vars: ["crop"] },
  { key: "qa.livestock.health.mastitis_treatment", vars: ["animal"] },
  { key: "qa.fruit.irrigation.schedule", vars: ["fruit crop"] },
  { key: "qa.flowers.requirements.sunlight_and_shade", vars: ["Flower crop"] },
  { key: "qa.schemes.machinery.subsidy_how_to_get", vars: ["Scheme name"] }
];

/* eslint-disable no-unused-vars */
export type QuickAction = {
	id: string;
	title: string;
	description: string;
	icon: "tractor" | "wheat" | "cow" | "cloud";
	prompt: string;
};

type ChatStore = {
	messages: ChatMessage[];
	quickActions: QuickAction[];
	draft: string;
	suggestions: Suggestion[];
	isAssistantTyping: boolean;
	isListening: boolean;
	isTranscribing: boolean;
	isFetchingSuggestions: boolean;
	sessionId: string | null;
	initializeSession: (user: any) => void;
	sendText: (text: string, language: string) => Promise<void>;
	sendAudio: (blob: Blob, sessionId: string, language: string) => Promise<void>;
	sendQuickAction: (id: string, language: string) => void;
	sendQuickReply: (payload: string, language: string) => void;
	setDraft: (value: string) => void;
	startListening: () => void;
	stopListening: () => void;
	clearChat: () => void;
	setIsTranscribing: (value: boolean) => void;
	setSuggestions: (suggestions: Suggestion[]) => void;
	clearSuggestions: () => void;
	fetchSuggestionsForMessage: (messageId: string) => Promise<void>;
	generateQuickActions: (t: any) => void;
	playTTS: (text: string, language: string) => Promise<void>;
	submitMessageFeedback: (messageId: string, isPositive: boolean, reason?: string, feedback?: string, meta?: { serviceLabel?: string; rating?: number }) => Promise<void>;
	toast: { message: string; type: ToastType } | null;
	setToast: (toast: { message: string; type: ToastType } | null) => void;
	fetchLocation: (t: any) => void;
    getUserForTelemetry: () => { preferred_username: string; email: string };
};
/* eslint-enable no-unused-vars */

const QUICK_ACTION_COUNT = 5;

const KEYWORD_ICON_MAP: Array<{ icon: QuickAction["icon"]; keywords: string[] }> = [
	{
		icon: "cow",
		keywords: ["ગાય", "ભેંસ", "પશુ", "દૂધ", "cow", "buffalo", "animal", "milk", "mastitis", "calving", "bred", "pregnant", "yield", "calf", "calves", "production", "ઉત્પાદન"]
	},
	{
		icon: "wheat",
		keywords: ["પાક", "સજીવ", "crop", "cultivation", "organic", "soil"]
	},
	{
		icon: "cloud",
		keywords: ["હવામાન", "weather", "rain", "forecast"]
	}
];

function pickIconForQuestion(question: string): QuickAction["icon"] {
	const lowerQ = question.toLowerCase();
	return KEYWORD_ICON_MAP.find(m => m.keywords.some(k => lowerQ.includes(k)))?.icon
		|| randomPick(["tractor", "wheat", "cow", "cloud"] as const);
}

function toQuickAction(question: string, index: number): QuickAction {
	return {
		id: String(index + 1),
		title: question,
		description: "",
		icon: pickIconForQuestion(question),
		prompt: question
	};
}

function buildQuickActions(t: (key: string, params?: Record<string, string>) => string | string[]): QuickAction[] {
	const pinned = t("pinnedQuestions");
	const pinnedQuestions = Array.isArray(pinned)
		? pinned.filter((q): q is string => typeof q === "string")
		: [];
	const pinnedLimited = pinnedQuestions.slice(0, QUICK_ACTION_COUNT);
	const pinnedSet = new Set(pinnedLimited);
	const randomCount = Math.max(0, QUICK_ACTION_COUNT - pinnedLimited.length);

	const staticQuestions = t("questions");
	if (Array.isArray(staticQuestions) && staticQuestions.length >= 3) {
		const pool = staticQuestions.filter((q) => typeof q === "string" && !pinnedSet.has(q));
		const randomQuestions = shuffle(pool).slice(0, randomCount);
		return [...pinnedLimited, ...randomQuestions].slice(0, QUICK_ACTION_COUNT).map(toQuickAction);
	}

	const VARS = {
		crop: t("variables.crop") as string[],
		"fruit crop": t("variables.fruit crop") as string[],
		"Flower crop": t("variables.Flower crop") as string[],
		market: t("variables.market") as string[],
		district: t("variables.district") as string[],
		animal: t("variables.animal") as string[],
		"Scheme name": t("variables.Scheme name") as string[]
	} as const;

	const templateActions: QuickAction[] = shuffle(QA_TEMPLATES)
		.slice(0, randomCount)
		.map(({ key, vars }, index) => {
			let prompt = "";
			if (vars) {
				const params: Record<string, string> = {};
				vars.forEach(v => {
					const rawValues = (VARS as any)[v] as string[];
					if (rawValues) {
						const scopedValues = filterVariableValues(key, v, rawValues);
						params[v] = randomPick(scopedValues);
					} else {
						params[v] = "";
					}
				});
				prompt = t(key, params) as string;
			} else {
				prompt = t(key) as string;
			}

			let icon: QuickAction["icon"] = "tractor";
			if (key.includes("livestock")) icon = "cow";
			else if (key.includes("market") || key.includes("crop")) icon = "wheat";
			else if (key.includes("weather")) icon = "cloud";

			return {
				id: String(pinnedLimited.length + index + 1),
				title: prompt,
				description: "",
				icon,
				prompt
			};
		});

	return [...pinnedLimited.map(toQuickAction), ...templateActions].slice(0, QUICK_ACTION_COUNT);
}


function makeUserMessage(text: string): TextMessage {
	return {
		id: crypto.randomUUID(),
		role: "user",
		type: "text",
		text,
		status: "sent",
		createdAt: new Date().toISOString()
	};
}

function makeAssistantMessage(text: string, isError = false, showListenRow = false): ChatMessage {
	return {
		id: crypto.randomUUID(),
		role: "assistant",
		type: "card",
		body: text,
		createdAt: new Date().toISOString(),
		showListenRow,
		isError
	};
}

function normalizeAssistantBodyForDisplay(text: string): string {
	// Backend guardrail prefixes milk-collection payloads with a success line.
	// Remove that prefix so the chat starts directly with markdown sections/tables.
	return text.replace(/^Farmer milk collection details fetched successfully:\s*\n*/i, "");
}

import { playTTS as playTTSHelper } from "@/lib/audio-utils";
import { ANONYMOUS_BOOTSTRAP_SESSION_KEY } from "@/lib/anonymous-bootstrap";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSuggestionsWithRetry(
	sessionId: string,
	language: string,
	isStale?: () => boolean,
) {
	const retryDelaysMs = [300, 700, 1200, 2000];
	for (let attempt = 0; attempt < retryDelaysMs.length; attempt++) {
		if (isStale?.()) return [];
		const suggestions = await apiService.getSuggestions(sessionId, language);
		if (suggestions.length > 0) {
			return suggestions;
		}
		await wait(retryDelaysMs[attempt] ?? 0);
	}
	if (isStale?.()) return [];
	return await apiService.getSuggestions(sessionId, language);
}

export const useChatStore = create<ChatStore>((set, get) => ({
	messages: [],
	quickActions: [],
	draft: "",
	suggestions: [],
	isAssistantTyping: false,
	isListening: false,
	isTranscribing: false,
	isFetchingSuggestions: false,
	sessionId: null,
	toast: null,

	setToast: (toast) => set({ toast }),

	initializeSession: (user) => {
		const sid =
			(typeof sessionStorage !== "undefined" &&
				sessionStorage.getItem(ANONYMOUS_BOOTSTRAP_SESSION_KEY)) ||
			uuidv4();
		if (typeof sessionStorage !== "undefined") {
			sessionStorage.removeItem(ANONYMOUS_BOOTSTRAP_SESSION_KEY);
		}
		set({ sessionId: sid });
		apiService.setSessionId(sid);
		try {
			telemetry.startTelemetry(sid, { 
				preferred_username: user?.user_metadata?.name || user?.email || "guest", 
				email: user?.email || "" 
			});
		} catch (e) {
			console.warn("Telemetry failed to start", e);
		}
	},

    getUserForTelemetry: () => {
        const user = useAuthStore.getState().user;
        return {
            preferred_username: user?.user_metadata?.name || user?.email || "guest",
            email: user?.email || ""
        };
    },

	setDraft: (value) => set(() => ({ draft: value })),

	fetchLocation: (t) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const locationData = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					};
					apiService.setLocationData(locationData);
				},
				(error) => {
					console.log("Unable to retrieve location:", error, t);
					// Localized toasts for location errors could be added here if needed
				}
			);
		}
	},

	setIsTranscribing: (value) => set(() => ({ isTranscribing: value })),
	setSuggestions: (suggestions) => set({ suggestions }),
	clearSuggestions: () => set({ suggestions: [] }),

	startListening: () => set(() => ({ isListening: true })),
	stopListening: () => set(() => ({ isListening: false })),

	clearChat: () =>
		set(() => ({
			messages: [],
			draft: "",
			suggestions: [],
			isAssistantTyping: false,
			isListening: false,
			isTranscribing: false,
			isFetchingSuggestions: false
		})),

	sendText: async (text, language) => {
		const trimmed = text.trim();
		if (!trimmed) return;

		const questionId = uuidv4(); // Generate early to attach to message
		const userMessage = makeUserMessage(trimmed);
		userMessage.questionId = questionId; // Attach questionId
		userMessage.questionText = trimmed;
		set((state) => ({
			messages: [...state.messages, userMessage],
			draft: "",
			suggestions: [],
			isAssistantTyping: true
		}));

		const { sessionId } = get();
		const currentSession = sessionId || uuidv4();
		if (!sessionId) {
			set({ sessionId: currentSession });
			apiService.setSessionId(currentSession);
		}

		telemetry.markServerRequestStart(questionId);
		try {
			const userDetails = get().getUserForTelemetry();
			await telemetry.startTelemetry(currentSession, userDetails);
			telemetry.logQuestionEvent(questionId, currentSession, trimmed);
			telemetry.endTelemetry();
		} catch (e) {
			console.warn("Telemetry failed (question event)", e);
		}

		try {
			let streamingText = "";
			let inlineSuggestions: string[] | null = null;
			const _response = await apiService.sendUserQuery(
				trimmed,
				currentSession,
				language, // source
				language, // target
				(chunk) => {
					// Check for inline suggestions tag from backend
					const combined = streamingText + chunk;
					const sugStart = combined.indexOf("__SUGGESTIONS__");
					if (sugStart !== -1) {
						const sugEnd = combined.indexOf("__END_SUGGESTIONS__");
						if (sugEnd !== -1) {
							// Extract suggestions JSON, strip tag from display text
							const jsonStr = combined.slice(sugStart + "__SUGGESTIONS__".length, sugEnd);
							try {
								inlineSuggestions = JSON.parse(jsonStr);
							} catch (e) {
								console.warn("Failed to parse inline suggestions", e);
							}
							streamingText = combined.slice(0, sugStart);
						} else {
							// Tag started but not ended yet — buffer without updating UI
							streamingText = combined;
							return;
						}
					} else {
						streamingText += chunk;
					}

					set((state) => {
						const displayBody = normalizeAssistantBodyForDisplay(streamingText);
						const lastMsg = state.messages[state.messages.length - 1];
						if (lastMsg && lastMsg.role === "assistant" && lastMsg.type === "card") {
							return {
								messages: [
									...state.messages.slice(0, -1),
									{ ...lastMsg, body: displayBody }
								]
							};
						} else {
							return {
								messages: [...state.messages, { ...makeAssistantMessage(displayBody), questionId, questionText: trimmed }]
							};
						}
					});
				}
			);

			set((state) => {
				const lastMsg = state.messages[state.messages.length - 1];
				if (lastMsg && lastMsg.role === "assistant" && lastMsg.type === "card") {
					return {
						messages: [
							...state.messages.slice(0, -1),
							{ ...lastMsg, showListenRow: true }
						],
						isAssistantTyping: false
					};
				}
				return { isAssistantTyping: false };
			});

			// Use inline suggestions from stream if available, fall back to API
			const parsedInlineSuggestions = Array.isArray(inlineSuggestions) ? inlineSuggestions : [];
			if (parsedInlineSuggestions.length > 0) {
				set({ suggestions: parsedInlineSuggestions.map((q: string) => ({ id: uuidv4(), text: q, label: q })) });
			} else {
				// Abort retries early if a new turn started (bounds the worst-case
				// retry tail and prevents stale suggestions overwriting a newer turn).
				const isStale = () =>
					get().sessionId !== currentSession || get().isAssistantTyping;
				const suggestions = await fetchSuggestionsWithRetry(currentSession, language, isStale);
				if (!isStale()) {
					set({ suggestions: suggestions.map(s => ({ id: uuidv4(), text: s.question, label: s.question })) });
				}
			}

			// Show success for text completion if needed, though usually silent is better for chat.
			// But user asked for success too
			// set({ toast: { message: "Response received", type: "success" } });

		} catch (error: any) {
			console.error("Error sending text:", error);
			set({ isAssistantTyping: false });
			
			const isRateLimitError = error?.status === 429 || error?.response?.status === 429 || (error instanceof Error && error.message.includes('Rate limit'));
			
			if (isRateLimitError) {
				const currentLang = language || "en";
				const tData = translations[currentLang] || translations["en"];
				const limitMessage = tData.limitMessage || "Dear user, you have reached the allotted question limit for today. You may continue to explore the other features of the Amul AI app.";
				
				set((state) => ({
					messages: [...state.messages, makeAssistantMessage(limitMessage, true, true)]
				}));
				try { telemetry.logErrorEvent(questionId, currentSession, "Rate limit error (429)"); } catch (e) { console.warn("Telemetry failed (error event)", e); }
			} else {
				set({ toast: { message: "Sorry, there was an error processing your request. Please try again.", type: "error" } });
				try { telemetry.logErrorEvent(questionId, currentSession, String(error)); } catch (e) { console.warn("Telemetry failed (error event)", e); }
			}
		}
	},

	fetchSuggestionsForMessage: async (messageId) => {
		set({ isFetchingSuggestions: true });
		try {
			const suggestions = await fetchSuggestions(messageId);
			set({ suggestions, isFetchingSuggestions: false });
		} catch (error) {
			console.error("Error fetching suggestions:", error);
			set({ isFetchingSuggestions: false });
			set({ toast: { message: "Failed to load suggestions.", type: "error" } });
		}
	},

	sendAudio: async (blob, sessionId, language) => {
		if (!blob) return;
		
		set({ isTranscribing: true });

		try {
			const base64Audio = await apiService.blobToBase64(blob);
			const transcription = await apiService.transcribeAudio(base64Audio, sessionId, language);
			
			if (transcription && transcription.text) {
				set((state) => ({
					draft: state.draft ? `${state.draft} ${transcription.text}` : transcription.text,
					isTranscribing: false
				}));
				set({ toast: { message: "Transcribed successfully", type: "success" } });
			} else {
				set({ isTranscribing: false });
			}
		} catch (error) {
			console.error("Transcription error:", error);
			set({ isAssistantTyping: false, isTranscribing: false });
			set({ toast: { message: "Transcription failed. Please try again.", type: "error" } });
			throw error;
		}
	},

	sendQuickAction: (id, language) => {
		const action = get().quickActions.find((qa) => qa.id === id);
		if (!action) return;
		get().sendText(action.prompt, language);
	},

	sendQuickReply: (payload, language) => {
		get().sendText(payload, language);
	},

	generateQuickActions: (t) => {
		set({ quickActions: buildQuickActions(t) });
	},

	playTTS: async (text, language) => {
		const { sessionId } = get();
		if (!sessionId) return;
		try {
			await playTTSHelper(text, language, sessionId);
		} catch (error) {
			console.error("TTS Playback failed:", error);
			set({ toast: { message: "Error Playing Audio. Please try again.", type: "error" } });
		}
	},

	submitMessageFeedback: async (messageId, isPositive, reason, feedback, meta) => {
		const { sessionId, messages } = get();
		if (!sessionId) return;

		const msg = messages.find(m => m.id === messageId);
		if (!msg) return;

		const feedbackQuestionId = msg.questionId || messageId;
		const userMsg = messages.findLast((m) => m.role === 'user' && m.questionId === msg.questionId);
		const questionText = userMsg && userMsg.type === 'text' ? userMsg.text : "";
		const responseText = msg && msg.type === 'card' ? msg.body : "";
		const feedbackType = isPositive ? "like" : "dislike";
		const feedbackMsg = isPositive ? "Liked the response" : (feedback || reason || "Negative feedback");
		const feedbackMeta = meta;

		try {
			const user = useAuthStore.getState().user;
			await telemetry.startTelemetry(sessionId, {
				preferred_username: user?.user_metadata?.name || user?.email || "guest",
				email: user?.email || ""
			});
			telemetry.logFeedbackEvent(
				feedbackQuestionId,
				sessionId,
				feedbackMsg,
				feedbackType,
				questionText,
				responseText,
				feedbackMeta
			);
			telemetry.endTelemetry();
		} catch (e) {
			console.warn("Telemetry failed (feedback)", e);
		}

		if (isPositive) {
			set({ toast: { message: "Thank you for your feedback! We're glad this response was helpful.", type: "success" } });
		} else {
			set({ toast: { message: "Thank you for your feedback. We'll use it to improve our responses.", type: "success" } });
		}
	}
}));
