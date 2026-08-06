type ProtectedRange = { start: number; end: number };

function getProtectedRanges(markdown: string): ProtectedRange[] {
	const ranges: ProtectedRange[] = [];
	const textLength = markdown.length;
	let index = 0;

	// Markdown lets a fence be indented by up to three spaces; four or more makes it an indented
	// code block instead. Returns where the marker would start, or -1 when the line is too deep.
	const fenceMarkerStart = (lineStart: number): number => {
		let indent = 0;
		while (indent < 4 && markdown[lineStart + indent] === " ") {
			indent += 1;
		}
		return indent < 4 ? lineStart + indent : -1;
	};

	while (index < textLength) {
		const isLineStart = index === 0 || markdown[index - 1] === "\n";
		const currentChar = markdown[index];
		const markerStart = isLineStart ? fenceMarkerStart(index) : -1;
		const markerChar = markerStart === -1 ? "" : markdown[markerStart];

		if (markerStart !== -1 && (markerChar === "`" || markerChar === "~")) {
			let markerLength = 0;
			while (markdown[markerStart + markerLength] === markerChar) {
				markerLength += 1;
			}

			if (markerLength >= 3) {
				const fenceStart = index;
				let cursor = markerStart + markerLength;

				while (cursor < textLength && markdown[cursor] !== "\n") {
					cursor += 1;
				}
				if (cursor < textLength) {
					cursor += 1;
				}

				let closed = false;
				while (cursor < textLength) {
					const cursorIsLineStart =
						cursor === 0 || markdown[cursor - 1] === "\n";
					const closingStart = cursorIsLineStart ? fenceMarkerStart(cursor) : -1;
					if (closingStart !== -1) {
						let closingLength = 0;
						while (markdown[closingStart + closingLength] === markerChar) {
							closingLength += 1;
						}

						if (closingLength >= markerLength) {
							let fenceEnd = closingStart + closingLength;
							while (fenceEnd < textLength && markdown[fenceEnd] !== "\n") {
								fenceEnd += 1;
							}
							if (fenceEnd < textLength) {
								fenceEnd += 1;
							}

							ranges.push({ start: fenceStart, end: fenceEnd });
							index = fenceEnd;
							closed = true;
							break;
						}
					}

					while (cursor < textLength && markdown[cursor] !== "\n") {
						cursor += 1;
					}
					if (cursor < textLength) {
						cursor += 1;
					}
				}

				if (!closed) {
					ranges.push({ start: fenceStart, end: textLength });
					index = textLength;
				}
				continue;
			}
		}

		if (currentChar === "`") {
			let tickLength = 0;
			while (markdown[index + tickLength] === "`") {
				tickLength += 1;
			}

			let cursor = index + tickLength;
			let spanEnd = -1;
			while (cursor < textLength) {
				let closingTicks = 0;
				while (markdown[cursor + closingTicks] === "`") {
					closingTicks += 1;
				}

				if (closingTicks === tickLength) {
					spanEnd = cursor + tickLength;
					break;
				}
				cursor += 1;
			}

			if (spanEnd !== -1) {
				ranges.push({ start: index, end: spanEnd });
				index = spanEnd;
				continue;
			}
		}

		index += 1;
	}

	return ranges;
}

export function normalizeMathDelimiters(markdown: string): string {
	const isStandaloneOnLine = (
		text: string,
		matchStart: number,
		matchEnd: number
	): boolean => {
		const lineStart = text.lastIndexOf("\n", matchStart - 1) + 1;
		const lineEndIndex = text.indexOf("\n", matchEnd);
		const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
		const before = text.slice(lineStart, matchStart).trim();
		const after = text.slice(matchEnd, lineEnd).trim();
		return before.length === 0 && after.length === 0;
	};

	// `\[...\]` is ambiguous: the backend uses it for citations and source attributions
	// (`\[1\]`, `\[doc-c3c9fec0ddfb\]`, `\[Source: dairy handbook\]`), never for display maths in
	// any response observed so far. Rendering those as KaTeX produces unreadable mush, so require
	// a LaTeX control sequence before converting. A bare operator is deliberately not enough:
	// citation text routinely contains `>`, `_`, `+` and `=`, so accepting those re-opens the bug.
	// The cost is that pure-ASCII block maths like `\[ x^2 = y^2 \]` stays literal; no response
	// has ever used that form, whereas mangled citations were a live defect.
	// `$...$` is left entirely to remark-math, and `\(...\)` is not ambiguous in practice.
	const looksLikeMath = (content: string): boolean => /\\\S/.test(content);

	const normalizePlainText = (text: string): string =>
		text
			// The content may not contain another `\[`, so a stray opener can never swallow the
			// prose between two citation markers into a single math block.
			.replace(/\\\[((?:(?!\\\[)[\s\S])*?)\\\]/g, (match, content: string, offset: number) => {
				const trimmedContent = content.trim();
				if (!looksLikeMath(trimmedContent)) {
					return match;
				}
				const matchEnd = offset + match.length;
				// Only a match that owns its whole line may inject newlines; doing so mid-line
				// would break the surrounding table row or list item.
				if (isStandaloneOnLine(text, offset, matchEnd)) {
					return `$$\n${trimmedContent}\n$$`;
				}
				return `$$${trimmedContent}$$`;
			})
			.replace(/\\\(((?:(?!\\\()[\s\S])*?)\\\)/g, (_match, content: string) => {
				const trimmedContent = content.trim();
				return `$${trimmedContent}$`;
			});

	const protectedRanges = getProtectedRanges(markdown);
	if (protectedRanges.length === 0) {
		return normalizePlainText(markdown);
	}

	let output = "";
	let cursor = 0;

	for (const range of protectedRanges) {
		if (range.start > cursor) {
			output += normalizePlainText(markdown.slice(cursor, range.start));
		}
		output += markdown.slice(range.start, range.end);
		cursor = range.end;
	}

	if (cursor < markdown.length) {
		output += normalizePlainText(markdown.slice(cursor));
	}

	return output;
}
