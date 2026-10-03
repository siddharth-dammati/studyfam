"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Sparkles, Trophy, BookOpen, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="bg-slate-50 text-slate-600 text-xs border-t border-slate-200/90">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center">
              <Logo inverted={false} className="h-8 shrink-0" />
            </Link>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              StudyFAM is India&apos;s premier community-driven JEE Main preparation portal. We provide 10 full-length NTA CBT mock tests and 400+ chapter-wise practice tests 100% free with complete step-by-step textbook solutions.
            </p>

            <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 shadow-xs">
              <Sparkles size={14} className="text-emerald-600 shrink-0" />
              <span>Free Forever · Authentic NTA CBT Interface · 0 Fees</span>
            </div>
          </div>

          {/* Col 3: 10 Free Full Mocks */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-900 tracking-wider">
              10 Free Full Mocks
            </div>
            <ul className="space-y-2">
              {[
                { name: "Full Mock Test 01 (MFT-01)", href: "/exam/player?id=MFT-1.pdf" },
                { name: "Full Mock Test 02 (MFT-02)", href: "/exam/player?id=MFT-2.pdf" },
                { name: "Full Mock Test 03 (MFT-03)", href: "/exam/player?id=MFT-3.pdf" },
                { name: "Full Mock Test 04 (MFT-04)", href: "/exam/player?id=MFT-4.pdf" },
                { name: "Full Mock Test 05 (MFT-05)", href: "/exam/player?id=MFT-5.pdf" },
                { name: "Full Mock Tests 06–10", href: "#free-mocks" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-indigo-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Chapter Tests & Practice */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-900 tracking-wider">
              Question Banks &amp; Events
            </div>
            <ul className="space-y-2">
              {[
                { name: "Physics Chapter Tests (110+)", href: "/exam" },
                { name: "Chemistry Chapter Tests (125+)", href: "/exam" },
                { name: "Mathematics Chapter Tests (105+)", href: "/exam" },
                { name: "All-India Scholarship Mock (27 Dec)", href: "/all-india-mock" },
                { name: "Official Scholarship Rules", href: "/scholarship-rules" },
                { name: "Candidate Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-indigo-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Transparency & Legal */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-900 tracking-wider">
              Platform &amp; Legal
            </div>
            <ul className="space-y-2">
              {[
                { name: "Financial Transparency Ledger", href: "/transparency" },
                { name: "About StudyFAM", href: "/about" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms & Conditions", href: "/terms" },
                { name: "Refund Policy", href: "/refund-policy" },
                { name: "Contact & Support", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-indigo-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} StudyFAM Education. Built for Indian Engineering Aspirants.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              NTA CBT Simulation Active
            </span>
            <span>All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
