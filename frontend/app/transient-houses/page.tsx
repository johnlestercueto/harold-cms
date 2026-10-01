import Link from "next/link";
import { HouseCard } from "@/components/houses/HouseCard";
import { getTransientHouses } from "@/lib/payload/houses";

export const metadata = {
  title: "Transient Houses | Burj Calapan",
  description:
    "Browse available transient houses in Calapan with pricing, amenities, and booking information.",
};

export default async function TransientHousesPage() {
  const response = await getTransientHouses({
    "where[status][equals]": "published",
    limit: 12,
    sort: "featured",
  });

  const houses = response?.docs ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Stay options
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Transient houses
          </h1>
        </div>
        <Link
          href="/booking"
          className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Book a stay
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {houses.length ? (
          houses.map((house) => (
            <HouseCard key={house.id ?? house.slug} house={house} />
          ))
        ) : (
          <div className="md:col-span-2 xl:col-span-3 rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No published houses are available in the CMS right now.
          </div>
        )}
      </div>
    </div>
  );
}
