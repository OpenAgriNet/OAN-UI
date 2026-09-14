import { useEffect, useMemo, useState } from "react";

function AgriStackCallbackPage() {
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
      query,
      hash: url.hash || null,
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const queryString = url.searchParams.toString();
    const backendUrl = `/api/callback${queryString ? `?${queryString}` : ""}`;

    console.info("[callback] received", payload);
    console.info("[callback] forwarding", { backendUrl });

    const run = async () => {
      setForwardStatus("sending");
      setForwardError("");

      try {
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: "frontend_callback",
            payload,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend callback failed with status ${response.status}`);
        }

        const responseData = await response.json();
        console.info("[callback] backend forward success", responseData);

        setForwardStatus("success");
      } catch (error) {
        setForwardStatus("error");
        setForwardError(error instanceof Error ? error.message : "Unknown forwarding error");
        console.error("[callback] backend forward error", error);
      } finally {
        const redirectSearch = url.search || "";
        sessionStorage.setItem("oan:callback-no-back", "1");
        window.location.replace(`/chat${redirectSearch}`);
      }
    };

    void run();
  }, [payload]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 p-6 sm:p-10">
      <h1 className="text-2xl font-semibold">Callback Received</h1>
      <p className="text-sm text-muted-foreground">
        This page accepts any query parameters. Use this URL as the AgriStack frontend redirect callback.
      </p>

      <section className="rounded-xl border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Summary</h2>
        <ul className="space-y-2 text-sm">
          <li><span className="font-medium">from:</span> {payload.from ?? "(not provided)"}</li>
          <li><span className="font-medium">path:</span> {payload.fullPath}</li>
          <li><span className="font-medium">backend forward:</span> {forwardStatus}</li>
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

export default AgriStackCallbackPage;
