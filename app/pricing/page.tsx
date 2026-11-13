import React from "react";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Rental Pricing & Rates | AZ Rental Guy | J-Bone Industries",
  description:
    "Transparent equipment rental pricing in Arizona. Daily, weekly, and 4-week rates with $150 flat Valley delivery and zero hidden fees.",
};

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <PageHero
          title="Commercial Rental"
          highlightText="Pricing & Policies"
          subtitle="Simple daily, weekly, and 4-week rates with no hidden fees. Generous engine hour caps, $150 flat Valley-wide delivery, and optional physical damage protection."
          primaryCtaText="Book Equipment Online"
          primaryCtaHref="/book-now"
          secondaryCtaText="Explore Machinery"
          secondaryCtaHref="/equipment"
        />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
