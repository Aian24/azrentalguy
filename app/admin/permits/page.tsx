"use client";

import React, { useState } from "react";
import {
  FileText,
  Upload,
  Zap,
  Send,
  Copy,
  Check,
  Building,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Target,
} from "lucide-react";
import { INITIAL_PERMITS, PermitLead } from "@/lib/admin-data";
import { FLEET, COMPANY_INFO } from "@/lib/fleet";

export default function PermitPipelinePage() {
  const [permits, setPermits] = useState<PermitLead[]>(INITIAL_PERMITS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPermit, setSelectedPermit] = useState<PermitLead | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showNotification("AI Outreach Pitch copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = (id: string, newStatus: PermitLead["status"]) => {
    setPermits((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    showNotification(`Permit ${id} marked as ${newStatus.toUpperCase()}`);
    if (selectedPermit && selectedPermit.id === id) {
      setSelectedPermit((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSimulateCsvUpload = () => {
    showNotification("County Permits CSV parsed! Scored 3 new contractor excavation leads.");
  };

  // Filtered Permits
  const filteredPermits = permits.filter((p) => {
    const matchesSearch =
      p.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.permitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.recommendedEquipment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesCity = cityFilter === "all" || p.city.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCity;
  });

  // Unique cities for filter
  const cities = Array.from(new Set(permits.map((p) => p.city)));

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredPermits.length / rowsPerPage) || 1;
  const displayedPermits = filteredPermits.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-6 font-sans text-gray-900 pb-12">
      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 bg-red-600 text-white font-bold px-4 py-2.5 rounded shadow-lg text-sm flex items-center gap-2 border border-yellow-400">
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* HEADER & CSV ACTION - UNIFORM H-10 HEIGHT */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-red-600" />
            Maricopa County Permit Pipeline
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            AI-powered lead scoring and contractor outreach for upcoming grading, excavation, and pool permits.
          </p>
        </div>

        {/* METRICS & UPLOAD WITH MATCHING HEIGHT */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-10 px-3.5 bg-yellow-50 border border-yellow-400 rounded flex items-center gap-2 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs cursor-pointer">
            <span className="text-yellow-800 font-bold">High Match:</span>
            <span className="text-sm font-black text-gray-950">
              {permits.filter((p) => p.matchScore >= 90).length} Contractors
            </span>
          </div>

          <button
            onClick={handleSimulateCsvUpload}
            className="h-10 bg-red-600 hover:bg-red-700 text-white font-bold px-4 rounded text-xs border border-red-600 flex items-center gap-2 transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4 text-yellow-300" />
            <span>Upload County CSV</span>
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-3.5 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 flex-1">
          {/* SEARCH */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search permit #, contractor, city, project..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:border-red-600 focus:outline-none bg-white"
            />
          </div>

          {/* STATUS & CITY FILTERS */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-xs font-bold bg-white text-gray-800 focus:border-red-600 focus:outline-none truncate cursor-pointer"
            >
              <option value="all">All Statuses ({permits.length})</option>
              <option value="new">New ({permits.filter((p) => p.status === "new").length})</option>
              <option value="contacted">
                Contacted ({permits.filter((p) => p.status === "contacted").length})
              </option>
              <option value="quoted">
                Quoted ({permits.filter((p) => p.status === "quoted").length})
              </option>
            </select>

            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-xs font-bold bg-white text-gray-800 focus:border-red-600 focus:outline-none truncate cursor-pointer"
            >
              <option value="all">All Valley Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* SHOW ENTRIES SELECTOR */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded font-bold bg-white text-gray-900 focus:border-red-600 focus:outline-none text-xs cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <span className="text-xs font-bold text-gray-500 hidden sm:inline">
          Showing {filteredPermits.length} of {permits.length} Permits
        </span>
      </div>

      {/* SCALABLE COUNTY PERMITS DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Permit #</th>
                <th className="py-3 px-4">Contractor</th>
                <th className="py-3 px-4">City / Address</th>
                <th className="py-3 px-4">Project Scope</th>
                <th className="py-3 px-4 text-right">Valuation</th>
                <th className="py-3 px-4">Recommended Unit</th>
                <th className="py-3 px-4 text-center">Match</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedPermits.map((permit) => (
                <tr
                  key={permit.id}
                  className="transition-all duration-150 hover:bg-yellow-50/50 hover:translate-x-1 cursor-pointer"
                >
                  {/* PERMIT ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-800 text-xs whitespace-nowrap">
                    <div>{permit.permitNumber}</div>
                    <div className="text-gray-400 font-sans text-[11px] font-normal">
                      Issued {permit.issuedDate}
                    </div>
                  </td>

                  {/* CONTRACTOR */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-950 text-sm">
                      {permit.contractorName}
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      <a
                        href={`tel:${permit.phone}`}
                        className="text-red-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-red-600" />
                        <span>{permit.phone}</span>
                      </a>
                    </div>
                  </td>

                  {/* CITY & ADDRESS */}
                  <td className="py-3.5 px-4 text-xs">
                    <span className="font-bold text-gray-900 block">{permit.city}, AZ</span>
                    <span className="text-gray-500 truncate block max-w-[180px]">
                      {permit.jobsiteAddress}
                    </span>
                  </td>

                  {/* PROJECT SCOPE */}
                  <td className="py-3.5 px-4 text-xs font-medium text-gray-700 max-w-[220px]">
                    <div className="line-clamp-2">{permit.projectType}</div>
                  </td>

                  {/* VALUATION */}
                  <td className="py-3.5 px-4 text-right font-black text-gray-950 text-sm whitespace-nowrap">
                    {permit.valuation}
                  </td>

                  {/* RECOMMENDED MACHINE */}
                  <td className="py-3.5 px-4 text-xs font-bold text-red-700 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span>{permit.recommendedEquipment}</span>
                    </div>
                  </td>

                  {/* MATCH SCORE */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="bg-yellow-500 text-gray-950 font-bold text-xs px-2.5 py-1 rounded inline-flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-gray-950" />
                      <span>{permit.matchScore}%</span>
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={permit.status}
                      onChange={(e) =>
                        handleStatusChange(permit.id, e.target.value as PermitLead["status"])
                      }
                      className={`text-xs font-bold px-2 py-1 rounded border focus:outline-none cursor-pointer ${permit.status === "new"
                          ? "bg-yellow-100 text-yellow-900 border-yellow-400"
                          : permit.status === "contacted"
                            ? "bg-red-50 text-red-800 border-red-300"
                            : "bg-emerald-100 text-emerald-900 border-emerald-400"
                        }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                    </select>
                  </td>

                  {/* OUTREACH ACTION */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPermit(permit)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>AI Pitch</span>
                      </button>
                      <button
                        onClick={() => handleCopy(permit.id, permit.aiPitchDraft)}
                        className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                        title="Copy AI Pitch"
                      >
                        {copiedId === permit.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {displayedPermits.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500 font-medium">
                    No permits found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS VIEW (NO SWIPING) */}
        <div className="md:hidden divide-y divide-gray-200">
          {displayedPermits.map((permit) => (
            <div key={permit.id} className="p-3.5 space-y-2.5 bg-white hover:bg-yellow-50/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-500 text-xs">{permit.permitNumber}</span>
                    <span className="text-[10px] text-gray-400 font-medium">Issued {permit.issuedDate}</span>
                  </div>
                  <div className="font-black text-gray-950 text-sm truncate mt-0.5">{permit.contractorName}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="bg-yellow-500 text-gray-950 font-bold text-xs px-2 py-0.5 rounded inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-gray-950" />
                    <span>{permit.matchScore}% Match</span>
                  </span>
                  <div className="mt-1">
                    <select
                      value={permit.status}
                      onChange={(e) =>
                        handleStatusChange(permit.id, e.target.value as PermitLead["status"])
                      }
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${permit.status === "new"
                          ? "bg-yellow-100 text-yellow-900 border-yellow-400"
                          : permit.status === "contacted"
                            ? "bg-red-50 text-red-800 border-red-300"
                            : "bg-emerald-100 text-emerald-900 border-emerald-400"
                        }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-2.5 rounded border border-gray-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Recommended:</span>
                  <span className="font-bold text-red-700 text-right truncate max-w-[200px]">
                    {permit.recommendedEquipment}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Valuation:</span>
                  <span className="font-black text-gray-950">{permit.valuation}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-gray-500 font-medium shrink-0">Scope:</span>
                  <span className="text-gray-700 line-clamp-2 text-right">{permit.projectType}</span>
                </div>
                <div className="flex items-start justify-between gap-2 pt-1 border-t border-gray-200/60">
                  <span className="text-gray-500 font-medium shrink-0">Jobsite:</span>
                  <span className="text-gray-600 truncate text-right">
                    {permit.city}, AZ • {permit.jobsiteAddress}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5 text-xs">
                <a
                  href={`tel:${permit.phone}`}
                  className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{permit.phone}</span>
                </a>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedPermit(permit)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>AI Pitch</span>
                  </button>
                  <button
                    onClick={() => handleCopy(permit.id, permit.aiPitchDraft)}
                    className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                    title="Copy AI Pitch"
                  >
                    {copiedId === permit.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {displayedPermits.length === 0 && (
            <div className="py-8 text-center text-gray-400 font-medium text-sm">
              No permits found matching criteria.
            </div>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">
          <span className="text-xs font-semibold text-gray-600 order-2 sm:order-1">
            Showing{" "}
            <strong className="text-gray-950 font-bold">
              {filteredPermits.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-gray-950 font-bold">
              {Math.min(currentPage * rowsPerPage, filteredPermits.length)}
            </strong>{" "}
            of <strong className="text-gray-950 font-bold">{filteredPermits.length}</strong> county permits
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

      {/* AI OUTREACH MODAL / DRAWER */}
      {selectedPermit && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-2 border-red-600 max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* MODAL HEADER */}
            <div className="bg-red-600 px-5 py-3.5 flex items-center justify-between text-white border-b-2 border-yellow-500">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <h3 className="font-bold text-sm tracking-wide">
                  AI Lead Pitch: {selectedPermit.contractorName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPermit(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-5 space-y-4 text-sm font-sans">
              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-600">
                    {selectedPermit.permitNumber}
                  </span>
                  <span className="bg-yellow-500 text-gray-950 font-bold text-xs px-2 py-0.5 rounded">
                    {selectedPermit.matchScore}% Machine Match
                  </span>
                </div>
                <div className="font-bold text-gray-950 text-base">
                  {selectedPermit.contractorName}
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  <span>
                    {selectedPermit.jobsiteAddress}, {selectedPermit.city}, AZ
                  </span>
                </div>
                <div className="text-xs text-gray-700 font-medium pt-1">
                  Scope: {selectedPermit.projectType} ({selectedPermit.valuation})
                </div>
              </div>

              {/* DRAFT */}
              <div>
                <label className="block text-gray-900 font-bold text-xs mb-1.5 flex items-center justify-between">
                  <span>SMS Outreach Pitch (Ready to Send):</span>
                  <span className="text-gray-500 font-normal">160 Characters • SMS Optimized</span>
                </label>
                <div className="bg-yellow-50 border-2 border-yellow-400 p-3.5 rounded font-mono text-xs text-gray-900 leading-relaxed">
                  {selectedPermit.aiPitchDraft}
                </div>
              </div>

              {/* GUARANTEES */}
              <div className="bg-gray-100 p-3 rounded text-xs text-gray-700 space-y-1 border border-gray-200">
                <div className="font-bold text-gray-950">J-Bone Guaranteed Terms Included:</div>
                <div>• $150 Flat Delivery anywhere in Maricopa County</div>
                <div>• 48-Hour Free Reservation Hold (Zero Upfront Charge)</div>
                <div>• Direct Line: (707) 326-5592</div>
              </div>

              {/* ACTIONS */}
              <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopy(selectedPermit.id, selectedPermit.aiPitchDraft)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy SMS Pitch</span>
                </button>

                <button
                  onClick={() => {
                    handleStatusChange(selectedPermit.id, "contacted");
                    setSelectedPermit(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Contacted</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}