import { NextResponse } from "next/server";
import { queryDb, executeDb, getDbPool } from "@/lib/db";
import { FLEET, EquipmentItem } from "@/lib/fleet";

export async function GET() {
  try {
    const pool = getDbPool();
    if (!pool) {
      // Fallback to static fleet if DB not configured yet
      return NextResponse.json({ success: true, source: "memory", fleet: FLEET });
    }

    const rows = await queryDb<any>("SELECT * FROM equipments ORDER BY created_at ASC");
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, source: "fallback", fleet: FLEET });
    }

    const fleet: EquipmentItem[] = rows.map((r) => {
      let parsedImages: string[] = [];
      try {
        parsedImages = typeof r.images === "string" ? JSON.parse(r.images) : r.images || [r.image];
      } catch {
        parsedImages = [r.image || "/images/cat-ontrailer.webp"];
      }

      const baseItem = FLEET.find((f) => f.id === r.id);

      return {
        id: r.id,
        name: r.name,
        slug: baseItem?.slug || r.id,
        category: r.category as any,
        tagline: r.tagline || baseItem?.tagline || "",
        description: baseItem?.description || r.tagline || "Heavy equipment built for tough Arizona jobsites.",
        dailyRate: Number(r.dailyRate),
        weeklyRate: Number(r.weeklyRate),
        monthlyRate: Number(r.monthlyRate),
        includedHours: baseItem?.includedHours || "8 hrs/day included",
        overtimeRate: Number(r.overtimeRate || 75),
        engineSpecs: r.engineSpecs || baseItem?.engineSpecs || "",
        operatingWeight: r.operatingWeight || baseItem?.operatingWeight || "",
        keyFeatures: baseItem?.keyFeatures || ["Valley-wide delivery available", "Commercial grade hydraulics"],
        requiresAZ811: Boolean(r.requiresDigLaw ?? r.requiresAZ811 ?? baseItem?.requiresAZ811),
        availableAttachments: baseItem?.availableAttachments,
        imageUrl: r.image || r.imageUrl || baseItem?.imageUrl || "/images/cat-ontrailer.webp",
        images: parsedImages.length > 0 ? parsedImages : baseItem?.images || [baseItem?.imageUrl || "/images/cat-ontrailer.webp"],
        badge: baseItem?.badge,
        fullSpecs: baseItem?.fullSpecs,
        status: (r.yardStatus || r.status || "available") as any,
        serialNumber: r.serialNumber || baseItem?.serialNumber,
        engineHours: Number(r.engineHours || baseItem?.engineHours || 0),
        nextServiceHours: baseItem?.nextServiceHours,
        year: baseItem?.year,
        weekendRate: baseItem?.weekendRate,
        depositAmount: baseItem?.depositAmount,
      };
    });

    return NextResponse.json({ success: true, source: "database", fleet });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, fleet: FLEET }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const items: EquipmentItem[] = Array.isArray(payload) ? payload : [payload];
    const pool = getDbPool();

    if (!pool) {
      return NextResponse.json({ success: true, message: "Cached locally (DB not connected)", count: items.length });
    }

    for (const item of items) {
      await executeDb(
        `INSERT INTO equipments (id, name, category, dailyRate, weeklyRate, monthlyRate, overtimeRate, serialNumber, engineHours, yardStatus, engineSpecs, operatingWeight, image, images, tagline, requiresDigLaw)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         name=VALUES(name), category=VALUES(category), dailyRate=VALUES(dailyRate), weeklyRate=VALUES(weeklyRate),
         monthlyRate=VALUES(monthlyRate), overtimeRate=VALUES(overtimeRate), serialNumber=VALUES(serialNumber),
         engineHours=VALUES(engineHours), yardStatus=VALUES(yardStatus), engineSpecs=VALUES(engineSpecs),
         operatingWeight=VALUES(operatingWeight), image=VALUES(image), images=VALUES(images), tagline=VALUES(tagline),
         requiresDigLaw=VALUES(requiresDigLaw)`,
        [
          item.id,
          item.name,
          item.category,
          item.dailyRate,
          item.weeklyRate,
          item.monthlyRate,
          item.overtimeRate,
          item.serialNumber || "",
          item.engineHours || 0,
          item.status || "available",
          item.engineSpecs,
          item.operatingWeight,
          item.imageUrl,
          JSON.stringify(item.images || [item.imageUrl]),
          item.tagline || "",
          item.requiresAZ811 ? 1 : 0,
        ]
      );
    }

    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const pool = getDbPool();

    if (pool && id) {
      await executeDb("DELETE FROM equipments WHERE id = ?", [id]);
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
