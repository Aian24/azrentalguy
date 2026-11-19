"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Filter,
  CreditCard,
  Plus,
  Activity,
  Layers,
} from "lucide-react";
import { FLEET } from "@/lib/fleet";
import { INITIAL_SALES_TRANSACTIONS, SalesTransaction } from "@/lib/admin-data";
import PhoneInLeadModal from "@/components/admin/PhoneInLeadModal";

export default function RentalDashboardPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [activeMetric, setActiveMetric] = useState<"revenue" | "bookings" | "quotes">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number>(18); // Default to Peak (Nov 19)
  const [isHoveringChart, setIsHoveringChart] = useState(false);
  const [transactions, setTransactions] = useState<SalesTransaction[]>(INITIAL_SALES_TRANSACTIONS);
  const [tableSearch, setTableSearch] = useState("");
  const [tableStatus, setTableStatus] = useState("all");
  const [tablePage, setTablePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 28-DAY RENTAL PERFORMANCE DATA (FOR CONTINUOUS LINE GRAPH)
  const lineData = [
    { day: "Nov 01", rev: 1150, bookings: 1, quotes: 8, y: 72 },
    { day: "Nov 02", rev: 1450, bookings: 2, quotes: 9, y: 66 },
    { day: "Nov 03", rev: 1300, bookings: 1, quotes: 7, y: 70 },
    { day: "Nov 04", rev: 1650, bookings: 2, quotes: 11, y: 62 },
    { day: "Nov 05", rev: 1950, bookings: 2, quotes: 14, y: 56 },
    { day: "Nov 06", rev: 1250, bookings: 1, quotes: 8, y: 70 },
    { day: "Nov 07", rev: 1400, bookings: 1, quotes: 10, y: 67 },
    { day: "Nov 08", rev: 2100, bookings: 2, quotes: 15, y: 53 },
    { day: "Nov 09", rev: 1350, bookings: 1, quotes: 9, y: 68 },
    { day: "Nov 10", rev: 1800, bookings: 2, quotes: 12, y: 59 },
    { day: "Nov 11", rev: 2300, bookings: 2, quotes: 16, y: 49 },
    { day: "Nov 12", rev: 1650, bookings: 1, quotes: 11, y: 62 },
    { day: "Nov 13", rev: 1900, bookings: 2, quotes: 13, y: 57 },
    { day: "Nov 14", rev: 1450, bookings: 1, quotes: 8, y: 66 },
    { day: "Nov 15", rev: 1750, bookings: 2, quotes: 12, y: 60 },
    { day: "Nov 16", rev: 2200, bookings: 2, quotes: 15, y: 51 },
    { day: "Nov 17", rev: 2850, bookings: 3, quotes: 19, y: 38 },
    { day: "Nov 18", rev: 3400, bookings: 3, quotes: 22, y: 27 },
    { day: "Nov 19", rev: 4450, bookings: 4, quotes: 28, y: 6 }, // Peak Day
    { day: "Nov 20", rev: 3100, bookings: 3, quotes: 20, y: 33 },
    { day: "Nov 21", rev: 1850, bookings: 2, quotes: 13, y: 58 },
    { day: "Nov 22", rev: 1950, bookings: 2, quotes: 14, y: 56 },
    { day: "Nov 23", rev: 2150, bookings: 2, quotes: 15, y: 52 },
    { day: "Nov 24", rev: 1700, bookings: 1, quotes: 11, y: 61 },
    { day: "Nov 25", rev: 1600, bookings: 1, quotes: 10, y: 63 },
    { day: "Nov 26", rev: 1900, bookings: 2, quotes: 13, y: 57 },
    { day: "Nov 27", rev: 1750, bookings: 2, quotes: 12, y: 60 },
    { day: "Nov 28", rev: 2100, bookings: 2, quotes: 14, y: 53 },
  ];

  // Catmull-Rom to Cubic Bezier spline interpolation for silky smooth continuous curve
  const getCurvedSvgPath = (points: { y: number }[], width = 600) => {
    if (points.length < 2) return "";
    const step = width / (points.length - 1);
    const pts = points.map((p, i) => ({ x: i * step, y: p.y }));

    let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const getCurvedAreaPath = (points: { y: number }[], width = 600, bottomY = 75) => {
    const curve = getCurvedSvgPath(points, width);
    if (!curve) return "";
    return `${curve} L ${width} ${bottomY} L 0 ${bottomY} Z`;
  };

  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const closestIdx = Math.round(xRatio * (lineData.length - 1));
    setHoveredIndex(closestIdx);
    setIsHoveringChart(true);
  };

  const handleChartMouseLeave = () => {
    setIsHoveringChart(false);
    setHoveredIndex(18); // Return smoothly to Peak Day
  };

  const currentItem = lineData[hoveredIndex] || lineData[18];
  const currentX = (hoveredIndex * (600 / (lineData.length - 1))).toFixed(1);
  const currentY = currentItem.y;

  // Filtered & Paginated Scalable Data Table
  const filteredInvoices = transactions.filter((inv) => {
    const matchesSearch =
      inv.customerName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      inv.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      inv.equipmentName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      inv.jobsite.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus = tableStatus === "all" || inv.status === tableStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage) || 1;
  const displayedRows = filteredInvoices.slice(
    (tablePage - 1) * rowsPerPage,
    tablePage * rowsPerPage
  );

  const handleExportCSV = () => {
    const headers = "InvoiceID,Customer,Company,Equipment,Amount,Status,Date,Jobsite\n";
    const rows = filteredInvoices
      .map(
        (t) =>
          `${t.id},"${t.customerName}","${t.companyName || ""}","${t.equipmentName}",${t.amount},"${t.status}","${t.date}","${t.jobsite}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `azrentalguy-invoices.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported invoices to CSV!");
  };

  return (
    <div className="space-y-6 font-sans text-gray-900 pb-16 relative">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-16 right-6 z-50 bg-red-600 text-white font-bold px-4 py-2.5 rounded shadow-xl text-sm flex items-center gap-2 border border-yellow-400 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* DASHBOARD TOP BAR */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-red-600" />
            Rental Performance Dashboard
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Live equipment revenue, interactive analytics tracking, and contractor holds.
          </p>
        </div>

        {/* TIME RANGE & ACTION - UNIFORM H-10 HEIGHT */}
        <div className="flex items-center gap-2.5">
          <div className="h-10 bg-gray-100 p-1 rounded flex items-center text-xs font-bold border border-gray-200">
            {(["7d", "30d", "90d", "1y"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`h-full px-3 rounded transition-all duration-150 uppercase ${
                  timeRange === range
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-950"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPhoneModalOpen(true)}
            className="h-10 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold px-4 rounded text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 4 IMPORTANT KPI CARDS (ANIMATED ON HOVER & CLICK) */}
      <div id="section-kpis" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* REVENUE */}
        <div
          onClick={() => setActiveMetric("revenue")}
          className={`bg-white border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98] ${
            activeMetric === "revenue"
              ? "border-red-600 bg-red-50/20 shadow-sm"
              : "border-gray-200 hover:border-red-400"
          }`}
        >
          <div className="flex items-center justify-between text-sm text-gray-600 font-bold">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 tracking-tight">
            $34,850
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-red-700 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* BOOKINGS */}
        <div
          onClick={() => setActiveMetric("bookings")}
          className={`bg-white border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98] ${
            activeMetric === "bookings"
              ? "border-yellow-500 bg-yellow-50/30 shadow-sm"
              : "border-gray-200 hover:border-yellow-400"
          }`}
        >
          <div className="flex items-center justify-between text-sm text-gray-600 font-bold">
            <span>Active Bookings</span>
            <Calendar className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 tracking-tight">
            29 Rentals
          </div>
          <div className="text-xs text-gray-500 font-medium mt-1">
            Avg Order: $1,245
          </div>
        </div>

        {/* QUOTES */}
        <div
          onClick={() => setActiveMetric("quotes")}
          className={`bg-white border-2 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98] ${
            activeMetric === "quotes"
              ? "border-red-600 bg-red-50/20 shadow-sm"
              : "border-gray-200 hover:border-red-400"
          }`}
        >
          <div className="flex items-center justify-between text-sm text-gray-600 font-bold">
            <span>Instant Quotes</span>
            <Activity className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 tracking-tight">
            240 Runs
          </div>
          <div className="text-xs text-red-700 font-bold mt-1">
            12% Hold Conversion Rate
          </div>
        </div>

        {/* FLEET UTILIZATION */}
        <Link
          href="/admin/dispatch"
          className="bg-white border-2 border-gray-200 hover:border-yellow-500 p-4 rounded-lg transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 font-bold">
              <span>Fleet on Jobsite</span>
              <Truck className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 tracking-tight">
              3 of 5 Units
            </div>
          </div>
          <div className="text-xs font-bold text-yellow-700 flex items-center justify-between mt-1">
            <span>76% Capacity</span>
            <span className="text-red-600 font-black">Open Dispatch →</span>
          </div>
        </Link>
      </div>

      {/* SECTION 2: INTERACTIVE ANALYTICS GRAPH WITH MOUSE SCRUBBING ANIMATION */}
      <div id="section-analytics" className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
        {/* GRAPH HEADER & METRIC TOGGLE */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Performance Curve
              </span>
              <span className="text-xs font-bold bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded flex items-center gap-1">
                <Activity className="w-3 h-3 text-yellow-600" />
                <span>Interactive Live Scrubbing</span>
              </span>
            </div>
            <div className="text-lg font-black text-gray-950 mt-0.5 capitalize flex items-center gap-2">
              <span>
                {activeMetric === "revenue"
                  ? "Daily Rental Revenue ($)"
                  : activeMetric === "bookings"
                  ? "Confirmed Machine Bookings"
                  : "Instant Price Quotes Generated"}
              </span>
              <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                Hover to Inspect
              </span>
            </div>
          </div>

          {/* METRIC SWITCH BUTTONS */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded text-xs font-bold border border-gray-200">
            <button
              onClick={() => setActiveMetric("revenue")}
              className={`px-3 py-1.5 rounded transition-all duration-150 ${
                activeMetric === "revenue"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-gray-700 hover:text-gray-950"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveMetric("bookings")}
              className={`px-3 py-1.5 rounded transition-all duration-150 ${
                activeMetric === "bookings"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-gray-700 hover:text-gray-950"
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveMetric("quotes")}
              className={`px-3 py-1.5 rounded transition-all duration-150 ${
                activeMetric === "quotes"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-gray-700 hover:text-gray-950"
              }`}
            >
              Quotes
            </button>
          </div>
        </div>

        {/* CONTINUOUS SMOOTH SVG LINE GRAPH WITH MOUSE SCRUBBING */}
        <div className="relative pt-4 pb-1 h-56 flex flex-col justify-end select-none">
          {/* FLOATING HOVER TOOLTIP (CENTERED DIRECTLY ABOVE POINT, NEVER TOUCHED BY VERTICAL LINE) */}
          <div
            className="absolute top-0 z-30 pointer-events-none transition-all duration-100 ease-out bg-gray-950 text-white px-2.5 py-1 rounded shadow-xl border border-yellow-400 text-xs font-bold flex items-center gap-1.5 -translate-x-1/2 whitespace-nowrap"
            style={{
              left: `clamp(40px, ${((Number(currentX) / 600) * 92).toFixed(1)}%, 88%)`,
            }}
          >
            <span className="text-yellow-400">{currentItem.day}:</span>
            <span className="font-black text-sm">
              {activeMetric === "revenue"
                ? `$${currentItem.rev.toLocaleString()}`
                : activeMetric === "bookings"
                ? `${currentItem.bookings} bookings`
                : `${currentItem.quotes} quotes`}
            </span>
            {hoveredIndex === 18 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded font-black uppercase">
                Peak
              </span>
            )}
          </div>

          {/* Y-AXIS SCALE LABELS */}
          <div className="absolute right-0 top-6 bottom-8 flex flex-col justify-between text-xs text-gray-400 font-mono text-right pointer-events-none">
            <span>{activeMetric === "revenue" ? "$4.5K" : activeMetric === "bookings" ? "4" : "30"}</span>
            <span>{activeMetric === "revenue" ? "$3.0K" : activeMetric === "bookings" ? "3" : "20"}</span>
            <span>{activeMetric === "revenue" ? "$1.5K" : activeMetric === "bookings" ? "1" : "10"}</span>
            <span>0</span>
          </div>

          {/* HORIZONTAL GRID LINES */}
          <div className="absolute inset-x-0 top-8 border-b border-gray-100"></div>
          <div className="absolute inset-x-0 top-20 border-b border-gray-100"></div>
          <div className="absolute inset-x-0 top-32 border-b border-gray-100"></div>

          {/* SVG CURVED LINE (SMOOTH CATMULL-ROM CUBIC BEZIER SPLINE) */}
          <svg
            ref={svgRef}
            viewBox="0 0 600 80"
            className="w-[92%] h-36 overflow-visible cursor-crosshair relative z-10"
            preserveAspectRatio="none"
            onMouseMove={handleChartMouseMove}
            onMouseLeave={handleChartMouseLeave}
          >
            <defs>
              <linearGradient id="analyticsCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* SOFT SHADED GRADIENT AREA (LIKE GA4) */}
            <path
              d={getCurvedAreaPath(lineData, 600, 75)}
              fill="url(#analyticsCurveGrad)"
            />

            {/* SILKY SMOOTH RED CURVE */}
            <path
              d={getCurvedSvgPath(lineData, 600)}
              fill="none"
              stroke="#DC2626"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* CLEAN VERTICAL PIN LINE: STARTS AT DOT, STOPS AT AXIS (y=75), NEVER POKES ABOVE INTO TOOLTIP */}
            <line
              x1={currentX}
              y1={currentY}
              x2={currentX}
              y2="75"
              stroke="#DC2626"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeOpacity="0.65"
            />

            {/* SOFT HALO */}
            <circle
              cx={currentX}
              cy={currentY}
              r="9"
              fill="#DC2626"
              fillOpacity="0.15"
            />

            {/* CRISP DATA POINT: GOLD CENTER + CLEAN WHITE RIM */}
            <circle
              cx={currentX}
              cy={currentY}
              r="5"
              fill="#E5A919"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <circle
              cx={currentX}
              cy={currentY}
              r="5"
              fill="none"
              stroke="#DC2626"
              strokeWidth="1.5"
            />
          </svg>

          {/* X-AXIS TIMELINE LABELS */}
          <div className="flex justify-between text-xs text-gray-500 font-medium pt-2 border-t border-gray-200 w-[92%]">
            <span>Nov 01</span>
            <span>Nov 08</span>
            <span>Nov 15</span>
            <span className="font-black text-red-600">Nov 19 (Peak: $4,450)</span>
            <span>Nov 24</span>
            <span>Nov 28</span>
          </div>
        </div>

        {/* BOTTOM METRIC SUMMARY BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100 text-sm">
          <div>
            <span className="text-gray-400 block text-xs">Peak Day Sales</span>
            <span className="font-black text-gray-950 text-base">$4,450 (Nov 19)</span>
          </div>
          <div>
            <span className="text-gray-400 block text-xs">Avg Daily Rate</span>
            <span className="font-black text-gray-950 text-base">$1,245 / job</span>
          </div>
          <div>
            <span className="text-gray-400 block text-xs">Delivery Flat Fee</span>
            <span className="font-black text-gray-950 text-base">$150 Valley-Wide</span>
          </div>
          <div>
            <span className="text-gray-400 block text-xs">Holds Converted</span>
            <span className="font-black text-red-600 text-base">92% Sign Rate</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: TWO COLUMN ROW: EQUIPMENT FLEET MATRIX + TODAY'S HOLDS */}
      <div id="section-fleet" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* EQUIPMENT FLEET REVENUE & DEMAND (7 COLS) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <Truck className="w-5 h-5 text-red-600" />
                Equipment Revenue & Utilization
              </h2>
              <p className="text-xs text-gray-500">
                Monthly revenue share per machine unit.
              </p>
            </div>
            <Link
              href="/admin/calendar"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {FLEET.map((machine) => {
              const rev =
                machine.id === "cat-259d3"
                  ? 14200
                  : machine.id === "cat-226d3"
                  ? 8400
                  : machine.id === "john-deere-4044m"
                  ? 6500
                  : machine.id === "trailer-gooseneck"
                  ? 3650
                  : 2100;

              const pct = Math.round((rev / 34850) * 100);
              const isOnJobsite =
                machine.id === "cat-259d3" ||
                machine.id === "john-deere-4044m" ||
                machine.id === "wt5c-water-trailer";

              return (
                <div
                  key={machine.id}
                  className="py-3 px-2 rounded-lg flex items-center justify-between gap-3 text-sm transition-all duration-150 hover:bg-yellow-50/50 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={machine.imageUrl}
                      alt={machine.name}
                      className="w-12 h-9 object-cover rounded border border-gray-200 flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-gray-950 block truncate max-w-[220px]">
                        {machine.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ${machine.dailyRate}/d • ${machine.weeklyRate}/w
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="font-black text-gray-950 block text-base">
                        ${rev.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {pct}% of sales
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded ${
                        isOnJobsite
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-yellow-50 text-yellow-800 border border-yellow-300"
                      }`}
                    >
                      {isOnJobsite ? "On Jobsite" : "In Yard"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIVE 48-HR HOLDS & TODAY'S DISPATCH (5 COLS) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  Active 48-Hour Reservation Holds
                </h2>
                <p className="text-xs text-gray-500">
                  Customer units held pending agreement signature.
                </p>
              </div>
              <span className="bg-yellow-100 text-yellow-900 font-bold text-xs px-2.5 py-0.5 rounded">
                2 Holds
              </span>
            </div>

            {/* HOLD CARDS WITH HOVER LIFT ANIMATIONS */}
            <div className="space-y-2.5">
              <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-lg text-sm space-y-1 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-yellow-400">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-950">CAT 259D3 Compact Track Loader</span>
                  <span className="text-xs font-bold text-red-600">10h left</span>
                </div>
                <div className="text-xs text-gray-600">
                  Client: <strong>Brandon Miller</strong> (Scottsdale, AZ)
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-black text-gray-950 text-sm">$1,450 Quote</span>
                  <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                    Pending Signature
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-lg text-sm space-y-1 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-yellow-400">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-950">2021 Cat 226D3 Skid Steer</span>
                  <span className="text-xs font-bold text-yellow-700">18h left</span>
                </div>
                <div className="text-xs text-gray-600">
                  Client: <strong>Dave Henderson</strong> (Anthem, AZ)
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-black text-gray-950 text-sm">$975 Quote</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Signed & Sealed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/admin/dispatch"
            className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold py-2.5 px-4 rounded text-sm flex items-center justify-center gap-2 transition-all duration-150 shadow-xs"
          >
            <span>Open Today&apos;s Dispatch Hub</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* SECTION 4: SCALABLE INVOICES DATA TABLE */}
      <div id="section-invoices" className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* TABLE HEADER & CONTROLS */}
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50">
          <div>
            <h2 className="text-base font-bold text-gray-950 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-600" />
              Rental Invoices & Transactions Data Table
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Searchable, paginated record of contractor bookings and payments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {/* SHOW ENTRIES SELECTOR (DEFAULT 10) */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setTablePage(1);
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

            {/* SEARCH */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search contractor, invoice, unit..."
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setTablePage(1);
                }}
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:border-red-600 focus:outline-none w-48 sm:w-56"
              />
            </div>

            {/* STATUS FILTER */}
            <select
              value={tableStatus}
              onChange={(e) => {
                setTableStatus(e.target.value);
                setTablePage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded font-semibold bg-white text-gray-800 focus:border-red-600 focus:outline-none text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Deposit Held">Deposit Held</option>
            </select>

            {/* EXPORT */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold rounded text-xs flex items-center gap-1 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Contractor / Customer</th>
                <th className="py-3 px-4">Machine Unit</th>
                <th className="py-3 px-4">Jobsite</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedRows.map((inv) => (
                <tr key={inv.id} className="hover:bg-yellow-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-700 text-xs whitespace-nowrap">
                    {inv.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-950 block text-sm">
                      {inv.customerName}
                    </span>
                    {inv.companyName && (
                      <span className="text-xs text-gray-500 font-medium">
                        {inv.companyName}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-900 text-sm">
                    {inv.equipmentName}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-gray-700">
                    {inv.jobsite}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-600 font-medium">
                    {inv.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-gray-950 text-base">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        inv.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-yellow-100 text-yellow-900 border border-yellow-300"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-gray-500 whitespace-nowrap">
                    {inv.date}
                  </td>
                </tr>
              ))}

              {displayedRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 font-medium text-sm">
                    No invoices matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="p-3.5 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-gray-600 bg-gray-50">
          <span className="font-medium">
            Showing {(tablePage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(tablePage * rowsPerPage, filteredInvoices.length)} of{" "}
            {filteredInvoices.length} invoices
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={tablePage === 1}
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border border-gray-300 rounded font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="font-bold text-gray-900 text-xs px-1">
              Page {tablePage} of {totalPages || 1}
            </span>
            <button
              disabled={tablePage >= totalPages}
              onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border border-gray-300 rounded font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* PHONE-IN LEAD MODAL */}
      <PhoneInLeadModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onLeadCreated={(newLead) => {
          showToast(`Hold recorded for ${newLead.customerName}!`);
        }}
      />
    </div>
  );
}