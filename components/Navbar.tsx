"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X } from "lucide-react";
import { COMPANY_INFO } from "@/lib/fleet";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Equipment", href: "/equipment" },
    { label: "Pricing", href: "/pricing" },
    { label: "Book Now", href: "/book-now" },
    { label: "Contact", href: "/contact" },
  ];

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
          <Link href="/" className="flex items-center shrink-0 group py-0.5">
            <img
              src="/images/logo.webp"
              alt="AZ Rental Guy - J-Bone Industries"
              className="h-10 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* DESKTOP NAV LINKS (ACTIVE ITEM IS A LINE ONLY - NO BACKGROUND) */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(link.href + "/");

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors inline-block ${
                    isActive ? "text-red-600" : "text-gray-800 hover:text-red-600"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-red-600 rounded-full" />
                  )}
                </Link>
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
              className="p-2 rounded-lg text-gray-900 hover:bg-gray-100 border border-gray-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-red-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-6 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(link.href + "/");

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-3 text-sm font-black uppercase tracking-wider flex items-center justify-between border-b border-gray-100 ${
                    isActive ? "text-red-600" : "text-gray-800 hover:text-red-600"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-6 h-[2.5px] bg-red-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-3 flex flex-col gap-2.5">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="btn-yellow text-center py-3 rounded-lg text-xs font-black uppercase flex items-center justify-center gap-2"
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
