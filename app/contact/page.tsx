import React from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/ContactSection";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact US | AZ Rental Guy | J-Bone Industries",
  description:
    "Contact J-Bone Industries LLC for equipment rentals in Arizona. Call (707) 326-5592 or email jbone@azrentalguy.com for fast Valley-wide jobsite dispatch.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        {/* CENTERED HERO - EXCLUDING IMAGE PER USER REQUEST */}
        <PageHero
          title="Contact Our Valley"
          highlightText="Equipment Team"
          subtitle="Direct phone dispatch, email inquiries, and jobsite delivery scheduling across Maricopa County. We are available 7 days a week to keep your project moving."
          primaryCtaText="Book Equipment Online"
          primaryCtaHref="/book-now"
          secondaryCtaText="Explore Machine Fleet"
          secondaryCtaHref="/equipment"
        />
        <ContactSection />
        <ServiceAreaMap />
      </main>
      <Footer />
    </div>
  );
}
