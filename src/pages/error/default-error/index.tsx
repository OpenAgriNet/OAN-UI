import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface DefaultErrorProps {
  error?: unknown;
  reset?: () => void;
}

export default function DefaultError({ error }: DefaultErrorProps) {
  const message =
    typeof error === "string"
      ? error
      : (error && (error as any).message) || "An unexpected error occurred.";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div
        style={{
          padding: "1px",
          background: "var(--primary)",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "400px"
        }}
      >
        <div
          className="w-full bg-card"
          style={{
            borderRadius: "23px",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <div
            style={{ backgroundColor: "rgba(128, 128, 128, 0.08)" }}
            className="flex w-full flex-col items-center space-y-6 p-8 text-center"
          >
            <div className="rounded-full bg-destructive/20 p-4">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>

            <div className="w-full space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Something went wrong
              </h1>
              <p className="break-words px-4 text-sm leading-tight text-muted-foreground">
                {message}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex h-10 w-full items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground hover:opacity-90"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>

              <a href="/" className="w-full no-underline">
                <button className="flex h-10 w-full items-center justify-center rounded-xl border border-border bg-transparent text-foreground hover:bg-muted">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
