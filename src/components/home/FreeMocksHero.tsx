"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Trophy,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  BarChart3,
  HelpCircle,
  PlayCircle,
  FileText,
} from "lucide-react";
import { FREE_MOCKS_DATA, FreeMockTestItem } from "@/lib/freeMocksData";

export function FreeMocksHero() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalTest, setActiveModalTest] = useState<FreeMockTestItem | null>(null);

  const filteredMocks = FREE_MOCKS_DATA.filter((mock) => {
    if (selectedDifficulty !== "ALL" && mock.difficulty !== selectedDifficulty) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = mock.title.toLowerCase().includes(q);
      const matchCode = mock.code.toLowerCase().includes(q);
      const matchTopics = mock.focusTopics.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchCode || matchTopics;
    }
    return true;
  });

  return (
    <section className="relative pt-6 pb-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 border-b border-slate-200">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -top-32 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Hero Top Badges & Announcement Hook */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-semibold shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>10 Full-Length Mocks Available Free</span>
            <span className="text-emerald-300">·</span>
            <span className="font-mono font-bold text-emerald-900">0 Fees / No Sign-up Barrier</span>
          </div>

          <Link
            href="/all-india-mock"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold transition-colors shadow-xs"
          >
            <Trophy size={13} className="text-indigo-600" />
            <span>National Scholarship Mock (27 Dec)</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Main H1 Headline for SEO */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-[clamp(2.3rem,5vw,4.2rem)] font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-5">
            Free JEE Main 2027 Mock Test Series{" "}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600">
              with Authentic NTA CBT Interface &amp; Solutions
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Practice <strong>10 full-length JEE Main mock tests</strong> designed strictly on the latest NTA syllabus &amp; 75-question pattern. Experience real TCS iON exam simulation, instant All-India percentile rank, and detailed step-by-step solutions.
          </p>

          {/* 4 Feature Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">75 Questions Each</div>
                <div className="text-[11px] text-slate-500">25 Phys, 25 Chem, 25 Math</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">180 Minutes (3 Hrs)</div>
                <div className="text-[11px] text-slate-500">Authentic countdown timer</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <BarChart3 size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">+4 / -1 Marking</div>
                <div className="text-[11px] text-slate-500">Sec A (MCQ) &amp; Sec B (Num)</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">100% Free Forever</div>
                <div className="text-[11px] text-slate-500">No paywall, full solutions</div>
              </div>
            </div>
          </div>
        </div>

        {/* 10 FREE MOCKS SHOWCASE SECTION (Hero Core) */}
        <div id="free-mocks" className="scroll-mt-24 mt-12 pt-6">

          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                10 Official Full-Length Mock Tests (MFT-01 to MFT-10)
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                {filteredMocks.length} Tests
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Difficulty Filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {["ALL", "Standard", "Moderate", "Challenging"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedDifficulty === diff
                        ? "bg-white text-slate-900 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {diff === "ALL" ? "All Levels" : diff}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative flex-1 sm:w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search test or chapter..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* 10 Mocks Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredMocks.map((mock) => (
              <div
                key={mock.id}
                className="bg-white border border-slate-200/90 hover:border-indigo-400/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Pill Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                      {mock.code}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        mock.difficulty === "Standard"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : mock.difficulty === "Moderate"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}>
                        {mock.difficulty} Level
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                        {mock.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug">
                    {mock.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {mock.keyHighlights}
                  </p>

                  {/* Syllabus / Focus Topics Tags */}
                  <div className="space-y-1.5 mb-5">
                    <div className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Key Syllabus Focus:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mock.focusTopics.map((topic) => (
                        <span
                          key={topic}
                          className="text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200/70 px-2 py-0.5 rounded-lg"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Specs & CTA */}
                <div>
                  {/* Pattern Breakdown */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center font-mono text-xs mb-4 bg-slate-50/60 rounded-xl">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Questions</div>
                      <div className="font-bold text-slate-800">75 Qs</div>
                    </div>
                    <div className="border-x border-slate-200/80">
                      <div className="text-slate-400 text-[10px] uppercase">Marks</div>
                      <div className="font-bold text-slate-800">300 M</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Time</div>
                      <div className="font-bold text-slate-800">180 Min</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={mock.playerUrl}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all active:scale-[0.98]"
                    >
                      <PlayCircle size={15} />
                      <span>Start Free CBT Mock</span>
                      <ArrowRight size={13} />
                    </Link>

                    <button
                      onClick={() => setActiveModalTest(mock)}
                      title="Inspect Test Structure & Syllabus"
                      className="p-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <FileText size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMocks.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
              <Search size={32} className="mx-auto text-slate-300 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">No matching tests found</h4>
              <p className="text-xs text-slate-500 mb-4">Try clearing your search query or selecting &quot;All Levels&quot;.</p>
              <button
                onClick={() => { setSelectedDifficulty("ALL"); setSearchQuery(""); }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Quick Bar: 300+ Chapter Tests Banner */}
          <div className="mt-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <BookOpen size={14} />
                <span>300+ Topic &amp; Chapter Tests Available</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                Want to practice individual chapters first?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Take chapter-wise tests across Physics, Chemistry, and Mathematics with targeted question banks covering Mechanics, Calculus, Organic Chemistry, and more.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/exam"
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <span>Browse 300+ Chapter Tests</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Test Structure Preview Modal */}
      {activeModalTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl relative animate-scaleUp">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  {activeModalTest.code} · Structure &amp; Syllabus
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {activeModalTest.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalTest(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              {activeModalTest.keyHighlights}
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="font-bold text-slate-900 mb-1">Subject-wise Distribution (75 Questions)</div>
                <ul className="text-slate-600 space-y-1 font-mono text-[11px]">
                  <li>• Physics: 25 Qs (20 Single Choice + 5 Numerical Value)</li>
                  <li>• Chemistry: 25 Qs (20 Single Choice + 5 Numerical Value)</li>
                  <li>• Mathematics: 25 Qs (20 Single Choice + 5 Numerical Value)</li>
                </ul>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
                <div className="font-bold text-indigo-950 mb-1">Marking Scheme (NTA Standard)</div>
                <div className="text-indigo-800 text-[11px] leading-relaxed">
                  +4 Marks for each correct answer · -1 Mark penalty for incorrect answers · 0 for unattempted questions. Maximum marks: 300.
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
                <div className="font-bold text-emerald-950 mb-1">Core Topics Tested</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeModalTest.focusTopics.map((t) => (
                    <span key={t} className="text-[11px] bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={activeModalTest.playerUrl}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <PlayCircle size={16} />
                <span>Launch Test In TCS iON Player</span>
              </Link>
              <button
                onClick={() => setActiveModalTest(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
