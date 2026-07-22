import { useCallback, useEffect, useRef, useState } from "react";
import type { LanguageCode } from "@/components/screens-component/chat-screen/config";
import {
	isAudioStreamCaptureSupported,
	startAudioStreamCapture,
	type AudioStreamCapture,
} from "@/lib/audio-stream-capture";
import { resolveAldLanguage } from "@/lib/ald-config";
import { environment, isStreamingVoiceEnabled } from "@/lib/config/environment";
import { mergeStreamingTranscript } from "@/lib/streaming-transcript";
import {
	resolveVoiceGatewayUrl,
	VoiceGatewayClient,
	type AsrState,
	type SessionPhase,
	type VoiceGatewayServerMessage,
} from "@/lib/voice-gateway-client";

export type StreamingAsrPhase =
	| "idle"
	| "connecting"
	| "warmup"
	| "detecting"
	| "transcribing"
	| "error";

export type UseStreamingAsrOptions = {
	onLanguageLocked?: (lang: LanguageCode, meta?: { confidence?: number; reason?: string }) => void;
	onTranscriptChange?: (streamedText: string, meta: { interim: boolean; lang?: string }) => void;
	onError?: (message: string) => void;
	gatewayUrl?: string;
};

export type UseStreamingAsrResult = {
	enabled: boolean;
	supported: boolean;
	isActive: boolean;
	isConnecting: boolean;
	pleaseSpeakNow: boolean;
	phase: StreamingAsrPhase;
	asrState: AsrState;
	sessionId: string | null;
	lockedLanguage: LanguageCode | null;
	streamedText: string;
	error: string | null;
	start: () => Promise<void>;
	stop: () => void;
};

function mapPhase(phase?: string): StreamingAsrPhase | null {
	if (!phase) return null;
	if (phase === "warmup" || phase === "detecting" || phase === "transcribing") return phase;
	return null;
}

export function useStreamingAsr(options: UseStreamingAsrOptions = {}): UseStreamingAsrResult {
	const enabled = isStreamingVoiceEnabled();
	const supported = isAudioStreamCaptureSupported();

	const [isActive, setIsActive] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [phase, setPhase] = useState<StreamingAsrPhase>("idle");
	const [asrState, setAsrState] = useState<AsrState>("idle");
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [lockedLanguage, setLockedLanguage] = useState<LanguageCode | null>(null);
	const [streamedText, setStreamedText] = useState("");
	const [error, setError] = useState<string | null>(null);

	const clientRef = useRef<VoiceGatewayClient | null>(null);
	const captureRef = useRef<AudioStreamCapture | null>(null);
	const activeRef = useRef(false);
	const streamedRef = useRef("");
	const optionsRef = useRef(options);

	useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	const publishTranscript = useCallback((text: string, interim: boolean, lang?: string) => {
		streamedRef.current = text;
		setStreamedText(text);
		optionsRef.current.onTranscriptChange?.(text, { interim, lang });
	}, []);

	const handleMessage = useCallback(
		(msg: VoiceGatewayServerMessage) => {
			switch (msg.type) {
				case "session.ready": {
					setSessionId((msg as { sessionId: string }).sessionId);
					break;
				}
				case "session.phase": {
					const mapped = mapPhase((msg as { phase: SessionPhase }).phase);
					if (mapped) setPhase(mapped);
					break;
				}
				case "asr.state": {
					const state = (msg as { state: AsrState }).state;
					setAsrState(state);
					if (state === "ready") {
						setPhase((p) =>
							p === "warmup" || p === "detecting" || p === "connecting"
								? "transcribing"
								: p
						);
					}
					break;
				}
				case "language.locked":
				case "language.active": {
					const m = msg as { lang: string; confidence?: number; reason?: string };
					const lang = resolveAldLanguage(m.lang);
					setLockedLanguage(lang);
					optionsRef.current.onLanguageLocked?.(lang, {
						confidence: m.confidence,
						reason: m.reason ?? (msg.type === "language.locked" ? "locked" : "active"),
					});
					break;
				}
				case "language.changed": {
					const m = msg as { to: string };
					const lang = resolveAldLanguage(m.to);
					setLockedLanguage(lang);
					optionsRef.current.onLanguageLocked?.(lang, { reason: "changed" });
					break;
				}
				case "transcript.interim": {
					const m = msg as { text: string; lang?: string };
					const live =
						m.text && (m.text.startsWith(streamedRef.current) || !streamedRef.current)
							? m.text
							: mergeStreamingTranscript(streamedRef.current, m.text ?? "");
					publishTranscript(live, true, m.lang);
					if (m.lang) {
						const lang = resolveAldLanguage(m.lang);
						setLockedLanguage((prev) => prev ?? lang);
					}
					break;
				}
				case "transcript.final": {
					const m = msg as { text: string; lang?: string };
					const merged = mergeStreamingTranscript(streamedRef.current, m.text ?? "");
					publishTranscript(merged, false, m.lang);
					if (m.lang) {
						const lang = resolveAldLanguage(m.lang);
						setLockedLanguage((prev) => prev ?? lang);
					}
					break;
				}
				case "error": {
					const m = msg as { code?: string; message?: string; detail?: string };
					const message = m.message || m.detail || m.code || "Voice gateway error";
					setError(message);
					setPhase("error");
					optionsRef.current.onError?.(message);
					break;
				}
				default:
					break;
			}
		},
		[publishTranscript]
	);

	const stopInternal = useCallback(async () => {
		activeRef.current = false;
		const capture = captureRef.current;
		captureRef.current = null;
		if (capture) {
			try {
				await capture.stop();
			} catch {
				// ignore
			}
		}
		const client = clientRef.current;
		if (client) {
			try {
				client.stopSpeaking();
			} catch {
				// ignore
			}
			try {
				client.close();
			} catch {
				// ignore
			}
			clientRef.current = null;
		}
		setIsActive(false);
		setIsConnecting(false);
		setPhase("idle");
		setAsrState("idle");
	}, []);

	const stop = useCallback(() => {
		void stopInternal();
	}, [stopInternal]);

	const start = useCallback(async () => {
		if (!enabled) {
			throw new Error("Streaming voice is disabled");
		}
		if (!supported) {
			throw new Error("Microphone streaming is not supported in this browser");
		}

		await stopInternal();
		streamedRef.current = "";
		setStreamedText("");
		setError(null);
		setLockedLanguage(null);
		setSessionId(null);
		setIsConnecting(true);
		setIsActive(true);
		setPhase("connecting");
		activeRef.current = true;

		const url = resolveVoiceGatewayUrl(
			optionsRef.current.gatewayUrl || environment.voiceGatewayUrl || undefined
		);

		const client = new VoiceGatewayClient({
			url,
			handlers: {
				onMessage: handleMessage,
				onError: () => {
					if (!activeRef.current) return;
					const message = "Voice gateway connection error";
					setError(message);
					setPhase("error");
					optionsRef.current.onError?.(message);
				},
				onClose: () => {
					if (!activeRef.current) return;
					activeRef.current = false;
					setIsActive(false);
					setIsConnecting(false);
					setPhase("idle");
				},
			},
		});
		clientRef.current = client;

		try {
			// Order: connect → startSpeaking → then mic
			await client.connect();
			if (!activeRef.current) return;

			client.startSpeaking();
			setPhase("warmup");
			setAsrState("held");
			setIsConnecting(false);

			const capture = await startAudioStreamCapture({
				onPcmChunk: (pcm) => {
					if (!activeRef.current) return;
					clientRef.current?.sendPcm(pcm);
				},
				onError: (err) => {
					const message = err.message || "Microphone capture failed";
					setError(message);
					setPhase("error");
					optionsRef.current.onError?.(message);
					void stopInternal();
				},
			});

			if (!activeRef.current) {
				await capture.stop();
				return;
			}
			captureRef.current = capture;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			setError(message);
			setPhase("error");
			optionsRef.current.onError?.(message);
			await stopInternal();
			throw err;
		}
	}, [enabled, supported, handleMessage, stopInternal]);

	useEffect(() => {
		return () => {
			activeRef.current = false;
			void stopInternal();
		};
	}, [stopInternal]);

	const pleaseSpeakNow =
		isActive &&
		(phase === "connecting" ||
			phase === "warmup" ||
			phase === "detecting" ||
			(phase === "transcribing" && asrState !== "ready" && asrState !== "idle"));

	return {
		enabled,
		supported,
		isActive,
		isConnecting,
		pleaseSpeakNow: pleaseSpeakNow || (isActive && phase === "warmup"),
		phase,
		asrState,
		sessionId,
		lockedLanguage,
		streamedText,
		error,
		start,
		stop,
	};
}
