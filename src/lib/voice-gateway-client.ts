/**
 * Browser WebSocket client for ald-voice-gateway (live ALD + ASR).
 */

export type SessionPhase = "warmup" | "detecting" | "transcribing" | string;
export type AsrState = "idle" | "held" | "connecting" | "ready" | "error" | string;

export type AldPrediction = {
	langCode?: string;
	lang?: string;
	score?: number;
};

export type VoiceGatewayServerMessage =
	| { type: "session.ready"; sessionId: string }
	| {
			type: "session.phase";
			phase: SessionPhase;
			warmupMs?: number;
			elapsedMs?: number;
			progress?: number;
	  }
	| { type: "asr.state"; state: AsrState }
	| {
			type: "language.locked";
			lang: string;
			confidence?: number;
			serviceId?: string;
			serviceLabel?: string;
			predictions?: AldPrediction[];
			reason?: string;
	  }
	| {
			type: "language.active";
			lang: string;
			confidence?: number;
			reason?: string;
	  }
	| {
			type: "language.changed";
			from?: string;
			to: string;
			serviceId?: string;
			serviceLabel?: string;
	  }
	| {
			type: "ald.probe";
			probe?: number;
			elapsedMs?: number;
			leader?: string;
			probeTop?: string;
			predictions?: AldPrediction[];
			votes?: Record<string, number>;
			switchCandidate?: { lang: string; score: number } | null;
	  }
	| {
			type: "ald.candidate";
			lang?: string;
			leader?: string;
			votes?: Record<string, number>;
	  }
	| { type: "transcript.interim"; text: string; lang?: string }
	| { type: "transcript.final"; text: string; lang?: string }
	| { type: "error"; code?: string; message?: string; detail?: string }
	| { type: string; [key: string]: unknown };

export type VoiceGatewayClientHandlers = {
	onOpen?: () => void;
	onClose?: (ev: CloseEvent) => void;
	onError?: (error: Event | Error) => void;
	onMessage?: (msg: VoiceGatewayServerMessage) => void;
};

export type VoiceGatewayClientOptions = {
	url: string;
	handlers?: VoiceGatewayClientHandlers;
};

export class VoiceGatewayClient {
	private ws: WebSocket | null = null;
	private readonly url: string;
	private handlers: VoiceGatewayClientHandlers;
	private intentionalClose = false;

	constructor(options: VoiceGatewayClientOptions) {
		this.url = options.url;
		this.handlers = options.handlers ?? {};
	}

	get readyState(): number {
		return this.ws?.readyState ?? WebSocket.CLOSED;
	}

	get isOpen(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	setHandlers(handlers: VoiceGatewayClientHandlers) {
		this.handlers = handlers;
	}

	connect(): Promise<void> {
		this.intentionalClose = false;
		if (
			this.ws &&
			(this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
		) {
			if (this.ws.readyState === WebSocket.OPEN) return Promise.resolve();
			return new Promise((resolve, reject) => {
				const ws = this.ws!;
				const onOpen = () => {
					cleanup();
					resolve();
				};
				const onError = () => {
					cleanup();
					reject(new Error("WebSocket connection failed"));
				};
				const cleanup = () => {
					ws.removeEventListener("open", onOpen);
					ws.removeEventListener("error", onError);
				};
				ws.addEventListener("open", onOpen);
				ws.addEventListener("error", onError);
			});
		}

		return new Promise((resolve, reject) => {
			try {
				const ws = new WebSocket(this.url);
				this.ws = ws;
				ws.binaryType = "arraybuffer";

				const onOpen = () => {
					cleanup();
					this.handlers.onOpen?.();
					resolve();
				};
				const onError = (ev: Event) => {
					cleanup();
					this.handlers.onError?.(ev);
					reject(new Error(`Failed to connect voice gateway: ${this.url}`));
				};
				const cleanup = () => {
					ws.removeEventListener("open", onOpen);
					ws.removeEventListener("error", onError);
				};

				ws.addEventListener("open", onOpen);
				ws.addEventListener("error", onError);
				ws.addEventListener("close", (ev) => {
					if (!this.intentionalClose) {
						this.handlers.onClose?.(ev);
					}
					if (this.ws === ws) this.ws = null;
				});
				ws.addEventListener("message", (ev) => {
					if (typeof ev.data !== "string") return;
					try {
						const msg = JSON.parse(ev.data) as VoiceGatewayServerMessage;
						this.handlers.onMessage?.(msg);
					} catch {
						// ignore non-JSON frames
					}
				});
			} catch (err) {
				reject(err instanceof Error ? err : new Error(String(err)));
			}
		});
	}

	startSpeaking(payload?: Record<string, unknown>) {
		this.sendJson({ type: "start", ...payload });
	}

	stopSpeaking() {
		this.sendJson({ type: "stop" });
	}

	sendPcm(chunk: ArrayBuffer | ArrayBufferView) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
		if (ArrayBuffer.isView(chunk)) {
			const view = chunk as ArrayBufferView;
			const copy = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
			this.ws.send(copy);
			return;
		}
		this.ws.send(chunk);
	}

	sendJson(msg: Record<string, unknown>) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
		this.ws.send(JSON.stringify(msg));
	}

	close() {
		this.intentionalClose = true;
		try {
			if (this.ws && this.ws.readyState === WebSocket.OPEN) {
				this.sendJson({ type: "stop" });
			}
		} catch {
			// ignore
		}
		try {
			this.ws?.close();
		} catch {
			// ignore
		}
		this.ws = null;
	}
}

export function resolveVoiceGatewayUrl(explicit?: string): string {
	const fromEnv = explicit?.trim();
	if (fromEnv) return fromEnv;

	if (typeof window === "undefined") {
		return "ws://localhost:3004/voice";
	}

	const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
	return `${proto}//${window.location.host}/voice-gateway/voice`;
}
