"use client";

import { ArrowRight, Share2, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ImpactReferralProps {
  onOpenRegistration?: () => void;
  onOpenShare?: () => void;
}

export function ImpactReferral({ onOpenRegistration, onOpenShare }: ImpactReferralProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_20px_60px_rgba(2,119,231,0.18)] bg-[#070E22]">
          
          {/* LinkedIn Wave Theme Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-screen pointer-events-none"
            style={{ backgroundImage: "url('/footer-theme-bg.png')" }}
          />

          {/* Gradient Overlay for 100% High Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050D24]/90 via-[#071333]/80 to-[#03091B]/95 pointer-events-none" />

          {/* Ambient Glow accents */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Content Container */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-center max-w-3xl mx-auto">
            
            {/* National Slot Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pan-India JEE Main 2027 CBT Mock</span>
            </div>

            {/* Main Motto from LinkedIn Theme */}
            <h2 className="text-[clamp(2.4rem,4.8vw,4rem)] font-extrabold text-white tracking-tight leading-[1.05] mb-4">
              Compete. Improve. Impact.
            </h2>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-normal">
              Take India&apos;s benchmark CBT mock test for ₹27. Test your preparation against tens of thousands of serious aspirants nationwide—and win 100% of your official JEE application fees paid back as a merit scholarship!
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {onOpenRegistration && (
                <Button 
                  size="lg" 
                  onClick={onOpenRegistration}
                  className="bg-white text-slate-950 hover:bg-slate-100 hover:text-black font-bold shadow-lg shadow-white/10 px-8"
                >
                  <span>Register for Mock — ₹27</span>
                  <ArrowRight size={16} />
                </Button>
              )}
              {onOpenShare && (
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={onOpenShare}
                  className="bg-cyan-950/70 border border-cyan-400/40 text-cyan-200 hover:text-white hover:bg-cyan-900/80 font-semibold"
                >
                  <Share2 size={16} />
                  <span>Challenge Study Groups</span>
                </Button>
              )}
            </div>

            {/* Value Highlights */}
            <div className="pt-6 border-t border-slate-700/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Fee Reimbursement
              </span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> TCS iON Exam Pattern (+4/−1)
              </span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ₹18 of ₹27 Escrowed to Students
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
