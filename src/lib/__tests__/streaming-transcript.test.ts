import { describe, expect, it } from "vitest";
import { applyStreamingToDraft, mergeStreamingTranscript } from "../streaming-transcript";

describe("mergeStreamingTranscript", () => {
	it("returns incoming when existing is empty", () => {
		expect(mergeStreamingTranscript("", "hello")).toBe("hello");
	});

	it("extends cumulative hypotheses", () => {
		expect(mergeStreamingTranscript("केशव", "केशव के घर")).toBe("केशव के घर");
		expect(mergeStreamingTranscript("केशव के घर", "केशव के घर में चार")).toBe(
			"केशव के घर में चार"
		);
	});

	it("keeps longer text when hypothesis shrinks", () => {
		expect(mergeStreamingTranscript("hello world", "hello")).toBe("hello world");
	});

	it("appends true deltas", () => {
		expect(mergeStreamingTranscript("first phrase", "second phrase")).toBe(
			"first phrase second phrase"
		);
	});

	it("handles overlap at boundary", () => {
		expect(mergeStreamingTranscript("abc def", "def ghi")).toBe("abc def ghi");
	});
});

describe("applyStreamingToDraft", () => {
	it("preserves pre-mic prefix", () => {
		const r = applyStreamingToDraft("typed before", "", "live text");
		expect(r.draft).toBe("typed before live text");
		expect(r.streamed).toBe("live text");
	});
});
