"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/sections/Footer";
import { ArrowLeft, Menu, X, ArrowRight, ShieldCheck, ChevronRight } from "lucide-react";

export interface MetaItem {
  label: string;
  value: string;
}

export interface ExternalPageShellProps {
  badgeText: string;
  badgeTone?: "blue" | "emerald" | "amber" | "indigo" | "rose";
  title: string;
  titleGradient?: string;
  subtitle: string;
  metaItems?: MetaItem[];
  maxWidth?: "narrow" | "wide" | "full";
  children: React.ReactNode;
}

export function ExternalPageShell({
  badgeText,
  badgeTone = "blue",
  title,
  titleGradient,
  subtitle,
  metaItems = [],
  maxWidth = "narrow",
  children,
}: ExternalPageShellProps) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const badgeStyles = {
    blue: "bg-blue-50 text-[#1A5FE0] border-blue-200/80",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    amber: "bg-amber-50 text-amber-800 border-amber-200/80",
    indigo: "bg-indigo-50 text-[#0A1C96] border-indigo-200/80",
    rose: "bg-rose-50 text-rose-700 border-rose-200/80",
  }[badgeTone];

  const maxWClass = {
    narrow: "max-w-[920px]",
    wide: "max-w-[1140px]",
    full: "max-w-[1240px]",
  }[maxWidth];

  return (
    <div className="min-h-screen bg-[#F6F9FF] text-[#0B1526] flex flex-col font-sans selection:bg-[#1A5FE0]/15 selection:text-[#0A1C96]">
      {/* 1. Google Fonts CDN link */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* 2. Embedded Scoped CSS for Tokko Landing Visual Tokens */}
      <style dangerouslySetInnerHTML={{ __html: `
        .tokko-font-sora { font-family: 'Sora', sans-serif; }
        .tokko-font-inter { font-family: 'Inter', sans-serif; }
        .tokko-glow-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .tokko-btn-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 14px;
          padding: 10px 22px;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .tokko-btn-dark {
          background: #0B1526;
          color: #ffffff;
          box-shadow: 0 4px 14px -3px rgba(11, 21, 38, 0.4);
        }
        .tokko-btn-dark:hover {
          background: #1A5FE0;
          transform: translateY(-1px);
        }
        .tokko-btn-ghost {
          background: #ffffff;
          border: 1px solid #E3EAF6;
          color: #0B1526;
        }
        .tokko-btn-ghost:hover {
          border-color: #1A5FE0;
          color: #1A5FE0;
        }
        .tokko-card {
          background: #ffffff;
          border: 1px solid #E3EAF6;
          border-radius: 20px;
          box-shadow: 0 10px 30px -15px rgba(10, 28, 150, 0.06);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .tokko-card:hover {
          border-color: #C5D7F4;
        }
      `}} />

      {/* 3. Sticky Tokko Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-200 border-b border-[#E3EAF6] ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-[#FAFAFA]/85 backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center flex-shrink-0" aria-label="StudyFAM Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-blue.png"
              alt="StudyFAM"
              className="h-8 w-auto object-contain flex-shrink-0"
              style={{ minWidth: "max-content", height: "32px" }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-[15px] font-semibold text-[#4B5B76]">
            <Link href="/" className="hover:text-[#1A5FE0] transition-colors">
              Home
            </Link>
            <Link href="/#mfts" className="hover:text-[#1A5FE0] transition-colors">
              10 Free Mocks
            </Link>
            <Link href="/all-india-mock" className="hover:text-[#1A5FE0] transition-colors">
              All-India Mock
            </Link>
            <Link href="/scholarship-rules" className="hover:text-[#1A5FE0] transition-colors">
              Scholarship Rules
            </Link>
            <Link href="/transparency" className="hover:text-[#1A5FE0] transition-colors">
              Transparency
            </Link>
            <Link href="/contact" className="hover:text-[#1A5FE0] transition-colors">
              Contact
            </Link>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Link
              href="/"
              className="hidden sm:inline-flex tokko-btn-pill tokko-btn-ghost text-xs text-[#4B5B76]"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/dashboard"
              className="tokko-btn-pill tokko-btn-dark text-xs sm:text-sm"
            >
              <span>{user ? "Dashboard →" : "Candidate Dashboard →"}</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-[#0B1526] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E3EAF6] bg-white/95 backdrop-blur-xl px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3 font-semibold text-[#0B1526]">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Home</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
              <Link
                href="/#mfts"
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>10 Free Mocks (MFT 1–10)</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
              <Link
                href="/all-india-mock"
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>All-India Mock (27 Dec)</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
              <Link
                href="/scholarship-rules"
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Scholarship Rules & Policy</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
              <Link
                href="/transparency"
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Transparency & Governance</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Contact & Grievance Desk</span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center tokko-btn-pill tokko-btn-dark justify-center text-sm"
              >
                Candidate Dashboard →
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 4. Page Hero Header with Tokko Halftone Glows */}
      <header className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 overflow-hidden border-b border-[#E3EAF6] bg-gradient-to-b from-[#EFF5FF]/70 via-[#F6F9FF] to-[#F6F9FF]">
        {/* Glow Blobs */}
        <div
          className="tokko-glow-blob w-[520px] h-[520px] -top-40 -right-20"
          style={{ background: "radial-gradient(circle, rgba(214, 174, 242, 0.35), transparent 65%)" }}
        />
        <div
          className="tokko-glow-blob w-[460px] h-[460px] -bottom-40 -left-20"
          style={{ background: "radial-gradient(circle, rgba(47, 143, 255, 0.22), transparent 65%)" }}
        />

        <div className={`relative z-10 mx-auto px-4 sm:px-6 w-full ${maxWClass}`}>
          {/* Breadcrumb Row */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7A8CA8] mb-6">
            <Link href="/" className="hover:text-[#1A5FE0] transition-colors">
              StudyFAM
            </Link>
            <span>/</span>
            <span className="text-[#0B1526] font-bold">Documentation</span>
          </div>

          {/* Kicker Pill */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${badgeStyles}`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span>{badgeText}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B1526] tokko-font-sora leading-[1.15] mb-5">
            {title}{" "}
            {titleGradient && (
              <span className="bg-gradient-to-r from-[#0A1C96] via-[#1A5FE0] to-[#2F8FFF] bg-clip-text text-transparent">
                {titleGradient}
              </span>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-[#4B5B76] text-base sm:text-lg leading-relaxed max-w-3xl">
            {subtitle}
          </p>

          {/* Meta Items Strip */}
          {metaItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-7 pt-6 border-t border-[#E3EAF6]">
              {metaItems.map((meta, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#E3EAF6] text-xs font-medium text-[#4B5B76] shadow-2xs"
                >
                  <span className="text-[#7A8CA8] font-mono">{meta.label}:</span>
                  <span className="font-bold text-[#0B1526]">{meta.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 5. Main Body Content */}
      <main className="flex-1 py-12 sm:py-16">
        <div className={`mx-auto px-4 sm:px-6 w-full ${maxWClass}`}>
          {children}
        </div>
      </main>

      {/* 6. Unified Dark Site Footer */}
      <Footer />
    </div>
  );
}
