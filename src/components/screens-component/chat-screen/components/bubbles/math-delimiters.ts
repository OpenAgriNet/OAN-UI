type ProtectedRange = { start: number; end: number };

function getProtectedRanges(markdown: string): ProtectedRange[] {
	const ranges: ProtectedRange[] = [];
	const textLength = markdown.length;
	let index = 0;

	while (index < textLength) {
		const isLineStart = index === 0 || markdown[index - 1] === "\n";
		const currentChar = markdown[index];

		if (isLineStart && (currentChar === "`" || currentChar === "~")) {
			let markerLength = 0;
			while (markdown[index + markerLength] === currentChar) {
				markerLength += 1;
			}

			if (markerLength >= 3) {
				const fenceStart = index;
				let cursor = index + markerLength;

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
					if (cursorIsLineStart) {
						let closingLength = 0;
						while (markdown[cursor + closingLength] === currentChar) {
							closingLength += 1;
						}

						if (closingLength >= markerLength) {
							let fenceEnd = cursor + closingLength;
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

	// `\[...\]` is ambiguous: the backend uses it far more often for citations and source
	// attributions (`\[1\]`, `\[doc-c3c9fec0ddfb\]`, `\[Source: dairy handbook\]`) than for
	// display math. Converting those to math renders them as unreadable KaTeX, so require the
	// content to carry an actual math signal — a LaTeX control sequence or a maths operator.
	// `\(...\)` is not ambiguous in practice and stays unconditional.
	const looksLikeMath = (content: string): boolean =>
		/\\[a-zA-Z]/.test(content) || /[\^_=+×÷≈<>]/.test(content);

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
