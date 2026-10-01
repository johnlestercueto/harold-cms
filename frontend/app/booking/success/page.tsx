import Link from "next/link";

export const metadata = {
  title: "Booking success | Burj Calapan",
  description: "Your reservation request has been received successfully.",
};

export default function BookingSuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-emerald-200 bg-white p-8 shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
          ✓
        </div>
        <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
          Booking request received
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
          Your stay is on the list.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          We’ve received your booking details and will confirm the reservation
          with the final pricing from the backend system.
        </p>

        <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left text-sm text-slate-600">
          <div className="flex justify-between gap-3 border-b border-slate-200 pb-3">
            <span>Reference</span>
            <span className="font-semibold text-slate-900">CTH-2026-0001</span>
          </div>
          <div className="mt-3 flex justify-between gap-3 border-b border-slate-200 pb-3">
            <span>Payment status</span>
            <span className="font-semibold text-slate-900">Pending</span>
          </div>
          <div className="mt-3 flex justify-between gap-3">
            <span>Next steps</span>
            <span className="font-semibold text-slate-900">
              Check email for confirmation
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/transient-houses"
            className="inline-flex rounded-full bg-[#007aff] px-5 py-3 text-sm font-medium text-white shadow-[0_8px_18px_rgba(0,122,255,0.18)] hover:bg-[#006fe6]"
          >
            Explore more stays
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
