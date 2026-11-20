"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { COMPANY_INFO } from "@/lib/fleet";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [loadedAt] = useState(() => Date.now());
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          honeypot,
          clientLoadedAt: loadedAt,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Submission could not be completed.");
        setIsSubmitting(false);
        return;
      }

      setSent(true);
    } catch (err: any) {
      setErrorMessage("Network error sending inquiry. Please call our dispatch line directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="Contact" className="scroll-mt-20 sm:scroll-mt-24 py-12 sm:py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER - NO BADGE PER USER REQUEST */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Contact J-Bone Industries
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
            Professional Equipment Rental • Direct dispatch line across Phoenix, Scottsdale, and Cave Creek, AZ.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT: DIRECT CONTACT CARDS (FILLED SOLID ACCENTS) */}
          <div className="lg:col-span-5 space-y-4">
            <ScrollReveal delay={100}>
              <div className="rounded-3xl p-6 sm:p-7 bg-red-50 border-2 border-red-200 shadow-md hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-red-700 uppercase tracking-wider">
                      Direct Dispatch Phone
                    </div>
                    <a
                      href={`tel:${COMPANY_INFO.phoneRaw}`}
                      className="text-xl sm:text-2xl font-black text-red-600 hover:underline"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-3 font-medium">
                  Available 7 days a week for immediate equipment dispatch and Valley delivery scheduling.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="rounded-3xl p-6 sm:p-7 bg-yellow-50 border-2 border-yellow-200 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#E5A919] text-white flex items-center justify-center shadow-md shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-yellow-900 uppercase tracking-wider">
                      Email Inquiries
                    </div>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-base sm:text-lg font-black text-gray-950 hover:underline"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-3 font-medium">
                  Send jobsite specifications, contractor COIs, or custom long-term rental inquiries.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="rounded-3xl p-6 sm:p-7 bg-slate-50 border-2 border-slate-200 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-md shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-500 uppercase tracking-wider">
                      Yard Location
                    </div>
                    <div className="text-base font-black text-gray-950">
                      Cave Creek / Scottsdale, Arizona
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-3 font-medium">
                  Serving the entire Phoenix Metropolitan area with prompt $150 flat jobsite delivery.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT: MODERN MESSAGE FORM (FILLED CONTAINER) */}
          <ScrollReveal delay={200} className="lg:col-span-7 rounded-3xl p-6 sm:p-10 bg-slate-50 border-2 border-gray-200 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-black text-gray-950 mb-1 tracking-tight">
              Send a Direct Message
            </h3>
            <p className="text-xs text-gray-500 mb-6 font-medium">
              Our team responds promptly to all equipment and scheduling inquiries.
            </p>

            {sent ? (
              <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl text-center">
                <CheckCircle2 className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h4 className="text-xl font-black text-gray-950">Inquiry Received!</h4>
                <p className="text-xs text-gray-600 mt-1.5 max-w-sm mx-auto font-medium">
                  Thank you, {formData.name}. We will review your project details and reach out shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="btn-yellow px-5 py-2.5 rounded-xl text-xs font-black uppercase mt-5"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-red-900 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                {/* ANTI-SPAM HONEYPOT FIELD (Hidden from humans, filled by bots) */}
                <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                  <label htmlFor="hp_company_website">Company Website (Leave Blank)</label>
                  <input
                    id="hp_company_website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50/60 hover:bg-white focus:bg-white border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-900 focus:border-red-600 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(602) 555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50/60 hover:bg-white focus:bg-white border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-900 focus:border-red-600 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50/60 hover:bg-white focus:bg-white border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-900 focus:border-red-600 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-800 mb-2">
                    Your Project &amp; Machine Needs
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what machine you need, delivery address, and requested dates..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-50/60 hover:bg-white focus:bg-white border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-900 focus:border-red-600 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-red flex-1 py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-101 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Sending..." : "Send Inquiry"}</span>
                  </button>
                  <a
                    href={`tel:${COMPANY_INFO.phoneRaw}`}
                    className="btn-yellow flex-1 py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md hover:scale-101 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Dispatch</span>
                  </a>
                </div>

                <p className="text-[11px] text-gray-500 text-center font-medium mt-2">
                  Protected by Anti-Spam Bot Filter • Dispatches directly to <strong className="text-gray-700">jbone@azrentalguy.com</strong>
                </p>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
