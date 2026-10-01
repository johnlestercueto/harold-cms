const API_BASE_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export function buildQueryString(params: QueryParams = {}): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function payloadFetch<T>(
  path: string,
  init: RequestInit = {},
  options?: { cache?: RequestCache; next?: { revalidate?: number } },
): Promise<T | null> {
  const url = path.startsWith("http")
    ? path
    : typeof window === "undefined"
      ? `${API_BASE_URL}${path}`
      : path;

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.headers || {}),
      },
      cache: options?.cache ?? "no-store",
      next: options?.next,
    });

    const result = (await response.json()) as T;
    return result;
  } catch {
    return null;
  }
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
