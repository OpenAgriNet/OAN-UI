import { useEffect, useMemo, useState } from "react";
import { Route } from "./routes";

function AgriStackCallbackWildcardPage() {
  const { callbackPath } = Route.useParams();
  const [forwardStatus, setForwardStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [forwardError, setForwardError] = useState<string>("");

  const payload = useMemo(() => {
    const url = new URL(window.location.href);
    const query: Record<string, string | string[]> = {};

    url.searchParams.forEach((value, key) => {
      const existing = query[key];
      if (existing === undefined) {
        query[key] = value;
        return;
      }

      query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    });

    return {
      from: url.searchParams.get("from") ?? null,
      fullPath: `${url.pathname}${url.search}${url.hash}`,
      callbackPath,
      query,
      hash: url.hash || null,
    };
  }, [callbackPath]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const callbackSessionId = url.searchParams.get("callbackSessionId");
    const statusParams = new URLSearchParams();
    if (url.searchParams.get("from")) {
      statusParams.set("from", url.searchParams.get("from") as string);
    }
    if (callbackSessionId) {
      statusParams.set("callbackSessionId", callbackSessionId);
    }
    const backendStatusUrl = `/api/callback/status${statusParams.toString() ? `?${statusParams.toString()}` : ""}`;

    console.info("[callback-wildcard] received", payload);
    console.info("[callback-wildcard] checking backend status", { backendStatusUrl });

    const run = async () => {
      setForwardStatus("sending");
      setForwardError("");

      try {
        if (!callbackSessionId) {
          console.warn("[callback-wildcard] callbackSessionId missing, skipping backend status check");
          setForwardStatus("success");
          return;
        }

        const response = await fetch(backendStatusUrl, { method: "GET" });

        if (!response.ok) {
          throw new Error(`Backend status check failed with status ${response.status}`);
        }

        const responseData = await response.json();
        console.info("[callback-wildcard] backend status success", responseData);

        setForwardStatus("success");
      } catch (error) {
        setForwardStatus("error");
        setForwardError(error instanceof Error ? error.message : "Unknown status check error");
        console.error("[callback-wildcard] backend status error", error);
      } finally {
        const redirectSearch = url.search || "";
        sessionStorage.setItem("oan:callback-no-back", "1");
        window.location.replace(`/chat${redirectSearch}`);
      }
    };

    void run();
  }, [callbackPath, payload]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 p-6 sm:p-10">
      <h1 className="text-2xl font-semibold">Callback Received</h1>
      <p className="text-sm text-muted-foreground">
        Wildcard callback path is accepted. Use this URL shape if AgriStack appends a path segment.
      </p>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Summary</h2>
        <ul className="space-y-2 text-sm">
          <li><span className="font-medium">from:</span> {payload.from ?? "(not provided)"}</li>
          <li><span className="font-medium">callbackPath:</span> {payload.callbackPath}</li>
          <li><span className="font-medium">path:</span> {payload.fullPath}</li>
          <li><span className="font-medium">backend status check:</span> {forwardStatus}</li>
          {forwardStatus === "error" && <li><span className="font-medium">error:</span> {forwardError}</li>}
        </ul>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Raw Query Payload</h2>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(payload.query, null, 2)}</pre>
      </section>
    </main>
  );
}

export default AgriStackCallbackWildcardPage;
