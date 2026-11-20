import { NextResponse } from "next/server";
import { queryDb, executeDb, getDbPool } from "@/lib/db";
import { DEFAULT_APP_SETTINGS, AppSettings } from "@/lib/settings";

export async function GET() {
  try {
    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json({ success: true, source: "memory", settings: DEFAULT_APP_SETTINGS });
    }

    const rows = await queryDb<any>("SELECT * FROM app_settings WHERE id = 'primary' LIMIT 1");
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, source: "fallback", settings: DEFAULT_APP_SETTINGS });
    }

    const r = rows[0];
    let parsedData: Partial<AppSettings> = {};
    if (r.data) {
      try {
        parsedData = typeof r.data === "string" ? JSON.parse(r.data) : r.data;
      } catch { }
    }

    const settings: AppSettings = {
      ...DEFAULT_APP_SETTINGS,
      companyName: r.companyName || DEFAULT_APP_SETTINGS.companyName,
      logoUrl: r.logoUrl || DEFAULT_APP_SETTINGS.logoUrl,
      logoSize: Number(r.logoSize) || DEFAULT_APP_SETTINGS.logoSize,
      dispatchPhone: r.supportPhone || DEFAULT_APP_SETTINGS.dispatchPhone,
      dispatchEmail: r.supportEmail || DEFAULT_APP_SETTINGS.dispatchEmail,
      yardAddress: r.yardAddress || DEFAULT_APP_SETTINGS.yardAddress,
      timeZone: r.timezone || DEFAULT_APP_SETTINGS.timeZone,
      taxRate: Number(r.salesTaxRate) ? Number(r.salesTaxRate) * 100 : DEFAULT_APP_SETTINGS.taxRate,
      waiverRate: Number(r.damageWaiverRate) ? Number(r.damageWaiverRate) * 100 : DEFAULT_APP_SETTINGS.waiverRate,
      deliveryFee: Number(r.deliveryFee) || DEFAULT_APP_SETTINGS.deliveryFee,
      depositAmount: Number(r.securityDeposit) || DEFAULT_APP_SETTINGS.depositAmount,
      ...parsedData,
    };

    return NextResponse.json({ success: true, source: "database", settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, settings: DEFAULT_APP_SETTINGS }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const settings: AppSettings = await req.json();
    const pool = getDbPool();

    if (pool) {
      await executeDb(
        `INSERT INTO app_settings (id, data, companyName, logoUrl, logoSize, supportPhone, supportEmail, yardAddress, timezone, salesTaxRate, damageWaiverRate, deliveryFee, securityDeposit)
         VALUES ('primary', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         data=VALUES(data), companyName=VALUES(companyName), logoUrl=VALUES(logoUrl), logoSize=VALUES(logoSize),
         supportPhone=VALUES(supportPhone), supportEmail=VALUES(supportEmail), yardAddress=VALUES(yardAddress),
         timezone=VALUES(timezone), salesTaxRate=VALUES(salesTaxRate), damageWaiverRate=VALUES(damageWaiverRate),
         deliveryFee=VALUES(deliveryFee), securityDeposit=VALUES(securityDeposit)`,
        [
          JSON.stringify(settings),
          settings.companyName,
          settings.logoUrl,
          settings.logoSize,
          settings.dispatchPhone,
          settings.dispatchEmail,
          settings.yardAddress,
          settings.timeZone,
          settings.taxRate / 100,
          settings.waiverRate / 100,
          settings.deliveryFee,
          settings.depositAmount,
        ]
      );
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
