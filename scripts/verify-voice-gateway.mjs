#!/usr/bin/env node
/**
 * Smoke-test the public voice gateway: connect → start → stream PCM → language.locked + transcript.
 *
 * Usage:
 *   node scripts/verify-voice-gateway.mjs
 *   VOICE_GATEWAY_URL=wss://host/voice-gateway/voice node scripts/verify-voice-gateway.mjs
 *   node scripts/verify-voice-gateway.mjs --clip=te
 */
const GATEWAY =
	process.env.VOICE_GATEWAY_URL ||
	"wss://bhashini-bh-ald.kenpath.ai/voice-gateway/voice";
const HTTP_BASE = GATEWAY.replace(/^wss:/, "https:").replace(/\/voice$/, "");
const clipId = (process.argv.find((a) => a.startsWith("--clip=")) || "--clip=hi").split("=")[1];
const CHUNK = 1600;

function wavToPcm(buf) {
	const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	const channels = view.getUint16(22, true);
	const sampleRate = view.getUint32(24, true);
	let offset = 12;
	while (offset < buf.length - 8) {
		const id = buf.toString("ascii", offset, offset + 4);
		const size = view.getUint32(offset + 4, true);
		if (id === "data") {
			let pcm = buf.subarray(offset + 8, offset + 8 + size);
			if (sampleRate === 16000 && channels === 1) return pcm;
			const samples = Math.floor(pcm.length / 2 / channels);
			const out = Buffer.alloc(Math.floor((samples * 16000) / sampleRate) * 2);
			for (let i = 0; i < out.length / 2; i++) {
				const src = Math.floor((i * sampleRate) / 16000);
				out.writeInt16LE(pcm.readInt16LE(src * channels * 2), i * 2);
			}
			return out;
		}
		offset += 8 + size + (size % 2);
	}
	throw new Error("WAV data chunk not found");
}

const clipUrl = `${HTTP_BASE}/api/clips/${clipId}-12s.wav`;
console.log("Gateway:", GATEWAY);
console.log("Clip:", clipUrl);

const res = await fetch(clipUrl);
if (!res.ok) {
	console.error("Failed to download clip", res.status);
	process.exit(1);
}
const wav = Buffer.from(await res.arrayBuffer());
const pcm = wavToPcm(wav);
console.log("PCM bytes:", pcm.length, `(~${(pcm.length / 32000).toFixed(1)}s)`);

const events = [];
let locked = null;
let finalText = null;
let interimText = null;

await new Promise((resolve, reject) => {
	const ws = new WebSocket(GATEWAY);
	const timer = setTimeout(() => {
		ws.close();
		reject(new Error("timeout waiting for transcript"));
	}, 30000);

	ws.addEventListener("open", () => {
		console.log("WS open");
		ws.send(JSON.stringify({ type: "start" }));
		let offset = 0;
		const pump = () => {
			if (offset >= pcm.length) {
				ws.send(JSON.stringify({ type: "stop" }));
				console.log("stop sent");
				return;
			}
			ws.send(pcm.subarray(offset, offset + CHUNK));
			offset += CHUNK;
			setTimeout(pump, 40);
		};
		setTimeout(pump, 50);
	});

	ws.addEventListener("message", (ev) => {
		if (typeof ev.data !== "string") return;
		const msg = JSON.parse(ev.data);
		events.push(msg.type);
		if (msg.type === "language.locked") {
			locked = msg;
			console.log("language.locked", msg.lang, "conf", msg.confidence?.toFixed?.(3));
		}
		if (msg.type === "transcript.interim") {
			interimText = msg.text;
		}
		if (msg.type === "transcript.final") {
			finalText = msg.text;
			console.log("transcript.final:", (msg.text || "").slice(0, 120));
			clearTimeout(timer);
			setTimeout(() => {
				ws.close();
				resolve();
			}, 500);
		}
		if (msg.type === "error") {
			console.error("gateway error", msg);
		}
	});

	ws.addEventListener("error", (e) => {
		clearTimeout(timer);
		reject(e.error || new Error("ws error"));
	});
	ws.addEventListener("close", () => {
		clearTimeout(timer);
		resolve();
	});
});

console.log("\n--- Result ---");
console.log("Events:", [...new Set(events)].join(", "));
console.log("Locked language:", locked?.lang ?? "(none)");
console.log("Final transcript:", finalText || interimText || "(none)");

const ok = Boolean(locked?.lang) && Boolean(finalText || interimText);
if (!ok) {
	console.error("FAIL: expected language.locked and transcript");
	process.exit(1);
}
console.log("OK: gateway returned language + transcript");
process.exit(0);
