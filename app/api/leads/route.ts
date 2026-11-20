import { NextResponse } from "next/server";
import { queryDb, executeDb, getDbPool } from "@/lib/db";
import { INITIAL_LEADS, PipelineLead } from "@/lib/admin-data";

export async function GET() {
  try {
    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({ success: true, source: "memory", leads: INITIAL_LEADS });
    }

    const rows = await queryDb<any>("SELECT * FROM pipeline_leads ORDER BY created_at DESC");
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, source: "fallback", leads: INITIAL_LEADS });
    }

    const leads: PipelineLead[] = rows.map((r) => ({
      id: r.id,
      customerName: r.customerName,
      companyName: r.companyName || "",
      phone: r.phone,
      email: r.email || "",
      equipmentId: r.equipmentId || "cat-259d3",
      equipmentName: r.equipmentName,
      jobsiteAddress: r.jobsiteAddress,
      quotedAmount: Number(r.quotedAmount),
      stage: r.stage as any,
      priority: r.priority as any,
      startDate: r.startDate || "",
      endDate: r.endDate || "",
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      notes: r.notes || "",
    }));

    return NextResponse.json({ success: true, source: "database", leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, leads: INITIAL_LEADS }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const lead: PipelineLead = await req.json();
    const pool = getDbPool();

    if (pool) {
      await executeDb(
        `INSERT INTO pipeline_leads (id, customerName, companyName, phone, email, equipmentName, jobsiteAddress, quotedAmount, stage, priority, startDate, endDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE stage=VALUES(stage), priority=VALUES(priority), quotedAmount=VALUES(quotedAmount)`,
        [
          lead.id,
          lead.customerName,
          lead.companyName || "",
          lead.phone,
          lead.email || "",
          lead.equipmentName,
          lead.jobsiteAddress,
          lead.quotedAmount,
          lead.stage,
          lead.priority,
          lead.startDate || "",
          lead.endDate || "",
        ]
      );
    }

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, stage, priority } = body;
    const pool = getDbPool();

    if (pool && id) {
      if (stage) {
        await executeDb("UPDATE pipeline_leads SET stage = ? WHERE id = ?", [stage, id]);
      }
      if (priority) {
        await executeDb("UPDATE pipeline_leads SET priority = ? WHERE id = ?", [priority, id]);
      }
    }

    return NextResponse.json({ success: true, id, stage, priority });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
