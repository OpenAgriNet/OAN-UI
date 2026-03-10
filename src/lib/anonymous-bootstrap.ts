import { request } from "@/config/request";
import { decodeJwt } from "jose";
import { authState } from "@/hooks/store/auth";
import { logAnonymousTokenIssued } from "@/lib/telemetry";
import type { TokenResponse } from "@/hooks/apis/auth/type";

/** Session id stored here by bootstrap so chat store can reuse it */
export const ANONYMOUS_BOOTSTRAP_SESSION_KEY = "oan_anonymous_session_id";

/**
 * When the app is loaded without ?token and not already authed,
 * fetches anonymous token, sets session, and sends OE_ANONYMOUS_TOKEN_ISSUED.
 * Session id is generated here and stored so the chat store can reuse it.
 */
export async function startAnonymousSessionIfNeeded(): Promise<void> {
  if (typeof window === "undefined") return;
  const tokenFromUrl = new URLSearchParams(window.location.search).get("token");
  if (tokenFromUrl) return;
  if (authState().isAuthed()) return;

  // If a bootstrap session is already recorded, avoid double-calling the API.
  if (
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem(ANONYMOUS_BOOTSTRAP_SESSION_KEY)
  ) {
    return;
  }

  const sessionId = crypto.randomUUID?.() ?? `sess-${Date.now()}`;
  sessionStorage.setItem(ANONYMOUS_BOOTSTRAP_SESSION_KEY, sessionId);

  try {
    const data = await request<TokenResponse>("/api/auth/anonymous", {
      method: "POST",
      skipAuth: true,
    });
    const payload = decodeJwt(data.access_token) as { sub?: string };
    const sub = payload.sub ?? "anonymous";
    const nowSec = Math.floor(Date.now() / 1000);
    const expires_at = nowSec + data.expires_in;

    authState().setSession({
      access_token: data.access_token,
      refresh_token: "",
      expires_at,
      user: {
        id: sub,
        email: "",
        name: "Anonymous",
        is_guest_user: true,
      },
    });

    const deviceId =
      (window as any).__FINGERPRINT_CONTEXT__?.data?.device_id ?? "unknown-device";
    logAnonymousTokenIssued(sub, sessionId, deviceId);
  } catch (e) {
    sessionStorage.removeItem(ANONYMOUS_BOOTSTRAP_SESSION_KEY);
    console.warn("Anonymous session bootstrap failed", e);
  }
}
