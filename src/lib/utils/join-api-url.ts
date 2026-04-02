/**
 * Normalize API base (trim, strip trailing slashes). Empty string stays empty.
 */
export function normalizeApiBaseUrl(base: string): string {
	return base.trim().replace(/\/+$/, "");
}

/**
 * Join API base URL with path segments. Avoids duplicate slashes and `/api/api/...`.
 * Segments may contain slashes (e.g. `auth/v1/token` or `feedback/positive`).
 *
 * Examples:
 * - `/api` + `chat` → `/api/chat`
 * - `/api/` + `/chat/` → `/api/chat`
 * - `` + `api/chat` → `/api/chat`
 * - `https://x.com/api` + `chat` → `https://x.com/api/chat`
 */
export function joinApiUrl(base: string, ...pathSegments: string[]): string {
	const trimmedBase = normalizeApiBaseUrl(base);
	const parts: string[] = [];
	for (const seg of pathSegments) {
		for (const piece of seg.split("/")) {
			const p = piece.trim();
			if (p) parts.push(p);
		}
	}
	const path = parts.join("/");
	if (!trimmedBase) {
		return path ? `/${path}` : "/";
	}
	if (!path) return trimmedBase;
	return `${trimmedBase}/${path}`;
}

/**
 * Split `pathname?query#hash` style path for building URLs with joinApiUrl.
 */
export function splitPathAndSuffix(path: string): { pathname: string; suffix: string } {
	const hashIdx = path.indexOf("#");
	const qIdx = path.indexOf("?");
	let end = path.length;
	if (hashIdx !== -1) end = Math.min(end, hashIdx);
	if (qIdx !== -1) end = Math.min(end, qIdx);
	const pathname = path.slice(0, end);
	const suffix = path.slice(end);
	return { pathname, suffix };
}
