import { NextResponse } from "next/server";

const PAYLOAD_API_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = new URL(`${PAYLOAD_API_URL}/api/transient-houses`);

  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
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
            responseText || "Unable to load transient houses from the CMS.",
        },
        { status: response.status },
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the transient houses service." },
      { status: 502 },
    );
  }
}
