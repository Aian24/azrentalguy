import nodemailer from "nodemailer";
import { COMPANY_INFO } from "@/lib/fleet";

// In-memory rate limiting store (IP -> array of submission timestamps)
const rateLimitMap = new Map<string, number[]>();

export interface AntiSpamCheckResult {
  valid: boolean;
  reason?: string;
}

/**
 * Strict Anti-Spam Validator
 * 1. Honeypot check: Bots fill in hidden fields; humans do not.
 * 2. Submission time check: Submissions under 2 seconds are automated bots.
 * 3. IP Rate limiter: Max 5 submissions per 10 minutes per IP.
 * 4. Spam link / Russian / Cyrillic regex filter: Flags malicious links.
 */
export function validateAntiSpam(payload: {
  honeypot?: string;
  clientLoadedAt?: number;
  ip?: string;
  message?: string;
}): AntiSpamCheckResult {
  // 1. Honeypot Check
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    return { valid: false, reason: "Automated submission detected (honeypot triggered)" };
  }

  // 2. Timing Check (human needs at least 2 seconds to type & submit)
  if (payload.clientLoadedAt) {
    const elapsedSeconds = (Date.now() - payload.clientLoadedAt) / 1000;
    if (elapsedSeconds < 2) {
      return { valid: false, reason: "Form submitted too fast (automated bot protection)" };
    }
  }

  // 3. IP Rate Limiting (max 5 requests per 10 minutes)
  const clientIp = payload.ip || "unknown";
  if (clientIp !== "unknown") {
    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const existing = rateLimitMap.get(clientIp) || [];
    const validTimestamps = existing.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= 5) {
      return { valid: false, reason: "Too many requests. Please wait a few minutes before submitting again." };
    }

    validTimestamps.push(now);
    rateLimitMap.set(clientIp, validTimestamps);
  }

  // 4. Spam & Suspicious Content Filter
  if (payload.message) {
    const msg = payload.message.toLowerCase();
    // Check for spam phrases or common link injections
    const spamPatterns = [
      /\b(crypto|casino|viagra|cialis|seo ranking|backlink|t\.me\/|wa\.me\/)\b/i,
      /[\u0400-\u04FF]/, // Cyrillic characters in standard English equipment requests
    ];

    for (const pat of spamPatterns) {
      if (pat.test(msg)) {
        return { valid: false, reason: "Spam content pattern detected." };
      }
    }
  }

  return { valid: true };
}

/**
 * Creates nodemailer transport:
 * 1. Uses explicit SMTP if provided in environment variables
 * 2. Defaults to local Plesk Postfix/Sendmail on localhost:25
 */
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST || "localhost";
  const smtpPort = Number(process.env.SMTP_PORT) || 25;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  // Local Postfix on Plesk (no auth required for local loopback)
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Dispatches verified executive notification email to jbone@azrentalguy.com
 */
export async function sendExecutiveNotification(params: {
  subject: string;
  type: "inquiry" | "quote" | "signed_agreement";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  detailsHtml: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const recipient = process.env.NOTIFICATION_EMAIL || "jbone@azrentalguy.com";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; }
        .card { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 2px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .header { background: #0F172A; padding: 24px; text-align: center; border-bottom: 4px solid #CA021E; }
        .header h1 { color: #FFFFFF; font-size: 20px; font-weight: 900; margin: 0; letter-spacing: 0.5px; }
        .header p { color: #E5A919; font-size: 13px; font-weight: 700; margin: 6px 0 0 0; text-transform: uppercase; }
        .body { padding: 28px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .badge-red { background: #FEE2E2; color: #CA021E; }
        .badge-gold { background: #FEF3C7; color: #92400E; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 14px; }
        .info-label { font-weight: 700; color: #475569; }
        .info-val { font-weight: 800; color: #0F172A; text-align: right; }
        .footer { background: #F8FAFC; padding: 18px 28px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>J-BONE INDUSTRIES / AZ RENTAL GUY</h1>
          <p>${params.subject}</p>
        </div>
        <div class="body">
          <div style="margin-bottom: 20px;">
            <span class="badge ${params.type === 'signed_agreement' ? 'badge-gold' : 'badge-red'}">
              ${params.type.replace('_', ' ')}
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">Customer Name:</span>
            <span class="info-val">${params.customerName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-val"><a href="tel:${params.customerPhone}" style="color: #CA021E; text-decoration: none;">${params.customerPhone}</a></span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-val"><a href="mailto:${params.customerEmail}" style="color: #0F172A; text-decoration: none;">${params.customerEmail}</a></span>
          </div>

          <div style="margin-top: 24px;">
            ${params.detailsHtml}
          </div>
        </div>
        <div class="footer">
          Dispatched from <strong>azrentalguy.com</strong> production server. Anti-spam verified.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"AZ Rental Guy Dispatch" <no-reply@azrentalguy.com>`,
      to: recipient,
      replyTo: params.customerEmail,
      subject: `[AZ Rental Guy] ${params.subject} - ${params.customerName}`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Email dispatch notice error (falling back to database record):", error.message);
    return { success: false, error: error.message };
  }
}
