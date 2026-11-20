"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FLEET, COMPANY_INFO, EquipmentItem } from "@/lib/fleet";
import { calculateQuote, QuoteCalculation } from "@/lib/pricing";
import {
  ARIZONA_LEGAL_TERMS,
  generateAgreementAuditHash,
  StatutoryDisclosures,
} from "@/lib/agreement";
import SignaturePad from "@/components/SignaturePad";
import SwalModal, { SwalModalProps } from "@/components/SwalModal";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Check,
  Printer,
  Calendar,
  Truck,
  FileText,
  Clock,
  AlertTriangle,
  Lock,
  Phone,
  ArrowLeft,
  DollarSign,
  Info,
} from "lucide-react";

interface DigitalAgreementViewProps {
  agreementId: string;
}

export default function DigitalAgreementView({ agreementId }: DigitalAgreementViewProps) {
  const searchParams = useSearchParams();

  // URL Query Parameters or Defaults
  const eqParam = searchParams.get("equipment") || "cat-259d3";
  const startParam = searchParams.get("start") || "";
  const endParam = searchParams.get("end") || "";
  const nameParam = searchParams.get("name") || "";
  const phoneParam = searchParams.get("phone") || "";
  const emailParam = searchParams.get("email") || "";
  const addressParam = searchParams.get("address") || "";
  const deliveryParam = searchParams.get("delivery") !== "false";
  const waiverParam = searchParams.get("waiver") !== "false";
  const attachmentParam = searchParams.get("attachment") === "true";

  // Selected Machine
  const [machine, setMachine] = useState<EquipmentItem>(() => {
    return FLEET.find((m) => m.id === eqParam) || FLEET[0];
  });

  // Dates
  const [startDate, setStartDate] = useState(startParam);
  const [endDate, setEndDate] = useState(endParam);

  // Renter Form Fields
  const [fullName, setFullName] = useState(nameParam);
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState(phoneParam);
  const [email, setEmail] = useState(emailParam);
  const [driverLicense, setDriverLicense] = useState("");
  const [jobsiteAddress, setJobsiteAddress] = useState(addressParam);

  // Options
  const [deliveryIncluded, setDeliveryIncluded] = useState(deliveryParam);
  const [damageWaiver, setDamageWaiver] = useState(waiverParam);
  const [withAttachment, setWithAttachment] = useState(attachmentParam);

  // Mandatory Statutory Disclosures Checkboxes
  const [disclosures, setDisclosures] = useState<StatutoryDisclosures>({
    az811Acknowledged: false,
    towingGvwrAcknowledged: false,
    fuelAndCleaningAcknowledged: false,
    operatingHoursAcknowledged: false,
    termsAndConditionsAccepted: false,
  });

  // Signature state
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [auditHash, setAuditHash] = useState<string>("");
  const [signedTimestamp, setSignedTimestamp] = useState<string>("");

  // SweetAlert-style Modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "warning" | "error" | "success" | "info";
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
    confirmText: "Got It, I'll Fix It",
    onConfirm: () => {},
  });

  const showModal = (
    title: string,
    message: string,
    type: "warning" | "error" | "success" | "info" = "warning",
    confirmText: string = "Got It, I'll Fix It",
    onConfirmAction?: () => void
  ) => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      confirmText,
      onConfirm: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        if (onConfirmAction) onConfirmAction();
      },
    });
  };

  // Default dates if empty
  useEffect(() => {
    if (!startDate || !endDate) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      if (!startDate) setStartDate(today.toISOString().split("T")[0]);
      if (!endDate) setEndDate(tomorrow.toISOString().split("T")[0]);
    }
  }, [startDate, endDate]);

  // Sync machine if URL changes
  useEffect(() => {
    const found = FLEET.find((m) => m.id === eqParam);
    if (found) setMachine(found);
  }, [eqParam]);

  // Live Math Calculation via Master Pricing Engine
  const quote: QuoteCalculation = calculateQuote({
    equipmentId: machine.id,
    startDate,
    endDate,
    deliveryIncluded,
    damageWaiver,
    withAttachment,
    zipCode: jobsiteAddress,
  });

  const isTrailer = machine.category === "Heavy Trailer" || machine.category === "Water Trailer";

  const handleCheckbox = (key: keyof StatutoryDisclosures) => {
    setDisclosures((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRatifyAgreement = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showModal(
        "Signer Full Name Required",
        "Please enter the Full Legal Name of the authorized signer before ratifying.",
        "warning"
      );
      return;
    }
    if (!phone.trim()) {
      showModal(
        "Contact Phone Required",
        "Please enter a valid contact phone number for machine delivery coordination.",
        "warning"
      );
      return;
    }
    if (!driverLicense.trim()) {
      showModal(
        "Driver License / ID Required",
        "Commercial equipment insurance regulations require a valid Driver License or State ID number for equipment release.",
        "warning"
      );
      return;
    }
    if (machine.requiresAZ811 && !disclosures.az811Acknowledged) {
      showModal(
        "Arizona 811 Dig-Law Required",
        "Under A.R.S. § 40-360.21, you must check and acknowledge the mandatory Call-Before-You-Dig statutory disclosure prior to operating this equipment.",
        "warning"
      );
      return;
    }
    if (isTrailer && !disclosures.towingGvwrAcknowledged) {
      showModal(
        "Trailer GVWR Certification Required",
        "You must certify that your tow vehicle possesses adequate manufacturer-rated GVWR capacity, an approved hitch, and an electric brake controller.",
        "warning"
      );
      return;
    }
    if (!disclosures.fuelAndCleaningAcknowledged) {
      showModal(
        "Fuel & Cleanliness Policy Required",
        "Please check the box acknowledging that machines must be returned 100% full of fuel and free of wet concrete/slurry build-up.",
        "warning"
      );
      return;
    }
    if (!disclosures.operatingHoursAcknowledged) {
      showModal(
        "Operating Hours Allowance Required",
        "Please acknowledge the included engine meter hours allowance and the $75.00/hour overtime rate.",
        "warning"
      );
      return;
    }
    if (!disclosures.termsAndConditionsAccepted) {
      showModal(
        "Master Rental Terms Required",
        "Please accept the J-Bone Industries LLC Master Equipment Rental Terms & Conditions.",
        "warning"
      );
      return;
    }
    if (!signatureDataUrl) {
      showModal(
        "Authorized Signature Required",
        "Please provide your authorized digital signature in the signature drawing box below using your finger, stylus, or mouse.",
        "warning"
      );
      return;
    }

    setIsSubmitting(true);

    const timestamp = new Date().toISOString();
    const hash = await generateAgreementAuditHash({
      agreementId,
      equipmentId: machine.id,
      renterName: fullName,
      renterEmail: email,
      totalDue: quote.costs.totalDue,
      signedAt: timestamp,
      signatureDataUrl,
    });

    setAuditHash(hash);
    setSignedTimestamp(timestamp);
    setIsSigned(true);
    setIsSubmitting(false);

    // Save signed agreement to MariaDB and dispatch confirmation email to jbone@azrentalguy.com
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: agreementId,
        equipmentId: machine.id,
        equipmentName: machine.name,
        customerName: fullName,
        companyName: companyName || "",
        phone,
        email,
        jobsiteAddress: jobsiteAddress,
        startDate,
        endDate,
        totalAmount: quote.costs.totalDue,
        signatureData: signatureDataUrl,
        auditHash: hash,
        status: "signed",
      }),
    }).catch((err) => console.error("Signed agreement sync error:", err));

    // Scroll to confirmation
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Show SweetAlert Success Modal
    setModalConfig({
      isOpen: true,
      type: "success",
      title: "Agreement Signed & Ratified!",
      message: `Contract #${agreementId} is officially locked with a SHA-256 cryptographic audit seal. Our dispatch coordinator will contact you prior to delivery.`,
      confirmText: "Print / Save",
      cancelText: "View Agreement",
      onConfirm: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        setTimeout(() => window.print(), 300);
      },
      onCancel: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* TOP NAVIGATION / RETURN */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href="/#Booknow"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Booking Form</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase">Need Help?</span>
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="text-xs font-black text-red-600 hover:underline inline-flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>

        {/* PRINTABLE AGREEMENT CONTAINER */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-6 sm:p-10 print:border-none print:shadow-none print:p-0">
          {/* AGREEMENT HEADER */}
          <div className="border-b-2 border-slate-900 pb-6 mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E5A919] text-gray-950 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest mb-2 shadow-xs">
                <span>Official Digital Contract</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                Equipment Rental Agreement
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">
                Lessor: <strong className="text-gray-950">{COMPANY_INFO.legalName}</strong> (dba {COMPANY_INFO.name}) • Phoenix, Maricopa County, AZ
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 text-left sm:text-right shrink-0">
              <span className="block text-[10px] font-black uppercase tracking-wider text-gray-500">
                Agreement Document #
              </span>
              <span className="text-base sm:text-lg font-black text-red-600 tracking-wider">
                {agreementId}
              </span>
              <div className="mt-1 flex items-center sm:justify-end gap-1.5 text-[11px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isSigned ? "RATIFIED & SEALED" : "48-HR RESERVATION HOLD"}</span>
              </div>
            </div>
          </div>

          {/* SIGNED CONFIRMATION BANNER */}
          {isSigned && (
            <div className="mb-8 p-5 sm:p-6 bg-emerald-50 border-2 border-emerald-600 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:border-emerald-700 print:bg-emerald-50">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md border-2 border-emerald-700"
                  style={{
                    backgroundColor: "#059669",
                    color: "#ffffff",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  }}
                >
                  <Check className="w-6 h-6 text-white stroke-[3]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-emerald-950">
                    Agreement Successfully Signed &amp; Ratified!
                  </h2>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    Your machine reservation is officially locked. Our dispatch coordinator will contact you prior to delivery.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="btn-red py-2.5 px-5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all print:hidden cursor-pointer whitespace-nowrap shrink-0"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>Print / Save</span>
              </button>
            </div>
          )}

          {/* FORM / CONTRACT BODY */}
          <form onSubmit={handleRatifyAgreement} className="space-y-8">
            {/* SECTION 1: EQUIPMENT & DURATION SUMMARY */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-red-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-black text-gray-950 uppercase tracking-wider">
                  Equipment Selection &amp; Operating Term
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* PHOTO & SPECS */}
                <div className="md:col-span-4 aspect-[16/11] rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative">
                  <img
                    src={machine.imageUrl}
                    alt={machine.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-xs">
                    {machine.category}
                  </span>
                </div>

                {/* DETAILS & DATES */}
                <div className="md:col-span-8 space-y-3">
                  <div>
                    <h3 className="text-lg font-black text-gray-950">{machine.name}</h3>
                    <p className="text-xs text-gray-600 font-medium mt-0.5">
                      Engine: <strong>{machine.engineSpecs}</strong> • Operating Weight: <strong>{machine.operatingWeight}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase">Start Date</span>
                      <strong className="text-gray-950 font-black">{startDate || "Not set"}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase">End Date</span>
                      <strong className="text-gray-950 font-black">{endDate || "Not set"}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase">Total Term</span>
                      <strong className="text-red-600 font-black">{quote.rentalPeriod.days} Calendar Days</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-gray-700">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>{machine.includedHours}</span>
                    </span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-red-600" />
                      <span>{deliveryIncluded ? "$150 Valley Delivery Included" : "Customer Pick Up"}</span>
                    </span>
                    {damageWaiver && (
                      <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>10% Damage Waiver Active</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: RENTER & JOBSITE INFORMATION */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-red-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-black text-gray-950 uppercase tracking-wider">
                  Renter Identification &amp; Jobsite Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                    Authorized Signer Full Legal Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSigned}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John C. Miller"
                    className="w-full bg-white border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                    Company / Contracting Entity (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={isSigned}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Miller Grading LLC"
                    className="w-full bg-white border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                    Mobile Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    disabled={isSigned}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(602) 555-0199"
                    className="w-full bg-white border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                    Email Address for Receipt &amp; Agreement <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isSigned}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-white border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                    Driver License / State ID # <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSigned}
                    value={driverLicense}
                    onChange={(e) => setDriverLicense(e.target.value)}
                    placeholder="e.g. AZ D12345678"
                    className="w-full bg-white border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                  />
                  <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">
                    Required by Arizona insurance underwriters for commercial machinery dispatch.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1">
                    Jobsite Delivery Address &amp; Zip <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSigned}
                    value={jobsiteAddress}
                    onChange={(e) => setJobsiteAddress(e.target.value)}
                    placeholder="e.g. 28400 N Scottsdale Rd, Scottsdale, AZ 85266"
                    className="w-full bg-white border-2 border-slate-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: ITEMIZED FINANCIAL STATEMENT & SECURITY HOLD */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-red-600 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h2 className="text-base font-black text-gray-950 uppercase tracking-wider">
                  Itemized Financial Statement &amp; Security Hold
                </h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-gray-700 font-medium">
                    Base Machine Rental ({quote.rentalPeriod.days} Days • Best-Rate Mix):
                  </span>
                  <strong className="text-gray-950 font-black">
                    ${quote.costs.baseRental.toFixed(2)}
                  </strong>
                </div>

                {quote.costs.attachments > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-gray-700 font-medium">Selected Equipment Attachments:</span>
                    <strong className="text-gray-950 font-black">
                      ${quote.costs.attachments.toFixed(2)}
                    </strong>
                  </div>
                )}

                {deliveryIncluded && (
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-gray-700 font-medium">
                      Valley-Wide Flat Delivery &amp; Pickup (Maricopa County):
                    </span>
                    <strong className="text-gray-950 font-black">
                      ${quote.costs.delivery.toFixed(2)}
                    </strong>
                  </div>
                )}

                {damageWaiver && (
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-gray-700 font-medium">
                      Optional 10% Physical Damage Waiver:
                    </span>
                    <strong className="text-emerald-700 font-black">
                      ${quote.costs.damageWaiver.toFixed(2)}
                    </strong>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-200 text-gray-600 font-semibold">
                  <span>Subtotal:</span>
                  <span>${quote.costs.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-gray-700 font-medium">
                    Maricopa County Equipment Rental Tax (8.6%):
                  </span>
                  <strong className="text-gray-950 font-black">
                    ${quote.costs.taxAmount.toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between py-2.5 bg-red-50 border border-red-200 rounded-xl px-4 text-sm sm:text-base">
                  <span className="font-black text-gray-950 uppercase tracking-tight">
                    Total Estimated Rental:
                  </span>
                  <strong className="font-black text-red-600">
                    ${quote.costs.totalDue.toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between items-center py-2 bg-yellow-50 border border-yellow-300 rounded-xl px-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-800" />
                    <span className="font-bold text-gray-900">
                      Security Deposit Hold (Released Upon Undamaged Return):
                    </span>
                  </div>
                  <strong className="font-black text-gray-950">$500.00 Pre-Auth Hold</strong>
                </div>
              </div>
            </div>

            {/* SECTION 4: ARIZONA STATUTORY DISCLOSURES & MANDATORY CHECKBOXES */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-red-600 text-white font-black text-xs flex items-center justify-center">
                  4
                </span>
                <h2 className="text-base font-black text-gray-950 uppercase tracking-wider">
                  Mandatory Statutory Disclosures &amp; Compliance Acknowledgment
                </h2>
              </div>

              {/* DISCLOSURE 1: ARIZONA 811 DIG-LAW */}
              <div
                onClick={() => !isSigned && handleCheckbox("az811Acknowledged")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  disclosures.az811Acknowledged
                    ? "bg-emerald-50 border-emerald-600"
                    : "bg-white border-slate-300 hover:border-slate-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={disclosures.az811Acknowledged}
                    onChange={() => {}}
                    disabled={isSigned}
                    className="mt-1 w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  <div>
                    <h3 className="text-xs font-black text-gray-950 uppercase">
                      {ARIZONA_LEGAL_TERMS.az811.title}
                    </h3>
                    <p className="text-[11px] text-gray-600 font-medium mt-1 leading-relaxed">
                      {ARIZONA_LEGAL_TERMS.az811.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* DISCLOSURE 2: TOWING GVWR (IF TRAILER) */}
              {isTrailer && (
                <div
                  onClick={() => !isSigned && handleCheckbox("towingGvwrAcknowledged")}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    disclosures.towingGvwrAcknowledged
                      ? "bg-emerald-50 border-emerald-600"
                      : "bg-white border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={disclosures.towingGvwrAcknowledged}
                      onChange={() => {}}
                      disabled={isSigned}
                      className="mt-1 w-4 h-4 accent-red-600 cursor-pointer"
                    />
                    <div>
                      <h3 className="text-xs font-black text-gray-950 uppercase">
                        {ARIZONA_LEGAL_TERMS.towingGvwr.title}
                      </h3>
                      <p className="text-[11px] text-gray-600 font-medium mt-1 leading-relaxed">
                        {ARIZONA_LEGAL_TERMS.towingGvwr.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* DISCLOSURE 3: FUEL & CLEANLINESS */}
              <div
                onClick={() => !isSigned && handleCheckbox("fuelAndCleaningAcknowledged")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  disclosures.fuelAndCleaningAcknowledged
                    ? "bg-emerald-50 border-emerald-600"
                    : "bg-white border-slate-300 hover:border-slate-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={disclosures.fuelAndCleaningAcknowledged}
                    onChange={() => {}}
                    disabled={isSigned}
                    className="mt-1 w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  <div>
                    <h3 className="text-xs font-black text-gray-950 uppercase">
                      {ARIZONA_LEGAL_TERMS.fuelAndCleaning.title}
                    </h3>
                    <p className="text-[11px] text-gray-600 font-medium mt-1 leading-relaxed">
                      {ARIZONA_LEGAL_TERMS.fuelAndCleaning.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* DISCLOSURE 4: OPERATING HOURS & OVERTIME */}
              <div
                onClick={() => !isSigned && handleCheckbox("operatingHoursAcknowledged")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  disclosures.operatingHoursAcknowledged
                    ? "bg-emerald-50 border-emerald-600"
                    : "bg-white border-slate-300 hover:border-slate-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={disclosures.operatingHoursAcknowledged}
                    onChange={() => {}}
                    disabled={isSigned}
                    className="mt-1 w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  <div>
                    <h3 className="text-xs font-black text-gray-950 uppercase">
                      {ARIZONA_LEGAL_TERMS.operatingHours.title}
                    </h3>
                    <p className="text-[11px] text-gray-600 font-medium mt-1 leading-relaxed">
                      {ARIZONA_LEGAL_TERMS.operatingHours.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* DISCLOSURE 5: MASTER TERMS & CONDITIONS */}
              <div
                onClick={() => !isSigned && handleCheckbox("termsAndConditionsAccepted")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  disclosures.termsAndConditionsAccepted
                    ? "bg-emerald-50 border-emerald-600"
                    : "bg-white border-slate-300 hover:border-slate-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={disclosures.termsAndConditionsAccepted}
                    onChange={() => {}}
                    disabled={isSigned}
                    className="mt-1 w-4 h-4 accent-red-600 cursor-pointer"
                  />
                  <div>
                    <h3 className="text-xs font-black text-gray-950 uppercase">
                      Master Equipment Rental Terms &amp; Indemnification
                    </h3>
                    <p className="text-[11px] text-gray-600 font-medium mt-1 leading-relaxed">
                      Renter certifies that all equipment will be operated strictly by qualified, licensed personnel in accordance with manufacturer safety manuals and OSHA guidelines. Renter agrees to defend, indemnify, and hold harmless J-Bone Industries LLC and its members from all claims, liabilities, or injuries arising from equipment operation or jobsite conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: HTML5 SIGNATURE PAD */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200">
                <span className="w-6 h-6 rounded-md bg-red-600 text-white font-black text-xs flex items-center justify-center">
                  5
                </span>
                <h2 className="text-base font-black text-gray-950 uppercase tracking-wider">
                  Digital Ratification &amp; Execution
                </h2>
              </div>

              {isSigned && signatureDataUrl ? (
                <div className="bg-white border-2 border-emerald-600 rounded-2xl p-4 text-center">
                  <div className="max-w-xs mx-auto h-32 flex items-center justify-center">
                    <img
                      src={signatureDataUrl}
                      alt="Captured Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-black text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Signed by: {fullName} • Verified at {new Date(signedTimestamp).toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <SignaturePad onChange={(dataUrl) => setSignatureDataUrl(dataUrl)} disabled={isSigned} />
              )}
            </div>

            {/* SECTION 6: CRYPTOGRAPHIC AUDIT SEAL & RATIFICATION BUTTON */}
            {isSigned ? (
              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[#E5A919] font-black pb-1 border-b border-white/10 uppercase">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cryptographic SHA-256 Audit Seal</span>
                  </div>
                  <span>Status: Ratified &amp; Immutable</span>
                </div>
                <div className="break-all text-[11px] text-gray-300">
                  <span className="text-gray-500">Hash: </span>
                  {auditHash}
                </div>
                <div className="flex flex-wrap justify-between text-[10px] text-gray-400 pt-1">
                  <span>Signer: {fullName} ({email || phone})</span>
                  <span>Signed Timestamp: {signedTimestamp}</span>
                  <span>Authority: {COMPANY_INFO.legalName}</span>
                </div>
              </div>
            ) : (
              <div className="pt-2 text-center print:hidden">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-red w-full sm:w-auto px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-wider shadow-xl hover:scale-102 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>{isSubmitting ? "Generating Cryptographic Audit Hash..." : "Sign & Ratify Rental Agreement"}</span>
                </button>
                <p className="text-[11px] text-gray-500 font-medium mt-2">
                  By clicking above, you apply your legally binding digital signature and generate a permanent SHA-256 tamper-proof contract record.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* SWEETALERT-STYLE VALIDATION & CONFIRMATION MODAL */}
      <SwalModal {...modalConfig} />
    </div>
  );
}
