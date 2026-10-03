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
  createdAt: string;
}

interface MockPerformanceCardProps {
  attempts: MockAttemptRecord[];
  loading?: boolean;
}

export function MockPerformanceCard({ attempts, loading }: MockPerformanceCardProps) {
  const [showAllAttempts, setShowAllAttempts] = useState(false);
  const [showAllMfts, setShowAllMfts] = useState(false);

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

  const displayedAttempts = showAllAttempts ? attempts : attempts.slice(0, 5);
  const displayedMfts = showAllMfts ? FREE_MOCKS_DATA : FREE_MOCKS_DATA.slice(0, 4);

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
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                <Activity size={16} />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Performance Dashboard
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Mock Practice &amp; Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Real-time analytics across all attempted Major Full Tests (MFT 1–10) and topic modules.
            </p>
          </div>

          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <span>Browse 400+ Chapter Tests</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* KPI 1: Tests Attempted */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-mono text-[11px] uppercase tracking-wider">Mocks Taken</span>
              <Trophy size={14} className="text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 tabular-nums">
              {totalAttempts}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {totalAttempts > 0 ? (
                <span className="text-indigo-600 font-semibold">{totalQuestionsSolved} Qs attempted</span>
              ) : (
                <span>10 Full Mocks ready</span>
              )}
            </div>
          </div>

          {/* KPI 2: Highest Score */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-100 rounded-2xl p-4">
            <div className="flex items-center justify-between text-indigo-900 text-xs mb-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-indigo-600">
                Highest Score
              </span>
              <Sparkles size={14} className="text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-indigo-950 tabular-nums">
              {totalAttempts > 0 ? highestScore : "—"}
              <span className="text-xs font-normal text-indigo-400 ml-1">/ 300</span>
            </div>
            <div className="text-[11px] text-indigo-700 mt-1 font-semibold truncate">
              {totalAttempts > 0 ? highestBracket.pct : "Score benchmark ready"}
            </div>
          </div>

          {/* KPI 3: Accuracy Rate */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-mono text-[11px] uppercase tracking-wider">Accuracy Rate</span>
              <Target size={14} className="text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 tabular-nums">
              {totalAttempts > 0 ? `${avgAccuracy}%` : "—"}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {totalAttempts > 0 ? (
                <span className="text-emerald-600 font-semibold">{totalCorrect} correct answers</span>
              ) : (
                <span>Target: &gt;80% for 99%ile</span>
              )}
            </div>
          </div>

          {/* KPI 4: Practice Time */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-mono text-[11px] uppercase tracking-wider">Practice Time</span>
              <Clock size={14} className="text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 tabular-nums">
              {totalAttempts > 0 ? timeFormatted : "0m"}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {totalAttempts > 0 ? "Under CBT conditions" : "3h authentic timer"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Major Full Test Series (MFT 1–10) Launcher */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                10 Major Tests Active
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Start Full-Length Mock Test (MFT Series)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact 75-question NTA format (300 Marks, 3.0 Hours, +4/-1) with proctoring &amp; full solutions.
            </p>
          </div>

          <button
            onClick={() => setShowAllMfts(!showAllMfts)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer shrink-0"
          >
            {showAllMfts ? "Show Less" : `View All 10 MFTs`}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedMfts.map((mft) => (
            <div
              key={mft.id}
              className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all flex items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md">
                    {mft.code}
                  </span>
                  <span className="font-bold text-sm text-slate-900 truncate">
                    {mft.title}
                  </span>
                  {mft.badge && (
                    <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {mft.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{mft.keyHighlights}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span>{mft.totalQuestions} Questions</span>
                  <span>•</span>
                  <span>{mft.durationMinutes} Mins</span>
                  <span>•</span>
                  <span>{mft.totalMarks} Marks</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">100% Free</span>
                </div>
              </div>

              <Link
                href={mft.playerUrl}
                className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Play size={12} className="fill-current" />
                <span>Start</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Attempt History & Solution Logs */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-600" />
              <span>Completed Tests &amp; Instant Solutions</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your answers, see step-by-step solutions, and identify lagging chapters.
            </p>
          </div>

          {attempts.length > 5 && (
            <button
              onClick={() => setShowAllAttempts(!showAllAttempts)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              {showAllAttempts ? "Show Less" : `View All (${attempts.length})`}
            </button>
          )}
        </div>

        {totalAttempts > 0 ? (
          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/40">
            {displayedAttempts.map((attempt) => {
              const title = formatTestTitle(attempt.testTitle, attempt.testId);
              const scorePct = Math.round((attempt.score / (attempt.maxScore || 300)) * 100);

              let badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
              if (attempt.score >= 180) {
                badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
              } else if (attempt.score >= 120) {
                badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
              } else if (attempt.score >= 80) {
                badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
              }

              return (
                <div
                  key={`${attempt.id}_${attempt.createdAt}_${attempt.score}`}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                        {title}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
                      >
                        {attempt.score} / {attempt.maxScore || 300} Marks ({scorePct}%)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
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
                            {Math.round(attempt.timeSpentSeconds / 60)} mins
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/exam/player?id=${encodeURIComponent(attempt.testId)}&review=1`}
                      className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>Analyze &amp; Solutions</span>
                      <ExternalLink size={13} />
                    </Link>
                    <Link
                      href={`/exam/player?id=${encodeURIComponent(attempt.testId)}`}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
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
          <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FileQuestion size={24} />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="font-bold text-sm text-slate-900">No mock attempts logged yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                Start with Major Full Test 1 above. Upon completion, full question-by-question solutions and chapter lag diagnostics will appear here automatically.
              </p>
            </div>
            <Link
              href="/exam/player?id=MFT-1.pdf"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <span>Take Free Mock (MFT-1)</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
