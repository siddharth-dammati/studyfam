"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  ArrowLeft,
  Sliders,
  Info,
  BookOpen,
  Sparkles,
  Target,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { JeePercentileAnalyzerCard } from "@/components/exam/JeePercentileAnalyzerCard";
import { MAX_PAPER1_MARKS, TOTAL_CANDIDATE_POOL_2026 } from "@/lib/jeePercentileAnalyzer";

export default function PercentileAnalyzerPage() {
  const [marksInput, setMarksInput] = useState<string>("180");
  const [incorrectInput, setIncorrectInput] = useState<string>("6");
  const [unattemptedInput, setUnattemptedInput] = useState<string>("14");

  const rawMarks = Math.max(-75, Math.min(MAX_PAPER1_MARKS, Number(marksInput) || 0));
  const incorrectCount = Math.max(0, Math.min(75, Number(incorrectInput) || 0));
  const unattemptedCount = Math.max(0, Math.min(75, Number(unattemptedInput) || 0));
  const correctCount = Math.max(0, Math.round((rawMarks + incorrectCount) / 4));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <span className="text-gray-300">|</span>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-gray-900 text-sm sm:text-base">
              StudyFAM JEE 2026 Percentile Analyzer
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black uppercase rounded-full">
              Official Reference Engine
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/exam"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Take Free Mock Test
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider rounded-full">
                JEE Main 2026 Reference Cycle
              </span>
              <span className="text-xs text-blue-200">
                15,38,468 Candidates Normalisation Model
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              JEE Main Marks vs Percentile &amp; AIR Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              In JEE Main, raw marks are never equal to percentile. NTA calculates percentiles shift-wise and normalises them across multiple exam shifts. Enter your raw score below to explore your estimated percentile range, projected All-India Rank, and shift difficulty scenarios.
            </p>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-gray-900 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Enter Your Exam Marks or Target Score</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Raw Score (Out of 300)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="-75"
                  max="300"
                  value={marksInput}
                  onChange={(e) => setMarksInput(e.target.value)}
                  className="w-full text-lg font-black px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 180"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-gray-400">/ 300</span>
              </div>
              <span className="text-[10px] text-gray-500 block mt-1">Accepts 0 to 300 (or negative penalty)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Incorrect Questions (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="75"
                value={incorrectInput}
                onChange={(e) => setIncorrectInput(e.target.value)}
                className="w-full text-lg font-black px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 6"
              />
              <span className="text-[10px] text-gray-500 block mt-1">Used for Negative Marking What-If simulator</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Quick Mark Presets
              </label>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[120, 150, 180, 210, 240, 270].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMarksInput(String(preset))}
                    className={`px-2.5 py-1 text-xs font-extrabold rounded-lg border cursor-pointer transition-colors ${
                      Number(marksInput) === preset
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-gray-500 block mt-1">Click to quickly test benchmark marks</span>
            </div>
          </div>
        </div>

        {/* Live Percentile Analyzer Engine Component */}
        <JeePercentileAnalyzerCard
          rawScore={rawMarks}
          maxScore={300}
          incorrectCount={incorrectCount}
          correctCount={correctCount}
          unattemptedCount={unattemptedCount}
        />

        {/* 2026 Reference Feed Documentation Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-gray-900">
              About StudyFAM JEE Main 2026 Normalisation Model
            </h3>
          </div>

          <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
            <p>
              This analyzer uses the official <strong>JEE Main 2026 Paper 1</strong> data feed as its historical baseline. A total of <strong>15,38,468 unique candidates</strong> appeared across both January and April sessions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-gray-800 block">Why We Report Ranges:</span>
                <p>
                  NTA normalises scores separately for each shift. The same 180 marks resulted in 98.88%ile in an easy shift and up to 99.41%ile in a tough shift. Reporting exact single-point numbers without shift data is statistically misleading.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-bold text-gray-800 block">All-India Rank (AIR) Formula:</span>
                <p>
                  Approximate All-India Rank is projected using the standard formula: <br />
                  <code className="text-blue-700 font-mono font-bold">AIR ≈ (100 - Percentile) × 15,38,468 / 100</code>, clamped and rounded to realistic merit list boundaries.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 pt-1">
              Disclaimer: StudyFAM is an independent educational platform. NTA does not publish an official marks-to-percentile table; our projections are based on verified 2026 shift trends.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
