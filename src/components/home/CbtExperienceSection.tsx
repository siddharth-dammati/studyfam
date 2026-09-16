"use client";

import React from "react";
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
} from "lucide-react";
import Link from "next/link";

export function CbtExperienceSection() {
  const paletteLegend = [
    { label: "Answered", count: 24, color: "bg-emerald-500 text-white", desc: "Question answered & saved" },
    { label: "Not Answered", count: 12, color: "bg-red-500 text-white", desc: "Visited but not answered" },
    { label: "Marked for Review", count: 4, color: "bg-purple-600 text-white", desc: "Flagged for later check" },
    { label: "Answered & Marked", count: 2, color: "bg-purple-600 text-white relative", desc: "Will be evaluated", badge: "✓" },
    { label: "Not Visited", count: 33, color: "bg-slate-200 text-slate-700", desc: "Yet to open question" },
  ];

  const features = [
    {
      icon: <Monitor className="w-5 h-5 text-indigo-600" />,
      title: "100% TCS iON NTA Interface Replica",
      description: "Identical button placement, timer layout, subject tabs (Physics, Chemistry, Maths), and question palette. Eradicate exam-day anxiety through muscle memory.",
    },
    {
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      title: "Section A (MCQ) + Section B (Numerical)",
      description: "Strictly conforms to the latest JEE Main 2027 structure. 20 compulsory MCQs + 5 numerical value questions per subject with virtual numeric input keypad.",
    },
    {
      icon: <Clock className="w-5 h-5 text-emerald-600" />,
      title: "Real-Time 180 Min Countdown & Auto-Save",
      description: "Automatic background answer synchronization every second. Auto-submits on completion so your answers and time log are never lost.",
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      title: "Instant Diagnostic Scorecard & Rank",
      description: "Get your exact score out of 300 immediately after test submission. Review accuracy rate, negative marks cost, and predicted All-India Percentile.",
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-amber-600" />,
      title: "Step-by-Step Textbook Solutions",
      description: "Every question comes with detailed conceptual explanations, diagrammatic reasoning, and formula derivation to fix gaps in real time.",
    },
    {
      icon: <Shield className="w-5 h-5 text-teal-600" />,
      title: "Zero Distractions & Anti-Cheat Logic",
      description: "Tab-blur detection and fullscreen test environment train disciplined exam-hall focus without external distractions.",
    },
  ];

  return (
    <section id="cbt-features" className="py-20 sm:py-28 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/90 rounded-full px-3.5 py-1 mb-4">
            <Monitor className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-indigo-800 text-[11px] font-mono font-bold uppercase tracking-wider">
              Official CBT Exam Simulation
            </span>
          </div>

          <h2 className="text-[clamp(1.9rem,3.8vw,3.2rem)] font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Practice in the Exact Same Screen{" "}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
              You Will See on JEE Exam Day.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Most aspirants lose 15–25 marks simply due to computer-interface unfamiliarity, incorrect palette review management, and panic under the 180-minute countdown. StudyFAM replicates the official NTA CBT system down to the exact pixel.
          </p>
        </div>

        {/* Visual Mock Screen & Interactive Palette Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">

          {/* Left: Simulated NTA Screen Mockup (Col 7) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl text-white relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono mb-4 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-300 font-bold ml-2">JEE Main 2027 CBT Player</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                <Clock size={12} />
                <span>Time Left: 02:44:18</span>
              </div>
            </div>

            {/* Subject Tabs */}
            <div className="flex gap-2 mb-4">
              {["Physics (25 Qs)", "Chemistry (25 Qs)", "Mathematics (25 Qs)"].map((sub, i) => (
                <div
                  key={sub}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    i === 0
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {sub}
                </div>
              ))}
            </div>

            {/* Question Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-4">
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mb-2">
                <span>Question 04 · Single Option Correct</span>
                <span className="text-emerald-400 font-bold bg-emerald-900/40 px-2 py-0.5 rounded">+4 / -1 Marks</span>
              </div>

              <div className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed mb-4">
                A particle of mass \(m\) executes simple harmonic motion along the x-axis with frequency \(\nu\). The average potential energy over one full cycle of oscillation is equal to:
              </div>

              {/* Options */}
              <div className="space-y-2">
                {[
                  { opt: "A", text: "\\frac{1}{4} m \\pi^2 \\nu^2 A^2", correct: false },
                  { opt: "B", text: "\\pi^2 m \\nu^2 A^2", correct: true },
                  { opt: "C", text: "2 \\pi^2 m \\nu^2 A^2", correct: false },
                  { opt: "D", text: "\\frac{1}{2} m \\pi^2 \\nu^2 A^2", correct: false },
                ].map((item, idx) => (
                  <div
                    key={item.opt}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-3 transition-colors ${
                      idx === 1
                        ? "bg-indigo-950/70 border-indigo-500 text-indigo-200"
                        : "bg-slate-950/60 border-slate-800 text-slate-300"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      idx === 1 ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {item.opt}
                    </span>
                    <span className="font-mono text-[11px]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-mono">
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-purple-950 border border-purple-800 text-purple-300 font-semibold">
                  Mark for Review &amp; Next
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">
                  Clear Response
                </span>
              </div>

              <Link
                href="/exam/player?id=MFT-1.pdf"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Save &amp; Next</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Right: Palette Legend & Breakdown (Col 5) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <BookmarkCheck size={18} className="text-indigo-600" />
                <span>NTA Official Question Palette Legend</span>
              </h3>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Color-coded indicators ensure you know which questions will be scored and which require attention before the timer runs out.
              </p>

              <div className="space-y-3">
                {paletteLegend.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${item.color}`}>
                        {item.count}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.label}</div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-600">
                      {item.count} Qs
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80">
                <Link
                  href="/exam/player?id=MFT-1.pdf"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                >
                  <PlayCircle size={15} />
                  <span>Launch Interactive CBT Engine Now</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* 6 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-xs transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-4">
                {feat.icon}
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                {feat.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
