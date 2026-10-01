import type { ApiListResponse, Faq } from "@/types/payload";
import { payloadFetch } from "@/lib/payload/client";

export async function getFAQs() {
  return payloadFetch<ApiListResponse<Faq>>(
    "/api/faqs?where[active][equals]=true&sort=order&limit=50",
    { method: "GET" },
    { cache: "no-store" },
  );
}
