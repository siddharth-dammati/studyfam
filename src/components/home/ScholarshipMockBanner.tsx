"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Award, Sparkles, ArrowRight, Calendar, Users, HeartHandshake } from "lucide-react";

export function ScholarshipMockBanner() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-500/30">
          
          {/* Subtle glowing elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col (Span 8) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Trophy size={14} className="text-emerald-400" />
                <span>Flagship National Event · 27 December 2026</span>
              </div>

              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold tracking-tight leading-tight">
                All-India JEE Main 2027 Mock Test:{" "}
                <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">
                  Win 100% of Your Official NTA Exam Fees Back!
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Beyond our 10 free full mocks, StudyFAM conducts a nationwide mock test on <strong>27 Dec 2026</strong>. ₹18 of every ₹27 fee is escrowed to refund 100% of the official NTA JEE fees (₹1,000 Boys / ₹800 Girls) across <strong>50% Merit + 50% Need-Based tracks</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-emerald-400" />
                  <span>27 Dec 2026 · 9 AM – 12 PM</span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1.5">
                  <Award size={13} className="text-indigo-400" />
                  <span>50% Merit · 50% Need-Based</span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-300 font-bold">
                  Registrations Open 20 Oct 2026
                </span>
              </div>
            </div>

            {/* Right Col (Span 4) */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                href="/all-india-mock"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-sm font-extrabold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] text-center"
              >
                <span>Explore Scholarship Mock</span>
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/scholarship-rules"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-2xl text-xs font-bold transition-all text-center"
              >
                <span>Read SF-SCH-2027 Rules</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
