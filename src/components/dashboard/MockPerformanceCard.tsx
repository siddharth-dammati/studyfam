"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    if (score >= 250) return { pct: "99.8+ %ile", air: "AIR < 1,500", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (score >= 210) return { pct: "99.2 - 99.7 %ile", air: "AIR 2,500 – 6,000", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (score >= 180) return { pct: "98.0 - 99.0 %ile", air: "AIR 8,000 – 16,000", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (score >= 140) return { pct: "95.0 - 97.5 %ile", air: "AIR 25,000 – 45,000", color: "text-indigo-700 bg-indigo-50 border-indigo-200" };
    if (score >= 100) return { pct: "90.0 - 94.5 %ile", air: "AIR 55,000 – 90,000", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { pct: "75 - 88 %ile", air: "Focus on High-Yield", color: "text-slate-700 bg-slate-100 border-slate-200" };
  };

  const highestBracket = getPercentileBracket(highestScore);

  const displayedAttempts = showAllAttempts ? attempts : attempts.slice(0, 4);

  const formatTestTitle = (title: string, testId: string) => {
    if (!title || title.trim() === "") {
      if (testId.includes("MFT-")) {
        const match = testId.match(/MFT-(\d+)/i);
        return match ? `Major Full Test ${match[1]} (JEE Main)` : "Major Full Mock Test";
      }
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
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
              <Activity size={16} />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Student Performance Analytics
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Mock Tests &amp; Diagnostics
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time tracking of full-length Major Tests (MFT 1–10) and chapter modules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <span>Take New Mock</span>
            <Zap size={14} className="text-amber-300" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* KPI 1: Tests Attempted */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-mono text-[11px] uppercase tracking-wider">Mocks Taken</span>
            <Trophy size={14} className="text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 tabular-nums">
            {totalAttempts}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
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
            <span className="font-mono text-[11px] uppercase tracking-wider">Average Accuracy</span>
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

      {/* If Attempts Exist: List of Recent Mocks */}
      {totalAttempts > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BarChart3 size={13} className="text-indigo-600" />
              <span>Recent Mock Attempts &amp; Solution Logs</span>
            </h4>
            {attempts.length > 4 && (
              <button
                onClick={() => setShowAllAttempts(!showAllAttempts)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                {showAllAttempts ? "Show Less" : `View All (${attempts.length})`}
              </button>
            )}
          </div>

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
                  key={attempt.id}
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
                            {Math.round(attempt.timeSpentSeconds / 60)} mins spent
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/exam/player?id=${encodeURIComponent(attempt.testId)}&review=1`}
                      className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Analyze &amp; Solutions</span>
                      <ExternalLink size={13} />
                    </Link>
                    <Link
                      href={`/exam/player?id=${encodeURIComponent(attempt.testId)}`}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
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
        </div>
      ) : (
        /* Empty State: Encouraging student to take first mock */
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50/60 border border-indigo-100/90 rounded-2xl p-6 sm:p-7 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              <Flame size={12} className="text-amber-500" />
              <span>Diagnostic Ready</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Take Your First Full-Length JEE Main Mock Test
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Experience the exact TCS iON Computer-Based Testing screen with auto full-screen proctoring.
              Instantly unlock your projected All-India Rank, question-by-question solutions, and weak chapter diagnostics.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> 75 NTA Pattern Questions
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> Full Solutions &amp; Step-by-Step
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-500" /> AI Negative Marks Leakage Analysis
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/exam/player?id=MFT-1.pdf"
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Launch Major Mock 1</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/exam"
              className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer"
            >
              <span>View All 10 Mocks</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
