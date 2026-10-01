import { NextResponse } from "next/server";

const PAYLOAD_API_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await fetch(`${PAYLOAD_API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the account service." },
      { status: 502 },
    );
  }
}
