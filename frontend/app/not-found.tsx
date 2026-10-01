import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
        404
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
        Page not found
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        The page you’re looking for may have moved or no longer exists.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-[#007aff] px-5 py-3 text-sm font-medium text-white shadow-[0_8px_18px_rgba(0,122,255,0.18)] hover:bg-[#006fe6]"
      >
        Return home
      </Link>
    </div>
  );
}
