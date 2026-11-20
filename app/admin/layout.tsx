"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Truck,
  LayoutDashboard,
  Calendar,
  FileText,
  Star,
  Plus,
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  LogOut,
  BookOpen,
  Wrench,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/fleet";
import PhoneInLeadModal from "@/components/admin/PhoneInLeadModal";
import {
  PipelineLead,
  INITIAL_HOLDS,
  ActiveHold,
  isDemoData,
  purgeDemoStorage,
} from "@/lib/admin-data";
import { getStoredSettings, applySettingsToDOM, AppSettings } from "@/lib/settings";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [azTime, setAzTime] = useState("");
  const [appSettings, setAppSettings] = useState<AppSettings>(getStoredSettings());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // DYNAMIC COUNTS FOR SIDEBAR & TOPBAR
  const [dispatchCount, setDispatchCount] = useState(0);
  const [pipelineCount, setPipelineCount] = useState(0);
  const [permitCount, setPermitCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("az_admin_sidebar_collapsed");
      if (saved === "true") {
        setIsSidebarCollapsed(true);
      }
    } catch { }
  }, []);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("az_admin_sidebar_collapsed", String(next));
      } catch { }
      return next;
    });
  };

  // WORKING 48-HR HOLDS NOTIFICATION POPOVER STATE
  const [isHoldsDropdownOpen, setIsHoldsDropdownOpen] = useState(false);
  const [holdsList, setHoldsList] = useState<ActiveHold[]>(INITIAL_HOLDS);
  const holdsRef = React.useRef<HTMLDivElement>(null);

  // AUTO-PURGE DEMO DATA AND SYNC LIVE COUNTS (LOCALSTORAGE + MARIADB)
  useEffect(() => {
    const syncDataCounts = async () => {
      try {
        const storedHolds = localStorage.getItem("az_admin_holds");
        const storedLeads = localStorage.getItem("az_admin_leads");
        const storedDispatch = localStorage.getItem("az_admin_dispatch");
        const storedPermits = localStorage.getItem("az_admin_permits");
        const storedInvoices = localStorage.getItem("az_admin_invoices");

        let hasDemo = false;
        if (storedHolds && isDemoData(JSON.parse(storedHolds))) hasDemo = true;
        if (storedLeads && isDemoData(JSON.parse(storedLeads))) hasDemo = true;
        if (storedDispatch && isDemoData(JSON.parse(storedDispatch))) hasDemo = true;
        if (storedPermits && isDemoData(JSON.parse(storedPermits))) hasDemo = true;
        if (storedInvoices && isDemoData(JSON.parse(storedInvoices))) hasDemo = true;

        if (hasDemo) {
          purgeDemoStorage();
          setHoldsList([]);
          setDispatchCount(0);
          setPipelineCount(0);
          setPermitCount(0);
        } else {
          if (storedHolds) {
            setHoldsList(JSON.parse(storedHolds));
          } else {
            setHoldsList([]);
          }
          if (storedDispatch) setDispatchCount(JSON.parse(storedDispatch).length);
          if (storedLeads) setPipelineCount(JSON.parse(storedLeads).length);
          if (storedPermits) setPermitCount(JSON.parse(storedPermits).length);
        }
      } catch {
        setHoldsList([]);
        setDispatchCount(0);
        setPipelineCount(0);
        setPermitCount(0);
      }

      // Sync with live MariaDB server database
      try {
        const [resHolds, resBookings] = await Promise.all([
          fetch("/api/holds"),
          fetch("/api/bookings"),
        ]);

        if (resHolds.ok) {
          const dataH = await resHolds.json();
          if (dataH.holds && Array.isArray(dataH.holds)) {
            setHoldsList(dataH.holds);
          }
        }

        if (resBookings.ok) {
          const dataB = await resBookings.json();
          if (dataB.bookings && Array.isArray(dataB.bookings)) {
            setDispatchCount(dataB.bookings.length);
          }
        }
      } catch (err) {
        console.error("Live DB count sync error", err);
      }
    };

    syncDataCounts();
    window.addEventListener("admin_data_updated", syncDataCounts);
    window.addEventListener("az_admin_purged", syncDataCounts);
    return () => {
      window.removeEventListener("admin_data_updated", syncDataCounts);
      window.removeEventListener("az_admin_purged", syncDataCounts);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (holdsRef.current && !holdsRef.current.contains(event.target as Node)) {
        setIsHoldsDropdownOpen(false);
      }
    };
    if (isHoldsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isHoldsDropdownOpen]);

  // AUTHENTICATION GUARD
  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = () => {
      const auth = localStorage.getItem("az_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  // LIVE SETTINGS SYNC (LOGO, COMPANY NAME, TIME ZONE, FONTS)
  useEffect(() => {
    const syncSettings = () => {
      const s = getStoredSettings();
      setAppSettings(s);
      applySettingsToDOM(s);
    };

    syncSettings();
    window.addEventListener("app_settings_updated", syncSettings);
    return () => window.removeEventListener("app_settings_updated", syncSettings);
  }, []);

  // REAL-TIME OPERATIONAL CLOCK
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-US", {
          timeZone: appSettings.timeZone || "America/Phoenix",
          hour: "numeric",
          minute: "2-digit",
          hour12: appSettings.timeFormat !== "24h",
        });
        setAzTime(timeStr);
      } catch {
        setAzTime("7:00 AM");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [appSettings.timeZone, appSettings.timeFormat]);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: BarChart3, badge: "Live" },
    { label: "Dispatch", href: "/admin/dispatch", icon: Truck, badge: String(dispatchCount) },
    { label: "Pipeline", href: "/admin/pipeline", icon: LayoutDashboard, badge: String(pipelineCount) },
    { label: "Calendar", href: "/admin/calendar", icon: Calendar, badge: "14-Day" },
    { label: "Fleet & Pricing", href: "/admin/fleet", icon: Wrench, badge: "5 Units" },
    { label: "Permits", href: "/admin/permits", icon: FileText, badge: String(permitCount) },
    { label: "Reviews", href: "/admin/reviews", icon: Star, badge: "5.0" },
    { label: "Settings", href: "/admin/settings", icon: Settings, badge: "System" },
    { label: "User Manual", href: "/admin/manual", icon: BookOpen, badge: "Guide" },
  ];

  const handleLeadCreated = (newLead: PipelineLead) => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("az_admin_leads");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newLead);
        localStorage.setItem("az_admin_leads", JSON.stringify(list));
        window.dispatchEvent(new Event("admin_data_updated"));
      } catch (err) {
        console.error("Failed to store lead", err);
      }
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("az_admin_auth");
      document.cookie = "az_admin_auth=; path=/; max-age=0";
      router.push("/admin/login");
    }
  };

  // IF ON LOGIN PAGE, RENDER CHILDREN CLEANLY WITHOUT SIDEBAR/HEADER
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // IF CHECKING AUTHENTICATION, SHOW BRIEF LOADING SCREEN
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-red-600 rounded-full animate-spin mb-3" />
        <span className="text-xs font-black text-gray-800 tracking-wider uppercase">
          Verifying Operator Security...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900 font-sans">
      {/* MOBILE BACKDROP */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
        />
      )}

      {/* MODERN LIGHT SIDEBAR WITH DYNAMIC BRANDING & DESKTOP COLLAPSE */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-xs ${mobileSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"
          } ${isSidebarCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        <div className="overflow-y-auto overflow-x-hidden">
          {/* LOGO HEADER & COLLAPSE TOGGLE */}
          <div className="p-3.5 border-b border-gray-200 bg-white flex items-center justify-between gap-2">
            {!isSidebarCollapsed ? (
              <Link href="/admin" className="flex items-center gap-2.5 group min-w-0">
                <img
                  src={appSettings.logoUrl}
                  alt={appSettings.companyName}
                  style={{ height: `${Math.min(appSettings.logoSize, 34)}px` }}
                  className="w-auto object-contain transition-transform group-hover:scale-105 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-red-600 font-black text-sm tracking-tight block leading-none truncate">
                    {appSettings.companyName.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-extrabold text-yellow-600 uppercase tracking-wider block mt-1">
                    Operator Admin Hub
                  </span>
                </div>
              </Link>
            ) : (
              <Link href="/admin" className="mx-auto block" title={appSettings.companyName}>
                <img
                  src={appSettings.logoUrl}
                  alt={appSettings.companyName}
                  className="h-8 w-8 object-contain"
                />
              </Link>
            )}

            {/* DESKTOP COLLAPSE / EXPAND TOGGLE BUTTON */}
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              className={`hidden md:flex p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors cursor-pointer shrink-0 ${isSidebarCollapsed ? "mx-auto mt-2" : ""
                }`}
              title={isSidebarCollapsed ? "Expand sidebar (full labels)" : "Collapse sidebar (icons only)"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-gray-700 hover:text-red-600" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-gray-700 hover:text-red-600" />
              )}
            </button>

            {/* MOBILE CLOSE */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-900 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* QUICK STATUS */}
          <div
            className={`px-3 py-2 bg-yellow-50/60 border-b border-gray-100 flex items-center text-xs ${isSidebarCollapsed ? "justify-center" : "justify-between"
              }`}
          >
            <div className="flex items-center gap-1.5" title="Cave Creek Yard: Open">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              {!isSidebarCollapsed && (
                <span className="text-gray-800 font-semibold text-xs truncate">Cave Creek Yard</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span className="text-red-600 font-black text-[11px] tracking-wide shrink-0">YARD OPEN</span>
            )}
          </div>

          {/* CTA: NEW LEAD MODAL */}
          <div className="p-2.5">
            <button
              onClick={() => setIsPhoneModalOpen(true)}
              className={`w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-black rounded text-sm flex items-center justify-center gap-2 shadow-xs transition-all duration-150 cursor-pointer ${isSidebarCollapsed ? "h-10 p-0" : "py-2 px-3"
                }`}
              title="Create New Lead / Hold"
            >
              <Plus className="w-4 h-4 shrink-0" />
              {!isSidebarCollapsed && <span>New Lead / Hold</span>}
            </button>
          </div>

          {/* NAV ITEMS */}
          <nav className="px-2 space-y-1 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={item.label}
                  className={`flex items-center rounded transition-all duration-200 cursor-pointer active:scale-[0.98] ${isSidebarCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2 text-sm"
                    } ${isActive
                      ? "bg-red-50 text-red-600 border-l-4 border-red-600 font-black shadow-xs"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-950 font-bold"
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-red-600" : "text-yellow-600"
                        }`}
                    />
                    {!isSidebarCollapsed && (
                      <span className="text-sm font-extrabold tracking-tight truncate">
                        {item.label}
                      </span>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-black tracking-wide shrink-0 ${isActive ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SHORTCUTS & OPERATOR LOGOUT */}
        <div className="p-2.5 border-t border-gray-200 bg-gray-50/70 space-y-2">
          <Link
            href="/"
            target="_blank"
            title="Live Website"
            className={`flex items-center text-gray-800 hover:text-red-600 bg-white border border-gray-200 rounded transition-all text-xs font-bold hover:shadow-xs ${isSidebarCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
              }`}
          >
            <span className="flex items-center gap-2 min-w-0">
              <ExternalLink className="w-4 h-4 text-yellow-600 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Live Website</span>}
            </span>
            {!isSidebarCollapsed && (
              <span className="text-[10px] text-red-600 font-extrabold bg-red-50 px-1.5 py-0.5 rounded shrink-0">
                AZ
              </span>
            )}
          </Link>

          {/* OPERATOR SIGN OUT */}
          <button
            type="button"
            onClick={handleLogout}
            title="Operator Sign Out"
            className={`w-full flex items-center text-gray-700 hover:text-red-700 bg-white border border-gray-200 hover:border-red-300 rounded transition-all text-xs font-bold hover:bg-red-50 cursor-pointer ${isSidebarCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
              }`}
          >
            <span className="flex items-center gap-2 min-w-0">
              <LogOut className="w-4 h-4 text-red-600 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Operator Sign Out</span>}
            </span>
            {!isSidebarCollapsed && (
              <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">Lock</span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 text-gray-700 hover:text-gray-950 border border-gray-300 rounded cursor-pointer shrink-0"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <span className="font-black text-xs sm:text-sm text-gray-950 truncate block leading-tight">
                {appSettings.companyName}
                <span className="hidden sm:inline font-bold text-gray-500"> • Operations & Analytics</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded text-xs">
              <Clock className="w-3.5 h-3.5 text-yellow-600" />
              <span className="text-gray-600 font-medium">Zone:</span>
              <span className="text-gray-950 font-bold">{azTime || "7:00 AM"}</span>
            </div>

            {/* INTERACTIVE WORKING 48-HR HOLDS NOTIFICATION CENTER */}
            <div ref={holdsRef} className="relative">
              <button
                type="button"
                onClick={() => setIsHoldsDropdownOpen(!isHoldsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-[0.98] ${
                  holdsList.length > 0
                    ? "bg-red-50 hover:bg-red-100 border border-red-300 text-red-700"
                    : "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700"
                }`}
                title="Click to view Active 48-Hour Reservation Holds"
              >
                <Bell className={`w-3.5 h-3.5 ${holdsList.length > 0 ? "text-red-600 animate-bounce" : "text-gray-500"}`} />
                <span>{holdsList.length} {holdsList.length === 1 ? "Hold" : "Holds"}</span>
                {holdsList.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />}
              </button>

              {/* HOLDS DROPDOWN NOTIFICATION POPOVER */}
              {isHoldsDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border-2 border-yellow-500 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="bg-yellow-500 px-4 py-2.5 flex items-center justify-between text-gray-950">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-950" />
                      <span className="font-black text-xs uppercase tracking-tight">
                        Active 48-Hr Holds ({holdsList.length} Units)
                      </span>
                    </div>
                    {holdsList.length > 0 && (
                      <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded">
                        Expiring Soon
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                    {holdsList.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-gray-700">No Active Holds</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          New equipment reservation holds will appear here.
                        </p>
                      </div>
                    ) : (
                      holdsList.map((hold) => (
                        <div
                          key={hold.id}
                          className="p-3 hover:bg-yellow-50/40 transition-colors flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-950 text-xs">
                                {hold.customerName}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                ({hold.id})
                              </span>
                            </div>
                            <span className="text-xs text-gray-600 block mt-0.5 font-medium">
                              {hold.equipmentName}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium block">
                              {hold.startDate} → {hold.endDate}
                            </span>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-black text-red-600 block">
                              {hold.hoursRemaining}h left
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block mt-1 ${
                                hold.signatureStatus === "signed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {hold.signatureStatus === "signed" ? "Signed" : "Pending Signature"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-gray-50 border-t border-gray-200 text-center">
                    <Link
                      href="/admin/dispatch"
                      onClick={() => setIsHoldsDropdownOpen(false)}
                      className="text-xs font-black text-red-600 hover:text-red-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage All Holds & Dispatches in Dispatch Hub →</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 sm:p-6 lg:p-6 flex-1 overflow-x-auto">
          {children}
        </main>
      </div>

      {/* FAST LEAD MODAL */}
      <PhoneInLeadModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onLeadCreated={handleLeadCreated}
      />
    </div>
  );
}
