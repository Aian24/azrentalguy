"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FLEET, COMPANY_INFO, EquipmentItem, getStoredFleet } from "@/lib/fleet";
import { calculateQuote } from "@/lib/pricing";
import { Calendar, ShieldAlert, CheckCircle, Truck, Phone, ShieldCheck, Check, Tag, PenTool } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SwalModal from "@/components/SwalModal";

export default function BookingSection() {
  const [selectedMachineId, setSelectedMachineId] = useState("cat-259d3");
  const [fleetList, setFleetList] = useState<EquipmentItem[]>(FLEET);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliveryIncluded, setDeliveryIncluded] = useState(true);
  const [damageWaiver, setDamageWaiver] = useState(true);
  const [withAttachment, setWithAttachment] = useState(false);
  const [az811Acknowledged, setAz811Acknowledged] = useState(false);

  // Form inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [agreementId, setAgreementId] = useState("");

  // SweetAlert-style Modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "warning" | "error" | "success" | "info";
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
    confirmText: "Got It, I'll Fix It",
    onConfirm: () => {},
  });

  useEffect(() => {
    const list = getStoredFleet();
    setFleetList(list);

    const handleSync = () => {
      setFleetList(getStoredFleet());
    };
    window.addEventListener("az_fleet_updated", handleSync);
    window.addEventListener("storage", handleSync);

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    setStartDate(today.toISOString().split("T")[0]);
    setEndDate(tomorrow.toISOString().split("T")[0]);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      let eqParam = params.get("equipment");
      if (!eqParam && window.location.hash.includes("?")) {
        const hashQuery = window.location.hash.split("?")[1];
        eqParam = new URLSearchParams(hashQuery).get("equipment");
      }
      if (eqParam && list.some((m) => m.id === eqParam)) {
        setSelectedMachineId(eqParam);
      }

      const handleCustomSelect = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        const current = getStoredFleet();
        if (customEvent.detail && current.some((m) => m.id === customEvent.detail)) {
          setSelectedMachineId(customEvent.detail);
        }
      };

      window.addEventListener("select-equipment", handleCustomSelect);
      return () => {
        window.removeEventListener("select-equipment", handleCustomSelect);
        window.removeEventListener("az_fleet_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
  }, []);

  const machine = fleetList.find((m) => m.id === selectedMachineId) || fleetList[0] || FLEET[0];

  // Dynamic calculations via master pricing engine
  const quote = calculateQuote({
    equipmentId: selectedMachineId,
    startDate,
    endDate,
    deliveryIncluded,
    damageWaiver,
    withAttachment,
    zipCode: address,
  });

  const days = quote.rentalPeriod.days;
  const baseCost = quote.costs.baseRental;
  const attachCost = quote.costs.attachments;
  const deliveryFee = quote.costs.delivery;
  const waiverFee = quote.costs.damageWaiver;
  const subtotal = quote.costs.subtotal;
  const tax = quote.costs.taxAmount;
  const grandTotal = quote.costs.totalDue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Customer Name Required",
        message: "Please enter your Full Name to reserve this equipment hold.",
        confirmText: "Got It",
        onConfirm: () => setModalConfig((p) => ({ ...p, isOpen: false })),
      });
      return;
    }

    if (!phone.trim()) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Contact Phone Required",
        message: "Please enter your contact phone number so our team can confirm dispatch.",
        confirmText: "Got It",
        onConfirm: () => setModalConfig((p) => ({ ...p, isOpen: false })),
      });
      return;
    }

    if (machine.requiresAZ811 && !az811Acknowledged) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Arizona 811 Dig-Law Required",
        message: "Pursuant to Arizona Revised Statutes § 40-360.21, you must check and acknowledge the mandatory Call-Before-You-Dig safety requirement to proceed with this earthmoving machine.",
        confirmText: "I Understand",
        onConfirm: () => setModalConfig((p) => ({ ...p, isOpen: false })),
      });
      return;
    }

    const generatedId = "AZR-" + Math.floor(100000 + Math.random() * 900000);
    setAgreementId(generatedId);
    setSubmitted(true);
  };

  return (
    <section id="Booknow" className="scroll-mt-20 sm:scroll-mt-24 py-12 sm:py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER - NO BADGE PER USER REQUEST */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Request an Equipment Rental
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
            Lock in your equipment with our free 48-hour reservation hold. Transparent pricing with instant quote breakdown.
          </p>
        </ScrollReveal>

        {submitted ? (
          <ScrollReveal className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 text-center bg-red-50 border-2 border-red-600 shadow-2xl">
            <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-950">Rental Hold Requested!</h3>
            <p className="text-sm text-gray-700 mt-2.5 max-w-md mx-auto leading-relaxed font-medium">
              Thank you, <strong className="text-gray-950">{name || "Customer"}</strong>. Your 48-hour reservation hold for the{" "}
              <strong className="text-red-600">{machine.name}</strong> has been received under confirmation <strong className="text-gray-950">{agreementId}</strong>.
            </p>

            <div className="mt-6 bg-white border-2 border-red-200 p-5 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto shadow-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Hold Reference:</span>
                <strong className="text-red-600 font-black">{agreementId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Machine:</span>
                <strong className="text-gray-950 font-black">{machine.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Dates:</span>
                <strong className="text-gray-950 font-black">
                  {startDate} to {endDate} ({days} Days)
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Estimated Total:</span>
                <strong className="text-red-600 font-black text-sm">
                  ${grandTotal.toFixed(2)}
                </strong>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px] pt-2 border-t border-gray-200">
                <span>Contact Phone:</span>
                <strong className="text-gray-950">{phone || "(707) 326-5592"}</strong>
              </div>
            </div>

            {/* 1-CLICK DIGITAL AGREEMENT & CALL CTA */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href={`/agreement/${agreementId || "AZR-884102"}?equipment=${machine.id}&start=${startDate}&end=${endDate}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&address=${encodeURIComponent(address)}&delivery=${deliveryIncluded}&waiver=${damageWaiver}&attachment=${withAttachment}`}
                className="btn-red py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg hover:scale-102 transition-all cursor-pointer whitespace-nowrap"
              >
                <PenTool className="w-4 h-4 text-white" />
                <span>Sign Digital Rental Agreement Now</span>
              </Link>
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="btn-yellow py-3.5 px-6 rounded-2xl text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-gray-950" />
                <span>Call Dispatch ({COMPANY_INFO.phone})</span>
              </a>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-950 underline cursor-pointer"
              >
                ← Edit reservation details or submit another request
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT: FORM DESIGN WITH FILLED ACCENTS */}
            <ScrollReveal className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-slate-50 border-2 border-gray-200 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: EQUIPMENT & DATES */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                    <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-base font-black text-gray-950 tracking-tight">
                      Equipment Model &amp; Rental Dates
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1.5">
                      Select Equipment Model
                    </label>
                    <select
                      value={selectedMachineId}
                      onChange={(e) => setSelectedMachineId(e.target.value)}
                      className="w-full bg-gray-50 hover:bg-white focus:bg-white border-2 border-gray-300 rounded-xl p-3.5 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none cursor-pointer"
                    >
                      {fleetList.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} — ${m.dailyRate}/day (${m.weeklyRate}/wk)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-gray-50 hover:bg-white focus:bg-white border-2 border-gray-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1.5">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-gray-50 hover:bg-white focus:bg-white border-2 border-gray-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 2: SERVICE OPTIONS (RICH FILLED CARDS) */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                    <span className="w-7 h-7 rounded-lg bg-[#E5A919] text-white font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-base font-black text-gray-950 tracking-tight">
                      Service Options &amp; Protections
                    </h3>
                  </div>

                  {/* DELIVERY OPTION */}
                  <div
                    onClick={() => setDeliveryIncluded(!deliveryIncluded)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                      deliveryIncluded
                        ? "border-red-300 bg-red-50 text-gray-950 shadow-xs"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        deliveryIncluded ? "bg-red-600 text-white shadow-xs" : "border-2 border-gray-300 bg-white"
                      }`}
                    >
                      {deliveryIncluded && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-gray-950 text-xs sm:text-sm">
                          Include $150 Flat Valley Delivery &amp; Pickup
                        </span>
                        <span className="text-xs font-black text-red-600 bg-white px-2 py-0.5 rounded-md border border-red-200">
                          +$150
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-700 mt-0.5 font-medium">
                        Direct drop-off and pickup anywhere in Maricopa County.
                      </p>
                    </div>
                  </div>

                  {/* DAMAGE WAIVER (WHITE CHECKMARK) */}
                  <div
                    onClick={() => setDamageWaiver(!damageWaiver)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                      damageWaiver
                        ? "border-yellow-300 bg-yellow-50 text-gray-950 shadow-xs"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        damageWaiver ? "bg-[#E5A919] text-white shadow-xs" : "border-2 border-gray-300 bg-white"
                      }`}
                    >
                      {damageWaiver && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-gray-950 text-xs sm:text-sm">
                          10% Physical Damage Waiver
                        </span>
                        <span className="text-xs font-black text-yellow-900 bg-white px-2 py-0.5 rounded-md border border-yellow-300">
                          +10%
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-700 mt-0.5 font-medium">
                        Zero-deductible coverage for accidental body or hydraulic damage.
                      </p>
                    </div>
                  </div>

                  {/* ATTACHMENT */}
                  {machine.availableAttachments && (
                    <div
                      onClick={() => setWithAttachment(!withAttachment)}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                        withAttachment
                          ? "border-red-300 bg-red-50 text-gray-950 shadow-xs"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          withAttachment ? "bg-red-600 text-white shadow-xs" : "border-2 border-gray-300 bg-white"
                        }`}
                      >
                        {withAttachment && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-gray-950 text-xs sm:text-sm">
                            Add Pallet Forks or Gannon Box Scraper
                          </span>
                          <span className="text-xs font-black text-red-600 bg-white px-2 py-0.5 rounded-md border border-red-200">
                            +$50/d
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-700 mt-0.5 font-medium">
                          Heavy-duty attachment for grading, digging, or material handling.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* STEP 3: CONTACT & JOBSITE */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3.5">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
                    <span className="w-7 h-7 rounded-lg bg-gray-900 text-white font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-base font-black text-gray-950 tracking-tight">
                      Contact &amp; Jobsite Address
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1.5">
                        Full Name / Company
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe / Desert Excavation"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 hover:bg-white focus:bg-white border-2 border-gray-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(602) 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 hover:bg-white focus:bg-white border-2 border-gray-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 hover:bg-white focus:bg-white border-2 border-gray-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-1.5">
                        Jobsite Delivery Address
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Street, City, Zip in Maricopa Co."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-gray-50 hover:bg-white focus:bg-white border-2 border-gray-300 rounded-xl p-3 text-sm font-bold text-gray-950 focus:border-red-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ARIZONA 811 CHECKBOX (RED-50 CARD THEMED) */}
                {machine.requiresAZ811 && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-950 p-4 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-black uppercase mb-1 text-red-700">
                      <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                      <span>Arizona 811 Statutory Excavation Disclosure</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed mb-2.5 font-medium">
                      Under A.R.S. § 40-360.21, any digging, grading, or trenching requires calling Arizona 811 at least two full working days prior to machine arrival on site.
                    </p>
                    <label className="flex items-start gap-2.5 text-xs font-bold text-gray-900 cursor-pointer bg-white border border-red-200 p-2.5 rounded-xl select-none">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          az811Acknowledged ? "bg-red-600 text-white" : "border-2 border-gray-300 bg-white"
                        }`}
                      >
                        {az811Acknowledged && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                      <input
                        type="checkbox"
                        required
                        checked={az811Acknowledged}
                        onChange={(e) => setAz811Acknowledged(e.target.checked)}
                        className="sr-only"
                      />
                      <span>I acknowledge and confirm Arizona 811 marks will be called in prior to machine excavation.</span>
                    </label>
                  </div>
                )}

                {/* SUBMIT BUTTON (SOLID RED PER USER RULE) */}
                <button
                  type="submit"
                  className="btn-red w-full py-4 rounded-2xl text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-102 transition-all cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-white" />
                  <span>Request 48-Hour Reservation Hold</span>
                </button>
              </form>
            </ScrollReveal>

            {/* RIGHT: RECEIPT SUMMARY CARD (RED-50 & YELLOW-50 THEME) */}
            <ScrollReveal delay={150} className="lg:col-span-5 rounded-3xl overflow-hidden bg-white border-2 border-gray-200 shadow-xl lg:sticky lg:top-24">
              {/* HEADER */}
              <div className="bg-red-50 border-b-2 border-red-200 p-5 flex items-center justify-between text-gray-950">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
                    Live Calculation
                  </span>
                  <h3 className="text-lg font-black tracking-tight text-gray-950">
                    Instant Quote Summary
                  </h3>
                </div>
                <span className="bg-yellow-50 text-yellow-900 border border-yellow-300 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-2xs">
                  48-Hr Hold
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* MACHINE MINI PREVIEW (YELLOW-50 CARD) */}
                <div className="p-3.5 bg-yellow-50 border-2 border-yellow-200 rounded-2xl flex items-center gap-3">
                  <img
                    src={
                      machine.id === "cat-259d3"
                        ? "/images/cat-ontrailer.webp"
                        : machine.id === "cat-226d3"
                        ? "/images/equipments/2021 Cat 226D3/1.jpg"
                        : machine.id === "jd-4044m"
                        ? "/images/jd-4044.webp"
                        : machine.id === "wt5c"
                        ? "/images/water-trailer.webp"
                        : "/images/cat-ontrailer.webp"
                    }
                    alt={machine.name}
                    className="w-14 h-14 object-contain rounded-xl bg-white border border-yellow-200 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-black text-gray-950 truncate">{machine.name}</div>
                    <div className="text-[11px] font-bold text-red-600">${machine.dailyRate}/day • ${machine.weeklyRate}/wk</div>
                    <div className="text-[10px] text-gray-700 font-bold">{days} Rental Days</div>
                  </div>
                </div>

                {/* ITEMIZED BREAKDOWN (SLATE-50 CARD) */}
                <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl space-y-2.5 text-xs">
                  {quote.costs.savings > 0 && (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Best Rate Applied:</span>
                      </div>
                      <span className="text-emerald-700 font-black">-${quote.costs.savings.toFixed(2)} Saved</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500 font-semibold">Included Operating Hours:</span>
                    <strong className="text-gray-950 font-black">{quote.operations.includedHours}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500 font-semibold">Optimized Rental Rate:</span>
                    <strong className="text-gray-950 font-black">${baseCost.toFixed(2)}</strong>
                  </div>
                  {attachCost > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-500 font-semibold">Attachment Fee:</span>
                      <strong className="text-gray-950 font-black">${attachCost.toFixed(2)}</strong>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500 font-semibold">Valley Delivery &amp; Pickup:</span>
                    <strong className="text-gray-950 font-black">${deliveryFee.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500 font-semibold">Damage Waiver (10%):</span>
                    <strong className="text-gray-950 font-black">${waiverFee.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500 font-semibold">Maricopa Rental Tax (8.6%):</span>
                    <strong className="text-gray-950 font-black">${tax.toFixed(2)}</strong>
                  </div>
                </div>

                {/* TOTAL CARD (YELLOW-50 CARD) */}
                <div className="bg-yellow-50 text-gray-950 p-5 rounded-2xl border-2 border-yellow-200 shadow-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-black text-yellow-900 text-xs uppercase tracking-wider">Estimated Total:</span>
                    <span className="text-3xl font-black text-gray-950">${grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-gray-700 font-bold mt-2 flex items-center gap-1.5 pt-2 border-t border-yellow-200">
                    <ShieldCheck className="w-4 h-4 text-yellow-700 shrink-0" />
                    <span>Refundable Deposit: $500 hold on delivery dispatch.</span>
                  </div>
                </div>

                {/* CALL DISPATCH BUTTON (SOLID RED) */}
                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="btn-red w-full py-3.5 rounded-2xl text-center text-xs font-black uppercase tracking-wider block shadow-md hover:scale-102 transition-all cursor-pointer"
                >
                  Need Immediate Help? Call {COMPANY_INFO.phone}
                </a>
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>

      {/* SWEETALERT-STYLE VALIDATION MODAL */}
      <SwalModal {...modalConfig} />
    </section>
  );
}
