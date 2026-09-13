import { NextResponse, type NextRequest } from "next/server";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = (
  rawApiUrl.startsWith("http://") || rawApiUrl.startsWith("https://")
    ? rawApiUrl
    : `https://${rawApiUrl}`
).replace(/\/+$/, "");

interface ContactPayload {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface LeadRequestPayload {
  contact: ContactPayload;
  companyName?: string;
  requirement?: string;
  timeline?: string;
  serviceId?: string;
  budgetMin?: number;
  budgetMax?: number;
  budgetCurrency?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: LeadRequestPayload;
  try {
    body = (await request.json()) as LeadRequestPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "Invalid JSON payload." } },
      { status: 400 },
    );
  }

  // Ensure contact firstName is present
  if (!body.contact?.firstName?.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Please check the highlighted fields.",
          details: [{ path: "name", message: "Please provide your name." }],
        },
      },
      { status: 400 },
    );
  }

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Attempt to proxy to the NestJS backend
  try {
    const backendResponse = await fetch(`${API_URL}/public/leads`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": clientIp,
      },
      body: JSON.stringify(body),
      // Short timeout so we don't hang if backend is down
      signal: AbortSignal.timeout(6000),
    });

    const data = await backendResponse.json().catch(() => null);

    if (backendResponse.ok && data?.success) {
      // Backend committed lead to DB and dispatched emails via Resend
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // Pass through 4xx validation errors if backend responded
    if (backendResponse.status < 500 && data) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    console.warn(
      `[leads/route] Backend returned status ${backendResponse.status}. Attempting direct email fallback.`,
    );
  } catch (backendError) {
    console.warn(
      "[leads/route] Could not reach backend API:",
      backendError instanceof Error ? backendError.message : backendError,
    );
  }

  // 2. Resilient Fallback: If backend is unreachable or errored, send directly via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey !== "YOUR_RESEND_API_KEY_HERE") {
    try {
      await sendFallbackEmails(body, resendApiKey);
      return NextResponse.json(
        {
          success: true,
          data: {
            id: `fallback_${Date.now()}`,
            message: "Enquiry received successfully.",
          },
        },
        { status: 201 },
      );
    } catch (mailError) {
      console.error("[leads/route] Direct email dispatch failed:", mailError);
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Unable to submit your enquiry at this moment. Please try again or contact srikanth@marinecloudx.in directly.",
      },
    },
    { status: 503 },
  );
}

// ─────────────────────────────────────────── Resend Direct Fallback
async function sendFallbackEmails(p: LeadRequestPayload, apiKey: string): Promise<void> {
  const from = process.env.MAIL_FROM || "no-reply@marinecloudx.in";
  const companyEmail = process.env.COMPANY_NOTIFICATION_EMAIL || "srikanth@marinecloudx.in";
  const clientName = p.contact.firstName + (p.contact.lastName ? ` ${p.contact.lastName}` : "");

  let budgetStr: string | undefined;
  if (p.budgetMin != null || p.budgetMax != null) {
    const curr = p.budgetCurrency || "INR";
    if (p.budgetMin != null && p.budgetMax != null) {
      budgetStr = `${curr} ${p.budgetMin.toLocaleString()} – ${p.budgetMax.toLocaleString()}`;
    } else if (p.budgetMin != null) {
      budgetStr = `${curr} ${p.budgetMin.toLocaleString()}+`;
    } else {
      budgetStr = `Up to ${curr} ${p.budgetMax!.toLocaleString()}`;
    }
  }

  const tasks: Promise<unknown>[] = [];

  // Internal notification to company
  tasks.push(
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `MarineCloudX CRM <${from}>`,
        to: [companyEmail],
        subject: `New Project Enquiry: ${clientName}`,
        html: buildCompanyAlertHtml(p, clientName, budgetStr),
      }),
    }),
  );

  // Client confirmation
  if (p.contact.email) {
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `MarineCloudX <${from}>`,
          to: [p.contact.email],
          subject: "We've received your project enquiry — MarineCloudX",
          html: buildClientReceiptHtml(p, clientName, budgetStr),
        }),
      }),
    );
  }

  await Promise.all(tasks);
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const tdLabel = `padding:7px 12px 7px 0;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;vertical-align:top;width:130px;`;
const tdValue = `padding:7px 0;font-size:13px;color:#111827;vertical-align:top;word-break:break-word;`;

function buildClientReceiptHtml(p: LeadRequestPayload, clientName: string, budgetStr?: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Enquiry Confirmation</title></head>
<body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08);" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 70%,#533483 100%);padding:48px 48px 40px;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">We&rsquo;ve got your message.</h1>
              <p style="margin:12px 0 0;font-size:15px;color:rgba(255,255,255,0.75);line-height:1.6;">Thank you for reaching out to MarineCloudX. We will review your requirement and get back to you shortly.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Hello, ${esc(clientName)}</p>
              <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
                We have received your project enquiry and our engineering leadership will review it within <strong>1 business day</strong>. Here is a summary of what you shared:
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;margin-bottom:28px;">
                <tr><td style="padding:20px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    ${p.timeline ? `<tr><td style="${tdLabel}">Timeline</td><td style="${tdValue}">${esc(p.timeline)}</td></tr>` : ""}
                    ${budgetStr ? `<tr><td style="${tdLabel}">Budget</td><td style="${tdValue}">${esc(budgetStr)}</td></tr>` : ""}
                    ${p.requirement ? `<tr><td style="${tdLabel}">Requirement</td><td style="${tdValue};white-space:pre-wrap;">${esc(p.requirement)}</td></tr>` : ""}
                  </table>
                </td></tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
                <tr><td align="center">
                  <a href="https://marinecloudx.in" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#533483,#0f3460);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:50px;">Visit our website &rarr;</a>
                </td></tr>
              </table>
              <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7;">
                If you have any further questions, you can reply directly to this email.<br/>
                <strong style="color:#374151;">— The MarineCloudX Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 48px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                MarineCloudX Technologies &bull; <a href="https://marinecloudx.in" style="color:#9ca3af;text-decoration:underline;">marinecloudx.in</a><br/>
                &copy; ${year} MarineCloudX. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildCompanyAlertHtml(p: LeadRequestPayload, clientName: string, budgetStr?: string): string {
  const year = new Date().getFullYear();
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long", timeStyle: "short" });
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>New Lead</title></head>
<body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.08);" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background:linear-gradient(135deg,#0d1117 0%,#161b22 100%);padding:32px 48px;border-bottom:3px solid #533483;">
              <span style="display:inline-block;background:#533483;color:#fff;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin-bottom:12px;">New Website Lead</span>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">${esc(clientName)}</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.6);">${now}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 48px 24px;">
              <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Contact Details</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;">
                <tr><td style="padding:20px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr><td style="${tdLabel}">Name</td><td style="${tdValue}">${esc(clientName)}</td></tr>
                    ${p.contact.email ? `<tr><td style="${tdLabel}">Email</td><td style="${tdValue}"><a href="mailto:${esc(p.contact.email)}">${esc(p.contact.email)}</a></td></tr>` : ""}
                    ${p.contact.phone ? `<tr><td style="${tdLabel}">Phone</td><td style="${tdValue}"><a href="tel:${esc(p.contact.phone)}">${esc(p.contact.phone)}</a></td></tr>` : ""}
                    ${(p.companyName || p.contact.company) ? `<tr><td style="${tdLabel}">Company</td><td style="${tdValue}">${esc(p.companyName || p.contact.company || "")}</td></tr>` : ""}
                    ${budgetStr ? `<tr><td style="${tdLabel}">Budget</td><td style="${tdValue}">${esc(budgetStr)}</td></tr>` : ""}
                    ${p.timeline ? `<tr><td style="${tdLabel}">Timeline</td><td style="${tdValue}">${esc(p.timeline)}</td></tr>` : ""}
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>
          ${p.requirement ? `<tr>
            <td style="padding:0 48px 28px;">
              <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Requirement</p>
              <div style="background:#f0f4ff;border-radius:12px;border:1px solid #c7d2fe;padding:20px;">
                <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.75;white-space:pre-wrap;">${esc(p.requirement)}</p>
              </div>
            </td>
          </tr>` : ""}
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 48px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                MarineCloudX CRM &bull; Automated lead alert<br/>
                &copy; ${year} MarineCloudX Technologies. Internal use only.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
