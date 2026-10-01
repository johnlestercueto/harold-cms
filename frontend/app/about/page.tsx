import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About | Burj Calapan",
  description:
    "Learn about Burj Calapan and the service behind each comfortable stay.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          About us
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          A comfortable, dependable place to stay in Calapan.
        </h1>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            What we offer
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Burj Calapan helps guests find clean, practical, and welcoming
            places to stay in Calapan, Oriental Mindoro. Whether someone is
            visiting for work, a family trip, or a short getaway, the goal is to
            make the stay easy, safe, and comfortable.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Why guests choose us
          </h2>
          <ul className="mt-4 space-y-3 text-base text-slate-600">
            <li>• Clear room details and transparent pricing</li>
            <li>• Convenient locations in and around Calapan</li>
            <li>• Straightforward booking and responsive support</li>
            <li>• Spaces designed for comfort and everyday practicality</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-[32px] border border-[#007aff]/10 bg-[#eaf3ff]/80 p-8 text-slate-900 shadow-[0_18px_50px_rgba(0,122,255,0.08)] sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#007aff]">
          Our purpose
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          We aim to make each stay smooth and comfortable by matching guests
          with the right place to rest, relax, and feel at home during their
          time in Calapan.
        </p>
        <div className="mt-8">
          <Button href="/transient-houses">Find a stay</Button>
        </div>
      </div>
    </div>
  );
}
