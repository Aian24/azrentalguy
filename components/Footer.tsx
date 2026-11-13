import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldAlert, ExternalLink, ArrowUp } from "lucide-react";
import { COMPANY_INFO, FLEET } from "@/lib/fleet";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t-2 border-yellow-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* COL 1: REAL LOGO & COMPANY INFO */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.webp"
                alt="J-Bone Industries - AZ Rental Guy"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-600 text-xs leading-relaxed">
              Professional heavy machinery, utility tractors, and commercial trailers operated by {COMPANY_INFO.legalName}. Valley-wide delivery across Phoenix, Scottsdale, and Cave Creek.
            </p>
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center gap-2 text-gray-800 font-bold">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
                <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="hover:text-red-600">
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-800 font-bold">
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-red-600">
                  {COMPANY_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-800 font-bold">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>Cave Creek / Scottsdale, Arizona</span>
              </div>
            </div>
          </div>

          {/* COL 2: REAL NAVBAR SHORTCUTS */}
          <div>
            <h4 className="text-gray-950 font-black text-xs uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2.5 font-bold">
              <li>
                <Link href="/" className="hover:text-red-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="hover:text-red-600 transition-colors">
                  Equipment Fleet
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-red-600 transition-colors">
                  Rental Pricing
                </Link>
              </li>
              <li>
                <Link href="/book-now" className="hover:text-red-600 transition-colors text-red-600">
                  Book Now (48-Hr Hold)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3: STATUTORY & LEGAL COMPLIANCE */}
          <div>
            <h4 className="text-gray-950 font-black text-xs uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
              Statutory Disclosures
            </h4>
            <ul className="space-y-2.5 text-gray-600 font-medium">
              <li>
                <a
                  href="https://www.arizona811.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 flex items-center gap-1.5 font-bold text-red-700"
                >
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>A.R.S. § 40-360.21 (AZ 811)</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                </a>
              </li>
              <li>Operating Hours: 8h/day, 40h/wk, 160h/mo</li>
              <li>Overtime Rate: $75.00 / hour</li>
              <li>Damage Waiver: Optional 10% (0 Deductible)</li>
              <li>Security Deposit: $500 Refundable Hold</li>
              <li>Valley Delivery &amp; Pickup: $150 Flat Fee</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-bold">
          <div>
            &copy; {new Date().getFullYear()} {COMPANY_INFO.legalName} ({COMPANY_INFO.name}). All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="text-red-600">A.R.S. Arizona 811 Verified</span>
            <span>•</span>
            <span>Maricopa County Licensed</span>
            <span>•</span>
            <span className="text-yellow-600">Valley-Wide Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
