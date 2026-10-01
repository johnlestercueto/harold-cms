import Image from "next/image";
import Link from "next/link";
import { formatCurrency, resolveMediaUrl } from "@/lib/utils";
import type { TransientHouse } from "@/types/payload";

export function HouseCard({ house }: { house: TransientHouse }) {
  const imageUrl = resolveMediaUrl(house.featuredImage);
  const amenities = (house.amenities ?? [])
    .slice(0, 3)
    .map((item) => (typeof item === "object" && item !== null ? item.name : ""))
    .filter(Boolean);

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/80 bg-white/80 shadow-[0_14px_38px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.1)]">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={house.name}
            width={1200}
            height={720}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-medium text-slate-500">
            No image
          </div>
        )}
        {house.featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-900 shadow-sm">
            Featured
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              {house.houseType ?? "Stay"}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">
              {house.name}
            </h3>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${house.available === false ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
          >
            {house.available === false ? "Booked" : "Available"}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {house.shortDescription || house.description}
        </p>

        <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
          <span>{house.capacity} guests</span>
          <span>{house.bedrooms ?? 1} bedrooms</span>
          <span>{house.bathrooms ?? 1} baths</span>
        </div>

        {amenities.length ? (
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600"
              >
                {amenity}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div>
            <p className="text-2xl font-semibold text-slate-900">
              {formatCurrency(house.pricePerNight)}
            </p>
            <p className="text-xs text-slate-500">per night</p>
          </div>

          <Link
            href={`/transient-houses/${house.slug}`}
            className="rounded-full bg-[#007aff] px-4 py-2.5 text-sm font-medium text-white shadow-[0_7px_16px_rgba(0,122,255,0.18)] transition hover:bg-[#006fe6]"
          >
            View stay
          </Link>
        </div>
      </div>
    </article>
  );
}
