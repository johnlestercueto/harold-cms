import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency, resolveMediaUrl } from "@/lib/utils";
import { getTransientHouseBySlug } from "@/lib/payload/houses";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const house = await getTransientHouseBySlug(resolved.slug);

  return {
    title: house
      ? `${house.name} | Burj Calapan`
      : "House details | Burj Calapan",
    description: house
      ? house.shortDescription || house.description
      : "Find information about a transient house in Calapan.",
  };
}

export default async function TransientHouseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const house = await getTransientHouseBySlug(resolved.slug);

  if (!house) {
    notFound();
  }

  const imageList = [house.featuredImage, ...(house.gallery ?? [])]
    .filter((entry): entry is number | { url?: string | null } =>
      Boolean(entry),
    )
    .map((entry) => resolveMediaUrl(entry));
  const amenities = (
    (house.amenities ?? []) as Array<{ name?: string } | number>
  )
    .map((item) => (typeof item === "object" && item !== null ? item.name : ""))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3 text-sm text-slate-500">
        <Link href="/transient-houses" className="hover:text-slate-900">
          Houses
        </Link>
        <span>/</span>
        <span className="text-slate-700">{house.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            {imageList.length ? (
              <Image
                src={imageList[0] ?? "/"}
                alt={house.name}
                width={1200}
                height={760}
                unoptimized
                className="h-[460px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[460px] items-center justify-center bg-slate-100 text-slate-500">
                No image available
              </div>
            )}
          </div>

          {imageList.length > 1 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {imageList.slice(0, 3).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-[22px] border border-slate-200 bg-white"
                >
                  <Image
                    src={image ?? "/"}
                    alt={`${house.name} gallery ${index + 1}`}
                    width={500}
                    height={280}
                    unoptimized
                    className="h-32 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              {house.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {house.description}
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                  From
                </p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">
                  {formatCurrency(house.pricePerNight)}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${house.available === false ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
              >
                {house.available === false ? "Not available" : "Available"}
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span>Capacity</span>
                <span className="font-medium text-slate-900">
                  {house.capacity} guests
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span>Bedrooms</span>
                <span className="font-medium text-slate-900">
                  {house.bedrooms ?? 1}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span>Beds</span>
                <span className="font-medium text-slate-900">
                  {house.beds ?? 1}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span>Bathrooms</span>
                <span className="font-medium text-slate-900">
                  {house.bathrooms ?? 1}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span>Location</span>
                <span className="font-medium text-slate-900">
                  {house.barangay || house.city || "Calapan"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Minimum stay</span>
                <span className="font-medium text-slate-900">
                  {house.minimumStay ?? 1} night(s)
                </span>
              </div>
            </div>

            <Link
              href={`/booking?house=${encodeURIComponent(house.slug)}&houseId=${house.id ?? ""}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#007aff] px-5 py-3 text-sm font-medium text-white shadow-[0_8px_18px_rgba(0,122,255,0.18)] hover:bg-[#006fe6]"
            >
              Book this stay
            </Link>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.length ? (
                amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {amenity}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  No amenities listed.
                </span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
