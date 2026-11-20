import { NextRequest, NextResponse } from "next/server";
import { validateAntiSpam, sendExecutiveNotification } from "@/lib/email";
import { executeDb, getDbPool } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, message, honeypot, clientLoadedAt } = body;

    // 1. Run Anti-Spam Check
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const spamCheck = validateAntiSpam({
      honeypot,
      clientLoadedAt: Number(clientLoadedAt),
      ip,
      message,
    });

    if (!spamCheck.valid) {
      // Return 400 with anti-spam block notice
      return NextResponse.json(
        { success: false, error: spamCheck.reason || "Submission blocked by anti-spam filter." },
        { status: 400 }
      );
    }

    // 2. Validate essential fields
    if (!name || !phone || !email) {
      return NextResponse.json(
        { success: false, error: "Please provide your name, phone number, and email." },
        { status: 400 }
      );
    }

    // 3. Save into MariaDB pipeline_leads as new inquiry
    const pool = getDbPool();
    const leadId = `INQ-${Date.now().toString().slice(-6)}`;

    if (pool) {
      try {
        await executeDb(
          `INSERT INTO pipeline_leads (id, customerName, phone, email, equipmentName, jobsiteAddress, quotedAmount, stage, priority)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            leadId,
            name,
            phone,
            email,
            "General Inquiry / Custom Equipment",
            message ? message.slice(0, 250) : "Website Contact Form",
            0.00,
            "inquired",
            "normal",
          ]
        );
      } catch (dbErr) {
        console.error("Database save inquiry warning:", dbErr);
      }
    }

    // 4. Send Email Notification to jbone@azrentalguy.com
    await sendExecutiveNotification({
      subject: `New Equipment Inquiry from ${name}`,
      type: "inquiry",
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      detailsHtml: `
        <div style="background: #F1F5F9; border-radius: 8px; padding: 16px; margin-top: 10px;">
          <strong style="color: #0F172A; display: block; margin-bottom: 8px;">Project Details / Message:</strong>
          <p style="color: #334155; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message || "No specific message provided."}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry successfully submitted and dispatched to J-Bone Industries dispatch team.",
      leadId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process inquiry" },
      { status: 500 }
    );
  }
}
