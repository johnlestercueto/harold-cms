export function MaintenanceScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-sm sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/10 text-3xl text-amber-300">
          ⚠
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-amber-300">
          System update
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Under maintenance
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-300">
          We are currently updating the site and the backend is temporarily
          unavailable. Please try again in a few minutes.
        </p>
      </div>
    </div>
  );
}
