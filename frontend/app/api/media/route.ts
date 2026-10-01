import { NextResponse } from "next/server";

const PAYLOAD_API_URL =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");

  try {
    const formData = await request.formData();
    const response = await fetch(`${PAYLOAD_API_URL}/api/media`, {
      method: "POST",
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: formData,
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
            responseText || "The media service returned an empty response.",
        },
        { status: response.status },
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the media service." },
      { status: 502 },
    );
  }
}
