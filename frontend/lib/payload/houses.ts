import type {
  ApiListResponse,
  Amenity,
  SiteSettings,
  TransientHouse,
} from "@/types/payload";
import { payloadFetch } from "@/lib/payload/client";

export async function getTransientHouses(
  params: Record<string, string | number | boolean | undefined | null> = {},
) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.append(key, String(value));
  });

  const qs = query.toString();

  return payloadFetch<ApiListResponse<TransientHouse>>(
    `/api/transient-houses${qs ? `?${qs}` : ""}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
    { cache: "no-store" },
  );
}

export async function getFeaturedTransientHouses() {
  return payloadFetch<ApiListResponse<TransientHouse>>(
    "/api/transient-houses?where[status][equals]=published&where[featured][equals]=true&limit=4",
    { method: "GET" },
    { cache: "no-store" },
  );
}

export async function getTransientHouseBySlug(slug: string) {
  const response = await payloadFetch<ApiListResponse<TransientHouse>>(
    `/api/transient-houses?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`,
    { method: "GET" },
    { cache: "no-store" },
  );

  if (!response || !response.docs.length) {
    return null;
  }

  return response.docs[0];
}

export async function getAmenities() {
  return payloadFetch<ApiListResponse<Amenity>>(
    "/api/amenities?where[active][equals]=true&limit=50&sort=name",
    { method: "GET" },
    { cache: "no-store" },
  );
}

export async function getSiteSettings() {
  return payloadFetch<SiteSettings>(
    "/api/globals/site-settings",
    { method: "GET" },
    { cache: "no-store" },
  );
}
