"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Table as TableIcon,
  Columns,
  Plus,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Download,
} from "lucide-react";
import { INITIAL_LEADS, PipelineLead, isDemoData, purgeDemoStorage } from "@/lib/admin-data";
import { FLEET } from "@/lib/fleet";
import PhoneInLeadModal from "@/components/admin/PhoneInLeadModal";

export default function LeadPipelinePage() {
  const [leads, setLeads] = useState<PipelineLead[]>(INITIAL_LEADS);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const loadLeads = () => {
      try {
        const stored = localStorage.getItem("az_admin_leads");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (isDemoData(parsed)) {
            purgeDemoStorage();
            setLeads([]);
          } else {
            setLeads(parsed);
          }
        } else {
          setLeads(INITIAL_LEADS);
        }
      } catch (err) {
        setLeads(INITIAL_LEADS);
      }
    };

    loadLeads();

    const handleUpdate = () => loadLeads();
    window.addEventListener("admin_data_updated", handleUpdate);
    return () => window.removeEventListener("admin_data_updated", handleUpdate);
  }, []);

  const saveLeads = (newLeads: PipelineLead[]) => {
    setLeads(newLeads);
    try {
      localStorage.setItem("az_admin_leads", JSON.stringify(newLeads));
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        "Lead ID",
        "Customer Name",
        "Company",
        "Phone",
        "Email",
        "Equipment",
        "Stage",
        "Start Date",
        "End Date",
        "Quoted Amount",
        "Jobsite Address",
        "Priority",
        "Created At",
        "Notes",
      ];
      const rows = leads.map((l) => [
        `"${l.id}"`,
        `"${(l.customerName || "").replace(/"/g, '""')}"`,
        `"${(l.companyName || "").replace(/"/g, '""')}"`,
        `"${(l.phone || "").replace(/"/g, '""')}"`,
        `"${(l.email || "").replace(/"/g, '""')}"`,
        `"${(l.equipmentName || "").replace(/"/g, '""')}"`,
        `"${(l.stage || "").replace(/"/g, '""')}"`,
        `"${l.startDate || ""}"`,
        `"${l.endDate || ""}"`,
        `"${l.quotedAmount || 0}"`,
        `"${(l.jobsiteAddress || "").replace(/"/g, '""')}"`,
        `"${(l.priority || "normal").replace(/"/g, '""')}"`,
        `"${l.createdAt || ""}"`,
        `"${(l.notes || "").replace(/"/g, '""')}"`,
      ]);
      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `azrentalguy-pipeline-deals-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(`Exported ${leads.length} deals to CSV successfully!`);
    } catch {
      showNotification("Failed to export CSV. Please try again.");
    }
  };

  const stageOrder: PipelineLead["stage"][] = [
    "inquired",
    "quoted",
    "agreement_sent",
    "reserved",
    "active",
    "closed",
  ];

  const stageLabels: Record<PipelineLead["stage"], { label: string; bg: string; text: string }> = {
    inquired: { label: "Inquired", bg: "bg-gray-100 border-gray-300", text: "text-gray-800" },
    quoted: { label: "Quoted", bg: "bg-yellow-100 border-yellow-400", text: "text-yellow-900" },
    agreement_sent: { label: "Agreement Sent", bg: "bg-red-100 border-red-300", text: "text-red-800" },
    reserved: { label: "Reserved", bg: "bg-emerald-100 border-emerald-400", text: "text-emerald-900" },
    active: { label: "Active On Site", bg: "bg-red-600 border-red-600", text: "text-white" },
    closed: { label: "Closed", bg: "bg-gray-200 border-gray-300", text: "text-gray-700" },
  };

  const moveLead = (leadId: string, direction: "prev" | "next") => {
    const updated = leads.map((lead) => {
      if (lead.id !== leadId) return lead;
      const currentIndex = stageOrder.indexOf(lead.stage);
      const targetIndex =
        direction === "next"
          ? Math.min(stageOrder.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);
      const newStage = stageOrder[targetIndex];
      showNotification(`Moved "${lead.customerName}" to ${newStage.toUpperCase().replace("_", " ")}`);
      return { ...lead, stage: newStage };
    });
    saveLeads(updated);
  };

  const setLeadStage = (leadId: string, stage: PipelineLead["stage"]) => {
    const updated = leads.map((lead) => (lead.id === leadId ? { ...lead, stage } : lead));
    saveLeads(updated);
    showNotification(`Lead ${leadId} status set to ${stage.replace("_", " ").toUpperCase()}`);
  };

  const handleLeadCreated = (newLead: PipelineLead) => {
    const updated = [newLead, ...leads];
    saveLeads(updated);
    showNotification(`New Phone-In Lead added for ${newLead.customerName}!`);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.companyName && lead.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.jobsiteAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMachine = selectedMachine === "all" || lead.equipmentId === selectedMachine;
    const matchesStage = selectedStage === "all" || lead.stage === selectedStage;

    return matchesSearch && matchesMachine && matchesStage;
  });

  // Pagination for Data Table
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage) || 1;
  const displayedLeads = filteredLeads.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.quotedAmount || 0), 0);
  const activeRentalValue = leads
    .filter((l) => l.stage === "active" || l.stage === "reserved")
    .reduce((acc, curr) => acc + (curr.quotedAmount || 0), 0);

  return (
    <div className="space-y-6 font-sans text-gray-900 pb-12">
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 bg-red-600 text-white font-bold px-4 py-2.5 rounded shadow-lg text-sm flex items-center gap-2 border border-yellow-400">
          <CheckCircle2 className="w-4 h-4 text-yellow-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* HEADER & METRICS - UNIFORM H-10 HEIGHT */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-red-600" />
            Contractor Lead Pipeline
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage inquiries, digital quote holds, signed contracts, and active jobs.
          </p>
        </div>

        {/* METRICS & ACTIONS WITH MATCHING HEIGHT */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-10 px-3.5 bg-yellow-50 border border-yellow-400 rounded flex items-center gap-2 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs cursor-pointer">
            <span className="text-yellow-800 font-bold">Pipeline Value:</span>
            <span className="text-sm font-black text-gray-950">
              ${totalPipelineValue.toLocaleString()}
            </span>
          </div>

          <div className="h-10 px-3.5 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xs cursor-pointer">
            <span className="text-red-700 font-bold">Active / Signed:</span>
            <span className="text-sm font-black text-gray-950">
              ${activeRentalValue.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleExportCSV}
            className="h-10 bg-red-600 hover:bg-red-700 text-white font-bold px-4 rounded text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Export all contractor leads and quote records to CSV"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export Deals (CSV)</span>
          </button>
        </div>
      </div>

      {/* TOOLBAR: SEARCH, FILTERS & VIEW TOGGLE */}
      <div className="bg-white p-3.5 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 flex-1">
          {/* SEARCH */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search contractor, company, phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:border-red-600 focus:outline-none bg-white"
            />
          </div>

          {/* STAGE & MACHINE FILTERS */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            <select
              value={selectedStage}
              onChange={(e) => {
                setSelectedStage(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-xs font-bold bg-white text-gray-800 focus:border-red-600 focus:outline-none truncate cursor-pointer"
            >
              <option value="all">All Stages ({leads.length})</option>
              <option value="inquired">Inquired</option>
              <option value="quoted">Quoted</option>
              <option value="agreement_sent">Agreement Sent</option>
              <option value="reserved">Reserved</option>
              <option value="active">Active On Site</option>
              <option value="closed">Closed / Returned</option>
            </select>

            <select
              value={selectedMachine}
              onChange={(e) => {
                setSelectedMachine(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-xs font-bold bg-white text-gray-800 focus:border-red-600 focus:outline-none truncate cursor-pointer"
            >
              <option value="all">All Fleet Equipment</option>
              {FLEET.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
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

        {/* VIEW TOGGLE */}
        <div className="flex items-center justify-end sm:justify-start gap-2 pt-1 md:pt-0 border-t md:border-t-0 border-gray-100">
          <div className="inline-flex rounded border border-gray-300 bg-gray-50 p-0.5 w-full sm:w-auto justify-center">
            <button
              onClick={() => setViewMode("table")}
              className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Data Table</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: SCALABLE PIPELINE DATA TABLE */}
      {viewMode === "table" ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Lead ID</th>
                  <th className="py-3 px-4">Contractor / Company</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Equipment Unit</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedLeads.map((lead) => {
                  const stageInfo = stageLabels[lead.stage];
                  return (
                    <tr
                      key={lead.id}
                      className="transition-all duration-150 hover:bg-yellow-50/50 hover:translate-x-1 cursor-pointer"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-700 text-xs whitespace-nowrap">
                        {lead.id}
                      </td>

                      {/* CONTRACTOR */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-950 text-sm">
                          {lead.customerName}
                        </div>
                        {lead.companyName && (
                          <div className="text-xs text-gray-500 font-medium">
                            {lead.companyName}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-0.5">{lead.jobsiteAddress}</div>
                      </td>

                      {/* CONTACT */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 text-xs"
                        >
                          <Phone className="w-3.5 h-3.5 text-red-600" />
                          <span>{lead.phone}</span>
                        </a>
                        <div className="text-xs text-gray-500 mt-0.5">{lead.email}</div>
                      </td>

                      {/* EQUIPMENT */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                          <span>{lead.equipmentName}</span>
                        </div>
                      </td>

                      {/* DATES */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-gray-700 font-medium">
                        <div>{lead.startDate}</div>
                        <div className="text-gray-400">thru {lead.endDate}</div>
                      </td>

                      {/* AMOUNT */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-black text-gray-950 text-base">
                          ${(lead.quotedAmount || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* STAGE SELECTOR */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={lead.stage}
                          onChange={(e) =>
                            setLeadStage(lead.id, e.target.value as PipelineLead["stage"])
                          }
                          className={`text-xs font-bold px-2.5 py-1 rounded border focus:outline-none cursor-pointer ${stageInfo.bg} ${stageInfo.text}`}
                        >
                          <option value="inquired">Inquired</option>
                          <option value="quoted">Quoted</option>
                          <option value="agreement_sent">Agreement Sent</option>
                          <option value="reserved">Reserved</option>
                          <option value="active">Active On Site</option>
                          <option value="closed">Closed / Returned</option>
                        </select>
                      </td>

                      {/* PRIORITY */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${lead.priority === "urgent"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : lead.priority === "high"
                                ? "bg-yellow-100 text-yellow-900 border-yellow-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }`}
                        >
                          {lead.priority}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => moveLead(lead.id, "prev")}
                            disabled={lead.stage === "inquired"}
                            className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Move to previous stage"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveLead(lead.id, "next")}
                            disabled={lead.stage === "closed"}
                            className="p-1.5 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Advance to next stage"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {displayedLeads.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500 font-medium">
                      No contractor leads found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW (NO SWIPING) */}
          <div className="md:hidden divide-y divide-gray-200">
            {displayedLeads.map((lead) => {
              const stageInfo = stageLabels[lead.stage];
              return (
                <div key={lead.id} className="p-3.5 space-y-2.5 bg-white hover:bg-yellow-50/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-500 text-xs">{lead.id}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${lead.priority === "urgent"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : lead.priority === "high"
                                ? "bg-yellow-100 text-yellow-900 border-yellow-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }`}
                        >
                          {lead.priority}
                        </span>
                      </div>
                      <div className="font-black text-gray-950 text-sm truncate mt-0.5">{lead.customerName}</div>
                      {lead.companyName && (
                        <div className="text-xs text-gray-500 font-medium truncate">{lead.companyName}</div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-gray-950 text-base leading-none">
                        ${(lead.quotedAmount || 0).toLocaleString()}
                      </div>
                      <div className="mt-1">
                        <select
                          value={lead.stage}
                          onChange={(e) =>
                            setLeadStage(lead.id, e.target.value as PipelineLead["stage"])
                          }
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${stageInfo.bg} ${stageInfo.text}`}
                        >
                          <option value="inquired">Inquired</option>
                          <option value="quoted">Quoted</option>
                          <option value="agreement_sent">Agreement Sent</option>
                          <option value="reserved">Reserved</option>
                          <option value="active">Active On Site</option>
                          <option value="closed">Closed / Returned</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded border border-gray-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Machine:</span>
                      <span className="font-bold text-gray-900 text-right truncate max-w-[200px]">
                        {lead.equipmentName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Dates:</span>
                      <span className="text-gray-800 font-semibold">
                        {lead.startDate} → {lead.endDate}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-gray-500 font-medium shrink-0">Location:</span>
                      <span className="text-gray-600 truncate max-w-[200px] text-right">
                        {lead.jobsiteAddress}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5 text-xs">
                    <a
                      href={`tel:${lead.phone}`}
                      className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lead.phone}</span>
                    </a>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveLead(lead.id, "prev")}
                        disabled={lead.stage === "inquired"}
                        className="px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </button>
                      <button
                        onClick={() => moveLead(lead.id, "next")}
                        disabled={lead.stage === "closed"}
                        className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {displayedLeads.length === 0 && (
              <div className="py-8 text-center text-gray-400 font-medium text-sm">
                No contractor leads found matching criteria.
              </div>
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/80 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">
            <span className="text-xs font-semibold text-gray-600 order-2 sm:order-1">
              Showing{" "}
              <strong className="text-gray-950 font-bold">
                {filteredLeads.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-gray-950 font-bold">
                {Math.min(currentPage * rowsPerPage, filteredLeads.length)}
              </strong>{" "}
              of <strong className="text-gray-950 font-bold">{filteredLeads.length}</strong> leads
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
      ) : (
        /* VIEW MODE 2: KANBAN BOARD */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6">
          {stageOrder.map((stageKey) => {
            const colLeads = filteredLeads.filter((l) => l.stage === stageKey);
            const colInfo = stageLabels[stageKey];
            const colValue = colLeads.reduce((acc, curr) => acc + (curr.quotedAmount || 0), 0);

            return (
              <div
                key={stageKey}
                className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-between min-w-[220px] shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-950 font-black text-xs uppercase tracking-tight">
                      {colInfo.label}
                    </h3>
                    <span className="bg-yellow-500 text-gray-950 font-bold text-xs px-2 py-0.5 rounded">
                      {colLeads.length}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 pb-2 border-b border-gray-200 mb-3 flex items-center justify-between">
                    <span>Value:</span>
                    <strong className="text-gray-950">${colValue.toLocaleString()}</strong>
                  </div>

                  <div className="space-y-3">
                    {colLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-gray-50 border border-gray-200 rounded p-3 hover:border-yellow-500 transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] cursor-pointer space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-gray-500">
                              {lead.id}
                            </span>
                            <h4 className="font-bold text-gray-950 text-sm mt-0.5">
                              {lead.customerName}
                            </h4>
                            {lead.companyName && (
                              <div className="text-xs text-gray-500">{lead.companyName}</div>
                            )}
                          </div>
                          <span
                            className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded ${lead.priority === "urgent"
                                ? "bg-red-600 text-white"
                                : lead.priority === "high"
                                  ? "bg-yellow-100 text-yellow-900 border border-yellow-300"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                          >
                            {lead.priority}
                          </span>
                        </div>

                        <div className="bg-white p-2 rounded border border-gray-200 text-xs">
                          <span className="font-bold text-gray-950 block truncate">
                            {lead.equipmentName}
                          </span>
                          <span className="text-gray-500 text-[11px]">
                            {lead.startDate} → {lead.endDate}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <strong className="text-sm font-black text-gray-950">
                            ${(lead.quotedAmount || 0).toLocaleString()}
                          </strong>
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-red-600" />
                            <span>Call</span>
                          </a>
                        </div>

                        <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                          <button
                            disabled={stageKey === "inquired"}
                            onClick={() => moveLead(lead.id, "prev")}
                            className="p-1 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-20"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-gray-400 font-bold">Shift</span>
                          <button
                            disabled={stageKey === "closed"}
                            onClick={() => moveLead(lead.id, "next")}
                            className="p-1 rounded text-red-600 font-bold hover:bg-red-50 disabled:opacity-20"
                          >
                            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {colLeads.length === 0 && (
                      <div className="text-center py-6 text-gray-400 text-xs italic">
                        No leads in stage
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PHONE-IN LEAD MODAL */}
      <PhoneInLeadModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onLeadCreated={handleLeadCreated}
      />
    </div>
  );
}