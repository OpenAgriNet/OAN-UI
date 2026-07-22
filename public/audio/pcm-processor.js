/**
 * AudioWorklet: float32 mono PCM capture with fixed-size chunks.
 * Clones buffers (no transfer) so the main thread always receives valid data.
 */
const PROCESSOR_NAME = "pcm-capture-worklet";
const DEFAULT_CHUNK_SIZE = 1024;

class PcmCaptureProcessor extends AudioWorkletProcessor {
	constructor(options) {
		super();
		const rawChunkSize = Number(options?.processorOptions?.chunkSize);
		this.chunkSize =
			Number.isFinite(rawChunkSize) && rawChunkSize >= 128
				? Math.floor(rawChunkSize)
				: DEFAULT_CHUNK_SIZE;
		this.buffer = new Float32Array(this.chunkSize);
		this.bufferOffset = 0;

		this.port.onmessage = (event) => {
			if (event?.data?.type === "flush") {
				this.flush();
				this.port.postMessage({ type: "flush-complete" });
			}
		};
	}

	emitChunk(chunk) {
		if (!(chunk instanceof Float32Array) || chunk.length === 0) return;
		this.port.postMessage({ type: "pcm-chunk", chunk: new Float32Array(chunk) });
	}

	pushSamples(input) {
		if (!(input instanceof Float32Array) || input.length === 0) return;
		let offset = 0;
		while (offset < input.length) {
			const available = this.chunkSize - this.bufferOffset;
			const take = Math.min(available, input.length - offset);
			this.buffer.set(input.subarray(offset, offset + take), this.bufferOffset);
			this.bufferOffset += take;
			offset += take;
			if (this.bufferOffset >= this.chunkSize) {
				this.emitChunk(new Float32Array(this.buffer));
				this.bufferOffset = 0;
			}
		}
	}

	flush() {
		if (this.bufferOffset <= 0) return;
		this.emitChunk(this.buffer.slice(0, this.bufferOffset));
		this.bufferOffset = 0;
	}

	process(inputs, outputs) {
		const input = inputs?.[0]?.[0];
		const output = outputs?.[0]?.[0];
		if (input && input.length > 0) {
			this.pushSamples(input);
			if (output && output.length >= input.length) {
				output.set(input);
			}
		}
		return true;
	}
}

registerProcessor(PROCESSOR_NAME, PcmCaptureProcessor);
registerProcessor("pcm-capture-processor", PcmCaptureProcessor);
