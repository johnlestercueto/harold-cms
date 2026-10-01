import type { Announcement, ApiListResponse } from "@/types/payload";
import { payloadFetch } from "@/lib/payload/client";

export async function getAnnouncements() {
  return payloadFetch<ApiListResponse<Announcement>>(
    "/api/announcements?where[active][equals]=true&sort=publishedDate&limit=20",
    { method: "GET" },
    { cache: "no-store" },
  );
}

export async function getAnnouncementBySlug(slug: string) {
  const response = await payloadFetch<ApiListResponse<Announcement>>(
    `/api/announcements?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`,
    { method: "GET" },
    { cache: "no-store" },
  );

  if (!response || !response.docs.length) {
    return null;
  }

  return response.docs[0];
}
