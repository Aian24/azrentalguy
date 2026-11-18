"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Phone, Menu, X } from "lucide-react";
import { COMPANY_INFO } from "@/lib/fleet";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const navLinks = [
    { label: "Home", targetId: "home", href: "/#home" },
    { label: "Equipment", targetId: "Equipment", href: "/#Equipment" },
    { label: "Pricing", targetId: "Pricing", href: "/#Pricing" },
    { label: "Book Now", targetId: "Booknow", href: "/#Booknow" },
    { label: "Contact", targetId: "Contact", href: "/#Contact" },
  ];

  // Scroll listener for sticky styling and active section detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (pathname === "/") {
        const sections = ["home", "Equipment", "Pricing", "Booknow", "Contact"];
        const scrollPosition = window.scrollY + 140;

        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && el.offsetTop <= scrollPosition) {
            setActiveSection(sections[i]);
            return;
          }
        }
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, targetId: string, href: string) => {
    if (pathname === "/") {
      e.preventDefault();
      setMobileMenuOpen(false);

      if (targetId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        setActiveSection("home");
        return;
      }

      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${targetId}`);
        setActiveSection(targetId);
      }
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-white ${
        isScrolled
          ? "border-b border-gray-200 shadow-sm py-2"
          : "border-b border-gray-100 py-2.5 sm:py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* COMPACT CLEAN LOGO */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                setActiveSection("home");
              }
            }}
            className="flex items-center shrink-0 group py-0.5 cursor-pointer"
          >
            <img
              src="/images/logo.webp"
              alt="AZ Rental Guy - J-Bone Industries"
              className="h-10 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* DESKTOP NAV LINKS (ACTIVE ITEM IS A RED LINE ONLY - NO GRADIENTS/NO CLUTTER) */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive =
                pathname === "/"
                  ? activeSection === link.targetId
                  : false;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.targetId, link.href)}
                  className={`relative py-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors inline-block cursor-pointer select-none ${
                    isActive ? "text-red-600" : "text-gray-800 hover:text-red-600"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-red-600 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-gray-900 hover:text-red-600 transition-colors py-2 px-1"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-900 hover:bg-gray-100 border border-gray-200 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-red-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === "/"
                  ? activeSection === link.targetId
                  : false;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.targetId, link.href)}
                  className={`px-3 py-3 text-sm font-black uppercase tracking-wider flex items-center justify-between border-b border-gray-100 cursor-pointer ${
                    isActive ? "text-red-600" : "text-gray-800 hover:text-red-600"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-6 h-[2.5px] bg-red-600 rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="mt-4 pt-3 flex flex-col gap-2.5">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="btn-yellow text-center py-3 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-gray-950" />
              <span>Call Dispatch: {COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
