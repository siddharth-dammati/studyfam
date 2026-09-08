"use client";

import { useState } from "react";
import { useRegistrationState } from "@/hooks/useRegistrationState";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { StatsTicker } from "@/components/sections/StatsTicker";
import { ImpactProgress } from "@/components/sections/ImpactProgress";
import { WhyMock } from "@/components/sections/WhyMock";
import { ExamPattern } from "@/components/sections/ExamPattern";
import { FeeSupportBreakdown } from "@/components/sections/FeeSupportBreakdown";
import { ImpactReferral } from "@/components/sections/ImpactReferral";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { RegistrationModal } from "@/components/ui/RegistrationModal";
import { ShareModal } from "@/components/ui/ShareModal";

export default function Home() {
  const [isRegOpen, setRegOpen] = useState(false);
  const [isShareOpen, setShareOpen] = useState(false);
  const { isOpen } = useRegistrationState();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar onOpenRegistration={() => setRegOpen(true)} />

      <main>
        <Hero onOpenRegistration={() => setRegOpen(true)} />
        <StatsTicker />
        <ImpactProgress />
        <WhyMock />
        <ExamPattern />
        <FeeSupportBreakdown />
        <ImpactReferral 
          onOpenRegistration={() => setRegOpen(true)} 
          onOpenShare={() => setShareOpen(true)} 
        />
        <FAQ />
      </main>

      <Footer />

      <RegistrationModal
        isOpen={isRegOpen}
        onClose={() => setRegOpen(false)}
        isMockOpen={isOpen}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
        isMockOpen={isOpen}
      />
    </div>
  );
}
