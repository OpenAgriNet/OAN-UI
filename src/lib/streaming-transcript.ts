/**
 * Merge streaming ASR hypotheses that may be cumulative or delta.
 * Bhashini often returns cumulative text; naive `+=` then duplicates history.
 */
export function mergeStreamingTranscript(existing: string, incoming: string): string {
	const prev = (existing ?? "").trimEnd();
	const next = (incoming ?? "").trim();

	if (!next) return existing ?? "";
	if (!prev) return next;
	if (next === prev) return prev;

	// Cumulative extension of current hypothesis
	if (next.startsWith(prev)) return next;

	// Shorter re-hypothesis of the same segment — keep longer stable text
	if (prev.startsWith(next)) return prev;

	// Incoming already fully contained as a whole phrase
	if (prev.includes(next)) return prev;

	// Overlap: longest suffix of prev that is a prefix of next.
	// Require word-boundary-friendly match so "phrase"+"second" does not glue on "se".
	const maxOverlap = Math.min(prev.length, next.length);
	for (let i = maxOverlap; i >= 3; i--) {
		const piece = next.slice(0, i);
		if (!prev.endsWith(piece)) continue;
		const prevBefore = prev.slice(0, prev.length - i);
		const boundaryOk =
			prevBefore.length === 0 ||
			/\s$/.test(prevBefore) ||
			/^\s/.test(next.slice(i)) ||
			/\s$/.test(piece) ||
			/^\s/.test(piece);
		if (!boundaryOk && i < 8) continue;
		return `${prev}${next.slice(i)}`.replace(/\s{2,}/g, " ").trimEnd();
	}

	// True delta / new phrase
	return `${prev} ${next}`.replace(/\s{2,}/g, " ").trim();
}

/** Combine a pre-mic typed prefix with the live streaming segment. */
export function applyStreamingToDraft(
	prefix: string,
	streamed: string,
	incoming: string
): { draft: string; streamed: string } {
	const nextStreamed = mergeStreamingTranscript(streamed, incoming);
	const base = (prefix ?? "").trimEnd();
	const draft = base
		? nextStreamed
			? `${base} ${nextStreamed}`.replace(/\s{2,}/g, " ")
			: base
		: nextStreamed;
	return { draft, streamed: nextStreamed };
}
