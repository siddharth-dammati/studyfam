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
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        {/* Header with Live Broadcast Pulse */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Official Exam Command Center</span>
              </span>
              <span className="text-xs font-mono text-slate-400">JEE Main 2027 Blueprint</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              All-India JEE Main 2027 Mock Test
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Sunday, 27 Dec 2026 · 09:00 AM – 12:00 PM IST · ₹27 Entry (₹18 scholarship pool + ₹9 ops) · Registrations open 20 Oct 2026.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isConfirmed && (
              <Link
                href="/all-india-mock"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
              >
                <span>Register for ₹27 →</span>
              </Link>
            )}
            <Link
              href="/admit-card"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <FileText size={16} />
              <span>{isConfirmed ? "Download Admit Card" : "Admit Card Specimen"}</span>
            </Link>
          </div>
        </div>

        {/* Countdown & Candidate Seat Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-5 sm:p-6 text-white mb-6 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Countdown timer */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Clock size={13} />
                <span>Time Remaining Until Examination</span>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: "Days", val: timeLeft.days },
                  { label: "Hours", val: timeLeft.hours },
                  { label: "Mins", val: timeLeft.minutes },
                  { label: "Secs", val: timeLeft.seconds },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 sm:p-3 text-center min-w-[60px]"
                  >
                    <div className="text-xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                      {String(val).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-indigo-200 uppercase font-mono tracking-wider mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Seat Lock Status */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 lg:max-w-xs w-full flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-200">
                  Candidate Seat
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>{isConfirmed ? "Seat Locked" : "Registered"}</span>
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-indigo-200">Candidate Roll No:</div>
                <div className="font-mono text-base sm:text-lg font-bold text-white tracking-wider">
                  {rollNumber}
                </div>
                <div className="text-[11px] text-indigo-300">
                  {candidateRecord?.full_name || "Verified Aspirant"} · Shift 1 (09:00 AM)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Shift Schedule & Exam Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card 1: Exam Date & Day */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider">Exam Schedule</span>
              <Calendar size={15} className="text-indigo-600" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Sunday, 27 Dec 2026
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                <span>180 Mins (3.0 Hours) · 75 Questions</span>
              </div>
            </div>
          </div>

          {/* Card 2: Shift Timings */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider">Shift Allocations</span>
              <Clock size={15} className="text-indigo-600" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Shift 1 (Forenoon):</span>
                <span className="font-mono text-indigo-700 font-extrabold">09:00 AM – 12:00 PM</span>
              </div>
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Shift 2 (Afternoon):</span>
                <span className="font-mono text-indigo-700 font-extrabold">03:00 PM – 06:00 PM</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-0.5">
                Reporting: 08:00 AM · Gate Closes: 08:30 AM
              </div>
            </div>
          </div>

          {/* Card 3: Merit Pool & Rewards */}
          <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700 text-xs mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold">100% Fee Refund Scholarship</span>
              <Trophy size={15} className="text-emerald-600" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-950">
                ₹18 of ₹27 Pooled
              </div>
              <div className="text-xs text-emerald-700 mt-1 font-medium">
                Top 20 to Top 1,000 Winners (50% Merit + 50% Need-Based)
              </div>
            </div>
          </div>
        </div>

        {/* Proctored Anti-Cheat & Security Policy Banner */}
        <div className="bg-indigo-900/5 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 mb-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>TCS iON CBT Proctored Anti-Cheat Security Active</span>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Enforced
                  </span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Automated proctoring guarantees fairness and authentic All-India Rank calculations.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSecurityDetails(!showSecurityDetails)}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <span>{showSecurityDetails ? "Hide Protocols" : "View Protocols"}</span>
              {showSecurityDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Expandable Anti-Cheat Directives */}
          {showSecurityDetails && (
            <div className="pt-3 border-t border-indigo-100/90 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 animate-fadeIn">
              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-indigo-700">
                  <Monitor size={14} /> Auto Full-Screen
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  The test player locks into mandatory Full-Screen mode upon clicking Proceed. Exiting prompts an immediate re-entry modal.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-rose-600">
                  <ShieldAlert size={14} /> 3-Strike Tab Lockout
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Switching tabs or unfocusing the window is tracked in real-time. On the 4th violation (&gt;3 exits), the exam is auto-submitted instantly.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-amber-600">
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
        <div className="border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-5 space-y-3 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  Official Paper Pattern · NTA JEE Main Standard (75 Questions)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  300 Total Marks · Physics, Chemistry &amp; Mathematics (25 Questions each).
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPatternDetails(!showPatternDetails)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <span>{showPatternDetails ? "Hide Pattern" : "View Pattern"}</span>
              {showPatternDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {showPatternDetails && (
            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fadeIn">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 text-blue-700">Physics (25 Qs · 100M)</div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>• Section A: 20 MCQs (+4, -1)</div>
                  <div>• Section B: 5 Numerical (+4, -1)</div>
                  <div>• Coverage: Class 11 &amp; 12 Full Syllabus</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 text-emerald-700">Chemistry (25 Qs · 100M)</div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>• Section A: 20 MCQs (+4, -1)</div>
                  <div>• Section B: 5 Numerical (+4, -1)</div>
                  <div>• Physical, Organic &amp; Inorganic</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 text-indigo-700">Mathematics (25 Qs · 100M)</div>
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
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <Link
              href="/admit-card"
              className="flex items-center gap-1.5 font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
            >
              <Printer size={13} className="text-emerald-600" />
              <span>Print Official Hall Ticket</span>
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              href="/scholarship-rules"
              className="flex items-center gap-1.5 font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
            >
              <Award size={13} className="text-indigo-600" />
              <span>Scholarship Payout Terms</span>
            </Link>
          </div>

          {onSwitchToPractice ? (
            <button
              onClick={onSwitchToPractice}
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Practice Major Mocks (MFT 1–10)</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <Link
              href="/exam"
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
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
