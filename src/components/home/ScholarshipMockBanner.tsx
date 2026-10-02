"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  Calendar,
  Users,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck,
} from "lucide-react";

export function ScholarshipMockBanner() {
  // Target Registration Date: 20 October 2026
  const targetRegDate = new Date("2026-10-20T00:00:00+05:30").getTime();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetRegDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetRegDate]);

  return (
    <section id="all-india-mock" className="py-20 sm:py-28 bg-[#F8FAFC] text-slate-900 border-b border-slate-200/90 relative overflow-hidden scroll-mt-20">
      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Flagship Spotlight Container with Rich Slate & Emerald Contrast */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#064E3B] text-white border border-slate-700/60 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl">
          
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Banner Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.1]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Trophy size={14} className="text-emerald-400" />
              <span>Flagship National Scholarship Examination</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Registration Status:</span>
              <span className="text-amber-300 font-bold">Opens 20 October 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left 7 Columns: Event Details & Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight text-white leading-tight mb-3">
                  All-India Major Mock Test 2027:{" "}
                  <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300">
                    Win 100% of Your Official NTA Exam Fees Back!
                  </span>
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Beyond our 10 free full-length mocks, StudyFAM hosts India&apos;s largest community-funded scholarship test on <strong>Sunday, 27 December 2026</strong>. For a nominal ₹27 fee, exactly <strong>₹18 is transparently escrowed</strong> into a public merit pool to refund 100% of official NTA JEE Main Application Fees (<strong>₹1,000 for Boys / ₹800 for Girls</strong>).
                </p>
              </div>

              {/* Key Registration & Exam Dates Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-white/[0.05] border border-amber-400/40 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-md">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                      Registrations Start Date
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      20 October 2026
                    </div>
                    <div className="text-[11px] text-slate-400">Early bird registration opens online</div>
                  </div>
                </div>

                <div className="bg-white/[0.05] border border-emerald-400/40 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-md">
                  <div className="w-9 h-9 rounded-xl bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                      Official Exam Date &amp; Slot
                    </div>
                    <div className="text-sm font-extrabold text-white mt-0.5">
                      27 December 2026
                    </div>
                    <div className="text-[11px] text-slate-400">9:00 AM – 12:00 PM IST (Single Shift)</div>
                  </div>
                </div>
              </div>

              {/* 3 Value Pillars */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span><strong>50% Pure Merit Track:</strong> Top rankers awarded 100% NTA fee refund strictly by mock percentile, zero income check.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span><strong>50% Need-Based Track:</strong> Dedicated scholarship quota for deserving aspirants from economically weaker backgrounds.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span><strong>100% Financial Transparency:</strong> Live public escrow ledger tracking every single ₹18 deposited and disbursed via DBT.</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/all-india-mock"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-2xl text-sm font-extrabold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] text-center"
                >
                  <Trophy size={16} />
                  <span>Explore All-India Mock Details</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/scholarship-rules"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] text-white rounded-2xl text-xs font-bold transition-all text-center"
                >
                  <FileCheck size={14} />
                  <span>Read SF-SCH-2027 Rules</span>
                </Link>

                <Link
                  href="/transparency"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-2xl text-xs font-semibold transition-all text-center"
                >
                  <span>Public Ledger</span>
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Countdown & Escrow Mechanism Card */}
            <div className="lg:col-span-5 bg-black/40 border border-white/[0.1] rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6">
              
              {/* Countdown Module */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-amber-300 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <Clock size={13} />
                    Registration Launch Countdown
                  </span>
                  <span className="text-slate-400">20 Oct 2026</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-2.5">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {String(timeLeft.days).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">Days</div>
                  </div>
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-2.5">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">Hours</div>
                  </div>
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-2.5">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">
                      {String(timeLeft.mins).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">Mins</div>
                  </div>
                  <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-2.5">
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                      {String(timeLeft.secs).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">Secs</div>
                  </div>
                </div>
              </div>

              {/* Escrow Pool Math Breakdown */}
              <div className="space-y-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-200 border-b border-white/[0.08] pb-2 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Coins size={14} className="text-emerald-400" />
                    Registration Fee Structure
                  </span>
                  <span className="text-emerald-400">₹27 per candidate</span>
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span>Direct Merit Escrow Pool:</span>
                  <span className="text-white font-bold">₹18 (66.7%)</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Cloud CBT Servers &amp; Bandwidth:</span>
                  <span className="text-slate-400">₹9 (33.3%)</span>
                </div>

                <div className="border-t border-white/[0.08] pt-2 flex items-center justify-between text-emerald-300 text-[11px]">
                  <span>Refund Per Male Winner:</span>
                  <span className="font-bold">₹1,000 (100% NTA Fee)</span>
                </div>

                <div className="flex items-center justify-between text-emerald-300 text-[11px]">
                  <span>Refund Per Female Winner:</span>
                  <span className="font-bold">₹800 (100% NTA Fee)</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2.5 text-[11px] text-slate-300 pt-1">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>Audited public disbursements via Direct Benefit Transfer (DBT) directly to candidate bank accounts.</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
