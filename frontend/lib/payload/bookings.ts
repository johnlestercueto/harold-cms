import type {
  ApiListResponse,
  Booking,
  BookingFormValues,
} from "@/types/payload";
import { payloadFetch } from "@/lib/payload/client";

export async function getUserBookings(email: string, token?: string) {
  if (!email) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const response = await payloadFetch<ApiListResponse<Booking>>(
    "/api/bookings?depth=2&limit=100&sort=-createdAt",
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
    { cache: "no-store" },
  );

  const docs = (response?.docs ?? []).filter((booking) => {
    const customer =
      typeof booking.customer === "object" && booking.customer !== null
        ? booking.customer
        : null;

    return customer?.email?.trim().toLowerCase() === normalizedEmail;
  });

  return {
    ...(response ?? {
      docs: [],
      totalDocs: 0,
      limit: 100,
      totalPages: 0,
      page: 1,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }),
    docs,
    totalDocs: docs.length,
  } as ApiListResponse<Booking>;
}

export function buildBookingSubmissionBody(payload: {
  token?: string;
  transientHouse: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequest?: string;
  additionalFees?: number;
  paymentMethod?: "gcash" | "cash";
  gcashReferenceNumber?: string;
}) {
  const sanitized = Object.fromEntries(
    Object.entries(payload).filter(
      ([key, value]) =>
        key !== "token" && value !== undefined && value !== null,
    ),
  );

  const body = new FormData();
  Object.entries(sanitized).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "number") {
      body.append(key, String(value));
      return;
    }

    body.append(key, JSON.stringify(value));
  });

  return body;
}

export async function createBooking(payload: {
  token?: string;
  transientHouse: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequest?: string;
  additionalFees?: number;
  paymentMethod?: "gcash" | "cash";
  gcashReferenceNumber?: string;
}) {
  const bookingPayload: Record<string, unknown> = {
    ...Object.fromEntries(
      Object.entries(payload).filter(([key]) => key !== "token"),
    ),
  };

  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(payload.token ? { Authorization: `Bearer ${payload.token}` } : {}),
    },
    body: JSON.stringify(bookingPayload),
    cache: "no-store",
  });

  const text = await response.text();

  try {
    const json = text ? JSON.parse(text) : {};
    return json as {
      doc?: Booking;
      error?: string;
      message?: string;
      errors?: Array<{ message?: string }>;
    };
  } catch {
    return {
      message: text || "Unable to create your booking request.",
    } as {
      doc?: Booking;
      error?: string;
      message?: string;
      errors?: Array<{ message?: string }>;
    };
  }
}

export function calculateBookingPreview({
  pricePerNight,
  checkIn,
  checkOut,
  additionalFees = 0,
}: {
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  additionalFees?: number;
}) {
  const nights = Math.max(
    0,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const subtotal = pricePerNight * nights;
  const total = subtotal + additionalFees;

  return { nights, subtotal, additionalFees, total };
}

export function getBookingFormDefaults(): BookingFormValues {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const inTwoDays = new Date(today);
  inTwoDays.setDate(today.getDate() + 2);

  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: today.toISOString().slice(0, 10),
    checkOut: tomorrow.toISOString().slice(0, 10),
    guests: 2,
    specialRequest: "",
    paymentMethod: "cash",
    gcashReferenceNumber: "",
  };
}
