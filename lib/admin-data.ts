import { FLEET, COMPANY_INFO } from "./fleet";

export interface DispatchItem {
  id: string;
  customerName: string;
  companyName?: string;
  phone: string;
  email: string;
  equipmentId: string;
  equipmentName: string;
  jobsiteAddress: string;
  zipCode: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string;
  returnDate: string;
  type: "delivery" | "return" | "hold";
  status: "scheduled" | "dispatched" | "on-site" | "completed" | "delayed";
  driver: string;
  notes?: string;
  amount: number;
}

export interface ActiveHold {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  equipmentId: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalAmount: number;
  expiresAt: string; // ISO string
  hoursRemaining: number;
  signatureStatus: "signed" | "pending";
  agreementId: string;
  jobsiteZip: string;
}

export interface PipelineLead {
  id: string;
  customerName: string;
  companyName?: string;
  phone: string;
  email: string;
  equipmentId: string;
  equipmentName: string;
  stage: "inquired" | "quoted" | "agreement_sent" | "reserved" | "active" | "closed";
  startDate: string;
  endDate: string;
  jobsiteAddress: string;
  quotedAmount: number;
  createdAt: string;
  notes?: string;
  priority: "high" | "normal" | "urgent";
}

export interface CalendarBooking {
  id: string;
  equipmentId: string;
  customerName: string;
  companyName?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: "active" | "reserved" | "hold" | "maintenance";
  notes?: string;
}

export interface PermitLead {
  id: string;
  permitNumber: string;
  issuedDate: string;
  contractorName: string;
  phone: string;
  email: string;
  jobsiteAddress: string;
  city: string;
  projectType: string;
  valuation: string;
  recommendedEquipment: string;
  matchScore: number;
  aiPitchDraft: string;
  status: "new" | "contacted" | "quoted" | "declined";
}

export interface ReviewFollowUp {
  id: string;
  customerName: string;
  phone: string;
  equipmentName: string;
  returnDate: string;
  queueStatus: "queued" | "sent" | "clicked" | "reviewed";
  sentAt?: string;
  ratingGiven?: number;
  reviewLink: string;
}

export interface SalesTransaction {
  id: string;
  customerName: string;
  companyName?: string;
  equipmentName: string;
  amount: number;
  date: string;
  paymentMethod: "Credit Card" | "ACH / Wire" | "Company Check" | "Pre-Auth Hold";
  status: "Paid" | "Pending" | "Deposit Held";
  jobsite: string;
}

// =====================================================================
// LIVE PRODUCTION DATA ARRAYS (INITIALIZED CLEAN & EMPTY)
// Fleet and Pricing remain 100% active in lib/fleet.ts
// =====================================================================

export const INITIAL_DISPATCH: DispatchItem[] = [];
export const INITIAL_HOLDS: ActiveHold[] = [];
export const INITIAL_LEADS: PipelineLead[] = [];
export const INITIAL_CALENDAR_BOOKINGS: CalendarBooking[] = [];
export const INITIAL_PERMITS: PermitLead[] = [];
export const INITIAL_REVIEWS: ReviewFollowUp[] = [];
export const INITIAL_SALES_TRANSACTIONS: SalesTransaction[] = [];

export const SALES_SUMMARY = {
  monthlyTotal: 0,
  todayTotal: 0,
  completedRentalsCount: 0,
  averageOrderValue: 0,
  depositHoldsActive: 0,
  fleetUtilizationRate: 0,
  equipmentRevenue: FLEET.map((f) => ({
    name: f.name,
    amount: 0,
    percentage: 0,
    color: "bg-gray-400",
  })),
  weeklySales: [
    { week: "Week 1", amount: 0 },
    { week: "Week 2", amount: 0 },
    { week: "Week 3", amount: 0 },
    { week: "Week 4 (Current)", amount: 0 },
  ],
};

/**
 * Purges development mock/demo records from browser localStorage
 * while preserving active Fleet & Pricing and App Settings.
 */
export function purgeDemoStorage(): void {
  if (typeof window === "undefined") return;
  const demoKeys = [
    "az_admin_dispatch",
    "az_admin_leads",
    "az_admin_calendar_bookings",
    "az_admin_permits",
    "az_admin_reviews",
    "az_admin_invoices",
    "az_admin_holds",
  ];
  demoKeys.forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new Event("az_admin_purged"));
}

/**
 * Checks if a stored array contains development mock records
 */
export function isDemoData(items: any[]): boolean {
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.some((item) => {
    const id = String(item?.id || "");
    return (
      id.startsWith("DSP-10") ||
      id.startsWith("LD-50") ||
      id.startsWith("HLD-48") ||
      id.startsWith("PMT-2026") ||
      id.startsWith("TXN-90") ||
      id.startsWith("INV-88")
    );
  });
}
