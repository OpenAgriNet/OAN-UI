import lockImg from "@/assets/lockImg.svg";

export default function AuthError() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="group relative w-full max-w-sm overflow-hidden rounded-3xl p-[1px] transition-all hover:scale-[1.01]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 opacity-70 blur-sm transition-opacity group-hover:opacity-100" />
        <div className="relative h-full w-full rounded-[23px] bg-card/90 backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-6 p-10 text-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-500/20 to-pink-500/20 p-4 shadow-inner ring-1 ring-white/10">
              <img src={lockImg} alt="Locked" className="h-full w-full object-contain drop-shadow-md" />
            </div>
            
            <div className="space-y-3">
              <h1 className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                Login Required
              </h1>
              <p className="px-2 text-sm leading-relaxed text-muted-foreground">
                Please log in to continue and access this secure page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
