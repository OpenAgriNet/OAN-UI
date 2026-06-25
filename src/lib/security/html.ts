const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;
const HTML_ENTITY_PATTERN = /[&<>"']/g;

const HTML_ESCAPE_MAP: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#x27;",
};

export function neutralizeHtmlMarkup(value: string): string {
	if (!HTML_TAG_PATTERN.test(value)) {
		return value;
	}

	return value.replace(HTML_ENTITY_PATTERN, (char) => HTML_ESCAPE_MAP[char] ?? char);
}
