import { NextResponse } from "next/server";
import { initializeDatabase, queryDb } from "@/lib/db";
import { FLEET } from "@/lib/fleet";
import { DEFAULT_APP_SETTINGS } from "@/lib/settings";

export async function GET() {
  try {
    const initialized = await initializeDatabase();
    if (!initialized) {
      return NextResponse.json({
        success: false,
        message: "Database connection failed. Verify DATABASE_URL or DB_USER / DB_NAME in environment.",
      }, { status: 500 });
    }

    // Seed equipment if empty
    const existingFleet = await queryDb<any>("SELECT COUNT(*) as count FROM equipments");
    const count = existingFleet[0]?.count || 0;

    if (count === 0) {
      for (const item of FLEET) {
        await queryDb(
          `INSERT INTO equipments (id, name, category, dailyRate, weeklyRate, monthlyRate, overtimeRate, serialNumber, engineHours, yardStatus, engineSpecs, operatingWeight, image, images, tagline, requiresDigLaw)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    }

    // Seed settings if empty
    const existingSettings = await queryDb<any>("SELECT COUNT(*) as count FROM app_settings");
    if ((existingSettings[0]?.count || 0) === 0) {
      await queryDb(
        `INSERT INTO app_settings (id, data, companyName, logoUrl, logoSize, supportPhone, supportEmail, yardAddress, timezone, salesTaxRate, damageWaiverRate, deliveryFee, securityDeposit, pin)
         VALUES ('primary', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          JSON.stringify(DEFAULT_APP_SETTINGS),
          DEFAULT_APP_SETTINGS.companyName,
          DEFAULT_APP_SETTINGS.logoUrl,
          DEFAULT_APP_SETTINGS.logoSize,
          DEFAULT_APP_SETTINGS.dispatchPhone,
          DEFAULT_APP_SETTINGS.dispatchEmail,
          DEFAULT_APP_SETTINGS.yardAddress,
          DEFAULT_APP_SETTINGS.timeZone,
          DEFAULT_APP_SETTINGS.taxRate / 100,
          DEFAULT_APP_SETTINGS.waiverRate / 100,
          DEFAULT_APP_SETTINGS.deliveryFee,
          DEFAULT_APP_SETTINGS.depositAmount,
          "1984",
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: "MariaDB tables and seed data initialized successfully on Plesk!",
      tables: ["equipments", "bookings", "reservation_holds", "pipeline_leads", "dispatches", "app_settings"],
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to initialize database",
    }, { status: 500 });
  }
}
