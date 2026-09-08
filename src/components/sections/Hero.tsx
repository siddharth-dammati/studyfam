"use client";

import { useRegistrationState } from "@/hooks/useRegistrationState";
import { useEffect, useState } from "react";
import { ArrowRight, Trophy, BarChart3, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

function ExamMockup() {
  const [answered, setAnswered] = useState(1);
  const questions = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    const id = setInterval(() => {
      setAnswered(a => Math.min(a + 1, 28));
    }, 800);
    return () => clearInterval(id);
  }, []);

  const getStatus = (q: number) => {
    if (q <= answered) return "answered";
    if (q === answered + 1) return "current";
    if (q <= answered + 4) return "visited";
    return "unseen";
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_20px_50px_rgba(10,13,20,0.12)] w-full max-w-[440px]">
      {/* Header */}
      <div className="bg-[#0A0D14] px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-slate-400 text-[10px] font-mono tracking-wider">ALL INDIA JEE MAIN 2027 CBT MOCK</span>
        <span className="text-emerald-400 text-[10px] font-mono font-bold">02:47:13</span>
      </div>

      {/* Subject tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {["Physics", "Chemistry", "Maths"].map((s, i) => (
          <div key={s} className={`flex-1 text-center py-2.5 text-xs font-semibold ${i === 0 ? "bg-white text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500"}`}>
            {s}
          </div>
        ))}
      </div>

      {/* Question */}
      <div className="p-5">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-3">
          <span>Question {answered + 1} of 30 · Single Correct</span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">+4 / −1</span>
        </div>
        <div className="space-y-1.5 mb-5">
          <div className="h-2 bg-slate-100 rounded w-full" />
          <div className="h-2 bg-slate-100 rounded w-4/5" />
          <div className="h-2 bg-slate-100 rounded w-3/5" />
        </div>
        <div className="space-y-2">
          {["A", "B", "C", "D"].map((opt, i) => (
            <div key={opt} className={`flex items-center gap-3 rounded-xl border px-3.5 py-2 text-xs font-medium ${i === 1 ? "border-indigo-400 bg-indigo-50/80 text-indigo-700" : "border-slate-200 text-slate-700 bg-white"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 1 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>{opt}</span>
              <div className="h-1.5 rounded flex-1 bg-current opacity-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Palette */}
      <div className="border-t border-slate-200 px-5 py-3.5 bg-slate-50/80">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-2">
          <span>National Question Palette</span>
          <span className="text-indigo-600 font-semibold">TCS iON Simulation</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {questions.slice(0, 20).map(q => {
            const s = getStatus(q);
            return (
              <div key={q} className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                s === "answered" ? "bg-emerald-500 text-white shadow-xs" :
                s === "current" ? "bg-indigo-600 text-white ring-2 ring-indigo-200" :
                s === "visited" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                "bg-white text-slate-500 border border-slate-200"
              }`}>{q}</div>
            );
          })}
          <div className="text-slate-400 text-[10px] flex items-center ml-1 font-mono">+10</div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-[9px] font-mono text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" /> Answered</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-indigo-600 inline-block" /> Current</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-amber-100 border border-amber-300 inline-block" /> Review</span>
        </div>
      </div>
    </div>
  );
}

export function Hero({ onOpenRegistration }: { onOpenRegistration: () => void }) {
  const { isOpen, days, hours, minutes, seconds, isClient } = useRegistrationState();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrder = localStorage.getItem("sf_confirmed_order_id");
      const storedRecord = localStorage.getItem("sf_candidate_record");
      if (storedOrder || storedRecord) {
        setIsEnrolled(true);
      }
    }
  }, []);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Subtle modern gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(10,13,20,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(10,13,20,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-32 lg:py-36 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Col (Span 7) */}
            <div className="lg:col-span-7">
              
              {/* National Event Badge */}
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-indigo-900 font-mono text-[11px] font-bold tracking-wide uppercase">
                  All India JEE Main Mock Test
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-700 font-mono text-[11px] font-bold">
                  27 Dec 2026 · 9:00 AM – 12:00 PM IST
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[clamp(2.6rem,5.2vw,4.8rem)] font-bold tracking-[-0.04em] leading-[0.96] text-slate-900 mb-6">
                All-India JEE Main Mock.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600">
                  Top Performers Win Their Exam Fees.
                </span>
              </h1>

              {/* Crystal Clear Proposition */}
              <p className="text-slate-700 text-lg sm:text-xl font-medium leading-relaxed mb-6 max-w-xl">
                Take India&apos;s unified Computer Based Test for JEE Main 2027. Benchmark your real national percentile against tens of thousands of serious aspirants—and <strong className="text-slate-950 underline decoration-emerald-500 decoration-2 underline-offset-4">win 100% of your official JEE application fees paid back</strong> as a merit scholarship if you rank among the top performers!
              </p>

              {/* 2 Clear Visual Pillar Cards: (1) 100% Fee Scholarships + (2) Accurate National Percentile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 max-w-xl">
                
                {/* Pillar 1: Win Fees Scholarship */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 mb-1">50% Merit + 50% Need Scholarships</h4>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      ₹18 of every ₹27 fee enters the pool. 50% awarded purely on mock rank (Top boys & girls) & 50% reserved for genuine need-based support.
                    </p>
                  </div>
                </div>

                {/* Pillar 2: More Students, More Accurate Data */}
                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">More Students · Real AIR</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      More students = more accurate data. Competing nationally gives you a statistically authentic, reliable All-India Rank (AIR).
                    </p>
                  </div>
                </div>

              </div>

              {/* Countdown & Action Bar */}
              {isClient && (
                <>
                  {!isOpen && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-3 text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Registration Opens In</span>
                      </div>
                      <div className="flex items-end gap-5">
                        {[{ label: "Days", v: days }, { label: "Hours", v: hours }, { label: "Minutes", v: minutes }, { label: "Seconds", v: seconds }].map((u, i) => (
                          <div key={i} className="text-center sm:text-left">
                            <div className="text-[clamp(2.4rem,4.5vw,3.8rem)] font-bold tabular-nums leading-none text-slate-900 tracking-tight">{pad(u.v)}</div>
                            <div className="text-slate-400 text-[10px] font-mono mt-1 uppercase tracking-wider">{u.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    {isEnrolled ? (
                      <Link href="/dashboard" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                          <span>✓ Mock Seat Confirmed — Enter Dashboard</span>
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    ) : (
                      <Button size="lg" onClick={onOpenRegistration} className="shadow-lg shadow-indigo-500/20">
                        {isOpen ? "Register for All-India Mock — ₹27" : "Get Notified for Mock Test — Free"}
                        <ArrowRight size={16} />
                      </Button>
                    )}
                    <Button size="lg" variant="secondary" onClick={() => document.getElementById("impact")?.scrollIntoView({ behavior: "smooth" })}>
                      View Scholarship Cutoff & Rules
                    </Button>
                  </div>

                  <p className="text-slate-500 text-xs font-mono mt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {isOpen 
                      ? "₹27 Entry · Registrations Now Open · Single National Slot: 27 Dec 2026 (9:00 AM – 12:00 PM IST)"
                      : "₹27 Entry · Opens Nov 27 · Single National Slot: 27 Dec 2026 (9:00 AM – 12:00 PM IST)"}
                  </p>
                </>
              )}

              {/* Trust & Guarantee Chips */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pan-India Participation</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Full NTA CBT Pattern (+4/−1)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Equal Boys & Girls Sponsorship</span>
              </div>

            </div>

            {/* Right Col: Interactive Mockup + Live Floating Badges (Span 5) */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center relative">
              <ExamMockup />
              
              {/* Floating Badge 1: Top Performers Win Full Fees */}
              <div className="absolute -top-7 -left-10 bg-white border border-emerald-200 rounded-2xl shadow-[0_12px_30px_rgba(16,185,129,0.15)] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg shrink-0">
                  🏆
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Win 100% JEE Exam Fees</div>
                  <div className="text-[10px] text-emerald-700 font-mono font-medium">
                    Top N Performers Get Full Reimbursement
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: All-India Rank & Percentile */}
              <div className="absolute -bottom-6 -right-6 bg-[#0A0D14] border border-slate-800 rounded-2xl shadow-[0_14px_35px_rgba(0,0,0,0.3)] px-5 py-3.5 text-white">
                <div className="text-indigo-400 text-[10px] font-mono font-bold tracking-wider uppercase mb-1">
                  Predict Your Real AIR
                </div>
                <div className="text-2xl font-bold tabular-nums leading-tight flex items-baseline gap-2">
                  <span>#4,219</span>
                  <span className="text-xs text-slate-400 font-normal">/ 12,847+ pool</span>
                </div>
                <div className="text-emerald-400 text-[11px] font-mono mt-1 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 99.12 Percentile Accuracy
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Subtle border bottom */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </section>
  );
}
