import { NextResponse } from "next/server";
import { queryDb, executeDb, getDbPool } from "@/lib/db";
import { INITIAL_HOLDS } from "@/lib/admin-data";

export async function GET() {
  try {
    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({ success: true, source: "memory", holds: INITIAL_HOLDS });
    }

    const rows = await queryDb<any>("SELECT * FROM reservation_holds ORDER BY created_at DESC");
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, source: "fallback", holds: INITIAL_HOLDS });
    }

    const holds = rows.map((r) => ({
      id: r.id,
      equipmentId: r.equipmentId,
      equipmentName: r.equipmentName,
      customerName: r.customerName,
      phone: r.phone,
      startDate: r.startDate,
      endDate: r.endDate,
      totalAmount: Number(r.totalAmount),
      hoursRemaining: Number(r.hoursRemaining),
      signatureStatus: r.signatureStatus as "pending" | "signed",
    }));

    return NextResponse.json({ success: true, source: "database", holds });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, holds: INITIAL_HOLDS }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, equipmentName, phone, customerName } = body;
    const pool = getDbPool();

    if (action === "release") {
      if (pool && id) {
        await executeDb("DELETE FROM reservation_holds WHERE id = ?", [id]);
      }
      return NextResponse.json({ success: true, message: `Hold ${id} released.` });
    }

    if (action === "reminder") {
      // Simulation of Twilio SMS dispatch
      return NextResponse.json({
        success: true,
        message: `SMS reminder dispatched to ${customerName} (${phone}) for ${equipmentName}.`,
      });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

