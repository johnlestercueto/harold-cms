import { NextResponse } from "next/server";

const PAYLOAD_API_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

async function getOverlappingBookingMessage(
  transientHouseId: number | string,
  checkIn: string,
  checkOut: string,
  authorization?: string | null,
): Promise<string | null> {
  try {
    const query = new URLSearchParams({
      "where[transientHouse][equals]": String(transientHouseId),
      limit: "100",
    });

    const response = await fetch(
      `${PAYLOAD_API_URL}/api/bookings?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(authorization ? { Authorization: authorization } : {}),
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as {
      docs?: Array<{
        id?: number;
        checkIn?: string;
        checkOut?: string;
        status?: string;
      }>;
    };

    const requestedStart = new Date(checkIn).getTime();
    const requestedEnd = new Date(checkOut).getTime();

    const hasOverlap = (result.docs ?? []).some((booking) => {
      const status = String(booking.status ?? "").toLowerCase();
      if (!status || !["pending", "confirmed"].includes(status)) {
        return false;
      }

      const existingStart = new Date(booking.checkIn ?? 0).getTime();
      const existingEnd = new Date(booking.checkOut ?? 0).getTime();

      return requestedStart < existingEnd && requestedEnd > existingStart;
    });

    return hasOverlap
      ? "This house is already booked for the selected dates."
      : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const url = new URL(`${PAYLOAD_API_URL}/api/bookings`);

  const { searchParams } = new URL(request.url);
  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    try {
      return NextResponse.json(JSON.parse(responseText), {
        status: response.status,
      });
    } catch {
      return NextResponse.json(
        {
          message:
            responseText || "Unable to load bookings from the booking service.",
        },
        { status: response.status },
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the booking service." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    customer?: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address?: string;
      notes?: string;
    };
    [key: string]: unknown;
  };
  const authorization = request.headers.get("authorization");

  try {
    const customer = body.customer;
    if (!customer) {
      return NextResponse.json(
        { message: "Customer details are required." },
        { status: 400 },
      );
    }

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(authorization ? { Authorization: authorization } : {}),
    };
    const customerQuery = new URLSearchParams({
      "where[email][equals]": customer.email,
      limit: "1",
    });
    const existingCustomerResponse = await fetch(
      `${PAYLOAD_API_URL}/api/customers?${customerQuery.toString()}`,
      { headers, cache: "no-store" },
    );
    const existingCustomerResult = (await existingCustomerResponse.json()) as {
      docs?: Array<{ id?: number }>;
    };
    let customerId = existingCustomerResult.docs?.[0]?.id;

    if (!customerId) {
      const newCustomerResponse = await fetch(
        `${PAYLOAD_API_URL}/api/customers`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(customer),
          cache: "no-store",
        },
      );
      const newCustomerResult = (await newCustomerResponse.json()) as {
        doc?: { id?: number };
        errors?: Array<{ message?: string }>;
        message?: string;
      };
      customerId = newCustomerResult.doc?.id;

      if (!customerId) {
        return NextResponse.json(
          {
            errors: newCustomerResult.errors,
            message:
              newCustomerResult.message ||
              "Unable to create the customer record.",
          },
          { status: newCustomerResponse.status },
        );
      }
    }

    const bookingBody = {
      ...body,
      customer: customerId,
    } as typeof body & {
      customer: number;
      transientHouse?: number | string;
      checkIn?: string;
      checkOut?: string;
    };
    const overlapMessage = await getOverlappingBookingMessage(
      bookingBody.transientHouse as number | string,
      String(bookingBody.checkIn ?? ""),
      String(bookingBody.checkOut ?? ""),
      authorization,
    );

    if (overlapMessage) {
      return NextResponse.json({ message: overlapMessage }, { status: 409 });
    }

    const response = await fetch(`${PAYLOAD_API_URL}/api/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(bookingBody),
      cache: "no-store",
    });

    const responseText = await response.text();
    try {
      return NextResponse.json(JSON.parse(responseText), {
        status: response.status,
      });
    } catch {
      return NextResponse.json(
        {
          message:
            responseText || "The booking service returned an empty response.",
        },
        { status: response.status },
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the booking service." },
      { status: 502 },
    );
  }
}
