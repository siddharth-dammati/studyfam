"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Zap,
} from "lucide-react";
import { TestSummary } from "@/lib/examDb";

export default function ExamCatalogPage() {
  const [activeTab, setActiveTab] = useState<"full" | "chapter">("full");
  const [fullMocks, setFullMocks] = useState<TestSummary[]>([]);
  const [chapterTests, setChapterTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");

  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        const res = await fetch("/api/exam/tests", { method: "POST" });
        const json = await res.json();
        if (json.success) {
          setFullMocks(json.fullMocks || []);
          setChapterTests(json.chapterTests || []);
        } else {
          setError(json.error || "Failed to load tests");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load tests");
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, []);

  const displayedTests = (activeTab === "full" ? fullMocks : chapterTests).filter((test) => {
    if (selectedSubject !== "ALL" && test.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = test.title.toLowerCase().includes(q);
      const matchChapter = (test.chapter || "").toLowerCase().includes(q);
      const matchSubject = test.subject.toLowerCase().includes(q);
      return matchTitle || matchChapter || matchSubject;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center space-x-2">
            <span className="text-blue-500">Study</span>FAM
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs sm:text-sm font-semibold text-slate-300">
            All India Mock Test Series &amp; Question Bank
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            My Account
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic TCS iON / NTA Exam Simulation</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Master the Real JEE Main with Official Test Players
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Experience the authentic NTA Computer Based Test interface with real countdown timers, official marking
              scheme (+4 / -1), collapsible 5-state question palettes, and step-by-step solutions from our 9,395+
              curated question bank.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-slate-300">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>10 Full 75-Q Major Mocks (MFT)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>400+ Chapter Practice Tests</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Scorecard &amp; Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Tabs */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab("full");
                setSelectedSubject("ALL");
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "full"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Full Mock Tests ({fullMocks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("chapter")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "chapter"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Chapter Practice Tests ({chapterTests.length})</span>
            </button>
          </div>

          {/* Search & Subject Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search tests or chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-60"
              />
            </div>

            {activeTab === "chapter" && (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
              </select>
            )}
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading tests from questions database...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl text-rose-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Tests Grid */}
        {!loading && !error && (
          <div>
            {displayedTests.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                No tests match your search criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedTests.map((test) => {
                  const isMft = test.source_file.startsWith("MFT-");

                  return (
                    <div
                      key={test.id}
                      className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-lg hover:shadow-blue-900/10 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              isMft
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {isMft ? "Official 300 Marks" : test.subject}
                          </span>

                          <span className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{test.duration_minutes} mins</span>
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                            {test.title}
                          </h3>
                          {test.chapter && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                              Chapter: {test.chapter}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                          <span className="flex items-center space-x-1">
                            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                            <span>{test.question_count} Questions</span>
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">+4 / -1 Scheme</span>
                        </div>
                      </div>

                      <Link
                        href={`/exam/player?id=${test.id}`}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs group-hover:shadow-blue-500/20 active:scale-98"
                      >
                        <span>Take Examination</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
