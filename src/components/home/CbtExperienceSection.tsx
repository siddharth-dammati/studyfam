"use client";

import React, { useState } from "react";
import {
  Monitor,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Trophy,
  Shield,
  Eye,
  FileCheck2,
  HelpCircle,
  PlayCircle,
  BarChart3,
  BookmarkCheck,
  ArrowRight,
  Zap,
  Lock,
  Cpu,
} from "lucide-react";
import Link from "next/link";

export function CbtExperienceSection() {
  const [activeSubjectTab, setActiveSubjectTab] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");

  const paletteLegend = [
    { label: "Answered", count: 24, bg: "bg-emerald-500", text: "text-white", desc: "Question answered & saved" },
    { label: "Not Answered", count: 12, bg: "bg-red-500", text: "text-white", desc: "Visited but not answered" },
    { label: "Marked for Review", count: 4, bg: "bg-purple-600", text: "text-white", desc: "Flagged for later review" },
    { label: "Answered & Marked", count: 2, bg: "bg-purple-600", text: "text-white relative", desc: "Will be evaluated", badge: "✓" },
    { label: "Not Visited", count: 33, bg: "bg-slate-200", text: "text-slate-700", desc: "Yet to open question" },
  ];

  const features = [
    {
      icon: <Monitor className="w-5 h-5 text-indigo-600" />,
      title: "100% TCS iON CBT Replica",
      badge: "Pixel Perfect",
      bgBadge: "bg-indigo-50 text-indigo-700 border-indigo-200",
      description: "Identical button placement, timer layout, subject tabs (Physics, Chemistry, Maths), and color-coded question palette. Eradicate exam-hall panic through authentic muscle memory.",
    },
    {
      icon: <Layers className="w-5 h-5 text-sky-600" />,
      title: "Section A (MCQ) & Section B (Numerical)",
      badge: "NTA 2027 Pattern",
      bgBadge: "bg-sky-50 text-sky-700 border-sky-200",
      description: "Strictly conforms to the latest JEE Main guidelines: 20 single-choice questions + 5 numerical integer questions per subject with virtual numeric keypad.",
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-emerald-600" />,
      title: "Calibrated AIR & Percentile Predictor",
      badge: "NTA Normalization",
      bgBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Instant All-India percentile calculation based on normalized past NTA shift curves. Know exactly where your score stands against 1.2M+ aspirants.",
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-amber-600" />,
      title: "Textbook-Quality Step-by-Step Solutions",
      badge: "Instant Submit",
      bgBadge: "bg-amber-50 text-amber-700 border-amber-200",
      description: "Comprehensive solutions with step-by-step mathematical proofs, reaction mechanisms, and diagrammatic reasoning to fix conceptual gaps immediately.",
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      title: "Real-Time 180 Min Countdown & Auto-Save",
      badge: "Zero Data Loss",
      bgBadge: "bg-purple-50 text-purple-700 border-purple-200",
      description: "Background state synchronization saves every answer option in milliseconds. Automatic test submission triggers when the countdown expires.",
    },
    {
      icon: <Shield className="w-5 h-5 text-teal-600" />,
      title: "Distraction-Free Anti-Cheat Mode",
      badge: "Integrity Lock",
      bgBadge: "bg-teal-50 text-teal-700 border-teal-200",
      description: "Tab-blur tracking, fullscreen enforcement, and zero advertising distractions simulate true examination hall pressure and focus.",
    },
  ];

  return (
    <section id="special-features" className="py-20 sm:py-28 bg-white text-slate-900 border-b border-slate-200/90 scroll-mt-20 relative overflow-hidden">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.04),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-3.5 py-1 mb-4">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-indigo-800 text-[11px] font-mono font-bold uppercase tracking-wider">
              Special Features &amp; CBT Technology
            </span>
          </div>

          <h2 className="text-[clamp(2.1rem,4.2vw,3.6rem)] font-extrabold tracking-tight text-slate-900 leading-tight mb-5">
            Practice in the Exact Same Screen{" "}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600">
              You Will Face on JEE Exam Day.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Most aspirants forfeit 15–25 marks simply due to computer-interface unfamiliarity, incorrect palette review management, and panic under the 180-minute countdown. StudyFAM replicates the official NTA CBT interface down to the exact pixel.
          </p>
        </div>

        {/* Visual Mock Screen & Interactive Palette Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">

          {/* Left: Simulated NTA Screen Mockup (Col 7) */}
          <div className="lg:col-span-7 bg-slate-900 text-white border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono mb-4 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-200 font-bold ml-2">Official NTA CBT Engine Simulation</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px]">
                <Clock size={12} />
                <span>02:44:18 Left</span>
              </div>
            </div>

            {/* Subject Tabs */}
            <div className="flex items-center gap-1.5 mb-4 border-b border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
              {(["Physics", "Chemistry", "Mathematics"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubjectTab(sub)}
                  className={`px-3 py-1.5 rounded-lg transition-all text-xs ${
                    activeSubjectTab === sub
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 bg-slate-800/60"
                  }`}
                >
                  {sub} (25 Qs)
                </button>
              ))}
            </div>

            {/* Simulated Question Area */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-3">
                <span className="font-bold text-slate-200">Question No. 04 · Section A (Single Choice)</span>
                <span className="text-emerald-400 font-semibold">+4.0 / -1.0 Marks</span>
              </div>

              <div className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-4 font-sans">
                A particle of mass <span className="font-mono text-indigo-400">m</span> moves along a straight line with velocity <span className="font-mono text-indigo-400">v(x) = k√x</span>. The total work done by all the forces during its displacement from <span className="font-mono text-indigo-400">x = 0</span> to <span className="font-mono text-indigo-400">x = d</span> is:
              </div>

              {/* Options */}
              <div className="space-y-2 font-sans">
                {[
                  { id: "A", text: "1/2 · m · k² · d", selected: true },
                  { id: "B", text: "m · k² · d", selected: false },
                  { id: "C", text: "2 · m · k² · d", selected: false },
                  { id: "D", text: "1/4 · m · k² · d", selected: false },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-colors ${
                      opt.selected
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      opt.selected ? "border-emerald-400 bg-emerald-500 text-slate-950" : "border-slate-600 text-slate-400"
                    }`}>
                      {opt.id}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Buttons Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-semibold">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-purple-600 text-white">
                  Mark for Review &amp; Next
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  Clear Response
                </span>
              </div>
              <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold">
                Save &amp; Next →
              </span>
            </div>

          </div>

          {/* Right: Interactive Palette Legend Demo (Col 5) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700">
                  Real-time NTA Palette Status
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">75 Questions Total</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Color-Coded Status Mastery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Never lose a mark to confusion over whether &quot;Marked for Review&quot; is evaluated by NTA. Our color palette strictly matches the official TCS iON rulebook.
              </p>

              {/* Status Palette Cards */}
              <div className="space-y-2.5 mb-6">
                {paletteLegend.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg ${item.bg} ${item.text} flex items-center justify-center font-mono font-bold text-xs shadow-xs`}>
                        {item.count}
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 text-slate-950 text-[9px] flex items-center justify-center font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.label}</div>
                        <div className="text-[10px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-700">
                      {item.count} Qs
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Launch CTA */}
            <div className="pt-2 border-t border-slate-100">
              <a
                href="#free-mocks"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all active:scale-95"
              >
                <span>Experience Full Test In Player</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>

        </div>

        {/* 6 Special Feature Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
                    {feat.icon}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${feat.bgBadge}`}>
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2.5">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[10px] uppercase text-emerald-700 font-bold">NTA 2027 Spec</span>
                <CheckCircle2 size={14} className="text-emerald-600" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
