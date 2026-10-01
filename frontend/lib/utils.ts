import type { Media } from "@/types/payload";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export function formatCurrency(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-PH").format(Number(value ?? 0));
}

export function formatDate(
  value: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...options,
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export function getNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();

  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function resolveMediaUrl(media?: Media | number | null): string | null {
  if (!media) return null;

  if (typeof media === "number") return null;

  if (media.url) {
    if (media.url.startsWith("http://") || media.url.startsWith("https://")) {
      return media.url;
    }

    return `${apiBaseUrl}${media.url}`;
  }

  return null;
}

export function getSafeText(value: string | null | undefined): string {
  return value?.trim() || "";
}

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
