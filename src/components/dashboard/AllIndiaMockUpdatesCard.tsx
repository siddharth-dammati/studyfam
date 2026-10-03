"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Award,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Monitor,
  CheckCircle2,
  Sparkles,
  Trophy,
  HelpCircle,
  Lock,
  Printer,
  ArrowRight,
} from "lucide-react";
import { CandidateRecord } from "./CandidateRegistrationCard";

interface AllIndiaMockUpdatesCardProps {
  candidateRecord?: CandidateRecord | null;
  onSwitchToPractice?: () => void;
}

export function AllIndiaMockUpdatesCard({
  candidateRecord,
  onSwitchToPractice,
}: AllIndiaMockUpdatesCardProps) {
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);
  const [showPatternDetails, setShowPatternDetails] = useState(false);

  // Live countdown to Sunday, 27 Dec 2026 at 09:00 AM IST
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date("2026-12-27T09:00:00+05:30").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const isConfirmed =
    candidateRecord?.amount_paid && candidateRecord.amount_paid >= 27;

  const rollNumber = candidateRecord?.order_id
    ? `SF-${candidateRecord.order_id.slice(-6).toUpperCase()}`
    : candidateRecord?.id
    ? `SF-${candidateRecord.id.slice(0, 6).toUpperCase()}`
    : "SF-CANDIDATE";

  return (
    <div className="space-y-6">
      {/* Main Unified All-India Mock Command Center */}
      <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_-25px_rgba(10,28,150,0.08)] relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0a1c96] via-[#1a5fe0] to-[#16a34a]" />

        {/* Header with Live Broadcast Pulse */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/80 px-3 py-1 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Official Exam Command Center</span>
              </span>
              <span className="text-xs font-mono text-slate-400">JEE Main 2027 Blueprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1a1a] tracking-tight">
              All-India JEE Main 2027 Mock Test
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sunday, 27 Dec 2026 · 09:00 AM – 12:00 PM IST · ₹27 Entry (₹18 scholarship pool + ₹9 ops) · Registrations open 20 Oct 2026.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!isConfirmed && (
              <Link
                href="/all-india-mock"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] hover:shadow-[0_14px_30px_-10px_rgba(26,95,224,0.5)] text-white rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer hover:-translate-y-0.5 active:scale-95"
              >
                <span>Register for ₹27 →</span>
              </Link>
            )}
            <Link
              href="/admit-card"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-[rgba(26,26,26,0.1)] text-[#0a1c96] hover:border-[#1a5fe0]/40 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer hover:-translate-y-0.5 active:scale-95"
            >
              <FileText size={15} />
              <span>{isConfirmed ? "Download Admit Card" : "Admit Card Specimen"}</span>
            </Link>
          </div>
        </div>

        {/* Countdown & Candidate Seat Banner - Tokko Schol Gradient with Dot Matrix */}
        <div className="bg-gradient-to-br from-[#081680] via-[#123aC8] to-[#1f6ff2] rounded-[26px] p-6 sm:p-8 text-white mb-6 shadow-[0_20px_45px_-18px_rgba(10,28,150,0.45)] relative overflow-hidden">
          {/* Subtle dot matrix overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 -z-0"
            style={{
              backgroundImage: "radial-gradient(rgba(214,174,242,.35) 1.2px, transparent 1.8px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Countdown timer */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs border border-white/15 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-indigo-100">
                <Clock size={13} className="text-[#d6aef2]" />
                <span>Time Remaining Until Examination</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
                {[
                  { label: "Days", val: timeLeft.days },
                  { label: "Hours", val: timeLeft.hours },
                  { label: "Mins", val: timeLeft.minutes },
                  { label: "Secs", val: timeLeft.seconds },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="bg-black/25 backdrop-blur-md border border-white/15 rounded-2xl p-3 sm:p-3.5 text-center min-w-[65px] shadow-inner"
                  >
                    <div className="text-2xl sm:text-4xl font-mono font-bold text-white tabular-nums tracking-tight">
                      {String(val).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-blue-200 uppercase font-mono tracking-wider mt-1 font-semibold">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Seat Lock Status */}
            <div className="bg-black/20 backdrop-blur-md border border-white/15 rounded-2xl p-5 lg:max-w-xs w-full flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-100 font-bold">
                  Candidate Seat
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 flex items-center gap-1 shadow-2xs">
                  <CheckCircle2 size={11} />
                  <span>{isConfirmed ? "Seat Locked" : "Registered"}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-indigo-200">Candidate Roll No:</div>
                <div className="font-mono text-lg sm:text-xl font-bold text-white tracking-wider">
                  {rollNumber}
                </div>
                <div className="text-xs text-indigo-200/90 font-medium pt-0.5">
                  {candidateRecord?.full_name || "Verified Aspirant"} · Shift 1 (09:00 AM)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Shift Schedule & Exam Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card 1: Exam Date & Day */}
          <div className="bg-[#fafafa] border border-[rgba(26,26,26,0.08)] rounded-[22px] p-5 flex flex-col justify-between hover:border-[#1a5fe0]/30 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-slate-400">Exam Schedule</span>
              <div className="w-7 h-7 rounded-xl bg-[#e9f1fd] text-[#1a5fe0] flex items-center justify-center">
                <Calendar size={14} />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight">
                Sunday, 27 Dec 2026
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                <Clock size={12} className="text-slate-400" />
                <span>180 Mins (3.0 Hours) · 75 Questions</span>
              </div>
            </div>
          </div>

          {/* Card 2: Shift Timings */}
          <div className="bg-[#fafafa] border border-[rgba(26,26,26,0.08)] rounded-[22px] p-5 flex flex-col justify-between hover:border-[#1a5fe0]/30 transition-all">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-slate-400">Shift Allocations</span>
              <div className="w-7 h-7 rounded-xl bg-[#f3e9fd] text-[#7c3aed] flex items-center justify-center">
                <Clock size={14} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span>Shift 1 (Forenoon):</span>
                <span className="font-mono text-[#0a1c96] font-bold">09:00 AM – 12:00 PM</span>
              </div>
              <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span>Shift 2 (Afternoon):</span>
                <span className="font-mono text-[#0a1c96] font-bold">03:00 PM – 06:00 PM</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Reporting: 08:00 AM · Gate Closes: 08:30 AM
              </div>
            </div>
          </div>

          {/* Card 3: Merit Pool & Rewards */}
          <div className="bg-gradient-to-br from-[#dcfce7]/60 to-[#e9f1fd]/60 border border-[#86efac]/80 rounded-[22px] p-5 flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-emerald-700 text-xs mb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold">100% Fee Refund Scholarship</span>
              <div className="w-7 h-7 rounded-xl bg-white text-[#16a34a] shadow-2xs flex items-center justify-center">
                <Trophy size={14} />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-950 tracking-tight">
                ₹18 of ₹27 Pooled
              </div>
              <div className="text-xs text-emerald-800 mt-1 font-semibold">
                Top 20 to Top 1,000 Winners (50% Merit + 50% Need-Based)
              </div>
            </div>
          </div>
        </div>

        {/* Proctored Anti-Cheat & Security Policy Banner */}
        <div className="bg-[#fafafa] border border-[rgba(26,26,26,0.08)] rounded-[24px] p-5 sm:p-6 mb-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#e9f1fd] text-[#1a5fe0] border border-[#1a5fe0]/20 flex items-center justify-center shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1a1a1a] tracking-tight flex items-center gap-2">
                  <span>TCS iON CBT Proctored Anti-Cheat Security Active</span>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a] border border-[#86efac]/70">
                    Enforced
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated browser lockdowns ensure authentic All-India Rank calculations.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSecurityDetails(!showSecurityDetails)}
              className="text-xs font-semibold text-[#0a1c96] hover:text-[#1a5fe0] px-3.5 py-1.5 rounded-full bg-white border border-[rgba(26,26,26,0.08)] flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-auto shadow-2xs active:scale-95 transition-all"
            >
              <span>{showSecurityDetails ? "Hide Protocols" : "View Protocols"}</span>
              {showSecurityDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Expandable Anti-Cheat Directives */}
          {showSecurityDetails && (
            <div className="pt-3 border-t border-[rgba(26,26,26,0.08)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 animate-fadeIn">
              <div className="p-3.5 bg-white rounded-2xl border border-[rgba(26,26,26,0.08)] space-y-1 shadow-2xs">
                <div className="font-bold text-[#0a1c96] flex items-center gap-1.5">
                  <Monitor size={14} /> Auto Full-Screen
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  The test player locks into mandatory Full-Screen mode upon clicking Proceed. Exiting prompts an immediate re-entry modal.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[rgba(26,26,26,0.08)] space-y-1 shadow-2xs">
                <div className="font-bold text-rose-600 flex items-center gap-1.5">
                  <ShieldAlert size={14} /> 3-Strike Tab Lockout
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Switching tabs or unfocusing the window is tracked in real-time. On the 4th violation (&gt;3 exits), the exam is auto-submitted instantly.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[rgba(26,26,26,0.08)] space-y-1 shadow-2xs">
                <div className="font-bold text-amber-600 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Sandbox Restrictions
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Clipboard copy/paste, right-click context menu, PrintScreen, and DevTools shortcuts (F12, Ctrl+U) are permanently disabled.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Official Syllabus & Paper Structure */}
        <div className="border border-[rgba(26,26,26,0.08)] rounded-[24px] p-5 sm:p-6 mb-5 space-y-3 bg-[#fafafa]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[rgba(26,26,26,0.08)] text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1a1a1a] tracking-tight">
                  Official Paper Pattern · NTA JEE Main Standard (75 Questions)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  300 Total Marks · Physics, Chemistry &amp; Mathematics (25 Questions each).
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPatternDetails(!showPatternDetails)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(26,26,26,0.08)] flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-auto shadow-2xs active:scale-95 transition-all"
            >
              <span>{showPatternDetails ? "Hide Pattern" : "View Pattern"}</span>
              {showPatternDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showPatternDetails && (
            <div className="pt-3 border-t border-[rgba(26,26,26,0.08)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fadeIn">
              <div className="p-3.5 bg-white rounded-2xl border border-[rgba(26,26,26,0.08)] shadow-2xs">
                <div className="font-bold text-[#0a1c96] mb-1">Physics (25 Qs · 100M)</div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>• Section A: 20 MCQs (+4, -1)</div>
                  <div>• Section B: 5 Numerical (+4, -1)</div>
                  <div>• Coverage: Class 11 &amp; 12 Full Syllabus</div>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[rgba(26,26,26,0.08)] shadow-2xs">
                <div className="font-bold text-emerald-700 mb-1">Chemistry (25 Qs · 100M)</div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>• Section A: 20 MCQs (+4, -1)</div>
                  <div>• Section B: 5 Numerical (+4, -1)</div>
                  <div>• Physical, Organic &amp; Inorganic</div>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[rgba(26,26,26,0.08)] shadow-2xs">
                <div className="font-bold text-[#7c3aed] mb-1">Mathematics (25 Qs · 100M)</div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>• Section A: 20 MCQs (+4, -1)</div>
                  <div>• Section B: 5 Numerical (+4, -1)</div>
                  <div>• Calculus, Algebra, Coordinate &amp; Vectors</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action bar linking to Practice or Admit Card */}
        <div className="pt-4 border-t border-[rgba(26,26,26,0.08)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-600">
            <Link
              href="/admit-card"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-[#0a1c96] px-3.5 py-1.5 rounded-full bg-[#fafafa] hover:bg-white border border-[rgba(26,26,26,0.06)] transition-all shadow-2xs"
            >
              <Printer size={13} className="text-emerald-600" />
              <span>Print Official Hall Ticket</span>
            </Link>
            <Link
              href="/scholarship-rules"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-[#0a1c96] px-3.5 py-1.5 rounded-full bg-[#fafafa] hover:bg-white border border-[rgba(26,26,26,0.06)] transition-all shadow-2xs"
            >
              <Award size={13} className="text-[#0a1c96]" />
              <span>Scholarship Payout Terms</span>
            </Link>
          </div>

          {onSwitchToPractice ? (
            <button
              onClick={onSwitchToPractice}
              className="text-[#0a1c96] hover:text-[#1a5fe0] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100"
            >
              <span>Practice Major Mocks (MFT 1–10)</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <Link
              href="/exam"
              className="text-[#0a1c96] hover:text-[#1a5fe0] font-bold inline-flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100"
            >
              <span>Practice Major Mocks (MFT 1–10)</span>
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
