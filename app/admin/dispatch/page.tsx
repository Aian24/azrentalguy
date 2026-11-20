"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  Send,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  ExternalLink,
  Calendar,
  RotateCcw,
  Printer,
  FileText,
} from "lucide-react";
import {
  INITIAL_DISPATCH,
  INITIAL_HOLDS,
  DispatchItem,
  ActiveHold,
} from "@/lib/admin-data";
import { FLEET } from "@/lib/fleet";
import PhoneInLeadModal from "@/components/admin/PhoneInLeadModal";
import ModernDatePicker from "@/components/admin/ModernDatePicker";

// RICH STATUS COLOR & BADGE CONFIGURATION (MATCHING PIPELINE & PERMITS)
const STATUS_CONFIG: Record<
  DispatchItem["status"],
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    selectClass: string;
  }
> = {
  scheduled: {
    label: "Scheduled",
    badgeClass: "bg-yellow-100 text-yellow-950 border-yellow-400 font-bold",
    dotClass: "bg-yellow-500",
    selectClass: "bg-yellow-100 text-yellow-950 border-yellow-400 font-bold hover:bg-yellow-200",
  },
  dispatched: {
    label: "Dispatched",
    badgeClass: "bg-red-50 text-red-800 border-red-300 font-bold",
    dotClass: "bg-red-600",
    selectClass: "bg-red-50 text-red-800 border-red-300 font-bold hover:bg-red-100",
  },
  "on-site": {
    label: "On-Site",
    badgeClass: "bg-red-600 text-white border-red-600 font-black",
    dotClass: "bg-white",
    selectClass: "bg-red-600 text-white border-red-600 font-black shadow-xs hover:bg-red-700",
  },
  completed: {
    label: "Completed",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-400 font-bold",
    dotClass: "bg-emerald-600",
    selectClass: "bg-emerald-100 text-emerald-900 border-emerald-400 font-bold hover:bg-emerald-200",
  },
  delayed: {
    label: "Delayed",
    badgeClass: "bg-red-100 text-red-900 border-red-500 font-bold",
    dotClass: "bg-red-700",
    selectClass: "bg-red-100 text-red-900 border-red-500 font-bold hover:bg-red-200",
  },
};

export default function AdminDispatchPage() {
  const [dispatchList, setDispatchList] = useState<DispatchItem[]>(INITIAL_DISPATCH);
  const [holdsList, setHoldsList] = useState<ActiveHold[]>(INITIAL_HOLDS);
  const [dispatchSearch, setDispatchSearch] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState("all");
  const [dispatchPage, setDispatchPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default to 10 entries

  // Date Filtering State: "all" | "today" | "tomorrow" | "yesterday" | "week" | "past" | "custom"
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "tomorrow" | "yesterday" | "week" | "past" | "custom"
  >("all");
  const [customDate, setCustomDate] = useState("");

  const [holdsSearch, setHoldsSearch] = useState("");
  const [holdsPage, setHoldsPage] = useState(1);
  const [isHoldsModalOpen, setIsHoldsModalOpen] = useState(false);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleStatusChange = (id: string, newStatus: DispatchItem["status"]) => {
    setDispatchList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    showNotice(`Dispatch ${id} updated to ${newStatus.toUpperCase()}`);
  };

  const handleSendReminder = (customer: string, phone: string) => {
    showNotice(`SMS agreement reminder sent to ${customer} (${phone})`);
  };

  const handleReleaseHold = (id: string, name: string) => {
    setHoldsList((prev) => prev.filter((h) => h.id !== id));
    showNotice(`Hold ${id} released for ${name}`);
  };

  // Date Constants (Standardized for Phoenix Operations)
  const todayStr = "2026-11-19";
  const tomorrowStr = "2026-11-20";
  const yesterdayStr = "2026-11-18";

  // Category Counts for Quick Filter Pills
  const todayCount = dispatchList.filter((d) => d.scheduledDate === todayStr).length;
  const tomorrowCount = dispatchList.filter((d) => d.scheduledDate === tomorrowStr).length;
  const yesterdayCount = dispatchList.filter((d) => d.scheduledDate === yesterdayStr).length;
  const pastCount = dispatchList.filter((d) => d.scheduledDate < todayStr).length;
  const weekCount = dispatchList.filter(
    (d) => d.scheduledDate >= "2026-11-17" && d.scheduledDate <= "2026-11-23"
  ).length;
  const allCount = dispatchList.length;

  // Filtered & Paginated Dispatch Data Table
  const filteredDispatch = dispatchList.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(dispatchSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(dispatchSearch.toLowerCase()) ||
      item.equipmentName.toLowerCase().includes(dispatchSearch.toLowerCase()) ||
      item.jobsiteAddress.toLowerCase().includes(dispatchSearch.toLowerCase()) ||
      item.driver.toLowerCase().includes(dispatchSearch.toLowerCase());

    const matchesStatus = dispatchStatus === "all" || item.status === dispatchStatus;

    let matchesDate = true;
    if (customDate) {
      matchesDate = item.scheduledDate === customDate;
    } else if (dateFilter === "today") {
      matchesDate = item.scheduledDate === todayStr;
    } else if (dateFilter === "tomorrow") {
      matchesDate = item.scheduledDate === tomorrowStr;
    } else if (dateFilter === "yesterday") {
      matchesDate = item.scheduledDate === yesterdayStr;
    } else if (dateFilter === "past") {
      matchesDate = item.scheduledDate < todayStr;
    } else if (dateFilter === "week") {
      matchesDate =
        item.scheduledDate >= "2026-11-17" && item.scheduledDate <= "2026-11-23";
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalDispatchPages = Math.ceil(filteredDispatch.length / rowsPerPage) || 1;
  const displayedDispatch = filteredDispatch.slice(
    (dispatchPage - 1) * rowsPerPage,
    dispatchPage * rowsPerPage
  );

  // Filtered & Paginated Holds for Modal
  const filteredHolds = holdsList.filter((h) => {
    return (
      h.customerName.toLowerCase().includes(holdsSearch.toLowerCase()) ||
      h.equipmentName.toLowerCase().includes(holdsSearch.toLowerCase()) ||
      h.id.toLowerCase().includes(holdsSearch.toLowerCase())
    );
  });
  const holdsRowsPerPage = 5;
  const totalHoldsPages = Math.ceil(filteredHolds.length / holdsRowsPerPage) || 1;
  const displayedHolds = filteredHolds.slice(
    (holdsPage - 1) * holdsRowsPerPage,
    holdsPage * holdsRowsPerPage
  );

  return (
    <div className="space-y-6 font-sans text-gray-900 pb-12">
      {/* TOAST */}
      {actionNotice && (
        <div className="fixed top-16 right-6 z-50 bg-red-600 text-white font-bold px-4 py-2.5 rounded shadow-lg text-sm flex items-center gap-2 border border-yellow-400 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* TOP HEADER WITH MATCHING HEIGHTS (h-10) */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-red-600" />
            Dispatch & Delivery Management
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Valley-wide machine drop-offs, driver assignments, and multi-day scheduling.
          </p>
        </div>

        {/* MATCHING HEIGHT ACTIONS & STATS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-10 px-3.5 bg-yellow-50 border border-yellow-300 rounded flex items-center gap-2 text-xs">
            <span className="text-yellow-800 font-bold">Delivery Zone:</span>
            <span className="font-black text-gray-950">$150 Flat Valley-Wide</span>
          </div>

          <button
            onClick={() => setIsManifestModalOpen(true)}
            className="h-10 bg-red-600 hover:bg-red-700 text-white font-bold px-4 rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Open printable daily driver delivery & pickup manifest"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Print Driver Manifest</span>
          </button>
        </div>
      </div>

      {/* 4 INTERACTIVE DATE SUMMARY CARDS (CLICK TO FILTER DATA TABLE) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TODAY DISPATCHES CARD */}
        <div
          onClick={() => {
            setDateFilter("today");
            setCustomDate("");
            setDispatchPage(1);
          }}
          className={`bg-white border-2 p-4 rounded-lg shadow-xs transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer group active:scale-[0.98] ${dateFilter === "today" && !customDate
              ? "border-red-600 ring-2 ring-red-600/30 bg-red-50/20"
              : "border-red-600 hover:bg-red-50/10"
            }`}
          title="Click to view Today's Dispatches"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Today's Dispatches
            </span>
            <span className="text-[11px] font-black text-red-600 group-hover:underline">
              Nov 19 →
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
            {todayCount} Units
          </div>
          <span className="text-xs font-bold text-red-700 block mt-1">
            {dateFilter === "today" && !customDate
              ? "Currently Active Filter"
              : "Click to filter Today"}
          </span>
        </div>

        {/* TOMORROW DISPATCHES CARD */}
        <div
          onClick={() => {
            setDateFilter("tomorrow");
            setCustomDate("");
            setDispatchPage(1);
          }}
          className={`bg-white border-2 p-4 rounded-lg shadow-xs transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer group active:scale-[0.98] ${dateFilter === "tomorrow" && !customDate
              ? "border-yellow-500 ring-2 ring-yellow-500/30 bg-yellow-50/20"
              : "border-yellow-500 hover:bg-yellow-50/10"
            }`}
          title="Click to view Tomorrow's Pre-Staged Dispatches"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Tomorrow's Schedule
            </span>
            <span className="text-[11px] font-black text-yellow-800 group-hover:underline">
              Nov 20 →
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
            {tomorrowCount} Units
          </div>
          <span className="text-xs font-bold text-yellow-800 block mt-1">
            {dateFilter === "tomorrow" && !customDate
              ? "Currently Active Filter"
              : "Prepped in Cave Creek yard"}
          </span>
        </div>

        {/* PAST & COMPLETED (YESTERDAY & EARLIER) */}
        <div
          onClick={() => {
            setDateFilter("past");
            setCustomDate("");
            setDispatchPage(1);
          }}
          className={`bg-white border-2 p-4 rounded-lg shadow-xs transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer group active:scale-[0.98] ${dateFilter === "past" && !customDate
              ? "border-gray-400 ring-2 ring-gray-400/30 bg-gray-50"
              : "border-gray-200 hover:bg-gray-50"
            }`}
          title="Click to view Past & Completed Dispatches"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Past & Completed
            </span>
            <span className="text-[11px] font-black text-gray-700 group-hover:underline">
              History →
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
            {pastCount} Units
          </div>
          <span className="text-xs font-bold text-gray-600 block mt-1">
            {dateFilter === "past" && !customDate
              ? "Showing Yesterday & Earlier"
              : "Yesterday & Earlier Records"}
          </span>
        </div>

        {/* CLICKABLE ACTIVE HOLDS CARD -> OPENS MODAL */}
        <div
          onClick={() => setIsHoldsModalOpen(true)}
          className="bg-white border-2 border-red-600 p-4 rounded-lg shadow-xs cursor-pointer hover:bg-red-50/10 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg group active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Active 48-Hr Holds
            </span>
            <span className="text-[11px] font-bold text-red-600 group-hover:underline">
              View Modal →
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1">
            {holdsList.length} Units
          </div>
          <span className="text-xs font-bold text-red-700 block mt-1">
            Click to manage holds
          </span>
        </div>
      </div>

      {/* SINGLE PRIMARY DATA TABLE: DISPATCH SCHEDULE */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* COMPACT TOOLBAR */}
        <div className="p-3.5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
          {/* SEARCH */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search dispatch, contractor, unit..."
              value={dispatchSearch}
              onChange={(e) => {
                setDispatchSearch(e.target.value);
                setDispatchPage(1);
              }}
              className="h-9 w-full pl-9 pr-3 border border-gray-300 rounded text-xs focus:border-red-600 focus:outline-none bg-white"
            />
          </div>

          {/* DATE & STATUS FILTERS */}
          <div className="flex flex-wrap items-center gap-2">
          <select
            value={customDate ? "custom" : dateFilter}
            onChange={(e) => {
              const val = e.target.value;
              if (val !== "custom") {
                setCustomDate("");
                setDateFilter(val as any);
                setDispatchPage(1);
              }
            }}
            className={`h-9 px-3 border rounded text-xs font-bold focus:outline-none cursor-pointer transition-colors shadow-2xs ${dateFilter === "today" && !customDate
                ? "bg-red-600 text-white border-red-600 shadow-xs"
                : dateFilter === "tomorrow" && !customDate
                  ? "bg-yellow-500 text-gray-950 border-yellow-500"
                  : dateFilter === "yesterday" && !customDate
                    ? "bg-gray-200 text-gray-800 border-gray-400"
                    : "bg-white text-gray-800 border-gray-300"
              }`}
          >
            <option value="all" className="bg-white text-gray-800 font-semibold">
              All Dates ({allCount})
            </option>
            <option value="today" className="bg-white text-red-700 font-bold">
              Today (Nov 19) ({todayCount})
            </option>
            <option value="tomorrow" className="bg-white text-yellow-800 font-bold">
              Tomorrow (Nov 20) ({tomorrowCount})
            </option>
            <option value="yesterday" className="bg-white text-gray-700 font-bold">
              Yesterday (Nov 18) ({yesterdayCount})
            </option>
            <option value="week" className="bg-white text-gray-800 font-bold">
              This Week ({weekCount})
            </option>
            <option value="past" className="bg-white text-gray-800 font-bold">
              Past Records ({pastCount})
            </option>
            {customDate && (
              <option value="custom" className="bg-white text-red-600 font-black">
                Date: {customDate}
              </option>
            )}
          </select>

          {/* MODERN THEMED DATE PICKER FOR SPECIFIC DATES */}
          <ModernDatePicker
            value={customDate}
            onChange={(selectedDate) => {
              setCustomDate(selectedDate);
              if (selectedDate) {
                setDateFilter("custom");
              } else {
                setDateFilter("all");
              }
              setDispatchPage(1);
            }}
            highlightDates={Array.from(new Set(dispatchList.map((d) => d.scheduledDate)))}
            todayDate={todayStr}
            tomorrowDate={tomorrowStr}
          />

          {/* STATUS FILTER WITH COLOR RECOGNITION */}
          <select
            value={dispatchStatus}
            onChange={(e) => {
              setDispatchStatus(e.target.value);
              setDispatchPage(1);
            }}
            className={`h-9 px-3 border rounded text-xs font-bold focus:outline-none cursor-pointer transition-colors shadow-2xs ${dispatchStatus === "scheduled"
                ? "bg-yellow-100 text-yellow-950 border-yellow-400"
                : dispatchStatus === "dispatched"
                  ? "bg-red-50 text-red-800 border-red-300"
                  : dispatchStatus === "on-site"
                    ? "bg-red-600 text-white border-red-600 shadow-xs"
                    : dispatchStatus === "completed"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                      : dispatchStatus === "delayed"
                        ? "bg-red-100 text-red-900 border-red-500"
                        : "bg-white text-gray-800 border-gray-300"
              }`}
          >
            <option value="all" className="bg-white text-gray-800 font-semibold">
              All Statuses ({dispatchList.length})
            </option>
            <option value="scheduled" className="bg-white text-yellow-950 font-bold">
              Scheduled ({dispatchList.filter((d) => d.status === "scheduled").length})
            </option>
            <option value="dispatched" className="bg-white text-red-800 font-bold">
              Dispatched ({dispatchList.filter((d) => d.status === "dispatched").length})
            </option>
            <option value="on-site" className="bg-white text-red-600 font-bold">
              On-Site ({dispatchList.filter((d) => d.status === "on-site").length})
            </option>
            <option value="completed" className="bg-white text-emerald-800 font-bold">
              Completed ({dispatchList.filter((d) => d.status === "completed").length})
            </option>
            <option value="delayed" className="bg-white text-red-900 font-bold">
              Delayed ({dispatchList.filter((d) => d.status === "delayed").length})
            </option>
          </select>

          {/* SHOW ENTRIES SELECTOR */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium ml-auto">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setDispatchPage(1);
              }}
              className="h-9 px-2 border border-gray-300 rounded font-bold bg-white text-gray-900 focus:border-red-600 focus:outline-none text-xs cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>
        </div>
      </div>

        {/* DESKTOP DATA TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Dispatch #</th>
                <th className="py-3 px-4">Contractor / Customer</th>
                <th className="py-3 px-4">Machine Unit</th>
                <th className="py-3 px-4">Jobsite Address</th>
                <th className="py-3 px-4">Scheduled Date & Slot</th>
                <th className="py-3 px-4">Driver / Rig</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedDispatch.map((item) => (
                <tr
                  key={item.id}
                  className="transition-all duration-150 hover:bg-yellow-50/50 hover:translate-x-1 cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-950 block text-sm">
                      {item.customerName}
                    </span>
                    {item.companyName && (
                      <span className="text-xs text-gray-500 font-normal">
                        {item.companyName}
                      </span>
                    )}
                    <a
                      href={`tel:${item.phone}`}
                      className="text-xs text-red-600 font-bold hover:underline block mt-0.5"
                    >
                      {item.phone}
                    </a>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-900">
                    {item.equipmentName}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span>{item.jobsiteAddress}</span>
                    </div>
                  </td>
                  {/* SCHEDULED DATE & SLOT WITH CLEAR OPERATIONAL BADGES */}
                  <td className="py-3.5 px-4">
                    {item.scheduledDate === todayStr ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 text-white font-black text-xs shadow-xs">
                        <Calendar className="w-3 h-3 text-yellow-300" />
                        Today (Nov 19)
                      </span>
                    ) : item.scheduledDate === tomorrowStr ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500 text-gray-950 font-black text-xs">
                        <Calendar className="w-3 h-3" />
                        Tomorrow (Nov 20)
                      </span>
                    ) : item.scheduledDate === yesterdayStr ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-200 text-gray-800 font-bold text-xs">
                        <Clock className="w-3 h-3 text-gray-500" />
                        Yesterday (Nov 18)
                      </span>
                    ) : item.scheduledDate < todayStr ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold text-xs border border-gray-200">
                        <span>Past ({item.scheduledDate.slice(5)})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-100 text-yellow-900 border border-yellow-300 font-bold text-xs">
                        <span>Upcoming ({item.scheduledDate.slice(5)})</span>
                      </span>
                    )}
                    <div className="font-semibold text-gray-900 text-xs mt-1">
                      {item.scheduledTime}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                      Return: {item.returnDate}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700 text-xs">
                    {item.driver}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-gray-950 text-base">
                    ${item.amount.toLocaleString()}
                  </td>
                  {/* COLOR-CODED STATUS SELECT (MATCHING PIPELINE / PERMITS) */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value as DispatchItem["status"])
                      }
                      className={`text-xs font-bold px-2.5 py-1 rounded border focus:outline-none cursor-pointer transition-colors shadow-2xs ${STATUS_CONFIG[item.status].selectClass
                        }`}
                    >
                      <option value="scheduled" className="bg-white text-yellow-950 font-bold">
                        Scheduled
                      </option>
                      <option value="dispatched" className="bg-white text-red-800 font-bold">
                        Dispatched
                      </option>
                      <option value="on-site" className="bg-white text-red-600 font-black">
                        On-Site
                      </option>
                      <option value="completed" className="bg-white text-emerald-800 font-bold">
                        Completed
                      </option>
                      <option value="delayed" className="bg-white text-red-900 font-bold">
                        Delayed
                      </option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(item.jobsiteAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-gray-100 hover:bg-yellow-50 text-gray-800 text-xs font-bold rounded border border-gray-300 inline-flex items-center gap-1"
                    >
                      <span>Map</span>
                    </a>
                  </td>
                </tr>
              ))}

              {displayedDispatch.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-400 font-medium text-sm">
                    No dispatches found matching this date and search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW (NO SWIPING) */}
        <div className="md:hidden divide-y divide-gray-200">
          {displayedDispatch.map((item) => (
            <div key={item.id} className="p-3.5 space-y-2.5 bg-white hover:bg-yellow-50/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-500 text-xs">{item.id}</span>
                    {item.scheduledDate === todayStr ? (
                      <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px]">
                        Today
                      </span>
                    ) : item.scheduledDate === tomorrowStr ? (
                      <span className="px-1.5 py-0.5 rounded bg-yellow-500 text-gray-950 font-black text-[10px]">
                        Tomorrow
                      </span>
                    ) : null}
                  </div>
                  <div className="font-black text-gray-950 text-sm truncate mt-0.5">{item.customerName}</div>
                  {item.companyName && (
                    <div className="text-xs text-gray-500 font-medium truncate">{item.companyName}</div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-gray-950 text-base leading-none">
                    ${item.amount.toLocaleString()}
                  </div>
                  <div className="mt-1">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value as DispatchItem["status"])
                      }
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${STATUS_CONFIG[item.status].selectClass
                        }`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="on-site">On-Site</option>
                      <option value="completed">Completed</option>
                      <option value="delayed">Delayed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded border border-gray-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Machine:</span>
                  <span className="font-bold text-gray-900 text-right truncate max-w-[200px]">
                    {item.equipmentName}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-gray-500 font-medium shrink-0">Jobsite:</span>
                  <div className="text-right min-w-0">
                    <div className="font-semibold text-gray-800 truncate max-w-[200px]">
                      {item.jobsiteAddress}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Slot & Driver:</span>
                  <span className="text-gray-700 font-medium">
                    {item.scheduledTime} • {item.driver}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5 text-xs">
                <a
                  href={`tel:${item.phone}`}
                  className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{item.phone}</span>
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(item.jobsiteAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-gray-100 hover:bg-yellow-50 text-gray-800 text-xs font-bold rounded border border-gray-300 inline-flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-red-600" />
                  <span>Google Map</span>
                </a>
              </div>
            </div>
          ))}

          {displayedDispatch.length === 0 && (
            <div className="py-8 text-center text-gray-400 font-medium text-sm">
              No dispatches found matching this date and search filter.
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">
          <span className="text-xs font-semibold text-gray-600 order-2 sm:order-1">
            Showing{" "}
            <strong className="text-gray-950 font-bold">
              {filteredDispatch.length === 0 ? 0 : (dispatchPage - 1) * rowsPerPage + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-gray-950 font-bold">
              {Math.min(dispatchPage * rowsPerPage, filteredDispatch.length)}
            </strong>{" "}
            of <strong className="text-gray-950 font-bold">{filteredDispatch.length}</strong> dispatches
          </span>

          <div className="inline-flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-300 shadow-2xs order-1 sm:order-2">
            <button
              disabled={dispatchPage === 1}
              onClick={() => setDispatchPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-bold text-xs transition-all bg-white hover:bg-gray-100 text-gray-800 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-950 font-black text-xs min-w-[85px] text-center">
              Page {dispatchPage} of {totalDispatchPages || 1}
            </span>
            <button
              disabled={dispatchPage >= totalDispatchPages}
              onClick={() => setDispatchPage((p) => Math.min(totalDispatchPages, p + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-bold text-xs transition-all bg-white hover:bg-gray-100 text-gray-800 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ACTIVE 48-HOUR RESERVATION HOLDS */}
      {isHoldsModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-2 border-yellow-500 max-w-4xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* MODAL HEADER */}
            <div className="bg-yellow-500 px-5 py-3.5 flex items-center justify-between text-gray-950 border-b border-yellow-600">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-950" />
                <h3 className="font-black text-base tracking-tight">
                  Active 48-Hour Reservation Holds ({holdsList.length} Units)
                </h3>
              </div>
              <button
                onClick={() => setIsHoldsModalOpen(false)}
                className="text-gray-900 hover:text-black p-1 font-bold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL TOOLBAR */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search hold ID, contractor, equipment..."
                  value={holdsSearch}
                  onChange={(e) => {
                    setHoldsSearch(e.target.value);
                    setHoldsPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <span className="text-xs font-bold text-gray-600">
                Zero upfront charges pending mobile signature
              </span>
            </div>

            {/* DESKTOP MODAL TABLE */}
            <div className="hidden md:block overflow-x-auto max-h-[420px]">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Hold ID</th>
                    <th className="py-3 px-4">Contractor</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Equipment Unit</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Hours Left</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedHolds.map((h) => (
                    <tr key={h.id} className="hover:bg-yellow-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-800 text-xs">
                        {h.id}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-950 text-sm">
                        {h.customerName}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-xs">
                        {h.phone}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900 text-xs">
                        {h.equipmentName}
                      </td>
                      <td className="py-3 px-4 text-gray-700 text-xs whitespace-nowrap">
                        {h.startDate} → {h.endDate}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-gray-950 text-sm">
                        ${h.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-red-600 text-xs whitespace-nowrap">
                        {h.hoursRemaining}h left
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded border inline-flex items-center gap-1.5 ${h.signatureStatus === "signed"
                              ? "bg-emerald-100 text-emerald-900 border-emerald-400 font-bold"
                              : "bg-red-50 text-red-800 border-red-300 font-bold"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${h.signatureStatus === "signed" ? "bg-emerald-600" : "bg-red-600"
                              }`}
                          />
                          <span>{h.signatureStatus === "signed" ? "Signed" : "Pending"}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSendReminder(h.customerName, h.phone)}
                            className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold rounded text-xs transition-colors cursor-pointer"
                          >
                            SMS
                          </button>
                          <button
                            onClick={() => handleReleaseHold(h.id, h.equipmentName)}
                            className="px-2 py-1 bg-gray-100 hover:bg-red-100 hover:text-red-700 text-gray-600 font-semibold rounded text-xs transition-colors cursor-pointer"
                          >
                            Release
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayedHolds.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-gray-500 text-sm">
                        No active holds found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE MODAL CARDS VIEW (NO SWIPING) */}
            <div className="md:hidden divide-y divide-gray-200 max-h-[420px] overflow-y-auto">
              {displayedHolds.map((h) => (
                <div key={h.id} className="p-3 space-y-2 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-500 text-xs">{h.id}</span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                          {h.hoursRemaining}h left
                        </span>
                      </div>
                      <div className="font-black text-gray-950 text-sm truncate mt-0.5">{h.customerName}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-gray-950 text-sm">
                        ${h.totalAmount.toLocaleString()}
                      </div>
                      <span
                        className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded border ${h.signatureStatus === "signed"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                            : "bg-red-50 text-red-800 border-red-300"
                          }`}
                      >
                        {h.signatureStatus === "signed" ? "Signed" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 rounded border border-gray-100 text-xs space-y-1">
                    <div className="font-bold text-gray-900 truncate">{h.equipmentName}</div>
                    <div className="text-gray-500 text-[11px] font-medium">
                      Dates: {h.startDate} → {h.endDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <a
                      href={`tel:${h.phone}`}
                      className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{h.phone}</span>
                    </a>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSendReminder(h.customerName, h.phone)}
                        className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold rounded text-xs transition-colors cursor-pointer"
                      >
                        SMS
                      </button>
                      <button
                        onClick={() => handleReleaseHold(h.id, h.equipmentName)}
                        className="px-2 py-1 bg-gray-100 hover:bg-red-100 hover:text-red-700 text-gray-600 font-semibold rounded text-xs transition-colors cursor-pointer"
                      >
                        Release
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {displayedHolds.length === 0 && (
                <div className="py-6 text-center text-gray-500 text-sm">
                  No active holds found.
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
              <span>
                Showing {(holdsPage - 1) * holdsRowsPerPage + 1} to{" "}
                {Math.min(holdsPage * holdsRowsPerPage, filteredHolds.length)} of{" "}
                {filteredHolds.length} holds
              </span>
              <button
                onClick={() => setIsHoldsModalOpen(false)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRIVER MANIFEST MODAL */}
      {isManifestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
          <div className="bg-white border-2 border-yellow-500 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* MODAL HEADER */}
            <div className="bg-red-600 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-yellow-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                    Daily Driver Delivery Manifest
                    <span className="text-[11px] bg-yellow-400 text-gray-950 font-black px-2 py-0.5 rounded uppercase">
                      Cave Creek Yard
                    </span>
                  </h3>
                  <p className="text-xs text-red-100 font-medium">
                    Run sheet for delivery drivers • Flat $150 Valley-Wide Delivery
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-black rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  title="Print manifest to physical printer or save as PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsManifestModalOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MANIFEST BODY */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* DISPATCH RUN META SUMMARY */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs">
                <div>
                  <span className="text-gray-500 font-medium block">Manifest Date</span>
                  <span className="font-black text-gray-950 text-sm">
                    {customDate || "Today (Nov 19, 2026)"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Dispatch Depot</span>
                  <span className="font-bold text-gray-950">42410 N Cave Creek Rd</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Active Stops</span>
                  <span className="font-black text-red-600 text-sm">
                    {filteredDispatch.length} Machines
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Delivery Flat Fee</span>
                  <span className="font-black text-yellow-700">$150 / Valley-Wide</span>
                </div>
              </div>

              {/* STOPS TABLE (DESKTOP & PRINT) */}
              <div className="hidden sm:block border border-gray-200 rounded-lg overflow-x-auto print:block">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-black tracking-wider text-[11px] border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3">Stop / Time</th>
                      <th className="py-2.5 px-3">Driver</th>
                      <th className="py-2.5 px-3">Equipment</th>
                      <th className="py-2.5 px-3">Customer & Contact</th>
                      <th className="py-2.5 px-3">Delivery Address / Gate</th>
                      <th className="py-2.5 px-3 text-center">Type</th>
                      <th className="py-2.5 px-3 text-center">Driver Sign-off</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDispatch.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-yellow-50/30">
                        <td className="py-3 px-3 font-mono font-bold text-gray-950 whitespace-nowrap">
                          <span className="w-5 h-5 rounded-full bg-red-600 text-white inline-flex items-center justify-center text-[10px] mr-1.5 font-black">
                            {idx + 1}
                          </span>
                          {item.scheduledTime}
                        </td>
                        <td className="py-3 px-3 font-bold text-gray-800 whitespace-nowrap">
                          {item.driver || "Unassigned"}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-950 block">
                            {item.equipmentName}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            ID: {item.equipmentId}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-950 block">
                            {item.customerName}
                          </span>
                          {item.companyName && (
                            <span className="text-[11px] text-gray-500 block">
                              {item.companyName}
                            </span>
                          )}
                          <span className="text-[11px] text-red-600 font-mono font-bold">
                            {item.phone}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-[200px]">
                          <span className="font-medium text-gray-800 block leading-tight">
                            {item.jobsiteAddress}
                          </span>
                          {item.notes && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-900 font-bold px-1.5 py-0.2 rounded inline-block mt-0.5">
                              Note: {item.notes}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.type === "delivery"
                                ? "bg-red-100 text-red-800"
                                : item.type === "return"
                                  ? "bg-yellow-100 text-yellow-900"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="w-24 border-b border-dashed border-gray-400 h-6 mx-auto" />
                          <span className="text-[9px] text-gray-400 uppercase tracking-tighter mt-0.5 block">
                            Initial / Date
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* STOPS MOBILE CARDS (SCREEN ONLY) */}
              <div className="sm:hidden print:hidden divide-y divide-gray-200 border border-gray-200 rounded-lg">
                {filteredDispatch.map((item, idx) => (
                  <div key={item.id} className="p-3 space-y-2 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white inline-flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        <span className="font-mono font-black text-gray-950 text-xs">
                          {item.scheduledTime}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.type === "delivery"
                            ? "bg-red-100 text-red-800"
                            : item.type === "return"
                              ? "bg-yellow-100 text-yellow-900"
                              : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {item.type}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
                      <div className="font-bold text-gray-950">{item.equipmentName}</div>
                      <div className="text-gray-700">Driver: <span className="font-bold">{item.driver || "Unassigned"}</span></div>
                      <div className="text-gray-600 truncate">{item.customerName} • {item.phone}</div>
                      <div className="text-gray-800 font-medium pt-1 border-t border-gray-200/60 truncate">
                        {item.jobsiteAddress}
                      </div>
                      {item.notes && (
                        <div className="text-[10px] text-yellow-900 font-bold bg-yellow-100 p-1 rounded">
                          Note: {item.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredDispatch.length === 0 && (
                  <div className="py-6 text-center text-gray-400 text-xs">
                    No dispatches found for this date.
                  </div>
                )}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">
                Showing {filteredDispatch.length} stops ready for transport
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsManifestModalOpen(false)}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Run Sheet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHONE-IN LEAD MODAL */}
      <PhoneInLeadModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onLeadCreated={(lead) => {
          showNotice(`Lead created for ${lead.customerName}! Dispatched to pipeline.`);
        }}
      />
    </div>
  );
}
