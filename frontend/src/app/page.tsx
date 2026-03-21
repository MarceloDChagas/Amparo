"use client";

import React, { useEffect, useState } from "react";

import {
  CTASection,
  FeaturesSection,
  Footer,
  HeroSection,
  HowItWorksSection,
  ImpactSection,
  Navbar,
  QuickAccessSection,
} from "@/components/landing";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar scrolled={scrolled} />
      <HeroSection />
      <QuickAccessSection />
      <HowItWorksSection />
      <ImpactSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
