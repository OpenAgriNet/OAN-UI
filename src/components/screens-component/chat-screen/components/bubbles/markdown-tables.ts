/**
 * Repairs GFM pipe tables whose rows were split by a stray `|`.
 *
 * GFM only accepts a table when the header row has exactly as many cells as the delimiter row;
 * otherwise every line falls back into one paragraph and the farmer sees raw `| ... |` text.
 * Translation sometimes inserts a pipe inside a cell — production Gujarati turned
 * "Modal Price (Rs./Qtl)" into `મોડલ ભાવ (રૂ.| /ક્યુટીએલ)` — so a header gains a column the
 * delimiter row doesn't have.
 *
 * Only tables that GFM would reject (header) or truncate (body rows with excess cells) are
 * touched; every other line is returned byte-for-byte, and fenced code is skipped.
 */

const FENCE = /^\s{0,3}(```|~~~)/;
const DELIMITER_ROW = /^\s{0,3}\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const UNESCAPED_PIPE = /(?<!\\)\|/;

function splitRow(line: string): string[] {
	const cells = line.trim().split(UNESCAPED_PIPE).map((cell) => cell.trim());
	if (cells[0] === "") cells.shift();
	if (cells[cells.length - 1] === "") cells.pop();
	return cells;
}

const joinRow = (cells: string[]) => `| ${cells.join(" | ")} |`;

const count = (text: string, char: string) => text.split(char).length - 1;

/** Re-joins cells that were split inside parentheses, while the row has more cells than columns. */
function mergeSplitCells(cells: string[], columns: number): string[] {
	let excess = cells.length - columns;
	const merged: string[] = [];
	for (const cell of cells) {
		const prev = merged[merged.length - 1];
		if (excess > 0 && prev !== undefined && count(prev, "(") > count(prev, ")")) {
			merged[merged.length - 1] = `${prev} ${cell}`;
			excess--;
			continue;
		}
		merged.push(cell);
	}
	return merged;
}

export function repairMarkdownTables(markdown: string): string {
	if (!markdown.includes("|")) return markdown;

	const lines = markdown.split("\n");
	let inFence = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i] ?? "";
		const prevLine = lines[i - 1] ?? "";
		if (FENCE.test(line)) {
			inFence = !inFence;
			continue;
		}
		if (inFence || !line.includes("|") || !prevLine.includes("|") || !DELIMITER_ROW.test(line)) continue;

		const originalHeader = splitRow(prevLine);
		const delimiter = splitRow(line);
		const delimiterCount = delimiter.length;
		let header = originalHeader;
		let columns = delimiterCount;

		if (header.length > columns) header = mergeSplitCells(header, columns);
		if (header.length < columns) header = [...header, ...Array<string>(columns - header.length).fill("")];
		if (header.length > columns) {
			delimiter.push(...Array<string>(header.length - columns).fill("---"));
			columns = header.length;
		}
		if (header.length !== originalHeader.length || delimiter.length !== delimiterCount) {
			lines[i - 1] = joinRow(header);
			lines[i] = joinRow(delimiter);
		}

		for (let j = i + 1; j < lines.length; j++) {
			const row = lines[j] ?? "";
			if (!row.includes("|") || row.trim() === "") break;
			const cells = splitRow(row);
			if (cells.length <= columns) continue;
			const merged = mergeSplitCells(cells, columns);
			if (merged.length < cells.length) lines[j] = joinRow(merged);
		}
	}

	return lines.join("\n");
}
