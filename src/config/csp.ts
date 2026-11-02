declare global {
	interface Window {
		__webpack_nonce__?: string;
	}
}

const content = document.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]')?.content;
export const cspNonce = content === "__CSP_NONCE__" ? undefined : content;

if (import.meta.env.PROD && !/^[a-f0-9]{32}$/.test(cspNonce ?? "")) {
	throw new Error("Missing or invalid CSP nonce: serve the production UI through its configured Nginx server.");
}

// react-style-singleton (Radix scroll locking) reads this standard nonce global.
window.__webpack_nonce__ = cspNonce;
