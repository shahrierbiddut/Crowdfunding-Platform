"use client";

import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ImpactStats from "@/components/ImpactStats";
import TopFundedCampaigns from "@/components/TopFundedCampaigns";
import HowItWorks from "@/components/HowItWorks";
import CategoryExplorer from "@/components/CategoryExplorer";
import PlatformImpact from "@/components/PlatformImpact";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <HeroSlider />
        <ImpactStats />
        <TopFundedCampaigns />
        <HowItWorks />
        <CategoryExplorer />
        <PlatformImpact />
        <Testimonials />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
