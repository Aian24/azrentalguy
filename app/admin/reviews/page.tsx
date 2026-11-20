"use client";

import React, { useState } from "react";
import {
  Star,
  Send,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  Truck,
} from "lucide-react";
import { INITIAL_REVIEWS, ReviewFollowUp } from "@/lib/admin-data";
import { COMPANY_INFO } from "@/lib/fleet";

export default function ReviewBoosterPage() {
  const [reviews, setReviews] = useState<ReviewFollowUp[]>(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [templateText, setTemplateText] = useState(
    "Hi {CustomerName}, thanks for renting our {EquipmentName} from J-Bone Industries! We hope the machine performed great on your jobsite. Could you take 30 seconds to drop us a quick 5-star Google review? It helps our Arizona family business immensely: {ReviewLink}"
  );
  const [testPhone, setTestPhone] = useState("(707) 326-5592");
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSendNow = (id: string, name: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, queueStatus: "sent", sentAt: "Just now" } : r
      )
    );
    showNotification(`Review request SMS sent to ${name}!`);
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification(`Test review request SMS sent to ${testPhone}!`);
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || r.queueStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredReviews.length / rowsPerPage) || 1;
  const displayedReviews = filteredReviews.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const previewSms = templateText
    .replace("{CustomerName}", "Travis Vance")
    .replace("{EquipmentName}", "CAT 259D3 Track Loader")
    .replace("{ReviewLink}", "https://g.page/r/azrentalguy/review");

  return (
    <div className="space-y-6 font-sans text-gray-900 pb-12">
      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 bg-red-600 text-white font-bold px-4 py-2.5 rounded shadow-lg text-sm flex items-center gap-2 border border-yellow-400">
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* HEADER & RATING KPI - UNIFORM H-10 HEIGHT */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            Google Reviews & Follow-Up Automation
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Automated SMS feedback requests dispatched 24 hours post-return to maintain a 5.0 Google rating.
          </p>
        </div>

        {/* GOOGLE STATS WITH MATCHING HEIGHT */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-10 px-3.5 bg-yellow-50 border border-yellow-400 rounded flex items-center gap-2 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs cursor-pointer">
            <div className="flex items-center gap-0.5 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-500" />
              ))}
            </div>
            <span className="font-black text-gray-950 text-sm">5.0</span>
            <span className="text-xs text-gray-600 font-medium">(48 Reviews)</span>
          </div>

          <div className="h-10 px-3.5 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs cursor-pointer">
            <span className="text-red-700 font-bold">SMS Conversion:</span>
            <span className="text-sm font-black text-gray-950">88%</span>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
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

          {/* SEARCH */}
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search customer, phone, machine..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:border-red-600 focus:outline-none"
            />
          </div>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold bg-white text-gray-800 focus:border-red-600 focus:outline-none"
          >
            <option value="all">All Follow-Ups ({reviews.length})</option>
            <option value="queued">
              Queued ({reviews.filter((r) => r.queueStatus === "queued").length})
            </option>
            <option value="sent">
              SMS Sent ({reviews.filter((r) => r.queueStatus === "sent").length})
            </option>
            <option value="reviewed">
              Reviewed ({reviews.filter((r) => r.queueStatus === "reviewed").length})
            </option>
          </select>
        </div>

        <span className="text-xs font-bold text-gray-500">
          Showing {filteredReviews.length} of {reviews.length} Queue Records
        </span>
      </div>

      {/* SCALABLE REVIEWS DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Queue ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Returned Machine</th>
                <th className="py-3 px-4">Return Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Sent At</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedReviews.map((item) => (
                <tr
                  key={item.id}
                  className="transition-all duration-150 hover:bg-yellow-50/50 hover:translate-x-1 cursor-pointer"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-700 text-xs whitespace-nowrap">
                    {item.id}
                  </td>

                  {/* CUSTOMER */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-950 text-sm">
                      {item.customerName}
                    </div>
                  </td>

                  {/* PHONE */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <a
                      href={`tel:${item.phone}`}
                      className="flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 text-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      <span>{item.phone}</span>
                    </a>
                  </td>

                  {/* MACHINE */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <span>{item.equipmentName}</span>
                    </div>
                  </td>

                  {/* RETURN DATE */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-gray-700 font-medium">
                    {item.returnDate}
                  </td>

                  {/* STATUS */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs font-bold uppercase px-2.5 py-1 rounded border inline-flex items-center gap-1.5 ${item.queueStatus === "reviewed"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                          : item.queueStatus === "sent"
                            ? "bg-yellow-100 text-yellow-900 border-yellow-400"
                            : "bg-red-50 text-red-800 border-red-300"
                        }`}
                    >
                      {item.queueStatus === "reviewed" ? (
                        <>
                          <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                          <span>5-Star Left</span>
                        </>
                      ) : item.queueStatus === "sent" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-yellow-700" />
                          <span>SMS Sent</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-red-600" />
                          <span>Queued (24h)</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* SENT AT */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-gray-500">
                    {item.sentAt || "Pending"}
                  </td>

                  {/* ACTION */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {item.queueStatus === "queued" ? (
                      <button
                        onClick={() => handleSendNow(item.id, item.customerName)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold px-3 py-1.5 rounded text-xs border border-yellow-500 flex items-center gap-1.5 transition-colors shadow-xs ml-auto cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Now</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendNow(item.id, item.customerName)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 transition-colors ml-auto cursor-pointer"
                      >
                        Resend SMS
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {displayedReviews.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 font-medium">
                    No review records found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW (NO SWIPING) */}
        <div className="md:hidden divide-y divide-gray-200">
          {displayedReviews.map((item) => (
            <div key={item.id} className="p-3.5 space-y-2.5 bg-white hover:bg-yellow-50/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-mono font-bold text-gray-500 text-xs">{item.id}</span>
                  <div className="font-black text-gray-950 text-sm truncate mt-0.5">{item.customerName}</div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-flex items-center gap-1 ${item.queueStatus === "reviewed"
                        ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                        : item.queueStatus === "sent"
                          ? "bg-yellow-100 text-yellow-900 border-yellow-400"
                          : "bg-red-50 text-red-800 border-red-300"
                      }`}
                  >
                    {item.queueStatus === "reviewed" ? (
                      <>
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        <span>5-Star</span>
                      </>
                    ) : item.queueStatus === "sent" ? (
                      <>
                        <Check className="w-3 h-3 text-yellow-700" />
                        <span>Sent</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-red-600" />
                        <span>Queued</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded border border-gray-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Returned Unit:</span>
                  <span className="font-bold text-gray-900 text-right truncate max-w-[200px]">
                    {item.equipmentName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Return Date:</span>
                  <span className="font-semibold text-gray-800">{item.returnDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Last Sent:</span>
                  <span className="text-gray-600">{item.sentAt || "Pending"}</span>
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
                <div>
                  {item.queueStatus === "queued" ? (
                    <button
                      onClick={() => handleSendNow(item.id, item.customerName)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send SMS</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendNow(item.id, item.customerName)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded text-xs border border-gray-300 transition-colors cursor-pointer"
                    >
                      Resend SMS
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {displayedReviews.length === 0 && (
            <div className="py-8 text-center text-gray-400 font-medium text-sm">
              No review records found matching criteria.
            </div>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">
          <span className="text-xs font-semibold text-gray-600 order-2 sm:order-1">
            Showing{" "}
            <strong className="text-gray-950 font-bold">
              {filteredReviews.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-gray-950 font-bold">
              {Math.min(currentPage * rowsPerPage, filteredReviews.length)}
            </strong>{" "}
            of <strong className="text-gray-950 font-bold">{filteredReviews.length}</strong> queue items
          </span>

          <div className="inline-flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-300 shadow-2xs order-1 sm:order-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-bold text-xs transition-all bg-white hover:bg-gray-100 text-gray-800 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-950 font-black text-xs min-w-[85px] text-center">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-bold text-xs transition-all bg-white hover:bg-gray-100 text-gray-800 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed active:scale-95 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: TEMPLATE CUSTOMIZER & RECENT REVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TEMPLATE CUSTOMIZER & PREVIEW (7 COLS) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-sm">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-950 text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-600" />
              SMS Review Invitation Template
            </h3>
            <span className="text-xs font-bold text-gray-500">Auto-Merge Enabled</span>
          </div>

          <div>
            <label className="block text-gray-900 font-bold text-xs mb-1.5">
              Message Content (Dispatched 24 Hours Post-Return):
            </label>
            <textarea
              rows={4}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:border-red-600 focus:outline-none leading-relaxed"
            />
            <span className="text-xs text-gray-500 block mt-1">
              Merge tags: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">{"{CustomerName}"}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">{"{EquipmentName}"}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">{"{ReviewLink}"}</code>
            </span>
          </div>

          {/* TEST SMS DISPATCH */}
          <form onSubmit={handleSendTestSms} className="flex items-center gap-3 pt-2">
            <input
              type="text"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="Test phone (e.g. 707-326-5592)"
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:border-red-600 focus:outline-none w-56 font-mono"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test SMS</span>
            </button>
          </form>
        </div>

        {/* RECENT VERIFIED REVIEWS WALL (5 COLS) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-950 text-base flex items-center gap-2 border-b border-gray-200 pb-3">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Verified Customer Reviews
          </h3>

          <div className="space-y-3">
            <div className="bg-gray-50 p-3.5 rounded border border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-950 text-sm">
                  Rick Martinez (Valley Trench)
                </span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-xs italic leading-relaxed">
                &quot;Rented the 2025 Load Trail gooseneck trailer for a week. Trailer was spotless, hydraulic tilt worked flawlessly, and J-Bone made pickup in Cave Creek super easy. 10/10.&quot;
              </p>
            </div>

            <div className="bg-gray-50 p-3.5 rounded border border-gray-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-950 text-sm">
                  Mike Callahan (Callahan Earthworks)
                </span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-xs italic leading-relaxed">
                &quot;CAT 259D3 was delivered right on time to our Cave Creek jobsite for $150 flat. Clean machine, strong AC, fresh tracks. Best rental outfit in the North Valley.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}