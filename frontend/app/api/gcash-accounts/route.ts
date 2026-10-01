import { NextResponse } from "next/server";

const PAYLOAD_API_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export async function GET() {
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/gcash-accounts?where[active][equals]=true&limit=1&sort=-updatedAt`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );
    const result = await response.json();

    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the GCash account service." },
      { status: 502 },
    );
  }
}
