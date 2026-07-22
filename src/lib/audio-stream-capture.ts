/**
 * Mic → PCM capture for voice-gateway.
 * Uses AudioWorklet at native sample rate, downsamples to 16 kHz s16le mono.
 */

export const TARGET_SAMPLE_RATE = 16000;
/** 50 ms @ 16 kHz mono s16 → 1600 bytes */
export const PCM_CHUNK_BYTES = 1600;
const WORKLET_NAME = "pcm-capture-worklet";
const WORKLET_URL = "/audio/pcm-processor.js";

export type AudioStreamCaptureHandlers = {
	onPcmChunk: (pcm: ArrayBuffer) => void;
	onError?: (error: Error) => void;
	onLevel?: (rms: number) => void;
};

export type AudioStreamCapture = {
	sampleRate: number;
	stop: () => Promise<void>;
};

function computeRms(input: Float32Array): number {
	if (!input?.length) return 0;
	let sum = 0;
	for (let i = 0; i < input.length; i++) {
		const v = input[i] ?? 0;
		sum += v * v;
	}
	return Math.sqrt(sum / input.length);
}

function downsampleFloat32To16k(input: Float32Array, inputSampleRate: number): Float32Array {
	if (!input?.length || inputSampleRate === TARGET_SAMPLE_RATE) return input;
	const ratio = inputSampleRate / TARGET_SAMPLE_RATE;
	const outLen = Math.max(1, Math.round(input.length / ratio));
	const out = new Float32Array(outLen);
	let offsetResult = 0;
	let offsetInput = 0;
	while (offsetResult < outLen) {
		const next = Math.min(input.length, Math.round((offsetResult + 1) * ratio));
		let sum = 0;
		let count = 0;
		for (let i = offsetInput; i < next; i++) {
			sum += input[i] ?? 0;
			count++;
		}
		out[offsetResult] = count > 0 ? sum / count : 0;
		offsetResult++;
		offsetInput = next;
	}
	return out;
}

function encodeFloat32ToPcm16Le(input: Float32Array): ArrayBuffer {
	const buf = new ArrayBuffer(input.length * 2);
	const view = new DataView(buf);
	for (let i = 0; i < input.length; i++) {
		const s = Math.max(-1, Math.min(1, input[i] ?? 0));
		view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
	}
	return buf;
}

function parseWorkletChunk(raw: unknown): Float32Array | null {
	if (!raw) return null;
	if (ArrayBuffer.isView(raw)) {
		const view = raw as ArrayBufferView;
		return new Float32Array(view.buffer, view.byteOffset, view.byteLength / 4);
	}
	if (raw instanceof ArrayBuffer) {
		return new Float32Array(raw);
	}
	if (raw instanceof Float32Array) {
		return new Float32Array(raw);
	}
	return null;
}

/**
 * Start mic capture. Order: getUserMedia → AudioContext → worklet → onPcmChunk.
 * Prefer native sample rate (forcing 16 kHz often yields silence in Chrome).
 */
export async function startAudioStreamCapture(
	handlers: AudioStreamCaptureHandlers,
	deviceId?: string
): Promise<AudioStreamCapture> {
	const AudioCtx =
		window.AudioContext ||
		(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

	if (!navigator.mediaDevices?.getUserMedia || !AudioCtx || !window.AudioWorkletNode) {
		throw new Error("Browser does not support mic capture (needs HTTPS + AudioWorklet)");
	}

	const audioConstraints: MediaTrackConstraints = {
		echoCancellation: false,
		noiseSuppression: false,
		autoGainControl: true,
		channelCount: { ideal: 1 },
	};
	if (deviceId) {
		audioConstraints.deviceId = { ideal: deviceId };
	}

	let stream: MediaStream;
	try {
		stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
	} catch (err) {
		if (deviceId) {
			stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: true,
					channelCount: { ideal: 1 },
				},
			});
		} else {
			throw err instanceof Error ? err : new Error(String(err));
		}
	}

	const track = stream.getAudioTracks()[0];
	if (!track) {
		stream.getTracks().forEach((t) => t.stop());
		throw new Error("No microphone track");
	}
	track.enabled = true;

	const ctx = new AudioCtx();
	await ctx.resume();
	if (ctx.state !== "running") {
		stream.getTracks().forEach((t) => t.stop());
		await ctx.close().catch(() => undefined);
		throw new Error(`AudioContext not running (${ctx.state})`);
	}

	try {
		await ctx.audioWorklet.addModule(WORKLET_URL);
	} catch (err) {
		stream.getTracks().forEach((t) => t.stop());
		await ctx.close().catch(() => undefined);
		throw new Error(
			`Failed to load PCM worklet: ${err instanceof Error ? err.message : String(err)}`
		);
	}

	const floatChunkSize = Math.max(
		1024,
		Math.round((PCM_CHUNK_BYTES / 2) * (ctx.sampleRate / TARGET_SAMPLE_RATE))
	);

	const source = ctx.createMediaStreamSource(stream);
	const worklet = new AudioWorkletNode(ctx, WORKLET_NAME, {
		numberOfInputs: 1,
		numberOfOutputs: 1,
		outputChannelCount: [1],
		channelCount: 1,
		channelCountMode: "explicit",
		processorOptions: { chunkSize: floatChunkSize },
	});

	const mute = ctx.createGain();
	mute.gain.value = 0;
	source.connect(worklet);
	worklet.connect(mute);
	mute.connect(ctx.destination);

	let pending = new Uint8Array(0);
	let stopped = false;

	const enqueue = (pcmBytes: ArrayBuffer) => {
		if (stopped) return;
		const incoming = new Uint8Array(pcmBytes);
		const merged = new Uint8Array(pending.length + incoming.length);
		merged.set(pending);
		merged.set(incoming, pending.length);
		pending = merged;

		while (pending.length >= PCM_CHUNK_BYTES) {
			const slice = pending.slice(0, PCM_CHUNK_BYTES);
			pending = pending.slice(PCM_CHUNK_BYTES);
			handlers.onPcmChunk(
				slice.buffer.slice(slice.byteOffset, slice.byteOffset + slice.byteLength)
			);
		}
	};

	worklet.port.onmessage = (event: MessageEvent) => {
		if (stopped) return;
		const msg = event.data as { type?: string; chunk?: unknown };
		if (!msg || msg.type !== "pcm-chunk") return;
		const floatChunk = parseWorkletChunk(msg.chunk);
		if (!floatChunk?.length) return;

		handlers.onLevel?.(computeRms(floatChunk));
		const down = downsampleFloat32To16k(floatChunk, ctx.sampleRate);
		const pcm = encodeFloat32ToPcm16Le(down);
		if (pcm.byteLength > 0) enqueue(pcm);
	};

	return {
		sampleRate: ctx.sampleRate,
		async stop() {
			if (stopped) return;
			stopped = true;
			worklet.port.onmessage = null;
			try {
				worklet.port.postMessage({ type: "flush" });
			} catch {
				// ignore
			}
			try {
				worklet.disconnect();
				source.disconnect();
				mute.disconnect();
			} catch {
				// ignore
			}
			stream.getTracks().forEach((t) => t.stop());
			try {
				await ctx.close();
			} catch {
				// ignore
			}
		},
	};
}

export function isAudioStreamCaptureSupported(): boolean {
	if (typeof window === "undefined") return false;
	const hasMedia = !!navigator.mediaDevices?.getUserMedia;
	const hasWorklet = typeof AudioWorkletNode !== "undefined";
	const hasCtx = !!(
		window.AudioContext ||
		(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
	);
	return hasMedia && hasWorklet && hasCtx;
}
