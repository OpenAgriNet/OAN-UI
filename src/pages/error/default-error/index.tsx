// index.tsx
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import React from "react";

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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="group relative w-full max-w-sm overflow-hidden rounded-3xl p-[1px] transition-all hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 opacity-70 blur-sm transition-opacity group-hover:opacity-100" />
        <div className="relative h-full w-full rounded-[23px] bg-card/90 backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-6 p-8 text-center">
            
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-red-500/10 p-3 shadow-inner ring-1 ring-red-500/20">
               <AlertTriangle className="h-full w-full text-red-500 drop-shadow-sm" />
            </div>
            
            <div className="space-y-2 w-full">
              <h1 className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Something went wrong
              </h1>
              <p className="px-2 text-sm leading-relaxed text-muted-foreground break-words">
                {message}
              </p>
            </div>

            <div className="flex flex-col w-full gap-3 pt-2">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-primary/20"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>
              
              <a href="/" className="w-full no-underline">
                <button 
                  className="w-full border border-input text-foreground hover:bg-accent hover:text-accent-foreground h-10 rounded-xl flex items-center justify-center transition-colors bg-transparent"
                >
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
