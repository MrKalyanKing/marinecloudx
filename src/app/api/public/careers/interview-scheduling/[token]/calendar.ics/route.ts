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

export async function GET(request: NextRequest, context: RouteContext): Promise<Response> {
  const { token } = await context.params;

  try {
    const backendResponse = await fetch(
      `${API_URL}/public/careers/interview-scheduling/${encodeURIComponent(token)}/calendar.ics`,
      { cache: "no-store" },
    );

    const icsText = await backendResponse.text();
    return new Response(icsText, {
      status: backendResponse.status,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="interview.ics"',
      },
    });
  } catch {
    return new Response("Could not generate calendar file.", { status: 502 });
  }
}
