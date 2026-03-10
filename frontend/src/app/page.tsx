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
  QuickExitButton,
} from "@/components/landing";
import { colors } from "@/styles/colors";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.functional.background.primary }}
    >
      <QuickExitButton />
      <Navbar scrolled={scrolled} />
      <HeroSection />
      <HowItWorksSection />
      <ImpactSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
