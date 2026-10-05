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

export async function GET(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { token } = await context.params;
  const date = request.nextUrl.searchParams.get("date") || "";

  try {
    const backendResponse = await fetch(
      `${API_URL}/public/careers/interview-scheduling/${encodeURIComponent(token)}/available-slots?date=${encodeURIComponent(date)}`,
      {
        headers: { accept: "application/json" },
        cache: "no-store",
      },
    );

    const data = await backendResponse.json().catch(() => null);
    if (data) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(
      {
        success: false,
        error: { message: "Could not load available time slots." },
      },
      { status: backendResponse.status || 502 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Could not reach the scheduling service. Please try again shortly." },
      },
      { status: 502 },
    );
  }
}
