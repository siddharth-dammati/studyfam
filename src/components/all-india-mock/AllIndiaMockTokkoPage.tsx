"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/sections/Footer";
import { RegistrationModal } from "@/components/ui/RegistrationModal";
import { ShareModal } from "@/components/ui/ShareModal";
import { useRegistrationState } from "@/hooks/useRegistrationState";
import {
  ShieldCheck,
  Award,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  HelpCircle,
  Zap,
  BarChart3,
  Calendar,
  Lock,
  Share2,
} from "lucide-react";

export function AllIndiaMockTokkoPage() {
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const { isOpen } = useRegistrationState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isRegModalOpen, setRegModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  // Countdown to 27 Dec 2026, 09:00 IST (Exam Day)
  const examTarget = new Date("2026-12-27T09:00:00+05:30").getTime();
  const [examCountdown, setExamCountdown] = useState({ d: "69", h: "10", m: "33", s: "02" });

  useEffect(() => {
    const tickExam = () => {
      const diff = examTarget - Date.now();
      if (diff > 0) {
        const d = String(Math.floor(diff / 864e5));
        const h = String(Math.floor((diff / 36e5) % 24)).padStart(2, "0");
        const m = String(Math.floor((diff / 6e4) % 60)).padStart(2, "0");
        const s = String(Math.floor((diff / 1e3) % 60)).padStart(2, "0");
        setExamCountdown({ d, h, m, s });
      } else {
        setExamCountdown({ d: "00", h: "00", m: "00", s: "00" });
      }
    };
    tickExam();
    const interval = setInterval(tickExam, 1000);
    return () => clearInterval(interval);
  }, [examTarget]);

  // Countdown to 20 Oct 2026, 00:00 IST (Registration Date)
  const regTarget = new Date("2026-10-20T00:00:00+05:30").getTime();
  const [regClock, setRegClock] = useState({ text: "Registrations open in", time: "--", live: false });

  useEffect(() => {
    const tickReg = () => {
      const now = Date.now();
      const diff = regTarget - now;
      if (diff <= 0 || isOpen) {
        setRegClock({ text: "Registrations are LIVE", time: "● OPEN NOW", live: true });
      } else {
        const d = Math.floor(diff / 864e5);
        const h = String(Math.floor((diff / 36e5) % 24)).padStart(2, "0");
        const m = String(Math.floor((diff / 6e4) % 60)).padStart(2, "0");
        const s = String(Math.floor((diff / 1e3) % 60)).padStart(2, "0");
        const timeStr = d > 0 ? `${d}d : ${h}h : ${m}m : ${s}s` : `${h}h : ${m}m : ${s}s`;
        setRegClock({ text: "Registrations open in", time: timeStr, live: false });
      }
    };
    tickReg();
    const interval = setInterval(tickReg, 1000);
    return () => clearInterval(interval);
  }, [regTarget, isOpen]);

  // Scroll Nav Shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pre-Registration Form State
  const [regForm, setRegForm] = useState({ name: "", phone: "", stream: "class-12", track: "merit" });
  const [regSuccess, setRegSuccess] = useState(false);

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone) return;
    try {
      localStorage.setItem("sf_scholarship_waitlist", JSON.stringify(regForm));
    } catch {}
    setRegSuccess(true);
  };

  return (
    <div className="all-india-mock-page font-sans text-[#1a1a1a] bg-[#fafafa]">
      {/* Scoped Tokko Design System CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root{--bg:#fafafa;--card:#fff;--ink:#1a1a1a;--mut:#555;--mut2:#888;--line:rgba(26,26,26,.1);--b0:#0a1c96;--b1:#1a5fe0;--b2:#2f8fff;--lav:#d6aef2;--lavbg:#f3e9fd;--tint:#e9f1fd;--grn:#16a34a;--grnbg:#dcfce7;--gold:#f59e0b;--r-s:16px;--r-m:24px;--r-l:32px;--r-xl:100px}
        .all-india-mock-page{line-height:1.3;letter-spacing:-.02em;-webkit-font-smoothing:antialiased}
        .all-india-mock-page h1,.all-india-mock-page h2,.all-india-mock-page h3{font-weight:700;letter-spacing:-.04em;line-height:1.05;text-wrap:balance}
        .all-india-mock-page a{color:inherit;text-decoration:none}
        .wrap{max-width:1200px;margin:0 auto;padding:0 24px}
        section[id]{scroll-margin-top:80px}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:600;border-radius:var(--r-xl);padding:16px 34px;font-size:16px;border:1.5px solid transparent;cursor:pointer;transition:transform .18s,box-shadow .2s,background .2s;font-family:inherit;letter-spacing:-.02em;white-space:nowrap}
        .btn:active{transform:scale(.97)}
        .btn-dark{background:var(--b1);color:#fff}
        .btn-dark:hover{background:var(--b0);transform:translateY(-2px);box-shadow:0 18px 34px -16px rgba(26,95,224,.55)}
        .btn-blue{background:linear-gradient(135deg,#0a1c96,#1f6ff2);color:#fff;box-shadow:0 18px 36px -16px rgba(26,95,224,.6)}
        .btn-blue:hover{transform:translateY(-2px)}
        .btn-ghost{background:#fff;border-color:var(--line);color:var(--ink)}
        .btn-ghost:hover{border-color:var(--b1)}
        .btn-lav{background:var(--lav);color:#1a1a1a}
        .btn-lav:hover{background:#c89be9;transform:translateY(-2px)}
        .btn-line{border-color:rgba(255,255,255,.35);background:transparent;color:#fff}
        .btn-line:hover{border-color:#fff;background:rgba(255,255,255,.1)}
        .btn-sm{padding:10px 22px;font-size:14px}
        .ann{background:linear-gradient(100deg,#0a1c96,#1a5fe0 60%,#1f6ff2);color:#fff;font-size:13.5px;text-align:center;padding:10px 16px;font-weight:500}
        .ann .tag{background:var(--lav);color:#1a1a1a;font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:var(--r-xl);margin-right:10px}
        .ann b{color:var(--lav)}
        nav{position:sticky;top:0;z-index:50;background:rgba(250,250,250,.85);backdrop-filter:blur(16px);border-bottom:1px solid var(--line);transition:box-shadow .25s}
        nav.scrolled{box-shadow:0 14px 30px -20px rgba(0,0,0,.2)}
        .nav-in{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 24px;max-width:1200px;margin:0 auto}
        .logo{display:inline-flex;align-items:center;flex-shrink:0}
        .logo-img{height:32px;width:auto;display:block;object-fit:contain}
        .nav-links{display:flex;gap:26px;font-size:15px;font-weight:500}
        .nav-links a{opacity:.75;transition:opacity .2s}
        .nav-links a:hover{opacity:1;color:var(--b1)}
        .hero{padding:60px 0 54px;position:relative;overflow:hidden}
        .hero::before{content:"";position:absolute;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(214,174,242,.35),transparent 65%);top:-220px;right:-180px;pointer-events:none}
        .hero::after{content:"";position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(47,143,255,.2),transparent 65%);bottom:-260px;left:-180px;pointer-events:none}
        .hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center;position:relative;z-index:1}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:var(--r-xl);padding:8px 18px;font-size:13.5px;font-weight:600}
        .hero-badge i{width:8px;height:8px;border-radius:50%;background:var(--grn)}
        .hero h1{font-size:clamp(38px,6vw,84px);margin:18px 0 16px;letter-spacing:-.04em}
        .hero h1 .hl{color:var(--b1)}
        .hero h1 .u{position:relative;white-space:nowrap}
        .hero h1 .u svg{position:absolute;left:0;right:0;bottom:-.12em;width:100%;height:.28em}
        .sub{font-size:18px;color:var(--mut);max-width:580px;line-height:1.45}
        .sub strong{color:var(--ink)}
        .cta-row{display:flex;gap:12px;flex-wrap:wrap;margin:26px 0 12px}
        .cta-note{font-size:13px;color:var(--mut2)}
        .hero-stats{display:grid;grid-template-columns:repeat(4,auto);gap:8px 32px;margin-top:30px;justify-content:start}
        .hero-stats div b{font-size:30px;font-weight:700;display:block;font-variant-numeric:tabular-nums;letter-spacing:-.04em}
        .hero-stats div span{font-size:13px;color:var(--mut2)}
        
        /* Tokko Ticket Visual */
        .ticket{background:#fff;border-radius:24px;border:1.5px solid var(--line);padding:24px;box-shadow:0 30px 60px -25px rgba(10,28,150,.35);position:relative}
        .ticket-head{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--b0);margin-bottom:16px;padding-bottom:12px;border-bottom:1px dashed var(--line)}
        .ticket-body{display:grid;grid-template-columns:1fr 90px;gap:16px;align-items:center}
        .ticket-body dl{margin:0;display:grid;grid-template-columns:90px 1fr;gap:6px;font-size:13px}
        .ticket-body dt{color:var(--mut2);font-weight:600}
        .ticket-body dd{margin:0;font-weight:700;color:var(--ink)}
        .ticket .photo{width:90px;height:105px;background:#f3f4f6;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:36px;border:1px solid var(--line)}
        .barcode{height:36px;background:repeating-linear-gradient(90deg,#1a1a1a,#1a1a1a 2px,transparent 2px,transparent 5px,#1a1a1a 5px,#1a1a1a 9px,transparent 9px,transparent 12px);margin:16px 0 12px;border-radius:4px;opacity:.85}
        .ticket-foot{display:flex;justify-content:space-between;font-size:11px;color:var(--mut2);font-family:monospace;font-weight:600}
        
        /* Section Kick & Titles */
        section{padding:72px 0}
        .kick{display:inline-block;font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--b1);background:var(--tint);padding:6px 18px;border-radius:var(--r-xl);margin-bottom:14px}
        .sec-title{font-size:clamp(30px,4.5vw,62px);max-width:860px}
        .sec-sub{font-size:17.5px;color:var(--mut);max-width:680px;margin-top:12px;line-height:1.45}
        .center{text-align:center}
        .center .sec-title,.center .sec-sub{margin-left:auto;margin-right:auto}
        
        /* Reg Open Live Bar */
        .reg-open{display:inline-flex;align-items:center;gap:10px;padding:9px 20px;border-radius:var(--r-xl);background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:14px;margin-bottom:20px}
        .reg-open.live .ro-dot{background:#4ade80;box-shadow:0 0 12px #4ade80}
        .ro-dot{width:8px;height:8px;border-radius:50%;background:#fbbf24}
        .ro-time{font-family:monospace;font-size:15px;letter-spacing:.02em}

        /* Countdown Grid */
        .count{display:flex;gap:12px;margin:20px 0}
        .count div{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:16px;padding:10px 16px;min-width:64px;text-align:center}
        .count div b{font-size:24px;font-weight:700;display:block;color:#fff;line-height:1}
        .count div span{font-size:11px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.05em}

        .menu-btn{display:none;place-items:center;width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:#fff;font-size:17px;cursor:pointer;color:var(--ink);flex-shrink:0;font-family:inherit}
        .mnav{display:none;border-top:1px solid var(--line);background:var(--bg);padding:8px 24px 18px}
        .mnav.open{display:grid}
        .mnav a, .mnav button{font-weight:600;font-size:15px;padding:11px 4px;border-bottom:1px solid var(--line);text-align:left;background:none;border-left:none;border-right:none;border-top:none;cursor:pointer;font-family:inherit;color:inherit}
        .mnav a:last-child, .mnav button:last-child{border-bottom:none}

        /* Responsive breakpoints */
        @media(max-width:960px){
          .hero-grid{grid-template-columns:1fr;gap:36px}
          .nav-links{display:none}
          .menu-btn{display:grid}
          .hero-stats{grid-template-columns:repeat(2,1fr);gap:16px 24px}
        }
      `}} />

      {/* Sticky Navbar */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-in">
          <Link className="logo" href="/" aria-label="StudyFAM home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-blue.png" alt="StudyFAM" className="logo-img" />
          </Link>

          <div className="nav-links">
            <a href="#overview">Overview</a>
            <a href="#fee-split">₹18 Fee Pool</a>
            <a href="#tracks">Scholarship Tracks</a>
            <a href="#advantages">Advantages</a>
            <a href="#pattern">Exam Pattern</a>
            <Link href="/exam">10 Free MFTs</Link>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setShareModalOpen(true)}
              className="btn btn-ghost btn-sm"
              title="Share with classmates"
            >
              <Share2 size={14} className="text-blue-600" />
              <span className="hidden sm:inline">Share ₹27 Mock</span>
            </button>

            <button
              onClick={() => setRegModalOpen(true)}
              className="btn btn-blue btn-sm"
            >
              <span>{isOpen ? "Register for ₹27 →" : "Pre-Register / Alert →"}</span>
            </button>

            {user ? (
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                Dashboard
              </Link>
            ) : null}

            <button
              className="menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mnav ${mobileOpen ? "open" : ""}`}>
          <a href="#overview" onClick={() => setMobileOpen(false)}>Overview</a>
          <a href="#fee-split" onClick={() => setMobileOpen(false)}>₹18 Fee Pool</a>
          <a href="#tracks" onClick={() => setMobileOpen(false)}>Scholarship Tracks</a>
          <a href="#advantages" onClick={() => setMobileOpen(false)}>Why StudyFAM</a>
          <a href="#pattern" onClick={() => setMobileOpen(false)}>Exam Pattern</a>
          <Link href="/exam" onClick={() => setMobileOpen(false)}>10 Free Full MFTs</Link>
          <Link href="/percentile-analyzer" onClick={() => setMobileOpen(false)}>Percentile Analyzer</Link>
          {user ? (
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>My Dashboard →</Link>
          ) : (
            <button
              onClick={() => { signInWithGoogle("/dashboard"); setMobileOpen(false); }}
              style={{ color: "var(--b1)", fontWeight: 700 }}
            >
              Sign in with Google →
            </button>
          )}
        </div>
      </nav>

      {/* 3. Hero Section (Dedicated Scholarship Focus) */}
      <header className="hero" id="overview">
        <div className="wrap hero-grid">
          <div>
            <span className="hero-badge">
              <i></i> Official CBT Scholarship Exam · 27 Dec 2026 · Entry ₹27
            </span>

            <h1>
              Win your full <span className="hl">JEE Main</span> exam fee{" "}
              <span className="u">
                back.
                <svg viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path d="M4 14 C 80 4, 220 4, 296 12" stroke="#d6aef2" strokeWidth="7" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="sub">
              Compete with thousands of JEE 2027 aspirants nationwide on <strong>Sunday, 27 Dec 2026 (9:00 AM – 12:00 PM IST)</strong>. For a transparent ₹27 entry, <strong>₹18 is escrowed directly into the Student Scholarship Pool</strong> to refund 100% of your official NTA exam fee (₹1,000 Boys / ₹800 Girls).
            </p>

            <div className="cta-row">
              <button
                onClick={() => setRegModalOpen(true)}
                className="btn btn-blue"
              >
                <span>{isOpen ? "Register Now (₹27) →" : "Pre-Register / Priority Alert →"}</span>
              </button>

              <a className="btn btn-ghost" href="#fee-split">
                How ₹18 Pool Works ↓
              </a>

              <Link className="btn btn-ghost" href="/exam">
                Practice 10 Free MFTs
              </Link>
            </div>

            <p className="cta-note">
              Registrations open 20 Oct 2026 · 100% NTA pattern (75 Qs) · Verified escrow pool · UPI refunds in 7 days
            </p>

            {/* Hero Key Metrics */}
            <div className="hero-stats">
              <div>
                <b>₹27</b>
                <span>Entry fee</span>
              </div>
              <div>
                <b style={{ color: "var(--b1)" }}>₹18</b>
                <span>Escrowed to pool</span>
              </div>
              <div>
                <b style={{ color: "var(--grn)" }}>100%</b>
                <span>NTA fee refund</span>
              </div>
              <div>
                <b>50:50</b>
                <span>Merit + Need tracks</span>
              </div>
            </div>
          </div>

          {/* Hero Visual: E-Admit Card Specimen + Countdown */}
          <div>
            <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-[#0a1c96] via-[#1a5fe0] to-[#123ac8] text-white shadow-xl relative overflow-hidden">
              <div
                className="absolute w-72 h-72 rounded-full -top-20 -right-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(214, 174, 242, 0.4), transparent 70%)" }}
              />

              <div className={`reg-open ${regClock.live ? "live" : ""}`}>
                <span className="ro-dot"></span>
                <span className="ro-text">{regClock.text}</span>
                <b className="ro-time">{regClock.time}</b>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                All-India JEE Main 2027 Mock
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mb-4">
                Sunday, 27 Dec 2026 · 09:00 AM – 12:00 PM IST · Proctored Online CBT Mode
              </p>

              {/* Countdown */}
              <div className="count">
                <div><b>{examCountdown.d}</b><span>Days</span></div>
                <div><b>{examCountdown.h}</b><span>Hours</span></div>
                <div><b>{examCountdown.m}</b><span>Mins</span></div>
                <div><b>{examCountdown.s}</b><span>Secs</span></div>
              </div>

              {/* Specimen Admit Slip */}
              <div className="ticket text-slate-900 mt-5">
                <div className="ticket-head">
                  <span>🎫 STUDYFAM OFFICIAL HALL TICKET</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono text-[10px]">
                    VERIFIED SPECIMEN
                  </span>
                </div>
                <div className="ticket-body">
                  <dl>
                    <dt>Exam</dt><dd>All-India Mock 2027</dd>
                    <dt>Roll No.</dt><dd className="font-mono text-[#0a1c96]">SF-2026-042517</dd>
                    <dt>Date</dt><dd>27 Dec 2026 · 09:00 AM</dd>
                    <dt>Reporting</dt><dd>08:00 AM (Gate closes 08:30)</dd>
                    <dt>Syllabus</dt><dd>Full Physics, Chem, Maths</dd>
                  </dl>
                  <div className="photo">
                    <span className="text-3xl">👨‍🎓</span>
                    <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">CANDIDATE</span>
                  </div>
                </div>
                <div className="barcode"></div>
                <div className="ticket-foot">
                  <span>Anti-Cheat Proctored · Tab Lock</span>
                  <span>studyfam.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Love / Trust Strip */}
      <div className="border-y border-[rgba(26,26,26,0.08)] bg-white py-5 text-center">
        <div className="wrap">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Why India&apos;s JEE Aspirants Trust the 27 Dec National Stage
          </p>
          <div className="flex gap-2.5 flex-wrap justify-center text-xs font-semibold text-slate-700">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200">
              ✓ ₹18 per student escrowed
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200">
              ✓ 100% NTA Application Fee Refund
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200">
              ✓ 50:50 Merit &amp; Need-based tracks
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200">
              ✓ 50:50 Boy–Girl representation
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200">
              ✓ Ranks within 48 hrs · UPI in 7 days
            </span>
          </div>
        </div>
      </div>

      <main>
        {/* 5. THE SCHOLARSHIP POOL & FEE BREAKDOWN SECTION (Crucial user request) */}
        <section id="fee-split" className="bg-[#f8fafc] border-b border-[rgba(26,26,26,0.08)]">
          <div className="wrap">
            <div className="center mb-12">
              <span className="kick">Transparent Student Economics</span>
              <h2 className="sec-title">Where does your ₹27 entry fee go?</h2>
              <p className="sec-sub center">
                No corporate profits. No hidden margins. StudyFAM operates an audited community escrow model where student registrations directly fund peer scholarships.
              </p>
            </div>

            {/* 2-Column Fee Split Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Card 1: ₹18 Escrow Pool */}
              <div className="bg-white border-2 border-emerald-500/30 rounded-[28px] p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-mono text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                  66.7% Escrowed
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-2xl font-mono">
                      ₹18
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Student Fee Support Pool
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        Direct Escrow Account · Audited Payouts
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    <strong>Every single rupee of this ₹18 is locked in escrow</strong> and returned directly to top-performing and deserving candidates as full NTA registration refunds:
                  </p>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>₹1,000 Full Refund</strong> for top-ranked Male candidates (official NTA general/OBC fee).
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>₹800 Full Refund</strong> for top-ranked Female candidates (official NTA female concession fee).
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Direct UPI / Bank SLA:</strong> Verified disbursement directly to student UPI within 7 business days.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-emerald-700 font-bold">
                  <span>Zero Corporate Retention</span>
                  <span>100% Back to Students</span>
                </div>
              </div>

              {/* Card 2: ₹9 Platform Operations */}
              <div className="bg-white border border-[rgba(26,26,26,0.1)] rounded-[28px] p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-blue-600 text-white font-mono text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                  33.3% Cloud &amp; Ops
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-2xl font-mono">
                      ₹9
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        High-Concurrency CBT Cloud
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        Anti-Cheat, Proctoring &amp; Infrastructure
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    Covers actual computing and technical costs to host a nationwide synchronized exam without server bottlenecks:
                  </p>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>100,000+ Concurrent Cloud:</strong> Zero server crashes during the high-load 9 AM exam start.
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Anti-Cheat Telemetry:</strong> Fullscreen lock, tab-switching detection, and anomalous click monitoring.
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Gateway &amp; SMS Costs:</strong> Payment gateway charges, GST, and SMS/WhatsApp admit slips.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500 font-bold">
                  <span>Audited Non-Profit Model</span>
                  <span>Published Escrow Ledger</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill */}
            <div className="mt-8 text-center">
              <Link
                href="/transparency"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0a1c96] hover:underline"
              >
                <span>Read the published Escrow &amp; Audit Governance Policy</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. DUAL TRACK ARCHITECTURE SECTION */}
        <section id="tracks" className="border-b border-[rgba(26,26,26,0.08)] bg-white">
          <div className="wrap">
            <div className="center mb-12">
              <span className="kick">Fair &amp; Inclusive Allocation</span>
              <h2 className="sec-title">Dual-track scholarship framework.</h2>
              <p className="sec-sub center">
                We believe financial background should never obstruct talent. Our pool is split equally into two distinct pathways with mandatory 50:50 gender parity across all tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Track A: Pure Merit */}
              <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#0a1c96] to-[#1a5fe0] text-white shadow-md space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
                  <span>Track 1 · 50% of Pool</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  🏅 Pure Academic Merit
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Determined 100% by your test score and percentile on 27 Dec. No financial documentation, income certificates, or affidavits required. Rank is everything.
                </p>
                <div className="pt-2 border-t border-white/15 space-y-2 text-xs font-mono text-blue-200">
                  <div className="flex items-center justify-between">
                    <span>Target Rankers</span>
                    <strong className="text-white">Top Percentiles</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gender Parity</span>
                    <strong className="text-white">50% Boys · 50% Girls</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Award</span>
                    <strong className="text-emerald-300">100% NTA Fee Refund</strong>
                  </div>
                </div>
              </div>

              {/* Track B: Need-Based Merit */}
              <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#123ac8] to-[#1f6ff2] text-white shadow-md space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
                  <span>Track 2 · 50% of Pool</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  🤝 Need-Based Merit Support
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Reserved for students from families with annual income ≤ ₹8 Lakh (verified post-exam). Same full NTA fee refund, ensuring economic background never halts prep.
                </p>
                <div className="pt-2 border-t border-white/15 space-y-2 text-xs font-mono text-blue-200">
                  <div className="flex items-center justify-between">
                    <span>Income Threshold</span>
                    <strong className="text-white">≤ ₹8 LPA (Verified)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gender Parity</span>
                    <strong className="text-white">50% Boys · 50% Girls</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Award</span>
                    <strong className="text-emerald-300">100% NTA Fee Refund</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* The Roll-Over Guarantee */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 max-w-4xl mx-auto flex items-start space-x-3 text-xs sm:text-sm text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>The Roll-Over Guarantee:</strong> If a student qualifies under both tracks, they are rewarded under Pure Merit, and their Need-Based slot immediately rolls down to the next ranker. If any student opts out or is disqualified for malpractice, 100% of the funds roll over. Zero escrow forfeiture.
              </div>
            </div>
          </div>
        </section>

        {/* 7. DYNAMIC MILESTONE SCALING (How the pool grows) */}
        <section id="pool-scaling" className="bg-[#fafafa] border-b border-[rgba(26,26,26,0.08)]">
          <div className="wrap">
            <div className="center mb-12">
              <span className="kick">Exponential Community Scale</span>
              <h2 className="sec-title">More registrations = More winners.</h2>
              <p className="sec-sub center">
                Because ₹18 from every single registration is pooled, our scholarship fund grows directly as awareness spreads.
              </p>
            </div>

            {/* Milestones Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 max-w-5xl mx-auto">
              {[
                { reg: "1,000", pool: "₹18,000", students: "20 Students", merit: "10B + 10G" },
                { reg: "5,000", pool: "₹90,000", students: "100 Students", merit: "50B + 50G" },
                { reg: "10,000", pool: "₹1,80,000", students: "200 Students", merit: "100B + 100G" },
                { reg: "25,000", pool: "₹4,50,000", students: "500 Students", merit: "250B + 250G" },
                { reg: "50,000", pool: "₹9,00,000", students: "1,000 Students", merit: "500B + 500G" },
                { reg: "1,00,000", pool: "₹18,00,000", students: "2,000 Students", merit: "1,000B + 1,000G" },
              ].map((m, i) => (
                <div
                  key={i}
                  className="bg-white border border-[rgba(26,26,26,0.08)] rounded-2xl p-4 text-center shadow-2xs hover:border-[#1a5fe0] transition-colors"
                >
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-400">
                    At {m.reg} Registrations
                  </div>
                  <div className="text-base font-bold text-[#0a1c96] font-mono mt-1">
                    {m.pool}
                  </div>
                  <div className="text-xs font-extrabold text-emerald-600 mt-0.5">
                    {m.students}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {m.merit}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[rgba(26,26,26,0.12)] text-xs font-bold text-slate-800 hover:border-[#1a5fe0] shadow-2xs transition-all active:scale-95"
              >
                <Share2 size={13} className="text-blue-600" />
                <span>Share with Study Groups &amp; Expand the Pool</span>
              </button>
            </div>
          </div>
        </section>

        {/* 8. CANDIDATE ADVANTAGES (Why You Must Take This Test) */}
        <section id="advantages" className="bg-white border-b border-[rgba(26,26,26,0.08)]">
          <div className="wrap">
            <div className="center mb-12">
              <span className="kick">Candidate Value</span>
              <h2 className="sec-title">What you gain by writing on 27 Dec.</h2>
              <p className="sec-sub center">
                The ₹27 entry fee unlocks more than just a test paper. It gives you the single most authentic dress rehearsal for the actual January JEE Main.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-[24px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  1. Zero Financial Risk (37x Value)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A ₹27 registration can earn you a ₹1,000 cash refund on your official NTA application fee. Even if you do not win, you receive an authentic 180-min diagnostic benchmark.
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  2. True National Sample Size
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Taking tests with 200 local coaching batchmates creates false confidence. Competing against thousands nationwide calculates your genuine All-India Percentile.
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  3. Exact TCS iON CBT Engine
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Full simulation of the official NTA terminal: 5-state question palette, live countdown, Section A/B layout, and question paper views. Zero surprise on exam day.
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Clock size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  4. Per-Question Speed Stopwatch
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Discover where you lose time. Our telemetry reveals the exact seconds spent on correct, incorrect, and guessed questions to fix negative marking.
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  5. Detailed Step-by-Step Solutions
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  No waiting days for answers. Detailed textbook explanations for all 75 questions are published immediately once the synchronized window closes.
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <Award size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  6. E-Admit Card &amp; Roll Number
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Verified candidate hall ticket with barcode and reporting guidelines. Conditions your mental psychology for real exam-day reporting and verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. EXAM SCHEDULE & OFFICIAL CBT SPECIFICATIONS */}
        <section id="pattern" className="bg-[#f8fafc] border-b border-[rgba(26,26,26,0.08)]">
          <div className="wrap">
            <div className="center mb-12">
              <span className="kick">NTA Exam Blueprint</span>
              <h2 className="sec-title">Official Paper 1 CBT Structure.</h2>
              <p className="sec-sub center">
                Conducted strictly under NTA Computer Based Test guidelines for B.E. / B.Tech aspirants.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-[32px] border border-[rgba(26,26,26,0.08)] p-6 sm:p-10 shadow-sm space-y-8">
              {/* Timing Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Exam Date</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">27 Dec 2026</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Window</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">09:00 AM – 12:00 PM</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Reporting</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">08:00 AM IST</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Gate Closes</div>
                  <div className="text-sm sm:text-base font-bold text-rose-600 mt-0.5">08:30 AM IST</div>
                </div>
              </div>

              {/* Subject Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span className="text-blue-700">Physics</span>
                    <span>25 Qs · 100M</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    20 MCQs (Sec A) + 5 Numericals (Sec B)<br />
                    Marking: +4 / -1 / 0
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span className="text-emerald-700">Chemistry</span>
                    <span>25 Qs · 100M</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    20 MCQs (Sec A) + 5 Numericals (Sec B)<br />
                    Marking: +4 / -1 / 0
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span className="text-purple-700">Mathematics</span>
                    <span>25 Qs · 100M</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    20 MCQs (Sec A) + 5 Numericals (Sec B)<br />
                    Marking: +4 / -1 / 0
                  </p>
                </div>
              </div>

              {/* Total Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <strong>Total: 75 Questions · 300 Maximum Marks · 180 Minutes</strong>
                  <div className="text-blue-200 text-xs">Section B includes negative marking (-1) in strict compliance with NTA guidelines.</div>
                </div>
                <button
                  onClick={() => setRegModalOpen(true)}
                  className="px-4 py-2 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 shrink-0"
                >
                  Confirm My Slot
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 10. WARM UP WITH 10 FREE PRACTICE MOCKS */}
        <section className="bg-white border-b border-[rgba(26,26,26,0.08)]">
          <div className="wrap">
            <div className="center mb-10">
              <span className="kick">Preparation Routine</span>
              <h2 className="sec-title">Condition your mind before 27 Dec.</h2>
              <p className="sec-sub center">
                Do not write the scholarship exam cold. Practice all 10 Major Full Tests (MFT-01 to MFT-10) on StudyFAM completely free forever.
              </p>
            </div>

            <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-[32px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold font-mono uppercase">
                  <span>100% Free Practice Suite</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  10 Full-Length Mocks · 750 Curated Questions
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Real 180-min timers, official +4/-1 scoring, and step-by-step textbook solutions. Available 24/7 on demand.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                <Link
                  href="/exam"
                  className="btn btn-blue btn-sm text-center"
                >
                  Explore All 10 Free MFTs →
                </Link>
                <Link
                  href="/exam/player?id=MFT-1.pdf"
                  className="btn btn-ghost btn-sm text-center"
                >
                  Launch MFT-01 Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 11. REGISTRATION / SEAT ALERT SECTION (OCTOBER 19 FOCUS) */}
        <section id="register" className="bg-[#fafafa]">
          <div className="wrap">
            <div className="center mb-10">
              <span className="kick">October 19 Priority Access</span>
              <h2 className="sec-title">Registrations Open 20 Oct 2026.</h2>
              <p className="sec-sub center">
                Reserve your spot now to receive instantaneous SMS/WhatsApp notifications and priority seat allocation the moment registration goes live.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white border border-[rgba(26,26,26,0.1)] rounded-[32px] p-6 sm:p-10 shadow-lg">
              <div className={`reg-open ${regClock.live ? "live" : ""}`} style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e", width: "100%", justifyContent: "center" }}>
                <span className="ro-dot"></span>
                <span className="ro-text">{regClock.text}</span>
                <b className="ro-time">{regClock.time}</b>
              </div>

              {regSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="text-5xl">🎉</div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    You are on the Priority Waitlist!
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Thank you, <strong>{regForm.name}</strong>. We will notify you directly at <strong>{regForm.phone}</strong> the exact moment registration links go live on 20 Oct 2026.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setRegModalOpen(true)}
                      className="btn btn-blue btn-sm"
                    >
                      Open Full Registration Form →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Candidate name (as per Aadhaar / School ID)"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1a5fe0] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                      10-Digit Mobile / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="WhatsApp number for admit card alerts"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1a5fe0] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Appearing Batch
                      </label>
                      <select
                        value={regForm.stream}
                        onChange={(e) => setRegForm({ ...regForm, stream: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#1a5fe0]"
                      >
                        <option value="class-12">Class 12 (JEE 2027)</option>
                        <option value="dropper">Dropper (JEE 2027)</option>
                        <option value="class-11">Class 11 (JEE 2028)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Scholarship Track
                      </label>
                      <select
                        value={regForm.track}
                        onChange={(e) => setRegForm({ ...regForm, track: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#1a5fe0]"
                      >
                        <option value="merit">Pure Merit (50%)</option>
                        <option value="need">Need-Based (≤ 8 LPA)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn btn-blue mt-2"
                  >
                    <span>Pre-Register for Priority Alert →</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
                    DPDP Act 2023 Compliant · Zero Spam · Direct SMS/WhatsApp Dispatch
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 12. FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="bg-white border-t border-[rgba(26,26,26,0.08)]">
          <div className="wrap">
            <div className="center mb-10">
              <span className="kick">Official Clarifications</span>
              <h2 className="sec-title">Frequently Asked Questions</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-3 text-sm">
              <details className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100 cursor-pointer" open>
                <summary className="font-bold text-slate-900">
                  How does the ₹18 fee refund scholarship work?
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every registration fee of ₹27 has ₹18 deposited directly into a designated escrow account. When the exam results are declared on 29 Dec 2026, the escrow pool is disbursed directly to top rankers across Merit and Need-based tracks to refund 100% of their official NTA JEE application fee (₹1,000 for Boys / ₹800 for Girls) via UPI or direct bank transfer within 7 business days.
                </p>
              </details>

              <details className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100 cursor-pointer">
                <summary className="font-bold text-slate-900">
                  Who is eligible for the Need-Based Scholarship track?
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The Need-Based track is open to all candidates with a verified family annual income of ≤ ₹8 Lakh. Candidates indicate this during registration, and winners provide standard income verification (ITR acknowledgment, income certificate, or ration card) post-exam before fee disbursement.
                </p>
              </details>

              <details className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100 cursor-pointer">
                <summary className="font-bold text-slate-900">
                  What happens if someone cheats or uses multiple devices?
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The exam is proctored with full-screen enforcement, tab-lock telemetry, and automated speed outlier detection. Any candidate with confirmed tab violations or impossible solving speeds is disqualified. Their scholarship slot immediately rolls down to the next honest ranker.
                </p>
              </details>

              <details className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100 cursor-pointer">
                <summary className="font-bold text-slate-900">
                  Can I take the exam on a mobile phone or tablet?
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Yes, StudyFAM&apos;s CBT engine is fully responsive and supports mobile devices, tablets, and laptops on modern browsers (Chrome, Firefox, Safari, Edge). However, for the true authentic CBT simulation experience, taking the exam on a laptop or desktop with a physical mouse is strongly recommended.
                </p>
              </details>

              <details className="p-4 rounded-2xl bg-[#fafafa] border border-slate-100 cursor-pointer">
                <summary className="font-bold text-slate-900">
                  When will Admit Cards be issued?
                </summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Candidates receive an instant provisional e-admit card upon registration. Official hall tickets with verified center server credentials and reporting guidelines will be available for download in your Candidate Dashboard starting 20 December 2026.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* 13. Canonical Tokko Footer */}
      <Footer />

      {/* 14. Registration & Share Modals */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setRegModalOpen(false)}
        isMockOpen={isOpen}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        isMockOpen={isOpen}
      />
    </div>
  );
}
