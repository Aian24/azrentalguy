import { NextRequest, NextResponse } from "next/server";
import { calculateQuote, QuoteParams } from "@/lib/pricing";
import { FLEET } from "@/lib/fleet";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      equipmentId,
      startDate,
      endDate,
      deliveryIncluded,
      damageWaiver,
      attachments,
      withAttachment,
      zipCode,
    } = body;

    if (!equipmentId) {
      return NextResponse.json(
        { error: "Missing required field: equipmentId" },
        { status: 400 }
      );
    }

    const machine = FLEET.find((m) => m.id === equipmentId);
    if (!machine) {
      return NextResponse.json(
        {
          error: `Invalid equipmentId '${equipmentId}'. Available: ${FLEET.map((m) => m.id).join(", ")}`,
        },
        { status: 404 }
      );
    }

    // Default dates if missing: today and tomorrow
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    const quoteParams: QuoteParams = {
      equipmentId,
      startDate: startDate || today,
      endDate: endDate || tomorrow,
      deliveryIncluded: deliveryIncluded !== undefined ? Boolean(deliveryIncluded) : true,
      damageWaiver: damageWaiver !== undefined ? Boolean(damageWaiver) : true,
      attachments: Array.isArray(attachments) ? attachments : undefined,
      withAttachment: Boolean(withAttachment),
      zipCode: zipCode ? String(zipCode) : undefined,
    };

    const quote = calculateQuote(quoteParams);

    return NextResponse.json(
      {
        success: true,
        data: quote,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Quote Calculation Error", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const equipmentId = searchParams.get("equipmentId") || searchParams.get("equipment") || "cat-259d3";
  const startDate = searchParams.get("startDate") || searchParams.get("start");
  const endDate = searchParams.get("endDate") || searchParams.get("end");
  const daysParam = searchParams.get("days");

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  let calculatedEnd = "";
  if (daysParam && !endDate) {
    const d = Math.max(1, parseInt(daysParam, 10) || 1);
    const end = new Date(today);
    end.setDate(today.getDate() + (d - 1));
    calculatedEnd = end.toISOString().split("T")[0];
  }

  const quote = calculateQuote({
    equipmentId,
    startDate: startDate || todayStr,
    endDate: endDate || calculatedEnd || todayStr,
    deliveryIncluded: searchParams.get("delivery") !== "false",
    damageWaiver: searchParams.get("waiver") !== "false",
    withAttachment: searchParams.get("attachment") === "true",
    zipCode: searchParams.get("zip") || undefined,
  });

  return NextResponse.json({
    success: true,
    data: quote,
  });
}

