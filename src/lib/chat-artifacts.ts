export const CHAT_ARTIFACTS_START = "\n__CHAT_ARTIFACTS__";
export const CHAT_ARTIFACTS_END = "__END_CHAT_ARTIFACTS__\n";
export const SUGGESTIONS_START = "__SUGGESTIONS__";
export const SUGGESTIONS_END = "__END_SUGGESTIONS__";

const MAX_HTML_CHARS = 1_100_000;

export type SoilHealthCardArtifact = {
	id: string;
	kind: "soil_health_card";
	title: string;
	media_type: "text/html";
	content: string;
	source: string;
	cycle: string;
};

export type ChatArtifact = SoilHealthCardArtifact;

export type ParsedChatWire = {
	text: string;
	artifacts: ChatArtifact[];
	suggestions: string[];
	pendingFrame: boolean;
};

function decodeBase64Utf8(value: string): string {
	const binary = atob(value);
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}

function isSoilHealthCardArtifact(value: unknown): value is SoilHealthCardArtifact {
	if (!value || typeof value !== "object") return false;
	const artifact = value as Record<string, unknown>;
	return (
		artifact.kind === "soil_health_card" &&
		artifact.media_type === "text/html" &&
		typeof artifact.id === "string" &&
		typeof artifact.title === "string" &&
		typeof artifact.source === "string" &&
		typeof artifact.cycle === "string" &&
		typeof artifact.content === "string" &&
		artifact.content.length <= MAX_HTML_CHARS
	);
}

function partialMarkerLength(value: string): number {
	const markers = [CHAT_ARTIFACTS_START, SUGGESTIONS_START];
	let held = 0;
	for (const marker of markers) {
		const max = Math.min(value.length, marker.length - 1);
		for (let length = max; length > held; length -= 1) {
			if (value.endsWith(marker.slice(0, length))) {
				held = length;
				break;
			}
		}
	}
	return held;
}

/** Parse the complete wire buffer after every chunk; safe across split frames. */
export function parseChatWire(value: string): ParsedChatWire {
	let cursor = 0;
	let text = "";
	let pendingFrame = false;
	const artifacts: ChatArtifact[] = [];
	const suggestions: string[] = [];

	while (cursor < value.length) {
		const artifactStart = value.indexOf(CHAT_ARTIFACTS_START, cursor);
		const suggestionsStart = value.indexOf(SUGGESTIONS_START, cursor);
		const candidates = [artifactStart, suggestionsStart].filter((index) => index >= 0);

		if (candidates.length === 0) {
			const remainder = value.slice(cursor);
			const held = partialMarkerLength(remainder);
			text += held ? remainder.slice(0, -held) : remainder;
			pendingFrame = held > 0;
			break;
		}

		const start = Math.min(...candidates);
		text += value.slice(cursor, start);
		const isArtifact = start === artifactStart;
		const startMarker = isArtifact ? CHAT_ARTIFACTS_START : SUGGESTIONS_START;
		const endMarker = isArtifact ? CHAT_ARTIFACTS_END : SUGGESTIONS_END;
		const contentStart = start + startMarker.length;
		const end = value.indexOf(endMarker, contentStart);
		if (end < 0) {
			pendingFrame = true;
			break;
		}

		const frame = value.slice(contentStart, end);
		try {
			if (isArtifact) {
				const decoded = JSON.parse(decodeBase64Utf8(frame)) as {
					version?: number;
					artifacts?: unknown[];
				};
				if (decoded.version === 1 && Array.isArray(decoded.artifacts)) {
					artifacts.push(...decoded.artifacts.filter(isSoilHealthCardArtifact));
				}
			} else {
				const decoded = JSON.parse(frame) as unknown;
				if (Array.isArray(decoded)) {
					suggestions.push(...decoded.filter((item): item is string => typeof item === "string"));
				}
			}
		} catch (error) {
			// Protocol frames are never shown as chat text. A malformed frame is
			// ignored and reported locally without exposing private encoded data.
			console.warn("Failed to parse chat metadata frame", error);
		}
		cursor = end + endMarker.length;
	}

	return { text, artifacts, suggestions, pendingFrame };
}
