export const env = {
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
	apiKey: import.meta.env.VITE_API_KEY as string,
	mode: import.meta.env.MODE as string,
	/** Ticker banner variant shown on chatbot homepage. 1 | 2 | 3 | 4.
	 *  Change VITE_UI_TICKER in .env and restart the dev server to switch designs. */
	uiTicker: Number(import.meta.env.VITE_UI_TICKER) || 2,
};

// if (!env.apiBaseUrl) throw new Error("Missing VITE_API_BASE_URL");
// if (!env.apiKey) throw new Error("Missing VITE_API_KEY");
