"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  Image,
  Clock,
  Type,
  DollarSign,
  MapPin,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
} from "lucide-react";
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  getStoredSettings,
  saveStoredSettings,
  getAdminPassword,
  setAdminPassword,
} from "@/lib/settings";
import { showConfirm, showAlert } from "@/lib/swal";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [liveTimePreview, setLiveTimePreview] = useState("");

  // PASSWORD CHANGE STATE
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const activePassword = getAdminPassword();
    if (currentPassword !== activePassword) {
      setPasswordError("Current password is incorrect. Please verify and try again.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setAdminPassword(newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess("Admin password updated successfully! Use your new password next time you sign in.");
    setTimeout(() => setPasswordSuccess(null), 5000);
  };

  useEffect(() => {
    const loaded = getStoredSettings();
    setSettings(loaded);
  }, []);

  // Update live preview clock
  useEffect(() => {
    const updatePreview = () => {
      try {
        const now = new Date();
        const str = now.toLocaleTimeString("en-US", {
          timeZone: settings.timeZone,
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: settings.timeFormat === "12h",
        });
        setLiveTimePreview(str);
      } catch {
        setLiveTimePreview("Invalid Timezone");
      }
    };
    updatePreview();
    const timer = setInterval(updatePreview, 1000);
    return () => clearInterval(timer);
  }, [settings.timeZone, settings.timeFormat]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoredSettings(settings);
    setSaveNotice("Settings saved successfully! Applied across both admin and client pages.");
    setTimeout(() => setSaveNotice(null), 3500);
  };

  const handleReset = async () => {
    const res = await showConfirm({
      title: "Reset All Settings?",
      text: "This will restore default Arizona rental specifications, logo scaling, and pricing defaults.",
      icon: "warning",
      confirmButtonText: "Yes, reset settings",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#DC2626",
    });

    if (res.isConfirmed) {
      setSettings(DEFAULT_APP_SETTINGS);
      saveStoredSettings(DEFAULT_APP_SETTINGS);
      setSaveNotice("Settings reset to system defaults.");
      setTimeout(() => setSaveNotice(null), 3500);
    }
  };

  return (
    <div className="space-y-6 font-sans text-gray-900 pb-16">
      {/* TOAST NOTICE */}
      {saveNotice && (
        <div className="fixed top-16 right-6 z-50 bg-red-600 text-white font-bold px-4 py-2.5 rounded shadow-xl text-sm flex items-center gap-2 border border-yellow-400 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* HEADER WITH UNIFORM H-10 ACTION BUTTONS */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-red-600" />
            System & Operator Settings
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage company branding, logo scale, typography, time zone, and pricing defaults.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="h-10 px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4 text-yellow-300" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. BRANDING & LOGO SECTION */}
        <div className="bg-white border border-gray-200 hover:border-yellow-400 hover:shadow-md rounded-lg p-5 shadow-xs space-y-4 transition-all duration-200">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building2 className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-black text-gray-950">
              Company Branding & Logo Customization
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* COMPANY DISPLAY NAME */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Company Display Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-bold text-gray-950 focus:border-red-600 focus:outline-none"
                placeholder="AZ Rental Guy"
              />
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Primary name displayed in site navigation, header, and invoices.
              </span>
            </div>

            {/* LEGAL ENTITY NAME */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Legal Entity Name
              </label>
              <input
                type="text"
                value={settings.legalEntityName}
                onChange={(e) => setSettings({ ...settings, legalEntityName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-semibold text-gray-950 focus:border-red-600 focus:outline-none"
                placeholder="J-Bone Industries LLC"
              />
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Used on formal digital rental agreements, insurance waivers, and tax filings.
              </span>
            </div>

            {/* TAGLINE */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Company Tagline / Subtitle
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-950 focus:border-red-600 focus:outline-none"
                placeholder="Heavy Equipment Rental Built for Arizona Jobs — Valley-Wide Delivery"
              />
            </div>

            {/* LOGO URL */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Logo Asset Path / URL
              </label>
              <input
                type="text"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono text-gray-950 focus:border-red-600 focus:outline-none"
                placeholder="/images/logo.webp"
              />
              <div className="flex gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoUrl: "/images/logo.webp" })}
                  className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Reset to Default Logo
                </button>
              </div>
            </div>

            {/* LOGO SIZE SLIDER & PRESETS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Logo Height Scale
                </label>
                <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  {settings.logoSize}px
                </span>
              </div>
              <input
                type="range"
                min={24}
                max={72}
                step={2}
                value={settings.logoSize}
                onChange={(e) => setSettings({ ...settings, logoSize: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex items-center gap-2 mt-2">
                {[
                  { label: "Compact", size: 28 },
                  { label: "Standard", size: 36 },
                  { label: "Medium", size: 44 },
                  { label: "Large", size: 56 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setSettings({ ...settings, logoSize: p.size })}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                      settings.logoSize === p.size
                        ? "bg-yellow-500 text-gray-950"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {p.label} ({p.size}px)
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LIVE LOGO PREVIEW BOX */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded border border-gray-200 flex items-center justify-center min-w-[80px]">
                <img
                  src={settings.logoUrl}
                  alt={settings.companyName}
                  style={{ height: `${settings.logoSize}px` }}
                  className="w-auto object-contain max-w-[200px]"
                />
              </div>
              <div>
                <span className="text-xs font-black text-gray-950 uppercase tracking-tight block">
                  Live Preview: Header Logo
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Renders at {settings.logoSize}px height across navbar and admin sidebar.
                </span>
              </div>
            </div>

            <div className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-yellow-600" />
              <span>Real-Time Scaled</span>
            </div>
          </div>
        </div>

        {/* 2. TIME FORMAT & TIME ZONE SECTION */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Clock className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-black text-gray-950">
              Time Format & Operational Time Zone
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* TIME ZONE SELECT */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Operating Time Zone
              </label>
              <select
                value={settings.timeZone}
                onChange={(e) => setSettings({ ...settings, timeZone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold text-gray-950 focus:border-red-600 focus:outline-none bg-white cursor-pointer"
              >
                <option value="America/Phoenix">America/Phoenix (Arizona MST - No DST)</option>
                <option value="America/Los_Angeles">America/Los Angeles (Pacific PT)</option>
                <option value="America/Denver">America/Denver (Mountain MT)</option>
                <option value="America/Chicago">America/Chicago (Central CT)</option>
                <option value="America/New_York">America/New York (Eastern ET)</option>
              </select>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Standardizes dispatch slot times and booking cutoffs.
              </span>
            </div>

            {/* TIME FORMAT */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Time Format
              </label>
              <select
                value={settings.timeFormat}
                onChange={(e) =>
                  setSettings({ ...settings, timeFormat: e.target.value as "12h" | "24h" })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold text-gray-950 focus:border-red-600 focus:outline-none bg-white cursor-pointer"
              >
                <option value="12h">12-Hour AM/PM (e.g. 07:30 AM)</option>
                <option value="24h">24-Hour Military (e.g. 19:30)</option>
              </select>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Applied to machine delivery windows and yard hours.
              </span>
            </div>

            {/* DATE FORMAT */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    dateFormat: e.target.value as "MM/DD/YYYY" | "YYYY-MM-DD" | "DD/MM/YYYY",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold text-gray-950 focus:border-red-600 focus:outline-none bg-white cursor-pointer"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY (11/19/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-11-19)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (19/11/2026)</option>
              </select>
            </div>
          </div>

          {/* CLOCK PREVIEW */}
          <div className="p-3 bg-yellow-50 border border-yellow-300 rounded flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="font-bold text-yellow-950">Active Zone Clock Preview:</span>
              <span className="font-mono font-black text-gray-950 text-sm">
                {liveTimePreview || "7:00 AM"}
              </span>
            </div>
            <span className="text-yellow-800 font-bold hidden sm:inline">
              {settings.timeZone}
            </span>
          </div>
        </div>

        {/* 3. TYPOGRAPHY & FONT STYLING (FRONTEND & BACKEND) */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Type className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-black text-gray-950">
              Typography & Font Style (Frontend & Admin)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* FONT FAMILY */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Font Family Style
              </label>
              <select
                value={settings.fontFamily}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    fontFamily: e.target.value as AppSettings["fontFamily"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold text-gray-950 focus:border-red-600 focus:outline-none bg-white cursor-pointer"
              >
                <option value="inter">Inter (Modern Clean Sans — Recommended)</option>
                <option value="jakarta">Plus Jakarta Sans (Sharp Modern)</option>
                <option value="roboto">Roboto (Industrial Workhorse)</option>
                <option value="oswald">Oswald (Heavy Industrial Condensed)</option>
                <option value="system">System Default (OS Native UI)</option>
              </select>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Controls the typography rendering on both public customer site and operator CRM.
              </span>
            </div>

            {/* BASE FONT SIZE */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Global Font Size Hierarchy
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    fontSize: e.target.value as AppSettings["fontSize"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-bold text-gray-950 focus:border-red-600 focus:outline-none bg-white cursor-pointer"
              >
                <option value="compact">Compact (13px body — high data density)</option>
                <option value="standard">Standard (14px body — recommended)</option>
                <option value="large">Large (15px body — enhanced readability)</option>
                <option value="spacious">Spacious (16px body — touch / field friendly)</option>
              </select>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Adjusts table rows, labels, inputs, and button typography scale.
              </span>
            </div>
          </div>

          {/* FONT PREVIEW CARD */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Typography Sample Box
            </span>
            <div className="text-lg font-black text-gray-950">
              CAT 259D3 Compact Track Loader — $150 Flat Valley Delivery
            </div>
            <p className="text-xs text-gray-600 mt-1 font-medium">
              Arizona commercial equipment rental agreement ratified with legal SHA-256 audit hash.
              Compliant with A.R.S. § 40-360.21 statutory dig requirements.
            </p>
          </div>
        </div>

        {/* 4. RENTAL PRICING & OPERATIONS (WHAT WAS MISSED) */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <DollarSign className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-black text-gray-950">
              Rental Pricing Engine & Compliance Defaults
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* FLAT DELIVERY FEE */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Valley-Wide Delivery Fee
              </label>
              <div className="relative rounded">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-gray-500 text-xs">
                  $
                </span>
                <input
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded text-sm font-black text-gray-950 focus:border-red-600 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Standard flat rate across Phoenix metro.
              </span>
            </div>

            {/* DEPOSIT AMOUNT */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Hold Deposit (Refundable)
              </label>
              <div className="relative rounded">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-gray-500 text-xs">
                  $
                </span>
                <input
                  type="number"
                  value={settings.depositAmount}
                  onChange={(e) => setSettings({ ...settings, depositAmount: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded text-sm font-black text-gray-950 focus:border-red-600 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Security authorization for 48-hr holds.
              </span>
            </div>

            {/* WAIVER RATE */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Damage Waiver Rate (%)
              </label>
              <div className="relative rounded">
                <input
                  type="number"
                  step={0.5}
                  value={settings.waiverRate}
                  onChange={(e) => setSettings({ ...settings, waiverRate: Number(e.target.value) })}
                  className="w-full pr-7 pl-3 py-1.5 border border-gray-300 rounded text-sm font-black text-gray-950 focus:border-red-600 focus:outline-none"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-gray-500 text-xs">
                  %
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Optional contractor damage protection.
              </span>
            </div>

            {/* SALES TAX RATE */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Sales Tax Rate (%)
              </label>
              <div className="relative rounded">
                <input
                  type="number"
                  step={0.1}
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                  className="w-full pr-7 pl-3 py-1.5 border border-gray-300 rounded text-sm font-black text-gray-950 focus:border-red-600 focus:outline-none"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-gray-500 text-xs">
                  %
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium mt-1 block">
                Maricopa County / AZ TPT tax rate.
              </span>
            </div>
          </div>

          {/* AZ 811 STATUTORY TOGGLE */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-900 block">
                Enforce Mandatory Arizona 811 Dig-Law Check
              </span>
              <span className="text-xs text-gray-500">
                Requires renters to check and acknowledge A.R.S. § 40-360.21 excavation rules before signing.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.az811Mandatory}
                onChange={(e) => setSettings({ ...settings, az811Mandatory: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        {/* 5. YARD & CONTACT INFORMATION */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <MapPin className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-black text-gray-950">
              Yard Operations & Dispatch Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Dispatch Phone Number
              </label>
              <input
                type="text"
                value={settings.dispatchPhone}
                onChange={(e) => setSettings({ ...settings, dispatchPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-bold text-gray-950 focus:border-red-600 focus:outline-none"
                placeholder="(707) 326-5592"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Notification & Dispatch Email
              </label>
              <input
                type="email"
                value={settings.dispatchEmail}
                onChange={(e) => setSettings({ ...settings, dispatchEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-bold text-gray-950 focus:border-red-600 focus:outline-none"
                placeholder="rentals@azrentalguy.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Equipment Yard Physical Address
              </label>
              <input
                type="text"
                value={settings.yardAddress}
                onChange={(e) => setSettings({ ...settings, yardAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-950 focus:border-red-600 focus:outline-none"
                placeholder="34820 N Cave Creek Rd, Cave Creek, AZ 85331"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Operating Yard Hours
              </label>
              <input
                type="text"
                value={settings.yardHours}
                onChange={(e) => setSettings({ ...settings, yardHours: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-950 focus:border-red-600 focus:outline-none"
                placeholder="Mon-Sat: 6:00 AM - 6:00 PM (MST)"
              />
            </div>
          </div>
        </div>

        {/* 6. ADMIN SECURITY & PASSWORD MANAGEMENT */}
        <div className="bg-white border-2 border-yellow-500 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-black text-gray-950">
                Operator Security & Admin Password
              </h2>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
              Role: Admin Superuser
            </span>
          </div>

          <p className="text-xs text-gray-600 font-medium">
            Update your master operator password to secure access to customer pipeline, dispatches, and financial invoices.
          </p>

          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-800 font-bold flex items-center gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* CURRENT PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-3 pr-9 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-950 focus:border-red-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-3 pr-9 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-950 focus:border-red-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-950 focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-black rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </div>

        {/* BOTTOM SAVE ACTION BAR */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-xs transition-colors cursor-pointer border border-gray-300"
          >
            Reset Defaults
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Save className="w-4 h-4 text-yellow-300" />
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
