"use client";

import React, { useState } from "react";
import { X, Phone, User, MapPin, Calendar, DollarSign, Check, AlertCircle, Plus } from "lucide-react";
import { FLEET, COMPANY_INFO } from "@/lib/fleet";
import { PipelineLead } from "@/lib/admin-data";

interface PhoneInLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated?: (lead: PipelineLead) => void;
}

export default function PhoneInLeadModal({ isOpen, onClose, onLeadCreated }: PhoneInLeadModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [jobsiteAddress, setJobsiteAddress] = useState("");
  const [equipmentId, setEquipmentId] = useState(FLEET[0]?.id || "cat-259d3");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [durationDays, setDurationDays] = useState(3);
  const [needsDelivery, setNeedsDelivery] = useState(true);
  const [needsWaiver, setNeedsWaiver] = useState(true);
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"normal" | "high" | "urgent">("normal");

  if (!isOpen) return null;

  const selectedMachine = FLEET.find((e) => e.id === equipmentId) || FLEET[0];

  const calculateEstimate = () => {
    let base = 0;
    if (durationDays >= 28) {
      const months = Math.floor(durationDays / 28);
      const remDays = durationDays % 28;
      base = months * selectedMachine.monthlyRate + remDays * selectedMachine.dailyRate;
    } else if (durationDays >= 7) {
      const weeks = Math.floor(durationDays / 7);
      const remDays = durationDays % 7;
      base = weeks * selectedMachine.weeklyRate + remDays * selectedMachine.dailyRate;
    } else {
      base = durationDays * selectedMachine.dailyRate;
    }

    const delivery = needsDelivery ? COMPANY_INFO.flatDeliveryFee : 0;
    const waiver = needsWaiver ? Math.round(base * COMPANY_INFO.damageWaiverRate) : 0;
    const subtotal = base + delivery + waiver;
    const tax = Math.round(subtotal * COMPANY_INFO.taxRate);
    return subtotal + tax;
  };

  const estimatedTotal = calculateEstimate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    const endD = new Date(startDate);
    endD.setDate(endD.getDate() + durationDays);

    const newLead: PipelineLead = {
      id: `LD-${Date.now().toString().slice(-4)}`,
      customerName: customerName.trim(),
      companyName: companyName.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || "dispatch@azrentalguy.com",
      equipmentId: selectedMachine.id,
      equipmentName: selectedMachine.name,
      stage: "quoted",
      startDate,
      endDate: endD.toISOString().split("T")[0],
      jobsiteAddress: jobsiteAddress.trim() || "Phoenix Valley",
      quotedAmount: estimatedTotal,
      createdAt: new Date().toISOString(),
      notes: notes.trim() || "Phone-in lead captured by dispatch.",
      priority,
    };

    if (onLeadCreated) {
      onLeadCreated(newLead);
    }
    onClose();
    setCustomerName("");
    setCompanyName("");
    setPhone("");
    setEmail("");
    setJobsiteAddress("");
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-none">
      <div className="bg-white border-2 border-red-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* HEADER - RED & GOLD THEME */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between border-b-2 border-yellow-500">
          <div className="flex items-center gap-3">
            <span className="bg-yellow-500 text-gray-950 font-black px-2.5 py-1 text-xs uppercase tracking-wider rounded">
              Fast Entry
            </span>
            <h3 className="text-white text-base font-bold tracking-tight">
              Phone-In Lead / Quick Booking Hold
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-red-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-900 font-bold mb-1">
                Customer Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Brett Miller"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-medium focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-1">Company (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Miller Custom Homes"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-medium focus:border-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-900 font-bold mb-1">
                Caller Phone Number <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="(602) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-medium focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-1">Email Address</label>
              <input
                type="email"
                placeholder="caller@contractor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-medium focus:border-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-900 font-bold mb-1">Jobsite Address / City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. 34100 N Cave Creek Rd, Cave Creek, AZ 85331"
                value={jobsiteAddress}
                onChange={(e) => setJobsiteAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-medium focus:border-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-gray-900 font-bold mb-1">Equipment Unit</label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-bold focus:border-yellow-500 focus:outline-none bg-white"
              >
                {FLEET.map((machine) => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name} (${machine.dailyRate}/d, ${machine.weeklyRate}/w)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "normal" | "high" | "urgent")}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-bold focus:border-yellow-500 focus:outline-none bg-white"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent / Today</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-900 font-bold mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-medium focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-1">Rental Days</label>
              <input
                type="number"
                min="1"
                max="90"
                value={durationDays}
                onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-medium focus:border-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          {/* TOGGLES */}
          <div className="bg-gray-50 border border-gray-200 p-3 rounded flex flex-wrap gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
              <input
                type="checkbox"
                checked={needsDelivery}
                onChange={(e) => setNeedsDelivery(e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              Include $150 Flat Valley Delivery
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
              <input
                type="checkbox"
                checked={needsWaiver}
                onChange={(e) => setNeedsWaiver(e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              Include 10% Damage Waiver
            </label>
          </div>

          {/* ESTIMATE CALLOUT */}
          <div className="bg-yellow-50 border-2 border-yellow-500 p-3.5 rounded flex items-center justify-between">
            <div>
              <span className="text-yellow-800 font-bold uppercase text-[10px] tracking-wider block">
                Calculated Rental Total
              </span>
              <span className="text-gray-950 font-black text-xl">
                ${estimatedTotal.toLocaleString()}{" "}
                <span className="text-xs text-gray-600 font-normal">
                  (Includes Maricopa 8.6% Tax)
                </span>
              </span>
            </div>
            <span className="text-xs text-yellow-900 font-bold bg-yellow-200/80 px-2.5 py-1 rounded">
              48-Hour Hold Eligible
            </span>
          </div>

          <div>
            <label className="block text-gray-900 font-bold mb-1">Dispatch Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Caller requested delivery before 8:00 AM."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded text-gray-900 font-medium focus:border-yellow-500 focus:outline-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded border-2 border-red-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              Save Lead & Reserve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
