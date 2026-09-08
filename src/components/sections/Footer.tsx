"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ShieldCheck, HeartHandshake } from "lucide-react";

const links = {
  "Mock Examination": [
    { label: "Why This Mock", href: "/#why-mock" },
    { label: "Exam Pattern (NTA Aligned)", href: "/#exam-pattern" },
    { label: "Predicted Percentile Engine", href: "/#why-mock" },
    { label: "Frequently Asked Questions", href: "/#faq" },
  ],
  "Scholarship & Impact": [
    { label: "Fee Support Rules & Policy", href: "/scholarship-rules" },
    { label: "Financial Audit & Transparency", href: "/transparency" },
    { label: "Top N Eligibility & Verification", href: "/scholarship-rules#eligibility" },
    { label: "Gender Parity Model (1000 Math)", href: "/scholarship-rules#formula" },
    { label: "Live Milestone Ledger", href: "/#impact" },
  ],
  "Legal & Compliance": [
    { label: "Privacy Policy (DPDP Act 2023)", href: "/privacy" },
    { label: "Terms of Service & Test Conduct", href: "/terms" },
    { label: "Cancellation & Refund Policy", href: "/refund-policy" },
    { label: "Statutory Grievance Redressal", href: "/contact#grievance" },
    { label: "NTA Non-Affiliation Notice", href: "/terms#disclaimer" },
  ],
  "Organization": [
    { label: "About StudyFam Technologies", href: "/about" },
    { label: "Candidate Support Desk", href: "/contact" },
    { label: "Academic Advisory Board", href: "/about#advisory" },
    { label: "Escrow Reserve Statement", href: "/transparency#escrow" },
  ],
};

export function Footer() {
  return (
    <footer className="relative text-white overflow-hidden bg-[#032575] border-t-2 border-cyan-300/50 shadow-[0_-12px_45px_rgba(2,80,163,0.35)]">
      {/* LinkedIn Theme Vibrant Blue Background Asset */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/footer-theme-bg.png')" }}
      />
      
      {/* Deep-blue contrast enhancement layer ensuring 100% razor-sharp readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#021748]/65 via-[#032470]/40 to-[#011442]/80 pointer-events-none" />

      {/* Radiant ambient glow accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-80 bg-[radial-gradient(ellipse_at_top,rgba(0,210,255,0.3)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-64 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,210,0.2)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 py-16">
          
          {/* Brand & Mission Statement Col (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="inline-block">
              <Logo className="h-8" textClassName="text-xl text-white" inverted={true} />
            </div>
            
            <p className="text-white text-sm leading-relaxed max-w-sm font-medium drop-shadow-[0_1px_2px_rgba(0,10,35,0.7)]">
              The national-scale JEE Main 2027 mock test platform. Predict your All-India Rank with statistically robust sample sizes while powering 100% exam fee scholarships for deserving peers.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#021B5A]/85 border border-cyan-300/50 text-white text-xs font-mono font-semibold shadow-md backdrop-blur-sm">
                <HeartHandshake className="w-4 h-4 text-cyan-300" />
                <span className="drop-shadow-[0_1px_1px_rgba(0,10,35,0.8)]">₹18 of ₹27 → Escrowed Fee Support Pool</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-100 pt-0.5 font-semibold drop-shadow-[0_1px_1px_rgba(0,10,35,0.8)]">
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                <span>Audited Social Enterprise Model · DPDP Act Compliant</span>
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-white space-y-1.5 drop-shadow-[0_1px_2px_rgba(0,10,35,0.7)]">
              <p>National Exam Slot: <strong className="text-cyan-200 font-bold ml-1">27 December 2027 · 20:27 IST</strong></p>
              <p>Standard Entry Fee: <strong className="text-cyan-200 font-bold ml-1">₹27 Only (All Taxes Included)</strong></p>
            </div>
          </div>

          {/* 4 Link Columns (1 col each) */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,10,35,0.9)]">
                <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,1)] shrink-0" />
                <span>{category}</span>
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs text-white hover:text-cyan-200 hover:underline hover:decoration-cyan-300 transition-colors duration-150 inline-block leading-relaxed font-medium drop-shadow-[0_1px_1px_rgba(0,10,35,0.6)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Statutory Disclaimers Bar */}
        <div className="py-6 border-t-2 border-white/25 text-xs text-white leading-relaxed space-y-2 drop-shadow-[0_1px_2px_rgba(0,10,35,0.7)] font-normal">
          <p>
            <strong className="text-white font-bold underline decoration-cyan-400/50 underline-offset-2">Statutory Non-Affiliation Disclaimer:</strong> StudyFam is an independent testing and analytics platform operated by StudyFam Technologies Pvt. Ltd. StudyFam is not affiliated, endorsed, or associated with the National Testing Agency (NTA), the Ministry of Education, or the Joint Entrance Examination (JEE) board. All trade names, acronyms, and exam pattern standards are cited solely under statutory fair use doctrine for preparatory reference.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-white/25 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white font-mono drop-shadow-[0_1px_1px_rgba(0,10,35,0.6)]">
          <p className="font-semibold text-white">© 2027 StudyFam Technologies Private Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5 text-xs">
            <Link href="/privacy" className="text-white hover:text-cyan-200 hover:underline transition-colors font-medium">Privacy</Link>
            <Link href="/terms" className="text-white hover:text-cyan-200 hover:underline transition-colors font-medium">Terms</Link>
            <Link href="/refund-policy" className="text-white hover:text-cyan-200 hover:underline transition-colors font-medium">Refunds</Link>
            <Link href="/scholarship-rules" className="text-white hover:text-cyan-200 hover:underline transition-colors font-medium">Scholarship Rules</Link>
            <Link href="/transparency" className="text-white hover:text-cyan-200 hover:underline transition-colors font-medium">Transparency</Link>
            <Link href="/contact" className="text-white hover:text-cyan-200 hover:underline transition-colors font-medium">Grievance</Link>
            <span className="text-white font-bold bg-[#021B5A]/90 px-3 py-1 rounded-full border border-cyan-300/40 text-[11px] shadow-sm">
              🇮🇳 Pan-India Initiative
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
