import { getApiBaseUrl } from "@/lib/payload/client";

export async function isPayloadAvailable() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `${getApiBaseUrl()}/api/globals/site-settings`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}
