"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Clock,
  Menu,
  X,
  Star,
  Users,
  Award,
  Layers,
  BarChart3,
  Flame,
  Check,
  ChevronDown,
  Calendar,
  Lock,
  ChevronRight,
  RefreshCw,
  Zap,
  BookOpen,
} from "lucide-react";
import { FREE_MOCKS_DATA } from "@/lib/freeMocksData";
import { HOME_FAQS } from "@/lib/faqData";

export function StudyFamLandingPage() {
  // 1. Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 2. MFT Difficulty Filter State
  const [activeFilter, setActiveFilter] = useState<"All" | "Standard" | "Moderate" | "Challenging">("All");

  // 3. Live Countdown Timer State (Target: 20 October 2026, 00:00 IST)
  const targetDate = new Date("2026-10-20T00:00:00+05:30").getTime();
  const [countdown, setCountdown] = useState({
    days: "17",
    hours: "04",
    mins: "22",
    secs: "45",
    isLive: false,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setCountdown({
          days: d < 10 ? "0" + d : String(d),
          hours: h < 10 ? "0" + h : String(h),
          mins: m < 10 ? "0" + m : String(m),
          secs: s < 10 ? "0" + s : String(s),
          isLive: false,
        });
      } else {
        setCountdown({ days: "00", hours: "00", mins: "00", secs: "00", isLive: true });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // 4. Interactive CBT Simulation State
  const [cbtSubject, setCbtSubject] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");
  const [currentQNum, setCurrentQNum] = useState(14);
  const [selectedOption, setSelectedOption] = useState<string | null>("B");
  const [paletteStatus, setPaletteStatus] = useState<Record<number, "answered" | "unanswered" | "review" | "unvisited">>({
    1: "answered",
    2: "answered",
    3: "unanswered",
    4: "review",
    5: "answered",
    6: "answered",
    7: "unanswered",
    8: "answered",
    9: "answered",
    10: "answered",
    11: "answered",
    12: "unanswered",
    13: "answered",
    14: "answered",
    15: "review",
    16: "unvisited",
    17: "unvisited",
    18: "unvisited",
    19: "unvisited",
    20: "unvisited",
    21: "unvisited",
    22: "unvisited",
    23: "unvisited",
    24: "unvisited",
    25: "unvisited",
  });

  const handleSaveAndNext = () => {
    if (selectedOption) {
      setPaletteStatus((prev) => ({ ...prev, [currentQNum]: "answered" }));
    } else {
      setPaletteStatus((prev) => ({ ...prev, [currentQNum]: "unanswered" }));
    }
    if (currentQNum < 25) {
      setCurrentQNum((prev) => prev + 1);
    }
  };

  const handleMarkReview = () => {
    setPaletteStatus((prev) => ({ ...prev, [currentQNum]: "review" }));
    if (currentQNum < 25) {
      setCurrentQNum((prev) => prev + 1);
    }
  };

  const handleClearResponse = () => {
    setSelectedOption(null);
    setPaletteStatus((prev) => ({ ...prev, [currentQNum]: "unvisited" }));
  };

  // 5. Interactive Priority Waitlist Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formStream, setFormStream] = useState("class-12");
  const [formTrack, setFormTrack] = useState("merit");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [generatedRefId, setGeneratedRefId] = useState("");

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Please enter your full name");
      return;
    }
    const cleanPhone = formPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number");
      return;
    }
    setFormError("");
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setGeneratedRefId(`SF-2027-WL-${randomCode}`);
    setFormSubmitted(true);
  };

  // 6. Interactive FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Filtered MFT Data
  const filteredMocks =
    activeFilter === "All"
      ? FREE_MOCKS_DATA
      : FREE_MOCKS_DATA.filter((m) => m.difficulty.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="relative min-h-screen bg-[#F6F9FF] text-[#0B1526] font-sans antialiased overflow-x-hidden selection:bg-[#1A5FE0] selection:text-white">
      {/* =========================================================================
          1. FLOATING TOKKO NAVBAR (BLURRED PILL CONTAINER)
          ========================================================================= */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-8 flex justify-center pointer-events-none">
        <nav className="w-full max-w-[1280px] pointer-events-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-[#E3EAF6] shadow-[0_8px_30px_rgba(11,21,38,0.06)] transition-all">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0A1C96] to-[#1A5FE0] flex items-center justify-center shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-black tracking-tight text-[#0B1526] leading-none">
                Study<span className="text-[#1A5FE0]">FAM</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#4B5B76] leading-tight">
                CBT Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 bg-[#F6F9FF] px-2.5 py-1 rounded-full border border-[#E3EAF6]">
            <a href="#free-mocks" className="px-3.5 py-1.5 text-xs font-bold text-[#4B5B76] hover:text-[#1A5FE0] hover:bg-white rounded-full transition-all">
              10 Free Mocks
            </a>
            <a href="#cbt-engine" className="px-3.5 py-1.5 text-xs font-bold text-[#4B5B76] hover:text-[#1A5FE0] hover:bg-white rounded-full transition-all">
              TCS iON CBT
            </a>
            <a href="#all-india-mock" className="px-3.5 py-1.5 text-xs font-bold text-[#4B5B76] hover:text-[#1A5FE0] hover:bg-white rounded-full transition-all">
              27 Dec Scholarship
            </a>
            <a href="#chapter-tests" className="px-3.5 py-1.5 text-xs font-bold text-[#4B5B76] hover:text-[#1A5FE0] hover:bg-white rounded-full transition-all">
              Chapter Banks
            </a>
            <a href="#comparison" className="px-3.5 py-1.5 text-xs font-bold text-[#4B5B76] hover:text-[#1A5FE0] hover:bg-white rounded-full transition-all">
              Comparison
            </a>
            <a href="#faq" className="px-3.5 py-1.5 text-xs font-bold text-[#4B5B76] hover:text-[#1A5FE0] hover:bg-white rounded-full transition-all">
              FAQs
            </a>
          </div>

          {/* Dual Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <a
              href="#free-mocks"
              className="px-4 py-2 text-xs font-bold rounded-full text-[#0B1526] hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              Take Free Mock
            </a>
            <a
              href="#all-india-mock"
              className="px-4 py-2 text-xs font-extrabold rounded-full bg-gradient-to-r from-[#0A1C96] via-[#1A5FE0] to-[#2F8FFF] text-white shadow-md shadow-blue-600/30 hover:shadow-lg hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>27 Dec Exam (₹27)</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full bg-[#F6F9FF] border border-[#E3EAF6] flex items-center justify-center text-[#0B1526] hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* Mobile Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-20 left-4 right-4 bg-white rounded-3xl p-6 shadow-2xl border border-[#E3EAF6] flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2 pb-4 border-b border-slate-100">
              <a
                href="#free-mocks"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-[#0B1526] hover:bg-blue-50 hover:text-[#1A5FE0] transition-colors"
              >
                10 Free Full Mocks
              </a>
              <a
                href="#cbt-engine"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-[#0B1526] hover:bg-blue-50 hover:text-[#1A5FE0] transition-colors"
              >
                TCS iON CBT Simulator
              </a>
              <a
                href="#all-india-mock"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-[#0B1526] hover:bg-blue-50 hover:text-[#1A5FE0] transition-colors"
              >
                27 Dec Scholarship Exam (₹27)
              </a>
              <a
                href="#chapter-tests"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-[#0B1526] hover:bg-blue-50 hover:text-[#1A5FE0] transition-colors"
              >
                300+ Chapter Test Banks
              </a>
              <a
                href="#comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-[#0B1526] hover:bg-blue-50 hover:text-[#1A5FE0] transition-colors"
              >
                Platform Comparison
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-[#0B1526] hover:bg-blue-50 hover:text-[#1A5FE0] transition-colors"
              >
                Official FAQs
              </a>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href="/exam/player?id=MFT-1.pdf"
                className="w-full py-3 rounded-full text-center text-xs font-extrabold bg-[#1A5FE0] text-white shadow-md"
              >
                Launch Test MFT-01 Now
              </a>
              <a
                href="#all-india-mock"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-full text-center text-xs font-extrabold bg-slate-100 text-[#0B1526]"
              >
                Join 27 Dec Priority Waitlist
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. HERO SECTION WITH 4 TILTED MOCKUPS & VALUE PROPOSITION
          ========================================================================= */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-[#F6F9FF] via-white to-[#F6F9FF]">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(circle,rgba(26,95,224,0.08),transparent_70%)] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Pill Kicker */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E3EAF6] shadow-sm text-xs font-extrabold text-[#1A5FE0] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>OFFICIAL NTA 75-QUESTION CBT BLUEPRINT · 100% FREE FOREVER</span>
            </div>

            {/* Display H1 */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0B1526] leading-[1.08] mb-6">
              Master JEE Main on the Exact{" "}
              <span className="bg-gradient-to-r from-[#0A1C96] via-[#1A5FE0] to-[#2F8FFF] bg-clip-text text-transparent">
                NTA CBT Screen.
              </span>
            </h1>

            {/* Benefit Subhead */}
            <p className="text-base sm:text-xl text-[#4B5B76] font-medium leading-relaxed max-w-3xl mb-8">
              Practice <strong>10 full-length 75-question mocks</strong> crafted strictly to the revised NTA syllabus. Experience 100% authentic TCS iON CBT simulation, pinpoint chapter-wise lag, race the 144s question clock, and compete in the Dec 27 ₹27 National Scholarship Exam.
            </p>

            {/* Dual CTAs + Micro-Trust Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-6 w-full sm:w-auto">
              <a
                href="/exam/player?id=MFT-1.pdf"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#0A1C96] via-[#1A5FE0] to-[#2F8FFF] text-white text-base font-extrabold shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Test MFT-01 Now</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#all-india-mock"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white text-[#0B1526] text-base font-bold border border-[#E3EAF6] shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <span>27 Dec Scholarship Exam (₹27)</span>
              </a>
            </div>

            {/* Micro-Trust Line */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-[#4B5B76] mb-10">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 size={14} className="text-emerald-500" />
                100% Free Forever
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-blue-500" />
                No Credit Card or OTP Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-blue-500" />
                Instant AIR & Chapter Lag Diagnostics
              </span>
            </div>

            {/* Avatar & Social Proof Row */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-[#E3EAF6] shadow-sm mb-12">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                  AIR
                </div>
                <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                  99
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                  100
                </div>
              </div>
              <div className="text-xs font-semibold text-[#4B5B76]">
                <strong className="text-[#0B1526] font-bold">48,200+ Aspirants</strong> Practicing ·{" "}
                <span className="text-amber-500">★★★★★</span> 4.9/5 Rating
              </div>
            </div>
          </div>

          {/* 4 TILTED MOCKUP SHOWCASE CARDS (TOKKO STYLE) */}
          <div className="relative pt-6 max-w-5xl mx-auto flex items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {/* Card 1: Live Question Screen */}
              <div className="bg-white rounded-3xl p-5 border-2 border-white shadow-[0_20px_45px_rgba(11,21,38,0.1)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-[280px]">
                <div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1A5FE0] text-[10px] font-mono font-bold">
                      PHYSICS · SEC-A
                    </span>
                    <span className="text-xs font-mono font-bold text-red-500 flex items-center gap-1">
                      <Clock size={12} /> 02:44:18
                    </span>
                  </div>
                  <div className="mt-3 text-xs font-bold text-[#0B1526] leading-snug">
                    Q.14: A solid cylinder rolls without slipping down an incline θ. The acceleration is:
                  </div>
                  <div className="mt-2.5 space-y-1.5 text-[11px] text-[#4B5B76]">
                    <div>○ (A) g sin θ</div>
                    <div className="text-[#1A5FE0] font-bold">● (B) (2/3) g sin θ ✓</div>
                    <div>○ (C) (1/2) g sin θ</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-emerald-600">+4 Correct</span>
                  <span className="text-slate-400">Save & Next →</span>
                </div>
              </div>

              {/* Card 2: 75-Question Palette Matrix */}
              <div className="bg-white rounded-3xl p-5 border-2 border-white shadow-[0_20px_45px_rgba(11,21,38,0.1)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-[280px]">
                <div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      PALETTE MATRIX
                    </span>
                    <span className="text-[10px] font-bold text-[#4B5B76]">75 QUESTIONS</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 mt-3">
                    <div className="aspect-square rounded bg-[#10B981] text-white text-[10px] font-bold flex items-center justify-center">1</div>
                    <div className="aspect-square rounded bg-[#10B981] text-white text-[10px] font-bold flex items-center justify-center">2</div>
                    <div className="aspect-square rounded bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center">3</div>
                    <div className="aspect-square rounded bg-[#8B5CF6] text-white text-[10px] font-bold flex items-center justify-center">4</div>
                    <div className="aspect-square rounded bg-[#10B981] text-white text-[10px] font-bold flex items-center justify-center">5</div>
                    <div className="aspect-square rounded bg-[#10B981] text-white text-[10px] font-bold flex items-center justify-center">6</div>
                    <div className="aspect-square rounded bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center">7</div>
                    <div className="aspect-square rounded bg-[#10B981] text-white text-[10px] font-bold flex items-center justify-center">8</div>
                    <div className="aspect-square rounded bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">9</div>
                    <div className="aspect-square rounded bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">10</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[10px] text-[#4B5B76] leading-tight">
                  🟢 24 Answered · 🔴 12 Unanswered<br />🟣 4 Review · ⚪ 35 Not Visited
                </div>
              </div>

              {/* Card 3: Diagnostic Scorecard */}
              <div className="bg-gradient-to-br from-[#0A1C96] to-[#0B1526] text-white rounded-3xl p-5 border-2 border-blue-900/40 shadow-[0_20px_45px_rgba(10,28,150,0.25)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-[280px]">
                <div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                    <span className="px-2 py-0.5 rounded bg-white/15 text-[10px] font-bold text-white">
                      SCORECARD
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">ALL-INDIA RANK</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-black text-white">
                      238 <span className="text-xs text-white/60 font-semibold">/ 300</span>
                    </div>
                    <div className="text-xs font-bold text-sky-300 mt-1">
                      99.84 Percentile (AIR #142)
                    </div>
                  </div>
                  <div className="mt-2.5 text-[11px] text-white/70 leading-snug">
                    P: 84 | C: 78 | M: 76<br />
                    Negative Leakage: -4 Marks
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 text-[10px] text-white/60">
                  Telemetry: 132s avg per question
                </div>
              </div>

              {/* Card 4: 27 Dec Admit Voucher */}
              <div className="bg-[#FFFDF7] rounded-3xl p-5 border-2 border-amber-200/80 shadow-[0_20px_45px_rgba(245,158,11,0.12)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-[280px]">
                <div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-amber-200">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      27 DEC MOCK
                    </span>
                    <span className="text-[10px] font-bold text-amber-700">ADMIT TICKET</span>
                  </div>
                  <div className="mt-3 text-xs font-extrabold text-[#0B1526]">
                    JEE Main National Scholarship
                  </div>
                  <div className="mt-2 text-[10px] text-[#4B5B76] space-y-0.5">
                    <div>Roll: SF-2027-8841</div>
                    <div>Date: Sunday, 27 Dec 2026</div>
                    <div>Slot: 09:00 AM – 12:00 PM</div>
                  </div>
                </div>
                <div>
                  <div className="h-6 bg-[repeating-linear-gradient(to_right,#000_0px,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_6px,transparent_6px,transparent_8px)] rounded-sm opacity-80" />
                  <div className="text-[9px] text-center text-amber-800 font-bold mt-1">
                    Fee Refund Escrow: ₹18.00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SPEC TICKER MARQUEE (CONTINUOUS 2-ROW CSS ANIMATION)
          ========================================================================= */}
      <section className="py-6 bg-white border-y border-[#E3EAF6] overflow-hidden">
        <div className="space-y-3">
          {/* Row 1 */}
          <div className="flex gap-4 animate-[tickerLeft_35s_linear_infinite] whitespace-nowrap">
            {[
              "TCS iON CBT Match",
              "75 Questions NTA Pattern",
              "3-Strike Tab Lockout",
              "Auto Fullscreen CBT",
              "10 Full MFTs Free Forever",
              "Zero Calculator Rule",
              "TCS iON CBT Match",
              "75 Questions NTA Pattern",
              "3-Strike Tab Lockout",
              "Auto Fullscreen CBT",
              "10 Full MFTs Free Forever",
              "Zero Calculator Rule",
            ].map((text, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F9FF] border border-[#E3EAF6] shrink-0">
                <span className="w-6 h-6 rounded-full bg-[#1A5FE0] text-white flex items-center justify-center text-xs font-bold">✓</span>
                <span className="text-xs font-bold text-[#0B1526]">{text}</span>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-4 animate-[tickerRight_35s_linear_infinite] whitespace-nowrap">
            {[
              "144s Question Pace",
              "Instant Step-by-Step Solutions",
              "Chapter-Lag Telemetry",
              "₹15L Scholarship Pool",
              "Negative Mark Shield",
              "Instant Percentile Predictor",
              "144s Question Pace",
              "Instant Step-by-Step Solutions",
              "Chapter-Lag Telemetry",
              "₹15L Scholarship Pool",
              "Negative Mark Shield",
              "Instant Percentile Predictor",
            ].map((text, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F9FF] border border-[#E3EAF6] shrink-0">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">⚡</span>
                <span className="text-xs font-bold text-[#0B1526]">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PLATFORM CAPABILITIES BENTO GRID (6 HIGH-CONTRAST CARDS)
          ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#F6F9FF]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3EAF6] text-xs font-extrabold text-[#1A5FE0] mb-3">
              PLATFORM CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0B1526] tracking-tight">
              Engineered for 99.8th Percentile Precision
            </h2>
            <p className="text-base sm:text-lg text-[#4B5B76] mt-3">
              Every detail is calibrated to eliminate exam-hall friction and instill disciplined pacing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento 1 */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#0A1C96] to-[#1A5FE0] text-white shadow-lg hover:-translate-y-1.5 transition-all group">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">TCS iON Parity</span>
              <h3 className="text-2xl font-black text-white mt-2 mb-3">Zero Exam-Day Surprises</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Exact replica of the official NTA examination portal. Matching question palette, virtual numerical keypad, subject tabs, and countdown timer.
              </p>
            </div>

            {/* Bento 2 */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white shadow-lg hover:-translate-y-1.5 transition-all group">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">Competitive Integrity</span>
              <h3 className="text-2xl font-black text-white mt-2 mb-3">3-Strike Anti-Cheat Defense</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Automatic fullscreen lock, copy-paste block, and auto-submission on 3 tab switches ensure your All-India percentile benchmark is 100% genuine.
              </p>
            </div>

            {/* Bento 3 */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#065F46] to-[#10B981] text-white shadow-lg hover:-translate-y-1.5 transition-all group">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">75-Question Blueprint</span>
              <h3 className="text-2xl font-black text-white mt-2 mb-3">10 Full-Length MFTs Free</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Complete syllabus papers with 20 MCQs and 5 Numerical Value Questions per subject, perfectly balanced between Class 11 and Class 12 concepts.
              </p>
            </div>

            {/* Bento 4 */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#92400E] to-[#F59E0B] text-white shadow-lg hover:-translate-y-1.5 transition-all group">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">National Scholarship</span>
              <h3 className="text-2xl font-black text-white mt-2 mb-3">100% Fee Refund Pool</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Top rankers in the 27 Dec All-India Mock receive a 100% refund of their official NTA JEE Main Application Fees (₹1,000 Boys / ₹800 Girls).
              </p>
            </div>

            {/* Bento 5 */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#991B1B] to-[#EF4444] text-white shadow-lg hover:-translate-y-1.5 transition-all group">
              <span className="text-xs font-bold uppercase tracking-wider text-red-200">Diagnostic Radar</span>
              <h3 className="text-2xl font-black text-white mt-2 mb-3">Chapter-Lag Telemetry</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Instant post-test diagnosis pinpointing the exact 3 chapters dragging your rank down in Physics, Chemistry, and Mathematics.
              </p>
            </div>

            {/* Bento 6 */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#0B1526] to-[#1E293B] text-white shadow-lg hover:-translate-y-1.5 transition-all group">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Speed Benchmarks</span>
              <h3 className="text-2xl font-black text-white mt-2 mb-3">144s Question Pacing Meter</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Real-time velocity tracking comparing your time spent on mechanics or integrals against national 99th percentile toppers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PRODUCT GRID: 10 FREE FULL MOCK TESTS (#free-mocks)
          ========================================================================= */}
      <section id="free-mocks" className="py-24 sm:py-32 bg-white border-y border-[#E3EAF6] scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold text-[#1A5FE0] mb-3">
                10 FULL-LENGTH MAJOR MOCKS
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0B1526] tracking-tight">
                Official NTA 75-Question Test Series
              </h2>
              <p className="text-base text-[#4B5B76] mt-2">
                100% Free Forever · Real TCS iON CBT Mode · Step-by-Step Solutions · Instant Percentile
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#F6F9FF] p-1.5 rounded-full border border-[#E3EAF6] shrink-0 self-start md:self-auto">
              {(["All", "Standard", "Moderate", "Challenging"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeFilter === tab
                      ? "bg-[#1A5FE0] text-white shadow-sm"
                      : "text-[#4B5B76] hover:text-[#0B1526]"
                  }`}
                >
                  {tab === "All" ? "All Tests (10)" : `${tab} Level`}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMocks.map((mock) => (
              <div
                key={mock.id}
                className="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#E3EAF6] shadow-sm hover:shadow-xl hover:border-[#1A5FE0]/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Ghost Watermark Numeral */}
                <span className="absolute -right-2 -bottom-4 text-8xl font-black text-slate-100 select-none pointer-events-none group-hover:text-blue-50 transition-colors">
                  {mock.mockNumber < 10 ? `0${mock.mockNumber}` : mock.mockNumber}
                </span>

                <div className="relative z-10">
                  {/* Card Header Chips */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1A5FE0] font-mono text-xs font-extrabold border border-blue-200">
                      {mock.code}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200">
                      {mock.badge} · 100% Free
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-[#0B1526] group-hover:text-[#1A5FE0] transition-colors mb-2">
                    {mock.title}
                  </h3>

                  {/* Focus Topics */}
                  <div className="text-xs text-[#4B5B76] leading-relaxed mb-4">
                    <strong className="text-[#0B1526]">Focus:</strong> {mock.focusTopics.join(" · ")}
                  </div>

                  {/* Spec Chips */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                      75 Questions
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                      300 Marks
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                      180 Mins
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        mock.difficulty === "Standard"
                          ? "bg-emerald-50 text-emerald-700"
                          : mock.difficulty === "Moderate"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {mock.difficulty} Level
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Instant Solutions Ready
                  </span>
                  <Link
                    href={mock.playerUrl}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0A1C96] to-[#1A5FE0] text-white text-xs font-extrabold shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                  >
                    <span>Launch CBT Exam</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SPOTLIGHT: 27 DEC SCHOLARSHIP MOCK (₹27) (#all-india-mock)
          ========================================================================= */}
      <section id="all-india-mock" className="py-24 sm:py-32 bg-[#F6F9FF] scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0A1C96] via-[#0B1526] to-[#064E3B] text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden border border-blue-900/50">
            {/* Dotted Radial Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#2F8FFF_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Information & Countdown */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-emerald-300 w-fit mb-4">
                  <Trophy size={14} className="text-amber-400" />
                  <span>FLAGSHIP NATIONAL SCHOLARSHIP EXAMINATION</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  All-India Major Mock Test: <br />
                  <span className="text-emerald-400">Win 100% of Your NTA Exam Fees Back!</span>
                </h2>

                <p className="text-base text-white/80 leading-relaxed mb-6">
                  On <strong>Sunday, 27 December 2026</strong>, StudyFam hosts India&apos;s most transparent community scholarship mock. For a nominal ₹27 fee, exactly <strong>₹18 is transparently escrowed</strong> to refund 100% of official NTA JEE Main Application Fees (<strong>₹1,000 for Boys / ₹800 for Girls</strong>) across 50% Merit and 50% Need-Based tracks.
                </p>

                {/* Transparent Fee-Split Bar */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                  <div className="flex justify-between items-center text-xs font-bold text-white/90 mb-2">
                    <span>Transparent Fee Allocation:</span>
                    <span className="text-emerald-300 font-mono">₹27 Total Fee</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-white/10">
                    <div className="w-[66.7%] bg-emerald-500" title="₹18 Escrowed to Fee Refund Pool" />
                    <div className="w-[22.2%] bg-sky-400" title="₹6 Cloud & Anti-Cheat Servers" />
                    <div className="w-[11.1%] bg-amber-400" title="₹3 Payment Gateway & Tax" />
                  </div>
                  <div className="flex justify-between text-[11px] text-white/70 mt-2 font-medium">
                    <span>🟢 ₹18 Scholarship Pool (66.7%)</span>
                    <span>🔵 ₹6 Servers (22.2%)</span>
                    <span>🟠 ₹3 Gateway & GST (11.1%)</span>
                  </div>
                </div>

                {/* Live Countdown Clock */}
                <div className="mb-6">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-2">
                    {countdown.isLive ? "EXAM IS NOW LIVE!" : "REGISTRATIONS OPEN IN:"}
                  </div>
                  <div className="flex gap-2.5 sm:gap-3">
                    <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-center min-w-[62px]">
                      <div className="text-2xl sm:text-3xl font-black font-mono leading-none">{countdown.days}</div>
                      <div className="text-[10px] uppercase font-bold text-white/60 mt-1">Days</div>
                    </div>
                    <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-center min-w-[62px]">
                      <div className="text-2xl sm:text-3xl font-black font-mono leading-none">{countdown.hours}</div>
                      <div className="text-[10px] uppercase font-bold text-white/60 mt-1">Hours</div>
                    </div>
                    <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-center min-w-[62px]">
                      <div className="text-2xl sm:text-3xl font-black font-mono leading-none">{countdown.mins}</div>
                      <div className="text-[10px] uppercase font-bold text-white/60 mt-1">Mins</div>
                    </div>
                    <div className="bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-center min-w-[62px]">
                      <div className="text-2xl sm:text-3xl font-black font-mono leading-none text-red-400">{countdown.secs}</div>
                      <div className="text-[10px] uppercase font-bold text-white/60 mt-1">Secs</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#register"
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Join Priority Waitlist (₹27)
                  </a>
                  <span className="text-xs text-white/70">
                    50% Merit + 50% Need-Based Dual Track
                  </span>
                </div>
              </div>

              {/* Right Column: Admit Card Ticket & Milestones Table */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Tilted Admit Card Mockup */}
                <div className="bg-white text-[#0B1526] rounded-3xl p-6 shadow-2xl border-4 border-white/90">
                  <div className="flex justify-between items-start border-b-2 border-dashed border-slate-200 pb-3 mb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#1A5FE0] tracking-wider">
                        NTA JEE MAIN 2027 CBT
                      </span>
                      <h4 className="text-base font-black text-[#0B1526] mt-0.5">
                        CANDIDATE ADMIT TICKET
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#4B5B76] block font-mono">TEST CODE</span>
                      <span className="font-mono text-xs font-bold text-slate-900">AIM-2027-27DEC</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#4B5B76]">
                    <div className="flex justify-between">
                      <span>Exam Date:</span>
                      <strong className="text-[#0B1526]">Sunday, 27 December 2026</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Slot Timing:</span>
                      <strong className="text-[#0B1526]">09:00 AM – 12:00 PM IST</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Pattern:</span>
                      <span>75 Questions · 300 Marks</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proctoring:</span>
                      <strong className="text-emerald-600">3-Strike Tab Lock Active</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Prize Award:</span>
                      <strong className="text-[#1A5FE0]">100% NTA Application Fee</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="h-8 bg-[repeating-linear-gradient(to_right,#000_0px,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_7px,transparent_7px,transparent_9px)] rounded" />
                    <div className="text-[10px] font-mono text-center text-slate-400 mt-1">
                      SF-27DEC-2026-NTA-VERIFIED
                    </div>
                  </div>
                </div>

                {/* Dynamic Scaling Milestones */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs">
                  <div className="font-bold text-white mb-2 flex items-center justify-between">
                    <span>Dynamic Scaling Milestones</span>
                    <span className="text-emerald-300">50% Merit / 50% Need</span>
                  </div>
                  <div className="space-y-1.5 text-white/80 text-[11px]">
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span>At 1,000 Aspirants (₹18K Pool):</span>
                      <strong className="text-white">20 Fee Refunds</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span>At 10,000 Aspirants (₹1.8L Pool):</span>
                      <strong className="text-white">200 Fee Refunds</strong>
                    </div>
                    <div className="flex justify-between text-amber-300 font-bold">
                      <span>At 50,000 Aspirants (₹9.0L Pool):</span>
                      <span>1,000 Fee Refunds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. LEAD GENERATION: PRE-REGISTRATION / PRIORITY WAITLIST (#register)
          ========================================================================= */}
      <section id="register" className="py-20 sm:py-28 bg-white border-b border-[#E3EAF6] scroll-mt-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-800 mb-3">
              OFFICIAL REGISTRATION OPENS 20 OCTOBER 2026
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1526] tracking-tight">
              Join the Priority Waitlist for the ₹27 Mock
            </h2>
            <p className="text-sm sm:text-base text-[#4B5B76] mt-2">
              Reserve your seat and slot notification before national capacity caps out.
            </p>
          </div>

          <div className="bg-[#F6F9FF] rounded-3xl p-6 sm:p-10 border border-[#E3EAF6] shadow-md">
            {formSubmitted ? (
              <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#0B1526] mb-2">Priority Spot Confirmed!</h3>
                <p className="text-sm text-[#4B5B76] max-w-md mx-auto mb-6">
                  Thank you, <strong>{formName}</strong>. You will receive an exclusive SMS/WhatsApp alert with direct payment gateway link on 20 October 2026 at 00:00 IST.
                </p>

                <div className="bg-white rounded-2xl p-4 border border-[#E3EAF6] max-w-xs mx-auto mb-6">
                  <span className="text-[10px] font-mono text-[#4B5B76] block">YOUR WAITLIST REFERENCE ID</span>
                  <span className="text-lg font-mono font-black text-[#1A5FE0]">{generatedRefId}</span>
                </div>

                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#1A5FE0] text-white hover:bg-blue-700 transition-colors"
                >
                  Register Another Candidate
                </button>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B1526] mb-1.5">
                      Full Name as per Aadhaar / Class 10 *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priyanshu Sharma"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-medium text-[#0B1526] focus:outline-none focus:border-[#1A5FE0] focus:ring-2 focus:ring-blue-100 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B1526] mb-1.5">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-medium text-[#0B1526] focus:outline-none focus:border-[#1A5FE0] focus:ring-2 focus:ring-blue-100 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B1526] mb-1.5">
                      Current Academic Status *
                    </label>
                    <select
                      value={formStream}
                      onChange={(e) => setFormStream(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-medium text-[#0B1526] focus:outline-none focus:border-[#1A5FE0] focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="class-11">Class 11 Aspirant (Target 2028)</option>
                      <option value="class-12">Class 12 Aspirant (Target 2027)</option>
                      <option value="dropper">Dropper / Repeater (Target 2027)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B1526] mb-1.5">
                      Target Scholarship Track *
                    </label>
                    <select
                      value={formTrack}
                      onChange={(e) => setFormTrack(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-medium text-[#0B1526] focus:outline-none focus:border-[#1A5FE0] focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="merit">50% Merit Track (Pure Test Rank)</option>
                      <option value="need">50% Need-Based Track (Income &lt; 8L)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#0A1C96] via-[#1A5FE0] to-[#2F8FFF] text-white text-sm font-extrabold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Reserve Priority Seat (Fee ₹27 on 20 Oct)</span>
                    <ArrowRight size={15} />
                  </button>
                  <p className="text-[11px] text-center text-[#4B5B76] mt-2">
                    🔒 No payment taken today. Zero spam policy. We only message on slot opening.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. TCS iON CBT SIMULATION SCREEN (#cbt-engine)
          ========================================================================= */}
      <section id="cbt-engine" className="py-24 sm:py-32 bg-[#F6F9FF] scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3EAF6] text-xs font-extrabold text-[#1A5FE0] mb-3">
              GENUINE NTA INTERFACE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0B1526] tracking-tight">
              Interactive TCS iON Simulator
            </h2>
            <p className="text-base sm:text-lg text-[#4B5B76] mt-3">
              Experience the exact test layout, color indicators, and subject navigation right now.
            </p>
          </div>

          {/* Interactive CBT Terminal Frame */}
          <div className="rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-white">
            {/* Terminal Top Window Bar */}
            <div className="bg-[#1E293B] text-white px-6 py-3 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold ml-2">JEE (Main) Computer Based Test — StudyFAM Simulator</span>
              </div>
              <div className="font-mono font-bold text-red-400 flex items-center gap-1.5">
                <Clock size={13} /> Time Left: 02:44:18
              </div>
            </div>

            {/* Subject Tabs */}
            <div className="flex bg-[#F1F5F9] border-b-2 border-slate-200">
              {(["Physics", "Chemistry", "Mathematics"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setCbtSubject(sub)}
                  className={`px-6 py-3 font-bold text-xs sm:text-sm transition-all border-b-2 ${
                    cbtSubject === sub
                      ? "bg-white text-[#1A5FE0] border-[#1A5FE0]"
                      : "text-slate-500 border-transparent hover:text-slate-900"
                  }`}
                >
                  {sub} (25 Qs)
                </button>
              ))}
            </div>

            {/* Split Body: Question Panel + Palette Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
              {/* Question Left */}
              <div className="lg:col-span-8 p-6 sm:p-8 border-r border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-5 text-xs">
                    <span className="font-extrabold text-[#1A5FE0]">Question No. {currentQNum}</span>
                    <span className="font-bold text-slate-500">Single Choice (+4, -1)</span>
                  </div>

                  <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                    {cbtSubject === "Physics" && (
                      <span>
                        A uniform solid cylinder of mass <em>M</em> and radius <em>R</em> rolls without slipping down an inclined plane of inclination θ with the horizontal. What is the linear acceleration of its center of mass down the incline?
                      </span>
                    )}
                    {cbtSubject === "Chemistry" && (
                      <span>
                        Which of the following coordination compounds exhibits optical isomerism and does not possess a plane or center of symmetry?
                      </span>
                    )}
                    {cbtSubject === "Mathematics" && (
                      <span>
                        Evaluate the definite integral: &int;<sub>0</sub><sup>&pi;/2</sup> [sin<sup>3</sup>(x) / (sin<sup>3</sup>(x) + cos<sup>3</sup>(x))] dx.
                      </span>
                    )}
                  </div>

                  {/* Radio Options */}
                  <div className="space-y-3 mt-6">
                    {[
                      { key: "A", val: cbtSubject === "Physics" ? "g sin θ" : cbtSubject === "Chemistry" ? "[Co(NH3)6]3+" : "π / 2" },
                      { key: "B", val: cbtSubject === "Physics" ? "(2/3) g sin θ (Correct)" : cbtSubject === "Chemistry" ? "cis-[Co(en)2Cl2]+ (Correct)" : "π / 4 (Correct)" },
                      { key: "C", val: cbtSubject === "Physics" ? "(1/2) g sin θ" : cbtSubject === "Chemistry" ? "trans-[Co(en)2Cl2]+" : "π" },
                      { key: "D", val: cbtSubject === "Physics" ? "(3/4) g sin θ" : cbtSubject === "Chemistry" ? "[Pt(NH3)2Cl2]" : "1" },
                    ].map((opt) => (
                      <label
                        key={opt.key}
                        onClick={() => setSelectedOption(opt.key)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                          selectedOption === opt.key
                            ? "bg-blue-50 border-[#1A5FE0] text-[#1A5FE0] font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cbt-opt"
                          checked={selectedOption === opt.key}
                          onChange={() => setSelectedOption(opt.key)}
                          className="accent-[#1A5FE0]"
                        />
                        <span>({opt.key}) {opt.val}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Question Actions */}
                <div className="pt-6 border-t border-slate-200 mt-6 flex flex-wrap gap-2.5 justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleClearResponse}
                      className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      Clear Response
                    </button>
                    <button
                      type="button"
                      onClick={handleMarkReview}
                      className="px-4 py-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors"
                    >
                      Mark for Review
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveAndNext}
                    className="px-6 py-2.5 rounded-lg bg-[#1A5FE0] text-white text-xs font-extrabold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>Save & Next</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Palette Right */}
              <div className="lg:col-span-4 p-6 bg-[#F8FAFC] flex flex-col justify-between">
                <div>
                  <div className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-3">
                    Question Palette (25 Questions)
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 mb-4 pb-3 border-b border-slate-200">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-[#10B981]" /> Answered
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-[#EF4444]" /> Not Answered
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-[#8B5CF6]" /> Marked Review
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-slate-200" /> Not Visited
                    </span>
                  </div>

                  {/* 25 Cell Grid */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => {
                      const status = paletteStatus[num] || "unvisited";
                      return (
                        <button
                          key={num}
                          onClick={() => setCurrentQNum(num)}
                          className={`aspect-square rounded text-xs font-extrabold flex items-center justify-center transition-all ${
                            currentQNum === num ? "ring-2 ring-blue-700 ring-offset-1 scale-105" : ""
                          } ${
                            status === "answered"
                              ? "bg-[#10B981] text-white"
                              : status === "unanswered"
                              ? "bg-[#EF4444] text-white"
                              : status === "review"
                              ? "bg-[#8B5CF6] text-white"
                              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-4">
                  <a
                    href="/exam/player?id=MFT-1.pdf"
                    className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-700 transition-colors"
                  >
                    <span>Launch Full 75-Q Mock (MFT-01)</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. 300+ CHAPTER PRACTICE TESTS SPOTLIGHT (#chapter-tests)
          ========================================================================= */}
      <section id="chapter-tests" className="py-24 sm:py-32 bg-white border-y border-[#E3EAF6] scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold text-[#1A5FE0] mb-3">
              300+ CHAPTER-WISE TESTS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0B1526] tracking-tight">
              Drill Specific Weak Chapters
            </h2>
            <p className="text-base sm:text-lg text-[#4B5B76] mt-3">
              Fix conceptual leaks with 9,300+ curated chapter questions before taking full-length papers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Physics Card */}
            <div className="bg-[#F6F9FF] rounded-3xl p-8 border border-[#E3EAF6] flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-4">
                  ⚛️
                </div>
                <h3 className="text-2xl font-black text-[#0B1526] mb-1">Physics Chapter Banks</h3>
                <span className="text-xs font-extrabold text-[#1A5FE0]">110+ Tests · 3,100+ Questions</span>
                <p className="text-xs text-[#4B5B76] leading-relaxed mt-3">
                  Kinematics, Rotational Dynamics, Electrodynamics & AC, Modern Physics, Ray & Wave Optics, Thermodynamics.
                </p>
              </div>
              <a
                href="/exam"
                className="mt-6 w-full py-3 rounded-full text-center text-xs font-extrabold bg-white border border-[#CBD5E1] text-[#0B1526] hover:bg-blue-50 hover:text-[#1A5FE0] hover:border-blue-200 transition-all"
              >
                Practice Physics Tests →
              </a>
            </div>

            {/* Chemistry Card */}
            <div className="bg-[#F6F9FF] rounded-3xl p-8 border border-[#E3EAF6] flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-4">
                  🧪
                </div>
                <h3 className="text-2xl font-black text-[#0B1526] mb-1">Chemistry Chapter Banks</h3>
                <span className="text-xs font-extrabold text-emerald-600">125+ Tests · 3,300+ Questions</span>
                <p className="text-xs text-[#4B5B76] leading-relaxed mt-3">
                  GOC & Reaction Mechanisms, Chemical Thermodynamics, Coordination Chemistry, Carbonyls, Chemical Bonding.
                </p>
              </div>
              <a
                href="/exam"
                className="mt-6 w-full py-3 rounded-full text-center text-xs font-extrabold bg-white border border-[#CBD5E1] text-[#0B1526] hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
              >
                Practice Chemistry Tests →
              </a>
            </div>

            {/* Maths Card */}
            <div className="bg-[#F6F9FF] rounded-3xl p-8 border border-[#E3EAF6] flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-4">
                  📐
                </div>
                <h3 className="text-2xl font-black text-[#0B1526] mb-1">Maths Chapter Banks</h3>
                <span className="text-xs font-extrabold text-purple-600">105+ Tests · 2,900+ Questions</span>
                <p className="text-xs text-[#4B5B76] leading-relaxed mt-3">
                  Definite Integrals, Vectors & 3D Geometry, Matrices & Determinants, Conic Sections, Limits & Continuity.
                </p>
              </div>
              <a
                href="/exam"
                className="mt-6 w-full py-3 rounded-full text-center text-xs font-extrabold bg-white border border-[#CBD5E1] text-[#0B1526] hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all"
              >
                Practice Maths Tests →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. 3-STAGE MASTERY CURRICULUM TRACKS (TOKKO STYLE)
          ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#F6F9FF]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3EAF6] text-xs font-extrabold text-[#1A5FE0] mb-3">
              3-STAGE MASTERY CURRICULUM
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0B1526] tracking-tight">
              What This Test Series Teaches You
            </h2>
            <p className="text-base sm:text-lg text-[#4B5B76] mt-3">
              A systematic progression taking you from CBT friction to national percentile scaling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 01 Purple */}
            <div className="rounded-3xl border border-[#E3EAF6] bg-white overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="bg-[#8B31D9] text-white p-7">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl">🖥️</span>
                  <span className="text-2xl font-black opacity-60">01</span>
                </div>
                <h3 className="text-2xl font-black">Foundation Track</h3>
                <p className="text-xs text-white/80 mt-1">TCS iON CBT interface mastery so exam day feels second nature.</p>
              </div>
              <div className="p-7 space-y-2.5 text-xs text-[#4B5B76]">
                <div className="flex gap-2"><strong>1.</strong><span>Official 5-color palette telemetry</span></div>
                <div className="flex gap-2"><strong>2.</strong><span>Section A (MCQ) vs Section B (NVQ) triage</span></div>
                <div className="flex gap-2"><strong>3.</strong><span>Strategic &apos;Mark for Review&apos; discipline</span></div>
                <div className="flex gap-2"><strong>4.</strong><span>Virtual numeric keypad speed protocols</span></div>
                <div className="flex gap-2"><strong>5.</strong><span>Handling the 180-min countdown clock</span></div>
                <div className="flex gap-2"><strong>6.</strong><span>Anti-cheat lockout & fullscreen focus</span></div>
              </div>
            </div>

            {/* 02 Orange */}
            <div className="rounded-3xl border border-[#E3EAF6] bg-white overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="bg-[#F56628] text-white p-7">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl">⚡</span>
                  <span className="text-2xl font-black opacity-60">02</span>
                </div>
                <h3 className="text-2xl font-black">Precision Track</h3>
                <p className="text-xs text-white/80 mt-1">High-yield question patterns and eliminating arithmetic traps.</p>
              </div>
              <div className="p-7 space-y-2.5 text-xs text-[#4B5B76]">
                <div className="flex gap-2"><strong>1.</strong><span>Identifying 15 guaranteed question archetypes</span></div>
                <div className="flex gap-2"><strong>2.</strong><span>High-speed Organic reaction recall</span></div>
                <div className="flex gap-2"><strong>3.</strong><span>Modern Physics shortcut equations</span></div>
                <div className="flex gap-2"><strong>4.</strong><span>Section B selection: picking easiest 5 of 10</span></div>
                <div className="flex gap-2"><strong>5.</strong><span>Trap option elimination via dimensions</span></div>
                <div className="flex gap-2"><strong>6.</strong><span>Calculated risk on 50/50 guesses</span></div>
              </div>
            </div>

            {/* 03 Red */}
            <div className="rounded-3xl border border-[#E3EAF6] bg-white overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="bg-[#EF4444] text-white p-7">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl">📈</span>
                  <span className="text-2xl font-black opacity-60">03</span>
                </div>
                <h3 className="text-2xl font-black">Rank Scaling Track</h3>
                <p className="text-xs text-white/80 mt-1">Chapter-lag telemetry and negative mark leakage eradication.</p>
              </div>
              <div className="p-7 space-y-2.5 text-xs text-[#4B5B76]">
                <div className="flex gap-2"><strong>1.</strong><span>Negative mark leakage diagnostic radar</span></div>
                <div className="flex gap-2"><strong>2.</strong><span>144-second velocity benchmarks</span></div>
                <div className="flex gap-2"><strong>3.</strong><span>Chapter-lag telemetry: weak areas</span></div>
                <div className="flex gap-2"><strong>4.</strong><span>Breaking past the 140 score plateau</span></div>
                <div className="flex gap-2"><strong>5.</strong><span>All-India percentile normalization</span></div>
                <div className="flex gap-2"><strong>6.</strong><span>Targeted re-attempt error logging</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. TRANSPARENT COMPARISON TABLE (#comparison)
          ========================================================================= */}
      <section id="comparison" className="py-24 sm:py-32 bg-white border-y border-[#E3EAF6] scroll-mt-20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold text-[#1A5FE0] mb-3">
              TRANSPARENT COMPARISON
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0B1526] tracking-tight">
              StudyFAM vs Paid Coaching Test Series
            </h2>
            <p className="text-base text-[#4B5B76] mt-2">
              See why 48,000+ JEE aspirants choose StudyFAM&apos;s open-access model.
            </p>
          </div>

          <div className="bg-[#F6F9FF] rounded-3xl border border-[#E3EAF6] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-[#E3EAF6]">
                    <th className="p-4 sm:p-5 font-bold text-[#0B1526] w-2/5">Capability</th>
                    <th className="p-4 sm:p-5 font-extrabold text-[#1A5FE0] w-2/5">StudyFAM Platform</th>
                    <th className="p-4 sm:p-5 font-medium text-slate-500 w-1/5">Paid Packages</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3EAF6]">
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0B1526]">Cost / Access Fee</td>
                    <td className="p-4 sm:p-5 font-extrabold text-emerald-600">100% Free Forever (₹0)</td>
                    <td className="p-4 sm:p-5 text-slate-500">₹4,000 – ₹15,000 / year</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0B1526]">Full-Length Mocks</td>
                    <td className="p-4 sm:p-5 font-bold text-[#1A5FE0]">10 Full Papers (MFT 01–10)</td>
                    <td className="p-4 sm:p-5 text-slate-500">Limited to 2–3 free, then locked</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0B1526]">Chapter-wise Tests</td>
                    <td className="p-4 sm:p-5 font-bold text-[#1A5FE0]">300+ Tests (9,300+ Qs)</td>
                    <td className="p-4 sm:p-5 text-slate-500">Restricted to coaching batches</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0B1526]">TCS iON CBT Interface</td>
                    <td className="p-4 sm:p-5 font-extrabold text-emerald-600">100% Official Palette & Keypad</td>
                    <td className="p-4 sm:p-5 text-slate-500">Generic mobile web app</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0B1526]">Instant Solutions</td>
                    <td className="p-4 sm:p-5 font-extrabold text-emerald-600">Instant Submit Access</td>
                    <td className="p-4 sm:p-5 text-slate-500">Often delayed by 24–48h</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0B1526]">Sign-up Friction</td>
                    <td className="p-4 sm:p-5 font-extrabold text-emerald-600">No OTP / Instant Launch</td>
                    <td className="p-4 sm:p-5 text-slate-500">Telemarketing calls & spam</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#0B1526]">Exam Fee Refund Pool</td>
                    <td className="p-4 sm:p-5 font-extrabold text-emerald-600">Win 100% NTA Fees (27 Dec)</td>
                    <td className="p-4 sm:p-5 text-slate-500">No refunds or scholarships</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          12. STUDENT STORIES (AUTHENTIC REVIEWS FROM 99+ PERCENTILERS)
          ========================================================================= */}
      <section className="py-24 sm:py-32 bg-[#F6F9FF]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3EAF6] text-xs font-extrabold text-[#1A5FE0] mb-3">
              AUTHENTIC STUDENT REVIEWS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0B1526] tracking-tight">
              Real Stories from 99+ Percentilers
            </h2>
            <p className="text-base sm:text-lg text-[#4B5B76] mt-3">
              How authentic CBT simulation eliminated exam day panic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Story 1 */}
            <div className="bg-white rounded-3xl p-7 border border-[#E3EAF6] shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-amber-500 text-sm mb-3">★★★★★</div>
                <p className="text-xs sm:text-sm text-[#4B5B76] leading-relaxed">
                  &ldquo;The TCS iON replica is uncannily accurate. When I sat for JEE Main Session 1, the exam center screen looked 100% like StudyFam MFT-04. Scored 99.42%ile in Physics.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <strong className="text-xs font-black text-[#0B1526] block">Aarav S.</strong>
                <span className="text-[11px] font-bold text-[#1A5FE0]">99.42%ile · IIT Roorkee Aspirant</span>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-white rounded-3xl p-7 border border-[#E3EAF6] shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-amber-500 text-sm mb-3">★★★★★</div>
                <p className="text-xs sm:text-sm text-[#4B5B76] leading-relaxed">
                  &ldquo;The 3-strike tab lockout forced genuine exam discipline. Other test portals allow tab switching which gives fake confidence. StudyFam gave me real percentiles.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <strong className="text-xs font-black text-[#0B1526] block">Sneha P.</strong>
                <span className="text-[11px] font-bold text-emerald-600">99.78%ile JEE Main · Delhi</span>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-white rounded-3xl p-7 border border-[#E3EAF6] shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-amber-500 text-sm mb-3">★★★★★</div>
                <p className="text-xs sm:text-sm text-[#4B5B76] leading-relaxed">
                  &ldquo;The chapter-lag diagnostic showed me I was bleeding 16 marks in Electrochemistry NVQs. Fixed it in 5 days before Session 2 and jumped from 168 to 224.&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <strong className="text-xs font-black text-[#0B1526] block">Rohan V.</strong>
                <span className="text-[11px] font-bold text-purple-600">99.15%ile · Kota Batch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          13. OFFICIAL FAQ ACCORDION (#faq)
          ========================================================================= */}
      <section id="faq" className="py-24 sm:py-32 bg-white border-y border-[#E3EAF6] scroll-mt-20">
        <div className="max-w-[840px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold text-[#1A5FE0] mb-3">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0B1526] tracking-tight">
              Let&apos;s Clear a Few Things Up
            </h2>
            <p className="text-base text-[#4B5B76] mt-2">
              Everything you need to know about the 10 free mocks and the 27 Dec scholarship exam.
            </p>
          </div>

          <div className="space-y-3.5">
            {HOME_FAQS.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => toggleFaq(idx)}
                className={`rounded-2xl border transition-all cursor-pointer p-5 sm:p-6 ${
                  openFaq === idx
                    ? "bg-[#F6F9FF] border-[#1A5FE0] shadow-md shadow-blue-600/5"
                    : "bg-white border-[#E3EAF6] hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#0B1526]">
                    {faq.q}
                  </h3>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-transform ${
                      openFaq === idx
                        ? "bg-[#1A5FE0] text-white rotate-45"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    +
                  </div>
                </div>

                {openFaq === idx && (
                  <div className="mt-3 pt-3 border-t border-[#E3EAF6] text-xs sm:text-sm text-[#4B5B76] leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          14. FINAL CALL TO ACTION BANNER
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#F6F9FF]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0A1C96] via-[#1A5FE0] to-[#2F8FFF] text-white p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-bold text-white mb-4">
              START YOUR PREPARATION TODAY
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Practice Better. Score Higher.
            </h2>
            <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto mb-8 leading-relaxed">
              Stop guessing your exam readiness. Experience authentic TCS iON CBT simulation with 10 free full-length major mocks today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="/exam/player?id=MFT-1.pdf"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#0A1C96] font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-colors"
              >
                Launch Test MFT-01 Free
              </a>
              <a
                href="#all-india-mock"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/15 border border-white/30 text-white font-extrabold text-sm hover:bg-white/20 transition-colors"
              >
                Explore 27 Dec Exam (₹27)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          15. MODERN 4-COLUMN FOOTER
          ========================================================================= */}
      <footer className="bg-[#0B1526] text-white pt-16 pb-28 sm:pb-20 border-t border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Col 1: Brand */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1A5FE0] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-xl font-black tracking-tight">StudyFAM</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                India&apos;s premier community-driven Free JEE Main CBT Mock Examination and National Scholarship Platform. Built by IITians for future IITians.
              </p>
              <div className="text-[11px] text-slate-500 font-mono">
                10 Full MFTs · 300+ Chapter Tests · 750 Curated NTA Qs
              </div>
            </div>

            {/* Col 2: Free Practice */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">Free Practice</div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="/exam/player?id=MFT-1.pdf" className="hover:text-white transition-colors">MFT-01 (Mechanics)</a></li>
                <li><a href="/exam/player?id=MFT-2.pdf" className="hover:text-white transition-colors">MFT-02 (Electrodynamics)</a></li>
                <li><a href="/exam/player?id=MFT-3.pdf" className="hover:text-white transition-colors">MFT-03 to MFT-10</a></li>
                <li><a href="#chapter-tests" className="hover:text-white transition-colors">300+ Chapter Tests</a></li>
                <li><a href="#cbt-engine" className="hover:text-white transition-colors">TCS iON CBT Simulator</a></li>
              </ul>
            </div>

            {/* Col 3: 27 Dec Mock */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">27 Dec Mock</div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#all-india-mock" className="hover:text-white transition-colors">All-India Major Mock</a></li>
                <li><a href="#all-india-mock" className="hover:text-white transition-colors">₹15L Scholarship Pool</a></li>
                <li><a href="#all-india-mock" className="hover:text-white transition-colors">100% Fee Refund Rules</a></li>
                <li><a href="#comparison" className="hover:text-white transition-colors">Platform Comparison</a></li>
                <li><a href="#register" className="hover:text-white transition-colors">Priority Waitlist</a></li>
              </ul>
            </div>

            {/* Col 4: Legal & Support */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal & Support</div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About StudyFAM</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Legal Disclaimer & Copyright */}
          <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-500 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>© 2026 StudyFAM Education. All rights reserved.</span>
              <span>Crafted for JEE Main 2027 Aspirants across India.</span>
            </div>
            <p className="text-slate-600 leading-normal">
              Disclaimer: StudyFAM is an independent testing and academic research platform. StudyFAM is not affiliated with, endorsed by, or sponsored by the National Testing Agency (NTA), TCS iON, or the Ministry of Education, Government of India. JEE (Main) is a registered trademark of the National Testing Agency.
            </p>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          16. MOBILE STICKY BOTTOM ACTION BAR
          ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3EAF6] p-3 sm:hidden shadow-lg flex items-center gap-2">
        <a
          href="/exam/player?id=MFT-1.pdf"
          className="flex-1 py-3 rounded-full text-center text-xs font-extrabold bg-[#1A5FE0] text-white shadow-md"
        >
          Launch MFT-01 Free
        </a>
        <a
          href="#all-india-mock"
          className="flex-1 py-3 rounded-full text-center text-xs font-extrabold bg-slate-100 text-[#0B1526] border border-slate-200"
        >
          27 Dec Exam (₹27)
        </a>
      </div>
    </div>
  );
}
