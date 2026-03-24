import { useState, useEffect, useCallback } from "react";
import { request } from "@/config/request";
import type { UserMeResponse } from "./type";
import { useAuthStore } from "@/hooks/store/auth";

export function useUserProfile() {
  const [data, setData] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const user = useAuthStore((s) => s.user);
  const isAuthed = useAuthStore((s) => s.isAuthed);

  const fetch = useCallback(async () => {
    if (!isAuthed() || user?.is_guest_user) {
      setData({ status: "anonymous", farmer: null });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await request<UserMeResponse>("/api/user/me");
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch profile"));
      setData({ status: "error", farmer: null });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthed, user?.is_guest_user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
