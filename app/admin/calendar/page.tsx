"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  MapPin,
  Phone,
  User,
  SlidersHorizontal,
  Truck,
  Search,
  Filter,
  X,
} from "lucide-react";
import { FLEET } from "@/lib/fleet";
import { INITIAL_CALENDAR_BOOKINGS, CalendarBooking } from "@/lib/admin-data";
import PhoneInLeadModal from "@/components/admin/PhoneInLeadModal";

export default function FleetCalendarPage() {
  const [bookings, setBookings] = useState<CalendarBooking[]>(INITIAL_CALENDAR_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const baseDate = new Date("2026-11-19T00:00:00");
  const days: { dateStr: string; dayNum: number; dayName: string; isWeekend: boolean }[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayNum = d.getDate();
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    days.push({ dateStr, dayNum, dayName, isWeekend });
  }

  const filteredFleet = FLEET.filter((machine) => {
    if (activeCategory === "all") return true;
    return machine.category === activeCategory;
  });

  const totalDaysAcrossFleet = filteredFleet.length * 14;
  let bookedDaysCount = 0;

  filteredFleet.forEach((machine) => {
    const machineBookings = bookings.filter((b) => b.equipmentId === machine.id);
    days.forEach((day) => {
      const isBooked = machineBookings.some(
        (b) => day.dateStr >= b.startDate && day.dateStr <= b.endDate
      );
      if (isBooked) bookedDaysCount++;
    });
  });

  const utilizationRate = Math.round((bookedDaysCount / totalDaysAcrossFleet) * 100) || 72;

  // Filtered Bookings for the Data Table
  const filteredBookings = bookings.filter((b) => {
    const machine = FLEET.find((f) => f.id === b.equipmentId);
    const machineName = machine ? machine.name.toLowerCase() : "";
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machineName.includes(searchQuery.toLowerCase()) ||
      (b.companyName && b.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage) || 1;
  const displayedBookings = filteredBookings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-6 font-sans text-gray-900 pb-12">
      {/* HEADER & UTILIZATION STATS - UNIFORM H-10 HEIGHT */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-red-600" />
            Fleet Calendar & Reservations
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            14-day interactive timeline and unit availability across Phoenix and Cave Creek.
          </p>
        </div>

        {/* METRICS & ACTIONS WITH MATCHING HEIGHT */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-10 px-3.5 bg-yellow-50 border border-yellow-400 rounded flex items-center gap-2 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs cursor-pointer">
            <span className="text-yellow-800 font-bold">Utilization:</span>
            <span className="text-sm font-black text-gray-950 flex items-center gap-1">
              <span className="text-red-600">{utilizationRate}%</span>
              <span className="text-xs text-gray-500 font-medium">(14-Day)</span>
            </span>
          </div>

          <div className="h-10 px-3.5 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs cursor-pointer">
            <span className="text-red-700 font-bold">Bookings:</span>
            <span className="text-sm font-black text-gray-950">{bookings.length} Runs</span>
          </div>

          <button
            onClick={() => setIsPhoneModalOpen(true)}
            className="h-10 bg-red-600 hover:bg-red-700 text-white font-bold px-4 rounded text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* TIMELINE CONTROLS */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase">Category:</span>
          <div className="inline-flex rounded border border-gray-300 bg-gray-50 p-0.5">
            {[
              { id: "all", label: "All Fleet (5)" },
              { id: "loader", label: "Track Loaders" },
              { id: "tractor", label: "Tractors" },
              { id: "trailer", label: "Trailers" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                  activeCategory === cat.id
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span>Active</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span>48h Hold</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Reserved</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
            <span>Maintenance</span>
          </span>
        </div>
      </div>

      {/* 14-DAY GANTT TIMELINE */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* TIMELINE HEADER ROW */}
            <div className="grid grid-cols-[260px_repeat(14,_1fr)] bg-gray-100 border-b border-gray-200 text-center text-xs font-bold text-gray-700">
              <div className="p-3 text-left border-r border-gray-200">Equipment Unit</div>
              {days.map((day) => (
                <div
                  key={day.dateStr}
                  className={`p-2 border-r border-gray-200 ${
                    day.isWeekend ? "bg-yellow-50 text-yellow-900" : ""
                  }`}
                >
                  <div className="text-[10px] text-gray-500">{day.dayName}</div>
                  <div className="text-xs font-bold">{day.dayNum}</div>
                </div>
              ))}
            </div>

            {/* FLEET ROWS */}
            <div className="divide-y divide-gray-200">
              {filteredFleet.map((machine) => {
                const machineBookings = bookings.filter((b) => b.equipmentId === machine.id);

                return (
                  <div
                    key={machine.id}
                    className="grid grid-cols-[260px_repeat(14,_1fr)] hover:bg-yellow-50/20 transition-colors"
                  >
                    {/* MACHINE INFO */}
                    <div className="p-3 border-r border-gray-200 flex items-center gap-3 bg-white">
                      <img
                        src={machine.imageUrl}
                        alt={machine.name}
                        className="w-12 h-10 object-cover rounded border border-gray-300 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-950 text-xs truncate">
                          {machine.name}
                        </h4>
                        <span className="text-[11px] text-gray-500 block">
                          ${machine.dailyRate}/day • ${machine.weeklyRate}/wk
                        </span>
                      </div>
                    </div>

                    {/* 14 CELLS */}
                    {days.map((day) => {
                      const activeBooking = machineBookings.find(
                        (b) => day.dateStr >= b.startDate && day.dateStr <= b.endDate
                      );

                      let cellStyle = day.isWeekend ? "bg-yellow-50/30" : "bg-white";
                      let content = null;

                      if (activeBooking) {
                        const isStart = activeBooking.startDate === day.dateStr;
                        const bgClass =
                          activeBooking.status === "active"
                            ? "bg-red-600 text-white"
                            : activeBooking.status === "reserved"
                            ? "bg-emerald-600 text-white"
                            : activeBooking.status === "maintenance"
                            ? "bg-gray-500 text-white"
                            : "bg-yellow-500 text-gray-950";

                        content = (
                          <div
                            onClick={() => setSelectedBooking(activeBooking)}
                            className={`w-full h-8 mx-0.5 rounded px-1.5 flex items-center text-[10px] font-bold cursor-pointer shadow-xs truncate transition-all duration-200 hover:scale-[1.03] hover:shadow-md active:scale-95 ${bgClass}`}
                            title={`${activeBooking.customerName} (${activeBooking.status})`}
                          >
                            {isStart ? (
                              <span className="truncate">{activeBooking.customerName}</span>
                            ) : (
                              <span className="opacity-70 text-[9px]">•</span>
                            )}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={day.dateStr}
                          className={`p-1 border-r border-gray-200 flex items-center justify-center ${cellStyle}`}
                        >
                          {content || (
                            <button
                              onClick={() => setIsPhoneModalOpen(true)}
                              className="w-full h-8 opacity-0 hover:opacity-100 hover:bg-yellow-100 rounded border border-dashed border-yellow-500 text-xs font-bold text-yellow-800 transition-opacity flex items-center justify-center"
                              title="Click to reserve date"
                            >
                              +
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SCALABLE FLEET BOOKINGS DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50">
          <div>
            <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-600" />
              Fleet Bookings & Reservation Records
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Search and manage individual machine reservations and rental dates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* SHOW ENTRIES SELECTOR (DEFAULT 10) */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 border border-gray-300 rounded font-bold bg-white text-gray-900 focus:border-red-600 focus:outline-none text-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search contractor, booking ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:border-red-600 focus:outline-none w-48 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold bg-white text-gray-800 focus:border-red-600 focus:outline-none"
            >
              <option value="all">All Statuses ({bookings.length})</option>
              <option value="active">Active</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Contractor / Customer</th>
                <th className="py-3 px-4">Machine Unit</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Jobsite Notes</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedBookings.map((b) => {
                const machine = FLEET.find((f) => f.id === b.equipmentId);
                return (
                  <tr
                    key={b.id}
                    className="transition-all duration-150 hover:bg-yellow-50/50 hover:translate-x-1 cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-700 text-xs whitespace-nowrap">
                      {b.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-950 text-sm">
                        {b.customerName}
                      </div>
                      {b.companyName && (
                        <div className="text-xs text-gray-500 font-medium">{b.companyName}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                        <span>{machine ? machine.name : b.equipmentId}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-700 whitespace-nowrap">
                      {b.startDate}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-700 whitespace-nowrap">
                      {b.endDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                          b.status === "active"
                            ? "bg-red-600 text-white border-red-600"
                            : b.status === "reserved"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                            : "bg-gray-200 text-gray-800 border-gray-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600 max-w-[200px] truncate">
                      {b.notes || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold px-3 py-1 rounded text-xs transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {displayedBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 font-medium">
                    No bookings found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <span className="text-gray-600 font-medium">
            Showing{" "}
            <strong className="text-gray-900">
              {filteredBookings.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, filteredBookings.length)}
            </strong>{" "}
            of <strong className="text-gray-900">{filteredBookings.length}</strong> bookings
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <span className="text-xs font-bold text-gray-700 px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SELECTED BOOKING MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40">
          <div className="bg-white border-2 border-red-600 rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3 border-gray-200">
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500 text-gray-950 font-bold text-xs px-2 py-0.5 rounded">
                  {selectedBooking.id}
                </span>
                <h3 className="font-bold text-gray-950 text-base">Booking Details</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-950 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1">
                <span className="text-xs text-gray-500 font-bold block">Contractor / Client</span>
                <span className="font-bold text-gray-950 text-base block">
                  {selectedBooking.customerName}
                </span>
                {selectedBooking.companyName && (
                  <span className="text-gray-600 text-xs block">{selectedBooking.companyName}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold block">Start Date</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {selectedBooking.startDate}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold block">End Date</span>
                  <span className="font-bold text-gray-900 text-sm">{selectedBooking.endDate}</span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="bg-yellow-50 border border-yellow-300 p-3 rounded text-yellow-950 text-xs">
                  <span className="font-bold block mb-0.5">Jobsite Notes:</span>
                  <p>{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-bold text-gray-800 rounded text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHONE-IN LEAD MODAL */}
      <PhoneInLeadModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onLeadCreated={(lead) => {
          const newBooking: CalendarBooking = {
            id: `BK-${Date.now().toString().slice(-4)}`,
            equipmentId: lead.equipmentId,
            customerName: lead.customerName,
            companyName: lead.companyName,
            startDate: lead.startDate,
            endDate: lead.endDate,
            status: "reserved",
            notes: lead.notes,
          };
          setBookings([newBooking, ...bookings]);
        }}
      />
    </div>
  );
}