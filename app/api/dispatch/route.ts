import { NextResponse } from "next/server";
import { queryDb, executeDb, getDbPool } from "@/lib/db";
import { INITIAL_DISPATCH, DispatchItem } from "@/lib/admin-data";

export async function GET() {
  try {
    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({ success: true, source: "memory", dispatches: INITIAL_DISPATCH });
    }

    const rows = await queryDb<any>("SELECT * FROM dispatches ORDER BY scheduledDate ASC, scheduledTime ASC");
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, source: "fallback", dispatches: INITIAL_DISPATCH });
    }

    const dispatches: DispatchItem[] = rows.map((r) => ({
      id: r.id,
      customerName: r.customerName,
      companyName: r.companyName || "",
      phone: r.phone,
      email: r.email || "customer@example.com",
      zipCode: r.zipCode || "85331",
      equipmentName: r.equipmentName,
      equipmentId: r.equipmentId,
      jobsiteAddress: r.jobsiteAddress,
      scheduledDate: r.scheduledDate,
      scheduledTime: r.scheduledTime,
      returnDate: r.returnDate,
      driver: r.driver,
      amount: Number(r.amount),
      status: r.status as any,
      type: r.type as any,
      notes: r.notes || "",
    }));

    return NextResponse.json({ success: true, source: "database", dispatches });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, dispatches: INITIAL_DISPATCH }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, driver } = body;
    const pool = getDbPool();

    if (pool && id) {
      if (status) {
        await executeDb("UPDATE dispatches SET status = ? WHERE id = ?", [status, id]);
      }
      if (driver) {
        await executeDb("UPDATE dispatches SET driver = ? WHERE id = ?", [driver, id]);
      }
    }

    return NextResponse.json({ success: true, id, status, driver });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
