import { NextResponse, type NextRequest } from "next/server";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = (
  rawApiUrl.startsWith("http://") || rawApiUrl.startsWith("https://")
    ? rawApiUrl
    : `https://${rawApiUrl}`
).replace(/\/+$/, "");

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function POST(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { token } = await context.params;

  try {
    const body = await request.json().catch(() => ({}));
    const backendResponse = await fetch(
      `${API_URL}/public/careers/interview-scheduling/${encodeURIComponent(token)}/book`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30_000),
      },
    );

    const data = await backendResponse.json().catch(() => null);
    if (data) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(
      {
        success: false,
        error: { message: "Could not complete interview booking. Please try again." },
      },
      { status: backendResponse.status || 502 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Could not reach the scheduling service. Please check connection and try again." },
      },
      { status: 502 },
    );
  }
}
