import { ShieldX, Home, ArrowLeft } from "lucide-react";

const Forbidden = () => {
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
              <ShieldX className="h-10 w-10 text-destructive" />
            </div>

            <div className="w-full space-y-2">
              <h1 className="text-5xl font-extrabold tracking-tight text-destructive">
                403
              </h1>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Access Denied
              </h2>
              <p className="px-4 text-sm leading-relaxed text-muted-foreground">
                You do not have permission to access this resource.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 pt-2">
              <a href="/" className="w-full no-underline">
                <button className="flex h-10 w-full items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground hover:opacity-90">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </button>
              </a>

              <button
                onClick={() => window.history.back()}
                className="flex h-10 w-full items-center justify-center rounded-xl border border-border bg-transparent text-foreground hover:bg-muted"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
