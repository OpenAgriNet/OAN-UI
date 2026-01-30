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

const translations: Record<string, any> = {
	en: enData,
	gu: guData,
	hi: enData,
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
	submitMessageFeedback: (messageId: string, isPositive: boolean, reason?: string, feedback?: string) => Promise<void>;
	toast: { message: string; type: ToastType } | null;
	setToast: (toast: { message: string; type: ToastType } | null) => void;
	fetchLocation: (t: any) => void;
    getUserForTelemetry: () => { preferred_username: string; email: string };
};
/* eslint-enable no-unused-vars */

const quickActionSeeds: QuickAction[] = [
	{
		id: "1",
		title: "What is the treatment for Mastitis in cow?",
		description: "",
		icon: "cow",
		prompt: "What is the treatment for Mastitis in cow?"
	},
	{
		id: "2",
		title: "What is the today’s price of amaranth in APMC Mumbai?",
		description: "",
		icon: "wheat",
		prompt: "What is the today’s price of amaranth in APMC Mumbai?"
	},
	{
		id: "3",
		title: "What is the ideal irrigation schedule for muskmelon?",
		description: "",
		icon: "cloud", 
		prompt: "What is the ideal irrigation schedule for muskmelon?"
	}
];

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

import { playTTS as playTTSHelper } from "@/lib/audio-utils";

export const useChatStore = create<ChatStore>((set, get) => ({
	messages: [],
	quickActions: quickActionSeeds,
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
		const sid = uuidv4();
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



		// const questionId = uuidv4(); // Already generated above
		telemetry.markServerRequestStart(questionId); // Start timing
        
        // Start telemetry session for Question Event
        const userDetails = get().getUserForTelemetry();
        await telemetry.startTelemetry(currentSession, userDetails);
		telemetry.logQuestionEvent(questionId, currentSession, trimmed);
        telemetry.endTelemetry(); // End session for Question Event


		try {
			// In a real app we'd detect language, here we use what's passed
			let streamingText = "";
			const _response = await apiService.sendUserQuery(
				trimmed,
				currentSession,
				language, // source
				language, // target
				(chunk) => {
					streamingText += chunk;
					set((state) => {
						const lastMsg = state.messages[state.messages.length - 1];
						if (lastMsg && lastMsg.role === "assistant" && lastMsg.type === "card") {
							return {
								messages: [
									...state.messages.slice(0, -1),
									{ ...lastMsg, body: streamingText }
								]
							};
						} else {
							return {
								messages: [...state.messages, { ...makeAssistantMessage(streamingText), questionId, questionText: trimmed }]
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
            
            // Start telemetry session for Response Event (wait for render)
             const userDetailsResponse = get().getUserForTelemetry();
             await telemetry.startTelemetry(currentSession, userDetailsResponse);
             await telemetry.endTelemetryWithWait(questionId);
			// telemetry.logResponseEvent(questionId, currentSession, trimmed, response.response); // Moved to message-list for render timing
			
			const suggestions = await apiService.getSuggestions(currentSession, language);
			set({ suggestions: suggestions.map(s => ({ id: uuidv4(), text: s.question, label: s.question })) });

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
				telemetry.logErrorEvent(questionId, currentSession, "Rate limit error (429)");
			} else {
				set({ toast: { message: "Sorry, there was an error processing your request. Please try again.", type: "error" } });
				telemetry.logErrorEvent(questionId, currentSession, String(error));
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

	sendAudio: async (blob, sessionId) => {
		if (!blob) return;
		
		set({ isTranscribing: true });

		try {
			const base64Audio = await apiService.blobToBase64(blob);
			const transcription = await apiService.transcribeAudio(base64Audio, 'bhashini', sessionId);
			
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
		const staticQuestions = t("questions");
		
		if (Array.isArray(staticQuestions) && staticQuestions.length >= 3) {
			// If we have a static list of questions (like for Gujarati or English), use them
			const newActions: QuickAction[] = shuffle(staticQuestions)
				.slice(0, 3)
				.map((question, index) => {
					// Map based on keywords or random
					const lowerQ = question.toLowerCase();
					const KEYWORD_MAP: Array<{ icon: QuickAction["icon"]; keywords: string[] }> = [
						{
							icon: "cow",
							keywords: ["ગાય", "ભેંસ", "પશુ", "દૂધ", "cow", "buffalo", "animal", "milk", "mastitis", "calving", "bred", "pregnant", "yield", "calf", "calves"]
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

					let icon = KEYWORD_MAP.find(m => m.keywords.some(k => lowerQ.includes(k)))?.icon || randomPick(["tractor", "wheat", "cow", "cloud"] as const);

					return {
						id: String(index + 1),
						title: question,
						description: "",
						icon,
						prompt: question
					};
				});
			set({ quickActions: newActions });
			return;
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

		const newActions: QuickAction[] = shuffle(QA_TEMPLATES)
			.slice(0, 3)
			.map(({ key, vars }, index) => {
				let prompt = "";
				if (vars) {
					const params: Record<string, string> = {};
					vars.forEach(v => {
						const rawValues = (VARS as any)[v] as string[];
						// Defensive check because translation might be missing for some languages
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

				// Map key prefix to icon
				let icon: QuickAction["icon"] = "tractor";
				if (key.includes("livestock")) icon = "cow";
				else if (key.includes("market") || key.includes("crop")) icon = "wheat";
				else if (key.includes("weather")) icon = "cloud";

				return {
					id: String(index + 1),
					title: prompt,
					description: "",
					icon,
					prompt
				};
			});

		set({ quickActions: newActions });
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

	submitMessageFeedback: async (messageId, isPositive, reason, feedback) => {
		const { sessionId, messages } = get();
		if (!sessionId) return;

		const msg = messages.find(m => m.id === messageId);
		if (!msg) return;

		const userMsg = messages.findLast((m) => m.role === 'user');
		const questionText = userMsg && userMsg.type === 'text' ? userMsg.text : "";
		const responseText = msg && msg.type === 'card' ? msg.body : "";
		const feedbackType = isPositive ? "like" : "dislike";
		const feedbackMsg = isPositive ? "Liked the response" : (feedback || reason || "Negative feedback");

		try {
			// Telemetry-only flow as per user request
			const user = useAuthStore.getState().user;
			telemetry.startTelemetry(sessionId, { 
				preferred_username: user?.user_metadata?.name || user?.email || "guest", 
				email: user?.email || "" 
			});
			
			telemetry.logFeedbackEvent(
				messageId, 
				sessionId, 
				feedbackMsg, 
				feedbackType, 
				questionText, 
				responseText
			);
			
			telemetry.endTelemetry();

			// // Logic from user code: show success toast
			// if (isPositive) {
			// 	set({ toast: { message: "Thank you for your feedback! We're glad this response was helpful.", type: "success" } });
			// } else {
			// 	set({ toast: { message: "Thank you for your feedback. We'll use it to improve our responses.", type: "success" } });
			// }

		} catch (error) {
			console.error("Feedback telemetry error:", error);
			set({ toast: { message: "Failed to submit feedback. Please try again.", type: "error" } });
		}
	}
}));
