import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import React from "react";

interface DefaultErrorProps {
  error?: unknown;
  reset?: () => void;
}

export default function DefaultError({ error, reset }: DefaultErrorProps) {
  const message =
    typeof error === "string"
      ? error
      : (error && (error as any).message) || null;

  const debugText =
    (error && (error as any).stack) ||
    (error && typeof error === "object" ? JSON.stringify(error, null, 2) : null);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-50 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                {message ?? "An unexpected error occurred. Please try again."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>
              If the problem persists, try reloading the page or contact support.
            </p>

            {debugText ? (
              <pre
                className="mt-4 max-h-40 overflow-auto rounded-md bg-surface p-3 text-xs font-mono text-left"
                aria-live="polite"
              >
                {debugText}
              </pre>
            ) : null}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              // best-effort reset call if provided
              if (reset) reset();
              else window.location.reload();
            }}
            title="Retry"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>

          <a href="/" className="no-underline">
            <Button variant="secondary">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
