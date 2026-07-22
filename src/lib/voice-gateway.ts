/**
 * Client for Kenpath / Bhashini Voice Gateway (ALD + streaming ASR).
 *
 * Protocol (from voice-gateway test-ui):
 * 1. Connect WebSocket
 * 2. Send JSON { type: "start" }
 * 3. Stream binary PCM s16le mono @ 16 kHz
 * 4. Send JSON { type: "stop" }
 * 5. Receive language.* and transcript.* events
 */

import { env } from "@/config/env";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/components/screens-component/chat-screen/config";
import { resolveAldLanguage } from "@/lib/ald-config";

const SAMPLE_RATE = 16_000;
const CHUNK_BYTES = 1600; // 50 ms @ 16 kHz mono s16le
const DEFAULT_TIMEOUT_MS = 45_000;
/** Pace batch PCM like realtime so warmup ALD can lock language. */
const CHUNK_INTERVAL_MS = 50;

export type VoiceGatewayResult = {
	text: string;
	lang_code: LanguageCode;
	status: "success" | "error";
	sessionId?: string;
};

type GatewayMessage = {
	type?: string;
	sessionId?: string;
	lang?: string;
	to?: string;
	from?: string;
	text?: string;
	state?: string;
	leader?: string;
	reason?: string;
	confidence?: number;
	[key: string]: unknown;
};

function flagEnabled(value: string | boolean | undefined): boolean {
	if (typeof value === "boolean") return value;
	if (!value) return false;
	const normalized = String(value).trim().toLowerCase();
	return normalized === "true" || normalized === "1" || normalized === "yes";
}

export function isVoiceGatewayEnabled(): boolean {
	return (
		flagEnabled(env.voiceGatewayEnabled) &&
		flagEnabled(env.streamingAsrEnabled) &&
		Boolean(env.voiceGatewayUrl?.trim())
	);
}

export function getVoiceGatewayUrl(): string {
	return (env.voiceGatewayUrl || "").trim();
}

/** Map gateway language codes onto app LanguageCode; fall back to Hindi. */
export function mapGatewayLangCode(raw?: string | null): LanguageCode {
	return resolveAldLanguage(raw, DEFAULT_LANGUAGE);
}

/**
 * Extract raw PCM s16le mono 16 kHz from a WAV ArrayBuffer.
 * If the buffer is already raw PCM, returns it as-is when it looks like one.
 */
export function wavArrayBufferToPcm16k(arrayBuffer: ArrayBuffer): Uint8Array {
	const buf = new Uint8Array(arrayBuffer);
	if (buf.length < 44) {
		return buf;
	}

	// RIFF/WAVE?
	const isRiff =
		buf[0] === 0x52 &&
		buf[1] === 0x49 &&
		buf[2] === 0x46 &&
		buf[3] === 0x46 &&
		buf[8] === 0x57 &&
		buf[9] === 0x41 &&
		buf[10] === 0x56 &&
		buf[11] === 0x45;

	if (!isRiff) {
		return buf;
	}

	const view = new DataView(arrayBuffer);
	const channels = view.getUint16(22, true);
	const sampleRate = view.getUint32(24, true);
	const bits = view.getUint16(34, true);

	let offset = 12;
	while (offset < buf.length - 8) {
		const id = String.fromCharCode(buf[offset]!, buf[offset + 1]!, buf[offset + 2]!, buf[offset + 3]!);
		const size = view.getUint32(offset + 4, true);
		if (id === "data") {
			offset += 8;
			const raw = buf.subarray(offset, offset + size);
			if (sampleRate === SAMPLE_RATE && channels === 1 && bits === 16) {
				return new Uint8Array(raw);
			}

			// Downmix / resample to 16 kHz mono s16le when needed
			const bytesPerSample = bits / 8;
			const frameSize = bytesPerSample * channels;
			const samples = Math.floor(raw.length / frameSize);
			const outLen = Math.floor((samples * SAMPLE_RATE) / sampleRate);
			const out = new Int16Array(outLen);
			const dataView = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);

			for (let i = 0; i < outLen; i++) {
				const src = Math.floor((i * sampleRate) / SAMPLE_RATE);
				const idx = src * frameSize;
				if (bits === 16) {
					out[i] = dataView.getInt16(idx, true);
				} else if (bits === 8) {
					out[i] = (dataView.getUint8(idx) - 128) << 8;
				} else {
					out[i] = 0;
				}
			}
			return new Uint8Array(out.buffer);
		}
		offset += 8 + size + (size % 2); // word-align
	}

	// Fallback: strip 44-byte header
	return buf.subarray(44);
}

function sendJson(ws: WebSocket, payload: Record<string, unknown>) {
	ws.send(JSON.stringify(payload));
}

function sendPcmChunks(ws: WebSocket, pcm: Uint8Array): Promise<void> {
	return new Promise((resolve) => {
		let offset = 0;
		const pump = () => {
			if (ws.readyState !== WebSocket.OPEN) {
				resolve();
				return;
			}
			if (offset >= pcm.length) {
				resolve();
				return;
			}
			const slice = pcm.subarray(offset, offset + CHUNK_BYTES);
			const copy = slice.buffer.slice(slice.byteOffset, slice.byteOffset + slice.byteLength);
			ws.send(copy);
			offset += CHUNK_BYTES;
			window.setTimeout(pump, CHUNK_INTERVAL_MS);
		};
		pump();
	});
}

/**
 * Stream recorded PCM (or WAV bytes) through the voice gateway and resolve
 * once we have a final transcript and/or active language, or on timeout/error.
 */
export function transcribeViaVoiceGateway(
	pcmOrWav: Uint8Array | ArrayBuffer,
	options?: { timeoutMs?: number; url?: string }
): Promise<VoiceGatewayResult> {
	const url = (options?.url || getVoiceGatewayUrl()).trim();
	if (!url) {
		return Promise.resolve({
			text: "",
			lang_code: DEFAULT_LANGUAGE,
			status: "error"
		});
	}

	const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	const inputBytes =
		pcmOrWav instanceof ArrayBuffer
			? new Uint8Array(pcmOrWav)
			: new Uint8Array(pcmOrWav.buffer, pcmOrWav.byteOffset, pcmOrWav.byteLength);
	// Copy into a standalone ArrayBuffer to satisfy TS (no SharedArrayBuffer) and detach safely
	const standalone = new ArrayBuffer(inputBytes.byteLength);
	new Uint8Array(standalone).set(inputBytes);
	const pcm = wavArrayBufferToPcm16k(standalone);

	return new Promise((resolve) => {
		let settled = false;
		let sessionId: string | undefined;
		let langCode: LanguageCode = DEFAULT_LANGUAGE;
		let gotLang = false;
		const finalParts: string[] = [];
		let interimText = "";
		let asrState = "idle";

		const finish = (status: "success" | "error", textOverride?: string) => {
			if (settled) return;
			settled = true;
			window.clearTimeout(timer);
			try {
				ws.close();
			} catch {
				/* ignore */
			}
			const text = (textOverride ?? [...finalParts, interimText].filter(Boolean).join(" ").trim());
			resolve({
				text,
				lang_code: gotLang ? langCode : DEFAULT_LANGUAGE,
				status: status === "success" && (text || gotLang) ? "success" : status,
				sessionId
			});
		};

		let ws: WebSocket;
		try {
			ws = new WebSocket(url);
		} catch (error) {
			console.error("Voice gateway WebSocket construct failed", error);
			resolve({ text: "", lang_code: DEFAULT_LANGUAGE, status: "error" });
			return;
		}

		const timer = window.setTimeout(() => {
			console.warn("Voice gateway timed out");
			finish(finalParts.length || gotLang ? "success" : "error");
		}, timeoutMs);

		ws.binaryType = "arraybuffer";

		ws.onopen = () => {
			void (async () => {
				try {
					sendJson(ws, { type: "start" });
					await sendPcmChunks(ws, pcm);
					if (ws.readyState === WebSocket.OPEN) {
						sendJson(ws, { type: "stop" });
					}
				} catch (error) {
					console.error("Voice gateway send failed", error);
					finish("error");
				}
			})();
		};

		ws.onmessage = (event) => {
			if (typeof event.data !== "string") return;
			let msg: GatewayMessage;
			try {
				msg = JSON.parse(event.data) as GatewayMessage;
			} catch {
				return;
			}

			switch (msg.type) {
				case "session.ready":
					sessionId = msg.sessionId;
					break;
				case "asr.state":
					asrState = String(msg.state ?? asrState);
					// After stop, some gateways emit idle/done once final is ready
					if (
						(asrState === "idle" || asrState === "done" || asrState === "stopped") &&
						(finalParts.length > 0 || gotLang)
					) {
						// small grace so a trailing final can arrive
						window.setTimeout(() => finish("success"), 250);
					}
					break;
				case "language.locked":
				case "language.active":
					if (msg.lang) {
						langCode = mapGatewayLangCode(msg.lang);
						gotLang = true;
					}
					break;
				case "language.changed":
					if (msg.to || msg.lang) {
						langCode = mapGatewayLangCode((msg.to as string) || msg.lang);
						gotLang = true;
					}
					break;
				case "ald.probe":
				case "ald.candidate":
					if (msg.leader || msg.lang) {
						// Soft update during probing; don't mark final yet
						langCode = mapGatewayLangCode((msg.leader as string) || msg.lang);
						gotLang = true;
					}
					break;
				case "transcript.interim":
					interimText = typeof msg.text === "string" ? msg.text : interimText;
					break;
				case "transcript.final":
					if (typeof msg.text === "string" && msg.text.trim()) {
						finalParts.push(msg.text.trim());
					}
					interimText = "";
					// Prefer resolving after a final + language if we have both
					if (gotLang) {
						window.setTimeout(() => finish("success"), 150);
					}
					break;
				case "error":
					console.error("Voice gateway error event", msg);
					finish(finalParts.length || gotLang ? "success" : "error");
					break;
				default:
					break;
			}
		};

		ws.onerror = (error) => {
			console.error("Voice gateway WebSocket error", error);
			finish(finalParts.length || gotLang ? "success" : "error");
		};

		ws.onclose = () => {
			finish(finalParts.length || gotLang ? "success" : "error");
		};
	});
}
