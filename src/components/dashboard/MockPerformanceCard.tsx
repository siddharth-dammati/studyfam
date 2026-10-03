"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FREE_MOCKS_DATA } from "@/lib/freeMocksData";
import {
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  RotateCcw,
  Sparkles,
  BarChart3,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  Activity,
  Zap,
  Play,
  FileQuestion,
  Filter,
  X,
  Eye,
} from "lucide-react";

export interface MockAttemptRecord {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  timeSpentSeconds: number;
  sectionBreakdown?: any[];
  questionTimes?: Record<string, number>;
  createdAt: string;
}

interface MockPerformanceCardProps {
  attempts: MockAttemptRecord[];
  loading?: boolean;
}

export function MockPerformanceCard({ attempts, loading }: MockPerformanceCardProps) {
  const [showAllAttempts, setShowAllAttempts] = useState(false);
  const [showAllMfts, setShowAllMfts] = useState(false);
  const [selectedTestFilter, setSelectedTestFilter] = useState<string>("ALL");
  const [inspectAttempt, setInspectAttempt] = useState<MockAttemptRecord | null>(null);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs animate-pulse">
        <div className="h-6 bg-slate-200 rounded-lg w-1/3 mb-4" />
        <div className="h-4 bg-slate-100 rounded-lg w-1/2 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
        </div>
        <div className="h-32 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  // Calculate summary KPIs
  const totalAttempts = attempts.length;
  const highestScore = attempts.reduce((max, a) => Math.max(max, a.score), 0);
  const avgAccuracy =
    totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / totalAttempts)
      : 0;

  const totalSeconds = attempts.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);
  const timeFormatted =
    totalHours > 0 ? `${totalHours}h ${totalMins}m` : `${Math.max(1, totalMins)}m`;

  const totalQuestionsSolved = attempts.reduce((sum, a) => sum + (a.attemptedCount || 0), 0);
  const totalCorrect = attempts.reduce((sum, a) => sum + (a.correctCount || 0), 0);

  // Projected percentile bracket based on student's highest score
  const getPercentileBracket = (score: number) => {
    if (score >= 250) return { pct: "99.8+ %ile", air: "AIR < 1,500" };
    if (score >= 210) return { pct: "99.2 - 99.7 %ile", air: "AIR 2,500 – 6,000" };
    if (score >= 180) return { pct: "98.0 - 99.0 %ile", air: "AIR 8,000 – 16,000" };
    if (score >= 140) return { pct: "95.0 - 97.5 %ile", air: "AIR 25,000 – 45,000" };
    if (score >= 100) return { pct: "90.0 - 94.5 %ile", air: "AIR 55,000 – 90,000" };
    return { pct: "75 - 88 %ile", air: "Foundation Phase" };
  };

  const highestBracket = getPercentileBracket(highestScore);

  // Filter attempts based on selected filter tab
  const filteredAttempts = attempts.filter((att) => {
    if (selectedTestFilter === "ALL") return true;
    if (selectedTestFilter === "MFT") {
      return att.testId.toLowerCase().includes("mft");
    }
    return att.testId.toLowerCase() === selectedTestFilter.toLowerCase();
  });

  const displayedAttempts = showAllAttempts ? filteredAttempts : filteredAttempts.slice(0, 5);
  const displayedMfts = showAllMfts ? FREE_MOCKS_DATA : FREE_MOCKS_DATA.slice(0, 4);

  // Extract unique tests taken by student for dropdown filtering
  const uniqueAttemptedTestIds = Array.from(new Set(attempts.map((a) => a.testId)));

  const formatDuration = (totalSecs: number) => {
    if (!totalSecs || totalSecs <= 0) return "0m";
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs > 0 ? `${secs}s` : ""}`.trim();
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const formatTestTitle = (title: string, testId: string) => {
    const match = testId.match(/MFT-0?(\d+)/i);
    if (match) {
      const num = parseInt(match[1]);
      const found = FREE_MOCKS_DATA.find((m) => m.mockNumber === num);
      if (found) return `${found.code} · ${found.title}`;
      return `MFT-${match[1].padStart(2, "0")} · Full Mock`;
    }
    if (!title || title.trim() === "") {
      return "JEE Main Mock Test";
    }
    return title.replace(/\.pdf$/i, "").replace(/_/g, " ");
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return "Recently";
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Performance Overview & KPIs */}
      <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_-25px_rgba(10,28,150,0.06)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f3e9fd] text-[#7c3aed] border border-[#d6aef2]/60 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Activity size={14} />
              <span>Performance Analytics Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1a1a] tracking-tight">
              My Mock Practice &amp; Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time analytics across all attempted Major Full Tests (MFT 1–10).
            </p>
          </div>

          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] hover:shadow-[0_12px_28px_-10px_rgba(26,95,224,0.5)] text-white rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer hover:-translate-y-0.5 active:scale-95"
          >
            <span>Explore All 10 Full Mocks</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Summary KPIs - Tokko Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* KPI 1: Tests Attempted */}
          <div className="bg-[#fafafa] border border-[rgba(26,26,26,0.08)] rounded-[22px] p-5 hover:border-[#1a5fe0]/30 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-slate-400">Mocks Taken</span>
              <div className="w-7 h-7 rounded-xl bg-[#e9f1fd] text-[#1a5fe0] flex items-center justify-center">
                <Trophy size={14} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#1a1a1a] tabular-nums tracking-tight">
                {totalAttempts}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                {totalAttempts > 0 ? (
                  <span className="text-[#0a1c96] font-semibold">{totalQuestionsSolved} Qs attempted</span>
                ) : (
                  <span>10 Full Mocks ready</span>
                )}
              </div>
            </div>
          </div>

          {/* KPI 2: Highest Score */}
          <div className="bg-gradient-to-br from-[#e9f1fd]/80 to-[#f3e9fd]/60 border border-[#1a5fe0]/20 rounded-[22px] p-5 hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-900 text-xs mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#0a1c96] font-bold">
                Highest Score
              </span>
              <div className="w-7 h-7 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-2xs">
                <Sparkles size={14} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#0a1c96] tabular-nums tracking-tight">
                {totalAttempts > 0 ? highestScore : "—"}
                <span className="text-xs font-normal text-indigo-500 ml-1">/ 300</span>
              </div>
              <div className="text-[11px] text-[#7c3aed] mt-1 font-bold truncate">
                {totalAttempts > 0 ? highestBracket.pct : "Score benchmark ready"}
              </div>
            </div>
          </div>

          {/* KPI 3: Accuracy Rate */}
          <div className="bg-[#fafafa] border border-[rgba(26,26,26,0.08)] rounded-[22px] p-5 hover:border-[#1a5fe0]/30 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-slate-400">Accuracy Rate</span>
              <div className="w-7 h-7 rounded-xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center">
                <Target size={14} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#1a1a1a] tabular-nums tracking-tight">
                {totalAttempts > 0 ? `${avgAccuracy}%` : "—"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                {totalAttempts > 0 ? (
                  <span className="text-emerald-700 font-semibold">{totalCorrect} correct answers</span>
                ) : (
                  <span>Target: &gt;80% for 99%ile</span>
                )}
              </div>
            </div>
          </div>

          {/* KPI 4: Practice Time */}
          <div className="bg-[#fafafa] border border-[rgba(26,26,26,0.08)] rounded-[22px] p-5 hover:border-[#1a5fe0]/30 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-slate-400">Practice Time</span>
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={14} />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#1a1a1a] tabular-nums tracking-tight">
                {totalAttempts > 0 ? timeFormatted : "0m"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                {totalAttempts > 0 ? "Under CBT conditions" : "3h authentic timer"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Major Full Test Series (MFT 1–10) Launcher */}
      <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_-25px_rgba(10,28,150,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9f1fd] text-[#1a5fe0] border border-[#1a5fe0]/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span>100% Free Practice Suite</span>
              <span className="text-slate-300">·</span>
              <span>10 Full-Length Mocks</span>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1a1a] tracking-tight">
              Start Full-Length Mock Test (MFT Series)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Exact 75-question NTA format (300 Marks, 3.0 Hours, +4/-1) with proctoring &amp; full solutions. Official benchmark for the 27 Dec 2026 All-India Mock.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={() => setShowAllMfts(!showAllMfts)}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#fafafa] hover:bg-slate-100 text-slate-700 border border-[rgba(26,26,26,0.08)] transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95"
            >
              {showAllMfts ? "Show Less" : `View All 10 MFTs`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {displayedMfts.map((mft) => {
            const isAttempted = attempts.some((a) => {
              const normA = a.testId.toLowerCase();
              const numMatch = a.testId.match(/MFT[-_ ]*0?(\d+)/i);
              return (
                normA === mft.id.toLowerCase() ||
                normA.includes(mft.code.toLowerCase()) ||
                (numMatch && parseInt(numMatch[1]) === mft.mockNumber)
              );
            });

            return (
              <div
                key={mft.id}
                className="p-4 sm:p-5 rounded-[22px] border border-[rgba(26,26,26,0.08)] bg-[#fafafa] hover:bg-white hover:border-[#1a5fe0]/40 hover:shadow-[0_12px_30px_-12px_rgba(10,28,150,0.1)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#0a1c96] bg-[#e9f1fd] border border-[#1a5fe0]/20 px-2.5 py-0.5 rounded-full">
                      {mft.code}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-slate-900 truncate">
                      {mft.title}
                    </span>
                    {isAttempted ? (
                      <span className="text-[10px] font-bold uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a] border border-[#86efac]/80">
                        Attempted
                      </span>
                    ) : mft.badge ? (
                      <span className="text-[10px] font-bold uppercase font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {mft.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{mft.keyHighlights}</p>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-mono pt-1">
                    <span>{mft.totalQuestions} Questions</span>
                    <span>•</span>
                    <span>{mft.durationMinutes} Mins</span>
                    <span>•</span>
                    <span>{mft.totalMarks} Marks</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">100% Free</span>
                  </div>
                </div>

                {isAttempted ? (
                  <Link
                    href={mft.playerUrl}
                    className="shrink-0 px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white rounded-full text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 hover:-translate-y-0.5"
                    title="Reattempt this test"
                  >
                    <RotateCcw size={13} />
                    <span>Reattempt</span>
                  </Link>
                ) : (
                  <Link
                    href={mft.playerUrl}
                    className="shrink-0 px-5 py-2 bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] hover:shadow-[0_10px_24px_-8px_rgba(26,95,224,0.5)] text-white rounded-full text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 hover:-translate-y-0.5"
                  >
                    <Play size={12} className="fill-current" />
                    <span>Start Test</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Recent Attempt History & Solution Logs */}
      <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_-25px_rgba(10,28,150,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3e9fd] text-[#7c3aed] border border-[#d6aef2]/60 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BarChart3 size={13} />
              <span>Diagnostic Logs</span>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1a1a1a] tracking-tight">
              Completed Tests &amp; Instant Solutions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review your answers for every attempt, see step-by-step solutions, and inspect question pacing.
            </p>
          </div>

          {attempts.length > 5 && (
            <button
              onClick={() => setShowAllAttempts(!showAllAttempts)}
              className="text-xs font-semibold text-[#0a1c96] hover:text-[#1a5fe0] transition-colors cursor-pointer self-start sm:self-center px-3.5 py-1.5 rounded-full bg-[#fafafa] border border-[rgba(26,26,26,0.08)] shadow-2xs"
            >
              {showAllAttempts ? "Show Less" : `View All (${filteredAttempts.length})`}
            </button>
          )}
        </div>

        {/* Filter Pills / Dropdown */}
        {attempts.length > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-mono text-[11px] shrink-0 font-bold uppercase">Filter:</span>
            <button
              onClick={() => setSelectedTestFilter("ALL")}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer shrink-0 text-xs active:scale-95 ${
                selectedTestFilter === "ALL"
                  ? "bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] text-white shadow-xs"
                  : "bg-[#fafafa] text-slate-600 hover:bg-slate-100 border border-[rgba(26,26,26,0.08)]"
              }`}
            >
              All Tests ({attempts.length})
            </button>

            <button
              onClick={() => setSelectedTestFilter("MFT")}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer shrink-0 text-xs active:scale-95 ${
                selectedTestFilter === "MFT"
                  ? "bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] text-white shadow-xs"
                  : "bg-[#fafafa] text-slate-600 hover:bg-slate-100 border border-[rgba(26,26,26,0.08)]"
              }`}
            >
              MFT Series ({attempts.filter((a) => a.testId.toLowerCase().includes("mft")).length})
            </button>

            {uniqueAttemptedTestIds.length > 2 && (
              <select
                value={selectedTestFilter}
                onChange={(e) => setSelectedTestFilter(e.target.value)}
                className="bg-[#fafafa] border border-[rgba(26,26,26,0.08)] text-slate-700 rounded-full px-3.5 py-1.5 text-xs outline-none cursor-pointer shadow-2xs"
              >
                <option value="ALL">Specific Test...</option>
                {uniqueAttemptedTestIds.map((tId) => (
                  <option key={tId} value={tId}>
                    {formatTestTitle(tId, tId)}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {filteredAttempts.length > 0 ? (
          <div className="space-y-2.5">
            {displayedAttempts.map((attempt) => {
              const title = formatTestTitle(attempt.testTitle, attempt.testId);
              const scorePct = Math.round((attempt.score / (attempt.maxScore || 300)) * 100);
              const avgPaceSecs =
                attempt.attemptedCount > 0
                  ? Math.round(attempt.timeSpentSeconds / attempt.attemptedCount)
                  : 0;

              let badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
              if (attempt.score >= 180) {
                badgeColor = "bg-[#dcfce7] text-[#16a34a] border-[#86efac]/80";
              } else if (attempt.score >= 120) {
                badgeColor = "bg-[#e9f1fd] text-[#1a5fe0] border-[#1a5fe0]/20";
              } else if (attempt.score >= 80) {
                badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
              }

              return (
                <div
                  key={`${attempt.id}_${attempt.createdAt}_${attempt.score}`}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fafafa] hover:bg-white border border-[rgba(26,26,26,0.07)] hover:border-[#1a5fe0]/30 rounded-[20px] shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                        {title}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}
                      >
                        {attempt.score} / {attempt.maxScore || 300} Marks ({scorePct}%)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock size={12} className="text-slate-400" />
                        {formatDate(attempt.createdAt)}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 font-medium text-emerald-600">
                        <CheckCircle2 size={12} />
                        {attempt.correctCount} Correct
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-rose-500 font-medium">
                        {attempt.incorrectCount} Incorrect
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-700">
                        {attempt.accuracy}% Accuracy
                      </span>
                      {attempt.timeSpentSeconds > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-600 font-mono text-[11px]">
                            {formatDuration(attempt.timeSpentSeconds)}
                          </span>
                        </>
                      )}
                      {avgPaceSecs > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-[#0a1c96] font-mono text-[11px] font-semibold">
                            ~{formatDuration(avgPaceSecs)}/Q
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Quick Review Modal Button */}
                    <button
                      onClick={() => setInspectAttempt(attempt)}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-[rgba(26,26,26,0.1)] rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                      title="Quick Review Summary"
                    >
                      <Eye size={13} className="text-slate-500" />
                      <span>Quick Review</span>
                    </button>

                    {/* Direct Player Solutions Review */}
                    <Link
                      href={`/exam/player?id=${encodeURIComponent(attempt.testId)}&review=1&attemptId=${encodeURIComponent(attempt.id)}`}
                      className="px-4 py-1.5 bg-[#e9f1fd] hover:bg-[#d8e8fc] text-[#0a1c96] border border-[#1a5fe0]/25 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <span>Analyze &amp; Solutions</span>
                      <ExternalLink size={13} />
                    </Link>

                    {/* Retake */}
                    <Link
                      href={`/exam/player?id=${encodeURIComponent(attempt.testId)}`}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-[rgba(26,26,26,0.1)] rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                      title="Retake Test"
                    >
                      <RotateCcw size={12} />
                      <span className="hidden sm:inline">Retake</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-[rgba(26,26,26,0.12)] rounded-[26px] bg-[#fafafa] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#e9f1fd] text-[#1a5fe0] flex items-center justify-center mx-auto shadow-2xs">
              <FileQuestion size={24} />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="font-bold text-sm text-[#1a1a1a]">
                {attempts.length > 0 ? "No attempts match the selected filter" : "No mock attempts logged yet"}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {attempts.length > 0
                  ? "Switch the filter tab back to 'All Tests' to see all your past mock evaluations."
                  : "Start with Major Full Test 1 above. Upon completion, full question-by-question solutions and performance analytics will appear here automatically."}
              </p>
            </div>
            {attempts.length > 0 ? (
              <button
                onClick={() => setSelectedTestFilter("ALL")}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] text-white rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>View All Tests</span>
              </button>
            ) : (
              <Link
                href="/exam/player?id=MFT-1.pdf"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] text-white rounded-full text-xs font-semibold transition-all shadow-xs active:scale-95"
              >
                <span>Take Free Mock (MFT-1)</span>
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* 4. Quick Review Modal */}
      {inspectAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_30px_70px_-20px_rgba(10,28,150,0.25)] overflow-hidden text-slate-900">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[rgba(26,26,26,0.08)] flex items-start justify-between gap-4 bg-[#fafafa]">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#e9f1fd] text-[#0a1c96] border border-[#1a5fe0]/20 text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
                  <span>Attempt Review</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-slate-500 font-normal">
                    {formatDate(inspectAttempt.createdAt)}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] tracking-tight">
                  {formatTestTitle(inspectAttempt.testTitle, inspectAttempt.testId)}
                </h3>
              </div>

              <button
                onClick={() => setInspectAttempt(null)}
                className="p-2 rounded-full bg-white hover:bg-slate-100 border border-[rgba(26,26,26,0.08)] text-slate-600 transition-colors cursor-pointer shadow-2xs active:scale-95"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Score & KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-[20px] bg-[#e9f1fd]/70 border border-[#1a5fe0]/20">
                  <div className="text-[11px] font-mono text-[#0a1c96] uppercase tracking-wider font-bold mb-0.5">
                    Score
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-[#0a1c96]">
                    {inspectAttempt.score}
                    <span className="text-xs font-normal text-indigo-500"> / {inspectAttempt.maxScore || 300}</span>
                  </div>
                  <div className="text-[10px] text-indigo-700 mt-1 font-semibold">
                    {Math.round((inspectAttempt.score / (inspectAttempt.maxScore || 300)) * 100)}% marks
                  </div>
                </div>

                <div className="p-4 rounded-[20px] bg-[#dcfce7]/70 border border-[#86efac]/80">
                  <div className="text-[11px] font-mono text-emerald-800 uppercase tracking-wider font-bold mb-0.5">
                    Accuracy
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-emerald-950">
                    {inspectAttempt.accuracy}%
                  </div>
                  <div className="text-[10px] text-emerald-800 mt-1 font-semibold">
                    {inspectAttempt.correctCount} Correct / {inspectAttempt.attemptedCount} Solved
                  </div>
                </div>

                <div className="p-4 rounded-[20px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)]">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold mb-0.5">
                    Time Spent
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-[#1a1a1a]">
                    {formatDuration(inspectAttempt.timeSpentSeconds)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    Total test duration
                  </div>
                </div>

                <div className="p-4 rounded-[20px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)]">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold mb-0.5">
                    Avg Pace / Q
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-[#1a1a1a]">
                    {inspectAttempt.attemptedCount > 0
                      ? formatDuration(Math.round(inspectAttempt.timeSpentSeconds / inspectAttempt.attemptedCount))
                      : "—"}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    Per question pace
                  </div>
                </div>
              </div>

              {/* Subject Breakdown if available */}
              {Array.isArray(inspectAttempt.sectionBreakdown) && inspectAttempt.sectionBreakdown.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    Subject Performance
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {inspectAttempt.sectionBreakdown.map((sec: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-[18px] bg-[#fafafa] border border-[rgba(26,26,26,0.08)]"
                      >
                        <div className="font-bold text-xs text-slate-900 capitalize mb-1">
                          {sec.name || sec.subject || `Subject ${idx + 1}`}
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-slate-500">Score:</span>
                          <span className="font-bold text-[#0a1c96]">
                            {sec.score ?? 0} Marks
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-0.5">
                          <span>Accuracy:</span>
                          <span className="text-slate-700">
                            {sec.correct ?? 0}C · {sec.incorrect ?? 0}W
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pacing Diagnostic Summary */}
              {inspectAttempt.questionTimes && Object.keys(inspectAttempt.questionTimes).length > 0 && (
                <div className="p-4 rounded-[20px] bg-[#e9f1fd]/60 border border-[#1a5fe0]/20 space-y-1">
                  <div className="text-xs font-bold text-[#0a1c96] flex items-center gap-1.5">
                    <Clock size={14} className="text-[#1a5fe0]" />
                    <span>Per-Question Pacing Captured</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Time logs recorded for {Object.keys(inspectAttempt.questionTimes).length} questions.
                    Click &apos;Open Full Solutions&apos; below to inspect question-by-question time breakdowns and time sink diagnostics.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[rgba(26,26,26,0.08)] bg-[#fafafa] flex items-center justify-between gap-3">
              <button
                onClick={() => setInspectAttempt(null)}
                className="px-5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-[rgba(26,26,26,0.1)] rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                Close
              </button>

              <Link
                href={`/exam/player?id=${encodeURIComponent(inspectAttempt.testId)}&review=1&attemptId=${encodeURIComponent(inspectAttempt.id)}`}
                className="px-5 py-2 bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] hover:shadow-[0_10px_24px_-8px_rgba(26,95,224,0.5)] text-white rounded-full text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Open Full Interactive Solutions</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
