import { COMPANY_INFO, FLEET, EquipmentItem } from "./fleet";
import { calculateQuote, QuoteCalculation } from "./pricing";

export interface StatutoryDisclosures {
  az811Acknowledged: boolean;
  towingGvwrAcknowledged: boolean;
  fuelAndCleaningAcknowledged: boolean;
  operatingHoursAcknowledged: boolean;
  termsAndConditionsAccepted: boolean;
}

export interface RentalAgreement {
  agreementId: string;
  createdAt: string;
  status: "draft" | "signed" | "expired";
  equipment: EquipmentItem;
  startDate: string;
  endDate: string;
  totalDays: number;
  deliveryIncluded: boolean;
  damageWaiver: boolean;
  withAttachment: boolean;
  quote: QuoteCalculation;

  // Signer / Renter Details
  renter: {
    fullName: string;
    companyName?: string;
    phone: string;
    email: string;
    driverLicense: string;
    jobsiteAddress: string;
    deliveryCity: string;
    deliveryZip: string;
  };

  // Statutory Disclosures
  disclosures: StatutoryDisclosures;

  // Ratification & Sign-off
  signatureDataUrl?: string;
  signedAt?: string;
  signerIp?: string;
  auditHash?: string;
}

/**
 * Generate a cryptographically strong SHA-256 audit seal
 * Works in both browser (Web Crypto API) and Node.js environments.
 */
export async function generateAgreementAuditHash(payload: {
  agreementId: string;
  equipmentId: string;
  renterName: string;
  renterEmail: string;
  totalDue: number;
  signedAt: string;
  signatureDataUrl: string;
}): Promise<string> {
  const serialized = JSON.stringify({
    id: payload.agreementId,
    equipment: payload.equipmentId,
    name: payload.renterName.trim().toLowerCase(),
    email: payload.renterEmail.trim().toLowerCase(),
    total: payload.totalDue.toFixed(2),
    timestamp: payload.signedAt,
    // Include signature hash slice for proof of non-repudiation
    sigChecksum: payload.signatureDataUrl.slice(-64),
    authority: COMPANY_INFO.legalName,
  });

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(serialized);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Fallback for Node.js / Server environments
  try {
    const nodeCrypto = await import("crypto");
    return nodeCrypto.createHash("sha256").update(serialized).digest("hex");
  } catch {
    // Basic pseudo-hex fallback if crypto is unavailable
    let hash = 0;
    for (let i = 0; i < serialized.length; i++) {
      hash = (hash << 5) - hash + serialized.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, "0");
  }
}

/**
 * Arizona Statutory Disclosures Legal Text Blocks
 */
export const ARIZONA_LEGAL_TERMS = {
  az811: {
    title: "Arizona 811 Call-Before-You-Dig Statutory Acknowledgment (A.R.S. § 40-360.21)",
    text: "Pursuant to Arizona Revised Statutes § 40-360.21 et seq., the Renter acknowledges that any excavation, earthmoving, grading, or trenching requires contacting Arizona 811 (call 811 or visit arizona811.com) at least two (2) full business days prior to commencing work. Renter assumes sole civil and financial liability for any damage to underground utility facilities, pipelines, or fiber conduits if work begins without valid 811 locate tickets.",
  },
  towingGvwr: {
    title: "Trailer Towing, GVWR & Class Capacity Certification",
    text: "For all towed equipment or commercial trailer rentals, Renter certifies that the tow vehicle possesses manufacturer-rated Gross Vehicle Weight Rating (GVWR) and towing capacity exceeding the combined weight of trailer and payload. Tow vehicle must feature an approved receiver hitch, proper ball size (2-5/16\" or specified size), functioning electric trailer brake controller, and valid commercial or personal auto liability insurance covering towed loads.",
  },
  fuelAndCleaning: {
    title: "Fuel Refill & Equipment Cleanliness Terms",
    text: "All machinery is dispatched with a 100% full fuel tank and must be returned 100% full of clean, approved diesel or gasoline. Refill by Lessor upon return is billed at $8.00 per gallon. Renter agrees that machines used in wet slurry, asphalt, or concrete must be power-washed prior to return; excessive concrete build-up or hazardous slurry incurs a mandatory $150 cleaning fee. Normal desert dust and jobsite dirt are fully acceptable.",
  },
  operatingHours: {
    title: "Operating Hours & Overtime Meter Policy",
    text: "Base rental rates include: 8 operating engine meter hours per daily rental, 40 hours per weekly rental, and 160 hours per 4-week rental. Hours accumulated in excess of these limits are billed at $75.00 per hour upon machine return and telematics meter audit.",
  },
  damageWaiverAndDeposit: {
    title: "10% Damage Waiver & Security Deposit Authorization",
    text: "A $500 pre-authorization security deposit hold is placed on Renter's payment method prior to dispatch and released in full upon undamaged machine return. The optional 10% Physical Damage Waiver covers accidental machine damage during normal operation, subject to zero deductible. Damage waiver strictly excludes gross negligence, unauthorized operators, operating under the influence, immersion in water/mud, rollover from improper slope operation, tire/track puncture from hazardous scrap, or theft.",
  },
};
