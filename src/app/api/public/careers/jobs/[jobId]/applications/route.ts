import { NextResponse, type NextRequest } from "next/server";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = (
  rawApiUrl.startsWith("http://") || rawApiUrl.startsWith("https://")
    ? rawApiUrl
    : `https://${rawApiUrl}`
).replace(/\/+$/, "");

interface RouteContext {
  params: Promise<{ jobId: string }>;
}

export async function POST(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  const { jobId } = await context.params;
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  try {
    const formData = await request.formData();
    const backendResponse = await fetch(
      `${API_URL}/public/careers/jobs/${encodeURIComponent(jobId)}/applications`,
      {
        method: "POST",
        headers: { "x-forwarded-for": clientIp },
        body: formData,
        signal: AbortSignal.timeout(45_000),
      },
    );

    const data = await backendResponse.json().catch(() => null);
    if (data) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "We could not submit your application right now. Please try again shortly.",
        },
      },
      { status: 502 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "We could not submit your application right now. Please try again shortly.",
        },
      },
      { status: 502 },
    );
  }
}
