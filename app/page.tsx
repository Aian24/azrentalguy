import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeOverview from "@/components/HomeOverview";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        <Hero />
        <HomeOverview />
      </main>
      <Footer />
    </div>
  );
}
