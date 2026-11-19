import { FLEET, COMPANY_INFO, EquipmentItem, getStoredFleet } from "./fleet";

export interface QuoteParams {
  equipmentId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  deliveryIncluded?: boolean;
  damageWaiver?: boolean;
  attachments?: string[]; // Attachment names or IDs
  withAttachment?: boolean; // Convenience flag for tractor attachments
  zipCode?: string;
}

export interface QuoteResult {
  equipment: {
    id: string;
    name: string;
    category: string;
    dailyRate: number;
    weeklyRate: number;
    monthlyRate: number;
  };
  rentalPeriod: {
    startDate: string;
    endDate: string;
    days: number;
  };
  tierBreakdown: {
    months: number;
    weeks: number;
    days: number;
    calculationSummary: string;
  };
  costs: {
    baseRental: number;
    uncappedDailyCost: number;
    savings: number;
    attachments: number;
    delivery: number;
    damageWaiver: number;
    subtotal: number;
    taxRate: number; // 0.086
    taxAmount: number;
    totalDue: number;
    securityDepositHold: number; // $500 pre-authorization
  };
  operations: {
    includedHours: string;
    overtimeRate: number;
    requiresAZ811: boolean;
    fuelPolicy: string;
  };
  compliance: {
    isValleyDelivery: boolean;
    statutoryDisclosures: string[];
  };
}

export type QuoteCalculation = QuoteResult;

/**
 * Calculates rental days from start and end dates.
 * Standard equipment rental includes both start and end calendar days.
 * Minimum 1 day.
 */
export function calculateRentalDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 1;
  }

  // Set to midnight UTC for pure calendar day comparison
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = utcEnd - utcStart;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(1, days);
}

/**
 * Mathematical Best-Rate Optimization Algorithm:
 * Finds the absolute cheapest tier combination for any number of rental days.
 * Automatically checks:
 * 1. Pure daily rate (days * dailyRate)
 * 2. Mixed tiers: (months * monthlyRate) + (weeks * weeklyRate) + (remaining days * dailyRate)
 * 3. Daily overflow optimization: if (remDays * dailyRate) > weeklyRate, bump to 1 extra week.
 * 4. Weekly overflow optimization: if (remWeeks * weeklyRate) > monthlyRate, bump to 1 extra month.
 */
export function optimizeEquipmentRate(
  equipment: EquipmentItem,
  days: number
): {
  baseCost: number;
  uncappedDailyCost: number;
  savings: number;
  months: number;
  weeks: number;
  remDays: number;
  summary: string;
  includedHours: string;
} {
  const daily = equipment.dailyRate;
  const weekly = equipment.weeklyRate;
  const monthly = equipment.monthlyRate;

  const pureDailyCost = days * daily;

  // Initial standard division (28 days per monthly rental billing cycle)
  let months = Math.floor(days / 28);
  let remAfterMonths = days % 28;
  let weeks = Math.floor(remAfterMonths / 7);
  let remDays = remAfterMonths % 7;

  // Step 1: Check if daily remainder cost exceeds a full weekly rate
  if (remDays * daily > weekly) {
    weeks += 1;
    remDays = 0;
  }

  // Step 2: Check if weekly remainder cost exceeds a full monthly rate
  if (weeks * weekly > monthly) {
    months += 1;
    weeks = 0;
    remDays = 0;
  }

  // Calculate optimized combination cost
  let optimizedCost = months * monthly + weeks * weekly + remDays * daily;

  // Step 3: Absolute safety check against pure daily cost
  let finalBaseCost = Math.min(optimizedCost, pureDailyCost);
  if (finalBaseCost === pureDailyCost) {
    months = 0;
    weeks = 0;
    remDays = days;
  }

  const savings = Math.max(0, pureDailyCost - finalBaseCost);

  // Generate human-readable summary
  const parts: string[] = [];
  if (months > 0) parts.push(`${months} × 4-Week ($${monthly.toLocaleString()})`);
  if (weeks > 0) parts.push(`${weeks} × Week ($${weekly.toLocaleString()})`);
  if (remDays > 0) parts.push(`${remDays} × Day ($${daily.toLocaleString()})`);
  const summary = parts.length > 0 ? parts.join(" + ") : `${days} × Day`;

  // Calculate included engine operating hours
  let includedHours = "Unlimited Hours";
  if (equipment.includedHours && !equipment.includedHours.toLowerCase().includes("unlimited")) {
    const totalHours = months * 160 + weeks * 40 + remDays * 8;
    includedHours = `${totalHours} Hours (${months > 0 ? `${months}mo ` : ""}${weeks > 0 ? `${weeks}wk ` : ""}${remDays > 0 ? `${remDays}d` : ""})`;
  } else if (equipment.category === "Heavy Trailer") {
    includedHours = "Unlimited Miles & Hours";
  }

  return {
    baseCost: Math.round(finalBaseCost * 100) / 100,
    uncappedDailyCost: Math.round(pureDailyCost * 100) / 100,
    savings: Math.round(savings * 100) / 100,
    months,
    weeks,
    remDays,
    summary,
    includedHours,
  };
}

/**
 * Calculates tractor attachment pricing:
 * $50/day or $100/week capped per attachment.
 */
export function calculateAttachmentCost(
  equipment: EquipmentItem,
  days: number,
  withAttachment?: boolean,
  attachmentsList?: string[]
): number {
  if (!equipment.availableAttachments || equipment.availableAttachments.length === 0) {
    return 0;
  }

  let count = 0;
  if (attachmentsList && attachmentsList.length > 0) {
    count = attachmentsList.length;
  } else if (withAttachment) {
    count = 1;
  }

  if (count === 0) return 0;

  // Best rate for attachments: $50/day up to $100/week (2+ days in a week = $100)
  const fullWeeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  const remCost = Math.min(remainingDays * 50, 100);
  const costPerAttachment = fullWeeks * 100 + remCost;

  return costPerAttachment * count;
}

/**
 * Master Quote Calculator Engine:
 * Produces an exact, audit-compliant quote with itemized subtotal,
 * optional physical damage waiver (10%), flat delivery ($150),
 * Maricopa County rental tax (8.6%), and $500 refundable security hold.
 */
export function calculateQuote(params: QuoteParams): QuoteResult {
  const currentFleet = getStoredFleet();
  const equipment = currentFleet.find((m) => m.id === params.equipmentId) || currentFleet[0] || FLEET[0];
  const days = calculateRentalDays(params.startDate, params.endDate);

  // 1. Optimized Base Rate
  const optimized = optimizeEquipmentRate(equipment, days);

  // 2. Attachments
  const attachmentsCost = calculateAttachmentCost(
    equipment,
    days,
    params.withAttachment,
    params.attachments
  );

  // 3. Flat Valley Delivery ($150 unless explicitly opted out for trailer self-pickup)
  const deliveryIncluded = params.deliveryIncluded !== false;
  const deliveryFee = deliveryIncluded ? COMPANY_INFO.flatDeliveryFee : 0;

  // 4. Physical Damage Waiver (Optional 10% of base rental + attachments)
  const damageWaiverIncluded = params.damageWaiver !== false;
  const waiverEligibleSubtotal = optimized.baseCost + attachmentsCost;
  const damageWaiverCost = damageWaiverIncluded
    ? Math.round(waiverEligibleSubtotal * COMPANY_INFO.damageWaiverRate * 100) / 100
    : 0;

  // 5. Taxable Subtotal & Arizona 8.6% Maricopa County Rental Tax
  const taxableSubtotal = optimized.baseCost + attachmentsCost + deliveryFee + damageWaiverCost;
  const taxRate = COMPANY_INFO.taxRate; // 0.086
  const taxAmount = Math.round(taxableSubtotal * taxRate * 100) / 100;

  // 6. Grand Total
  const totalDue = Math.round((taxableSubtotal + taxAmount) * 100) / 100;

  // 7. Statutory Legal Disclosures
  const statutoryDisclosures: string[] = [
    "Delivered full of fuel; must be returned full or subject to $8.00/gallon refuel charge.",
    "Normal jobsite dust is acceptable; concrete splatter or hardened mud incurs a $150 wash fee.",
    "$500 refundable pre-authorization card hold placed upon delivery dispatch.",
  ];

  if (equipment.requiresAZ811) {
    statutoryDisclosures.unshift(
      "ARIZONA 811 STATUTORY MANDATE: State law (A.R.S. § 40-360.21) requires calling 811 at least two working days prior to excavation."
    );
  }

  if (equipment.category === "Heavy Trailer" || equipment.category === "Water Trailer") {
    statutoryDisclosures.push(
      "TOWING CERTIFICATION: Renter certifies towing vehicle meets manufacturer GVWR rating and is equipped with an electronic trailer brake controller."
    );
  }

  // 8. Service Area Check
  let isValleyDelivery = true;
  if (params.zipCode) {
    const cleanZip = params.zipCode.trim();
    if (cleanZip.length === 5) {
      const prefix = cleanZip.substring(0, 3);
      isValleyDelivery = ["850", "852", "853"].includes(prefix);
    }
  }

  return {
    equipment: {
      id: equipment.id,
      name: equipment.name,
      category: equipment.category,
      dailyRate: equipment.dailyRate,
      weeklyRate: equipment.weeklyRate,
      monthlyRate: equipment.monthlyRate,
    },
    rentalPeriod: {
      startDate: params.startDate,
      endDate: params.endDate,
      days,
    },
    tierBreakdown: {
      months: optimized.months,
      weeks: optimized.weeks,
      days: optimized.remDays,
      calculationSummary: optimized.summary,
    },
    costs: {
      baseRental: optimized.baseCost,
      uncappedDailyCost: optimized.uncappedDailyCost,
      savings: optimized.savings,
      attachments: attachmentsCost,
      delivery: deliveryFee,
      damageWaiver: damageWaiverCost,
      subtotal: taxableSubtotal,
      taxRate,
      taxAmount,
      totalDue,
      securityDepositHold: COMPANY_INFO.securityDepositHold,
    },
    operations: {
      includedHours: optimized.includedHours,
      overtimeRate: equipment.overtimeRate || COMPANY_INFO.overtimeHourlyRate,
      requiresAZ811: equipment.requiresAZ811,
      fuelPolicy: "Delivered Full • Return Full ($8/gal penalty)",
    },
    compliance: {
      isValleyDelivery,
      statutoryDisclosures,
    },
  };
}

