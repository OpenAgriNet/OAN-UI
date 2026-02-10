import { useMutation } from "@tanstack/react-query";
import { decodeJwt } from "jose";
import { request } from "@/config/request";
import { useAuthStore } from "@/hooks/store/auth";
import { logAnonymousTokenIssued } from "@/lib/telemetry";
import { LoginPayload, LoginResponse, TokenResponse } from "./type";

const login = (payload: LoginPayload) =>
  request<LoginResponse>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      gotrue_meta_security: payload.gotrue_meta_security ?? { captcha_token: null },
    }),
    skipAuth: true,
  });

/** POST /auth/anonymous – no auth, no body; returns 1-day JWT for anonymous usage */
const fetchAnonymousToken = () =>
  request<TokenResponse>("/auth/anonymous", {
    method: "POST",
    skipAuth: true,
  });

export const useLogin = () =>
  useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      useAuthStore
        .getState()
        .setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          // Force 100 days expiry as per user request
          expires_at: Math.floor(Date.now() / 1000) + (100 * 24 * 60 * 60),
          user: data.user,
        });
    },
  });

export const useAnonymousLogin = () =>
  useMutation({
    mutationFn: fetchAnonymousToken,
    onSuccess: (data) => {
      const payload = decodeJwt(data.access_token) as { sub?: string };
      const sub = payload.sub ?? "anonymous";
      const nowSec = Math.floor(Date.now() / 1000);
      const expires_at = nowSec + data.expires_in;

      useAuthStore.getState().setSession({
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

      const sessionId = crypto.randomUUID?.() ?? `sess-${Date.now()}`;
      const deviceId =
        (typeof window !== "undefined" && (window as any).__FINGERPRINT_CONTEXT__?.data?.device_id) ??
        "unknown-device";
      logAnonymousTokenIssued(sub, sessionId, deviceId);
    },
  });
