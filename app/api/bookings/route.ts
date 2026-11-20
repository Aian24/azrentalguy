import { NextResponse } from "next/server";
import { queryDb, executeDb, getDbPool } from "@/lib/db";
import { sendExecutiveNotification } from "@/lib/email";
import crypto from "crypto";

export async function GET() {
  try {
    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({ success: true, source: "memory", bookings: [] });
    }

    const rows = await queryDb<any>("SELECT * FROM bookings ORDER BY created_at DESC");
    return NextResponse.json({ success: true, bookings: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pool = getDbPool();

    const bookingId = body.id || `BK-${Date.now().toString().slice(-4)}`;
    const equipmentId = body.equipmentId || "cat-259d3";
    const equipmentName = body.equipmentName || "CAT 259D3 Compact Track Loader";
    const customerName = body.customerName || "Customer";
    const companyName = body.companyName || "";
    const phone = body.phone || "";
    const email = body.email || "";
    const jobsiteAddress = body.jobsiteAddress || "Phoenix, AZ";
    const startDate = body.startDate || new Date().toISOString().slice(0, 10);
    const endDate = body.endDate || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
    const status = body.status || "reserved";
    const quotedAmount = Number(body.quotedAmount || body.totalAmount || 0);
    const totalAmount = Number(body.totalAmount || quotedAmount || 0);
    const notes = body.notes || "";
    const signatureData = body.signatureData || null;

    // Generate cryptographic SHA-256 audit hash
    const rawData = `${customerName}|${bookingId}|${equipmentId}|${startDate}|${endDate}|${totalAmount}|${Date.now()}`;
    const auditHash = crypto.createHash("sha256").update(rawData).digest("hex");

    if (pool) {
      await executeDb(
        `INSERT INTO bookings (id, equipmentId, equipmentName, customerName, companyName, phone, email, jobsiteAddress, startDate, endDate, status, quotedAmount, totalAmount, notes, signatureData, auditHash)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status=VALUES(status), totalAmount=VALUES(totalAmount), signatureData=VALUES(signatureData), auditHash=VALUES(auditHash)`,
        [
          bookingId,
          equipmentId,
          equipmentName,
          customerName,
          companyName,
          phone,
          email,
          jobsiteAddress,
          startDate,
          endDate,
          status,
          quotedAmount,
          totalAmount,
          notes,
          signatureData,
          auditHash,
        ]
      );

      // Create or update corresponding 48-Hour Reservation Hold
      const holdId = `HLD-${bookingId.slice(-4)}`;
      const expiresAt = new Date(Date.now() + 48 * 3600 * 1000);

      await executeDb(
        `INSERT INTO reservation_holds (id, bookingId, equipmentId, equipmentName, customerName, phone, startDate, endDate, totalAmount, hoursRemaining, signatureStatus, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE signatureStatus=VALUES(signatureStatus)`,
        [
          holdId,
          bookingId,
          equipmentId,
          equipmentName,
          customerName,
          phone,
          startDate,
          endDate,
          totalAmount,
          48,
          signatureData ? "signed" : "pending",
          expiresAt,
        ]
      );
    }

    // Send executive email notification to jbone@azrentalguy.com
    try {
      if (signatureData) {
        await sendExecutiveNotification({
          subject: `Signed Rental Agreement #${bookingId} [${equipmentName}]`,
          type: "signed_agreement",
          customerName,
          customerPhone: phone,
          customerEmail: email,
          detailsHtml: `
            <div style="background: #F1F5F9; border-radius: 8px; padding: 16px;">
              <p style="margin: 6px 0;"><strong>Equipment:</strong> ${equipmentName}</p>
              <p style="margin: 6px 0;"><strong>Rental Period:</strong> ${startDate} to ${endDate}</p>
              <p style="margin: 6px 0;"><strong>Jobsite:</strong> ${jobsiteAddress}</p>
              <p style="margin: 6px 0;"><strong>Total Locked:</strong> $${totalAmount.toLocaleString()}</p>
              <p style="margin: 6px 0;"><strong>SHA-256 Audit Seal:</strong> <code style="font-size: 11px; word-break: break-all; color: #CA021E;">${auditHash}</code></p>
            </div>
          `,
        });
      } else {
        await sendExecutiveNotification({
          subject: `New Equipment Quote & Hold #${bookingId} [${equipmentName}]`,
          type: "quote",
          customerName,
          customerPhone: phone,
          customerEmail: email,
          detailsHtml: `
            <div style="background: #F1F5F9; border-radius: 8px; padding: 16px;">
              <p style="margin: 6px 0;"><strong>Equipment:</strong> ${equipmentName}</p>
              <p style="margin: 6px 0;"><strong>Rental Period:</strong> ${startDate} to ${endDate}</p>
              <p style="margin: 6px 0;"><strong>Jobsite:</strong> ${jobsiteAddress}</p>
              <p style="margin: 6px 0;"><strong>Quoted Total:</strong> $${totalAmount.toLocaleString()}</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Executive notification dispatch error:", emailErr);
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: bookingId,
        equipmentId,
        equipmentName,
        customerName,
        totalAmount,
        auditHash,
        status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
