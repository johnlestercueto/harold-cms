import type { ApiListResponse, GcashAccount } from "@/types/payload";
import { payloadFetch } from "@/lib/payload/client";

export async function getActiveGcashAccount() {
  const response = await payloadFetch<ApiListResponse<GcashAccount>>(
    "/api/gcash-accounts?where[active][equals]=true&limit=1&sort=-updatedAt",
    { method: "GET" },
    { cache: "no-store" },
  );

  return response?.docs?.[0] ?? null;
}
