"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  BarChart3,
  Truck,
  LayoutDashboard,
  Calendar,
  FileText,
  Settings,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  Search,
  Download,
  ShieldCheck,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Layers,
  Info,
} from "lucide-react";

interface GuideSection {
  id: string;
  tabLabel: string;
  title: string;
  badge: string;
  route: string;
  icon: React.ElementType;
  purpose: string;
  steps: string[];
  operatorTip: string;
}

const SECTIONS: GuideSection[] = [
  {
    id: "dashboard",
    tabLabel: "Dashboard",
    title: "1. Dashboard & Real-Time Analytics",
    badge: "Overview",
    route: "/admin",
    icon: BarChart3,
    purpose:
      "Gives you a single screen to see how the rental business is doing today: today's revenue, how many machines are currently rented, active 48-hour holds, and recent customer activity.",
    steps: [
      "Check the 4 KPI cards at the top for quick numbers: Pipeline Value, Active Rentals, 48-Hr Holds, and Fleet Utilization %.",
      "Hover your mouse over the red sales curve to view day-by-day revenue, booking counts, and quotes sent.",
      "Look at the Recent Activity list at the bottom to see contractors who just signed agreements or reserved units.",
      "Use the fast links to jump directly to driver dispatches or lead creation.",
    ],
    operatorTip:
      "Check the red sales graph every morning. Peak booking days show you when machines are returning and ready to rent again.",
  },
  {
    id: "dispatch",
    tabLabel: "Dispatch Hub",
    title: "2. Dispatch & Machine Deliveries",
    badge: "Logistics",
    route: "/admin/dispatch",
    icon: Truck,
    purpose:
      "Your logistics center. Controls which machine goes to which contractor jobsite, which driver is hauling it, jobsite addresses, gate codes, and delivery status.",
    steps: [
      "Filter by Date: Click 'Today's Dispatches' or use the date picker to check drop-offs for yesterday, today, or next week.",
      "Print Driver Manifest: Click the red 'Print Driver Manifest' button at the top right to print the daily run sheet for yard drivers.",
      "Update Machine Status: Click the status dropdown on any row to change it from Scheduled → Dispatched → On-Site → Completed.",
      "Check Valley-Wide Delivery: All standard Valley drop-offs are billed at the flat $150 delivery fee.",
    ],
    operatorTip:
      "Print the Driver Manifest at 6:30 AM before drivers load trailers at the Cave Creek yard (42410 N Cave Creek Rd).",
  },
  {
    id: "pipeline",
    tabLabel: "Lead Pipeline",
    title: "3. Contractor Lead Pipeline",
    badge: "Deals & Quotes",
    route: "/admin/pipeline",
    icon: LayoutDashboard,
    purpose:
      "Tracks customer inquiries from the first phone call until the rental contract is signed and paid. Makes sure no customer quote is forgotten.",
    steps: [
      "Follow the 6 Deal Stages: Inquired → Quoted → Agreement Sent → Reserved → Active → Closed.",
      "Switch Views: Click 'Table' for fast searching and sorting, or 'Kanban' to see cards arranged in visual columns.",
      "Export to Excel: Click the red 'Export Deals (CSV)' button at the top right to download all leads into a spreadsheet.",
      "Search Contractors: Type in the search box to find past quotes by customer name, company name, or phone number.",
    ],
    operatorTip:
      "When you send an agreement link to a customer, immediately move them to 'Agreement Sent'. This starts their 48-Hour Hold.",
  },
  {
    id: "calendar",
    tabLabel: "14-Day Calendar",
    title: "4. 14-Day Fleet Schedule",
    badge: "Fleet Schedule",
    route: "/admin/calendar",
    icon: Calendar,
    purpose:
      "Prevents double-booking machines. Displays a 14-day visual timeline across all 5 machines so you can see which units are free or rented on any day.",
    steps: [
      "View Machines by Row: CAT 259D3, Kubota SVL75-3, Kubota KX040-4, Bobcat MT100, and Diamond C Trailer.",
      "White/Light Gray Slots: Machines are open and available for immediate booking.",
      "Color-Coded Rental Blocks: Shows who has the machine, their rental dates, and jobsite location.",
      "Filter Categories: Use the buttons above the calendar to filter by Skid Steers, Excavators, Mini Track Loaders, or Trailers.",
    ],
    operatorTip:
      "Before telling a customer a machine is available for the weekend, verify on the calendar that it returns by Friday afternoon.",
  },
  {
    id: "fleet",
    tabLabel: "Fleet & Pricing",
    title: "5. Fleet & Equipment Pricing Manager",
    badge: "Equipment & Rates",
    route: "/admin/fleet",
    icon: Wrench,
    purpose:
      "Your equipment inventory control room. Allows you to add new machines to the fleet, edit daily/weekly/monthly rental rates, update engine hour meters, track service status, and configure attachments.",
    steps: [
      "Add New Machines: Click the red '+ Add New Machine' button to expand the fleet inventory with custom rates and serial numbers.",
      "Manage Multi-Angle Photos: Drag & drop multiple photos at once, enter direct URLs, or load preset angles. Click 'Set Cover' to choose the primary listing photo.",
      "Adjust Rental Rates: Click 'Edit Machine & Rates' or use the quick -$25 / +$25 adjuster to change daily, weekly, and monthly rates.",
      "Update Engine Hours: Record hour meter readings to keep track of oil and hydraulic service intervals.",
      "Toggle Machine Status: Set units as Available in Yard, Rented / On-Site, or Service Due / Repair.",
    ],
    operatorTip:
      "Changes made to machine prices update instantly across customer quotes, agreements, and booking calculations.",
  },
  {
    id: "permits",
    tabLabel: "Dig Permits",
    title: "6. AZ 811 Dig Law Compliance",
    badge: "Safety & Legal",
    route: "/admin/permits",
    icon: FileText,
    purpose:
      "Protects the company from legal liability. Arizona law requires underground utilities (gas, electric, water) to be marked before digging. This page tracks utility clearance tickets.",
    steps: [
      "Verify Ticket Numbers: Ensure active excavation jobs have a recorded AZ 811 confirmation number.",
      "Check 'Cleared' Status: Never dispatch an excavator to a trenching job until the utility status shows Cleared.",
      "Response Window: Utilities have 2 full working days to mark lines before digging is permitted.",
    ],
    operatorTip:
      "Always ask contractors digging trenches for their AZ 811 ticket number when they book the Kubota KX040-4 excavator.",
  },
  {
    id: "settings",
    tabLabel: "Settings",
    title: "7. Settings & System Management",
    badge: "Settings",
    route: "/admin/settings",
    icon: Settings,
    purpose:
      "Control panel for company branding, logo sizing, time format, base typography, rental pricing defaults, and admin password security.",
    steps: [
      "Resize Company Logo: Drag the Logo Height slider (24px to 72px) to adjust the logo size across the whole portal.",
      "Time Format: Switch between 12-Hour (AM/PM) and 24-Hour Military Time.",
      "Font Style & Size: Choose Inter, Plus Jakarta Sans, Roboto, or Oswald fonts, and toggle Normal or Large base font size.",
      "Rental Pricing Defaults: Configure the Valley delivery fee ($150), security deposit ($500), damage waiver (10%), and tax rate (8.6%).",
      "Change Admin Password: Enter current password ('azrentaladmin'), type your new password (minimum 6 characters), and click Save.",
    ],
    operatorTip:
      "Changes made in Settings are saved in your browser and update immediately across both public pages and admin screens.",
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is a 48-Hour Hold and how does it work?",
    answer:
      "A 48-Hour Hold reserves a machine for 2 days while a contractor reviews and signs their digital rental agreement. During these 48 hours, no one else can book that unit. Click the '2 Holds' button in the top header anytime to see hours remaining countdown. Once signed, it converts to an Active Rental. If 48 hours pass without signature, the machine automatically returns to available fleet.",
  },
  {
    question: "How do I print the daily run sheet for the delivery driver?",
    answer:
      "Go to Dispatch (/admin/dispatch) in the sidebar. Click the red 'Print Driver Manifest' button at the top right. A clean printable sheet opens with all scheduled stops, drop-off windows, machine serials, contractor phone numbers, and addresses. Click 'Print Sheet' to print to paper or save as a PDF.",
  },
  {
    question: "How do I export all leads and quotes into Excel?",
    answer:
      "Go to Pipeline (/admin/pipeline) in the sidebar. Click the red 'Export Deals (CSV)' button at the top right. Your browser downloads a clean .csv spreadsheet with contractor names, phone numbers, requested equipment, rates, and deal stages.",
  },
  {
    question: "How do I log a fast phone-in call from a contractor?",
    answer:
      "From ANY page in the admin portal, click the red 'New Lead / Hold' button at the top of the left sidebar. Fill in the contractor's name, phone, equipment requested, rental dates, and jobsite address, then click 'Create Lead'.",
  },
  {
    question: "How do I change the Admin password?",
    answer:
      "Go to Settings (/admin/settings) in the sidebar. Scroll down to 'Admin Security & Password Change'. Enter the current password ('azrentaladmin' by default), type your new password twice (minimum 6 characters), and click 'Update Admin Password'.",
  },
  {
    question: "What is the delivery fee and depot address?",
    answer:
      "Arizona Rental Guy offers a flat $150 delivery fee Valley-wide. The dispatch depot is located at 42410 N Cave Creek Rd in Cave Creek, AZ 85331, serving Phoenix, Cave Creek, Carefree, Scottsdale, Mesa, Chandler, Gilbert, Peoria, and Glendale.",
  },
];

export default function OperatorManualPage() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Filter sections by selected tab and search query
  const filteredSections = SECTIONS.filter((sec) => {
    const matchesTab = selectedTab === "all" || sec.id === selectedTab;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesTab;
    const matchesQuery =
      sec.title.toLowerCase().includes(q) ||
      sec.purpose.toLowerCase().includes(q) ||
      sec.steps.some((s) => s.toLowerCase().includes(q)) ||
      sec.operatorTip.toLowerCase().includes(q) ||
      sec.route.toLowerCase().includes(q);
    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER WITH SOLID BACKGROUND & RED BUTTON */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider bg-yellow-400 text-gray-950 px-2 py-0.5 rounded">
              Operator Guide
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Cave Creek Dispatch Depot
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-600" />
            How to Use This Admin Portal
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Simple, clear instructions on what each page does and how to run daily equipment operations.
          </p>
        </div>

        {/* RED ACTION BUTTON */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 bg-red-600 hover:bg-red-700 text-white font-bold px-4 rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Print clean manual cheat sheet"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Print Guide</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE NAVIGATION TABS & SEARCH */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3 shadow-xs">
        {/* SEARCH BAR */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search manual (e.g. manifest, 48-hr hold, status colors, password)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-600"
          />
        </div>

        {/* SOLID INTERACTIVE TABS */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold pt-1">
          <button
            type="button"
            onClick={() => setSelectedTab("all")}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              selectedTab === "all"
                ? "bg-red-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            All Pages ({SECTIONS.length})
          </button>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSelectedTab(sec.id)}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                selectedTab === sec.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {sec.tabLabel}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedTab("holds")}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              selectedTab === "holds"
                ? "bg-red-600 text-white"
                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-950 border border-yellow-300"
            }`}
          >
            48-Hour Holds Guide
          </button>
        </div>
      </div>

      {/* SECTION GUIDES */}
      {selectedTab !== "holds" && (
        <div className="space-y-4">
          {filteredSections.map((sec) => {
            const IconComponent = sec.icon;
            return (
              <div
                key={sec.id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:border-yellow-500 cursor-pointer"
              >
                {/* CARD TITLE & ROUTE LINK */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-gray-950 tracking-tight">
                        {sec.title}
                      </h3>
                      <span className="text-xs text-gray-400 font-mono">
                        Page URL: {sec.route}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={sec.route}
                    className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Open {sec.tabLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* PURPOSE (SOLID YELLOW CALLOUT) */}
                <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-500 p-3.5 rounded-r text-xs">
                  <span className="font-black text-gray-950 uppercase tracking-wider block mb-1">
                    What is the purpose of this page?
                  </span>
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {sec.purpose}
                  </p>
                </div>

                {/* STEP-BY-STEP ACTIONS */}
                <div className="mb-4">
                  <span className="text-xs font-black text-gray-950 uppercase tracking-wider block mb-2">
                    How to use it (Step-by-Step):
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {sec.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 bg-gray-50 border border-gray-200 p-2.5 rounded text-gray-800 transition-all duration-150 hover:bg-yellow-50/50 hover:translate-x-1 cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black inline-flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="font-medium leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OPERATOR TIP (SOLID GRAY WITH YELLOW BORDER) */}
                <div className="bg-gray-100 border-l-4 border-yellow-500 p-3 rounded-r text-xs">
                  <span className="font-black text-gray-950 block mb-0.5">Yard Operator Tip:</span>
                  <span className="text-gray-700 font-medium">{sec.operatorTip}</span>
                </div>
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="bg-white border border-gray-200 p-8 rounded-lg text-center text-xs text-gray-500">
              <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-bold text-gray-950 text-sm">No matching topics found.</p>
              <p className="mt-1">Try another search or click &quot;All Pages&quot; above.</p>
            </div>
          )}
        </div>
      )}

      {/* 48-HOUR HOLD DEEP DIVE (SHOWN WHEN 'HOLDS' TAB OR 'ALL' IS ACTIVE) */}
      {(selectedTab === "holds" || selectedTab === "all") && (
        <div className="bg-white border-2 border-red-600 rounded-lg p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              <h2 className="text-lg font-black text-gray-950 tracking-tight">
                How 48-Hour Equipment Holds Work
              </h2>
            </div>
            <span className="text-[11px] font-black bg-yellow-400 text-gray-950 px-2 py-0.5 rounded">
              Reservation System
            </span>
          </div>

          <p className="text-xs text-gray-600 font-medium mb-4 max-w-3xl leading-relaxed">
            Machines like the CAT 259D3 track loader are expensive capital assets. Contractors need time to review contracts, but the yard cannot hold machines forever. A 48-Hour Hold protects both sides.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs mb-4">
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <span className="font-black text-red-600 text-sm block mb-1">Step 1: Phone Inquiry</span>
              <p className="text-gray-700 font-medium">
                Contractor calls asking for a machine. You click <strong>New Lead / Hold</strong> in the sidebar to log customer and machine details.
              </p>
            </div>

            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <span className="font-black text-yellow-700 text-sm block mb-1">Step 2: 48-Hr Timer Starts</span>
              <p className="text-gray-700 font-medium">
                Agreement link is sent to the customer. The 48-hour clock begins. The machine is reserved so no other contractor can book it.
              </p>
            </div>

            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <span className="font-black text-emerald-700 text-sm block mb-1">Step 3: Signature Received</span>
              <p className="text-gray-700 font-medium">
                Customer signs on their phone. The hold automatically turns into an <strong>Active Rental</strong> and queues for driver dispatch.
              </p>
            </div>

            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <span className="font-black text-gray-900 text-sm block mb-1">Step 4: Auto-Release</span>
              <p className="text-gray-700 font-medium">
                If 48 hours pass without signature, the machine releases automatically so another contractor can rent the unit.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 p-3 rounded text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="font-bold text-gray-950">
                Notice the <strong>2 Holds</strong> button in the top navigation bar?
              </span>
              <span className="text-gray-700 font-medium">
                Click it anytime to see remaining hours countdown and customer status!
              </span>
            </div>
            <Link
              href="/admin/dispatch"
              className="text-xs font-black text-red-600 hover:text-red-800 underline flex-shrink-0"
            >
              Open Dispatch Hub →
            </Link>
          </div>
        </div>
      )}

      {/* STATUS COLOR GUIDE (SOLID BADGES) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
        <h2 className="text-base font-black text-gray-950 tracking-tight mb-1 flex items-center gap-2">
          <Layers className="w-5 h-5 text-red-600" />
          Status Color Guide (What Each Color Means)
        </h2>
        <p className="text-xs text-gray-500 font-medium mb-4">
          All data tables across Dispatch, Pipeline, and Permits use these exact colors:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="border border-yellow-300 rounded p-3 bg-yellow-50 text-center">
            <span className="px-2 py-0.5 rounded text-[11px] font-black bg-yellow-400 text-gray-950 inline-block mb-1">
              Quoted / Inquired
            </span>
            <span className="text-[11px] text-gray-700 font-medium block">
              Quote sent to contractor, awaiting review.
            </span>
          </div>

          <div className="border border-red-300 rounded p-3 bg-red-50 text-center">
            <span className="px-2 py-0.5 rounded text-[11px] font-black bg-red-600 text-white inline-block mb-1">
              Agreement Sent
            </span>
            <span className="text-[11px] text-gray-700 font-medium block">
              Contract emailed, 48-hr hold clock running.
            </span>
          </div>

          <div className="border border-emerald-300 rounded p-3 bg-emerald-50 text-center">
            <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-600 text-white inline-block mb-1">
              Signed / Reserved
            </span>
            <span className="text-[11px] text-gray-700 font-medium block">
              Contract signed, machine reserved for delivery.
            </span>
          </div>

          <div className="border border-blue-300 rounded p-3 bg-blue-50 text-center">
            <span className="px-2 py-0.5 rounded text-[11px] font-black bg-blue-600 text-white inline-block mb-1">
              Dispatched
            </span>
            <span className="text-[11px] text-gray-700 font-medium block">
              Machine loaded on trailer, driver en route.
            </span>
          </div>

          <div className="border border-purple-300 rounded p-3 bg-purple-50 text-center col-span-2 sm:col-span-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-black bg-purple-600 text-white inline-block mb-1">
              On-Site
            </span>
            <span className="text-[11px] text-gray-700 font-medium block">
              Machine delivered at contractor site working.
            </span>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-red-600" />
          <h2 className="text-base font-black text-gray-950 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {FAQS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-3 text-xs font-bold text-gray-950 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-black">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-red-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-2 text-xs text-gray-700 font-medium bg-gray-50 p-3 rounded border border-gray-200 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
