"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Target,
  Info,
  Sparkles,
  ShieldCheck,
  Sliders,
  HelpCircle,
  BarChart2,
} from "lucide-react";
import {
  analyzeJeeScore,
  simulateScoreImpact,
  SHIFTS_2026,
  TOTAL_CANDIDATE_POOL_2026,
  MAX_PAPER1_MARKS,
  formatIndianNumber,
  AnalysisPrediction,
} from "@/lib/jeePercentileAnalyzer";

interface JeePercentileAnalyzerCardProps {
  rawScore: number;
  maxScore?: number;
  incorrectCount?: number;
  correctCount?: number;
  unattemptedCount?: number;
  subjectBreakdown?: {
    sectionName: string;
    score: number;
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
  }[];
  compact?: boolean;
}

export function JeePercentileAnalyzerCard({
  rawScore,
  maxScore = 300,
  incorrectCount = 0,
  correctCount = 0,
  unattemptedCount = 0,
  subjectBreakdown = [],
  compact = false,
}: JeePercentileAnalyzerCardProps) {
  // Mode: "quick" (pooled 2026 baseline) vs "advanced" (shift-aware)
  const [mode, setMode] = useState<"quick" | "advanced">("quick");
  const [selectedShiftId, setSelectedShiftId] = useState<string>("preset_moderate");
  const [showFormulaExplainer, setShowFormulaExplainer] = useState<boolean>(false);
  const [showWhatIfSimulator, setShowWhatIfSimulator] = useState<boolean>(false);
  const [simulatedExtraMarks, setSimulatedExtraMarks] = useState<number>(0);

  // Scaled score to 300 scale if test had different max score
  const scaledScore = useMemo(() => {
    if (maxScore === 300) return rawScore;
    return Math.round((rawScore / maxScore) * 300);
  }, [rawScore, maxScore]);

  // Current analysis prediction
  const analysis: AnalysisPrediction = useMemo(() => {
    return analyzeJeeScore(scaledScore, {
      mode,
      shiftId: mode === "advanced" ? selectedShiftId : undefined,
    });
  }, [scaledScore, mode, selectedShiftId]);

  // What-If simulation: No Negative Marking
  const marksLostToNegatives = incorrectCount * 1;
  const noNegativesScore = scaledScore + marksLostToNegatives;
  const noNegativesImpact = useMemo(() => {
    if (incorrectCount === 0) return null;
    return simulateScoreImpact(scaledScore, noNegativesScore, mode, selectedShiftId);
  }, [scaledScore, noNegativesScore, incorrectCount, mode, selectedShiftId]);

  // Custom Extra Marks Simulation
  const customSimImpact = useMemo(() => {
    if (simulatedExtraMarks === 0) return null;
    return simulateScoreImpact(scaledScore, scaledScore + simulatedExtraMarks, mode, selectedShiftId);
  }, [scaledScore, simulatedExtraMarks, mode, selectedShiftId]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all">
      {/* 1. TOP HEADER & OFFICIAL 2026 BADGE */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider">
                JEE Main 2026 Reference Engine
              </span>
              <span className="text-[11px] text-gray-300">
                15,38,468 Unique Candidates Pool
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-1.5 flex items-center space-x-2 text-white">
              <TrendingUp className="w-5 h-5 text-blue-400 shrink-0" />
              <span>StudyFAM Percentile &amp; AIR Analyzer</span>
            </h2>
            <p className="text-xs text-blue-200/80 mt-0.5">
              Normalised range estimates based on NTA multi-shift score normalisation principles
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setMode("quick")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === "quick"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Quick Mode (Pooled)
            </button>
            <button
              onClick={() => setMode("advanced")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                mode === "advanced"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Advanced (Shift-Aware)</span>
            </button>
          </div>
        </div>

        {/* Advanced Mode: Shift Selector Banner */}
        {mode === "advanced" && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-blue-200">Simulate Shift Difficulty:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedShiftId("preset_tough")}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    selectedShiftId === "preset_tough"
                      ? "bg-rose-500 text-white"
                      : "bg-white/10 text-rose-200 hover:bg-white/20"
                  }`}
                >
                  Tough Shift (99%ile @ ~153)
                </button>
                <button
                  onClick={() => setSelectedShiftId("preset_moderate")}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    selectedShiftId === "preset_moderate"
                      ? "bg-amber-500 text-slate-950 font-black"
                      : "bg-white/10 text-amber-200 hover:bg-white/20"
                  }`}
                >
                  Moderate (Baseline @ ~175)
                </button>
                <button
                  onClick={() => setSelectedShiftId("preset_easy")}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    selectedShiftId === "preset_easy"
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 text-emerald-200 hover:bg-white/20"
                  }`}
                >
                  Easy / High Marks (99%ile @ ~193)
                </button>
              </div>
            </div>

            {/* Shift Dropdown for Exact 2026 Shifts */}
            <select
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(e.target.value)}
              className="bg-slate-800 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            >
              <optgroup label="Shift Difficulty Scenarios">
                <option value="preset_tough">🔴 Tough Shift Scenario (e.g. 6 Apr S1)</option>
                <option value="preset_moderate">🟡 Moderate Baseline Scenario</option>
                <option value="preset_easy">🟢 Easy Shift Scenario (e.g. 4 Apr S2)</option>
              </optgroup>
              <optgroup label="April 2026 Shifts">
                {SHIFTS_2026.filter((s) => s.session === "April" && !s.id.startsWith("preset_")).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.difficulty}) - 99%ile @ {s.marksAt99Percentile}
                  </option>
                ))}
              </optgroup>
              <optgroup label="January 2026 Shifts">
                {SHIFTS_2026.filter((s) => s.session === "January" && !s.id.startsWith("preset_")).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.difficulty}) - 99%ile @ {s.marksAt99Percentile}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        )}
      </div>

      {/* 2. MAIN ESTIMATES HERO GRID */}
      <div className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Estimated Percentile Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 border-2 border-blue-200/80 rounded-xl p-5 shadow-2xs relative">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-blue-700 flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Estimated Percentile</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Range
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
                {analysis.percentileMin.toFixed(2)} - {analysis.percentileMax.toFixed(2)}
              </span>
              <span className="text-sm font-extrabold text-blue-600">%ile</span>
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-gray-600">
              <span>Raw Score: <strong>{scaledScore} / 300</strong></span>
              <span className="text-blue-700 font-semibold">Mid: {analysis.percentileMid}%ile</span>
            </div>
          </div>

          {/* Estimated AIR Range Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50/70 border-2 border-purple-200/80 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-purple-700 flex items-center space-x-1.5">
                <Target className="w-4 h-4" />
                <span>Projected AIR Range</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                All-India
              </span>
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight">
                AIR {formatIndianNumber(analysis.airMin)} - {formatIndianNumber(analysis.airMax)}
              </span>
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-purple-200/60 flex items-center justify-between text-[11px] text-gray-600">
              <span>Pool: <strong>15.38 Lakh</strong></span>
              <span className="text-purple-700 font-semibold">
                Top {Math.max(0.01, 100 - analysis.percentileMid).toFixed(2)}% in India
              </span>
            </div>
          </div>

          {/* Confidence & Shift Context */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-gray-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold tracking-wider text-gray-600 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Model Confidence</span>
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    analysis.confidence === "High"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-blue-100 text-blue-800 border-blue-300"
                  }`}
                >
                  {analysis.confidence} Confidence
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {analysis.confidenceReason}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
              <span>Baseline: <strong>2026 Cycle</strong></span>
              <button
                onClick={() => setShowFormulaExplainer(!showFormulaExplainer)}
                className="text-blue-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>How NTA Normalises</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. NTA PERCENTILE FORMULA & NORMALISATION EXPLAINER (COLLAPSIBLE / TOOLTIP) */}
        {showFormulaExplainer && (
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-400 shrink-0" />
                <h3 className="text-sm font-extrabold text-white">
                  How NTA Percentile Score Actually Works (Official NTA IB Rule)
                </h3>
              </div>
              <button
                onClick={() => setShowFormulaExplainer(false)}
                className="text-gray-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Formula Block */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3.5 text-center font-mono text-xs sm:text-sm text-blue-200">
              Percentile = 100 × (Candidates in shift with raw score ≤ Your score) ÷ (Total candidates in shift)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/60">
                <strong className="text-white block mb-1">Why Marks Alone Are Not Enough:</strong>
                Different shifts have different question papers and difficulty levels. NTA uses shift-wise percentile normalisation so that candidates in a tough shift are not disadvantaged compared to an easier shift.
              </div>
              <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/60">
                <strong className="text-white block mb-1">StudyFAM Reporting Rule:</strong>
                We always display an estimated <strong>range</strong> rather than false single-point precision, because actual results depend on NTA shift normalisation and final shift distribution.
              </div>
            </div>
          </div>
        )}

        {/* 4. STRATEGIC SCORE LEAP SIMULATOR (WHAT-IF ANALYSIS) */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4.5 h-4.5 text-amber-600" />
              <h3 className="text-sm font-extrabold text-amber-950">
                Score Leap Simulator: The Impact of Eliminating Negative Marking
              </h3>
            </div>
            {noNegativesImpact && (
              <span className="text-xs font-black px-2.5 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                +{noNegativesImpact.ranksGained.toLocaleString("en-IN")} Ranks Potential
              </span>
            )}
          </div>

          {incorrectCount > 0 && noNegativesImpact ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/80 text-xs text-gray-700 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">If you had skipped {incorrectCount} uncertain questions:</span>
                <div className="text-base font-black text-amber-900">
                  {scaledScore} → {noNegativesScore} Marks (+{marksLostToNegatives} Marks)
                </div>
                <p className="text-[11px] text-gray-600">
                  Percentile jumps from <strong>{analysis.percentileMid}%ile</strong> to{" "}
                  <strong className="text-emerald-700">{noNegativesImpact.improved.percentileMid}%ile</strong> (+{noNegativesImpact.percentileGain}%ile gain).
                </p>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/80 text-xs text-gray-700 space-y-1">
                <span className="text-[11px] font-bold text-gray-500 uppercase">All-India Rank Improvement:</span>
                <div className="text-base font-black text-emerald-800">
                  AIR {formatIndianNumber(noNegativesImpact.improved.airMin)} - {formatIndianNumber(noNegativesImpact.improved.airMax)}
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  You would gain approximately <strong>{formatIndianNumber(noNegativesImpact.ranksGained)} ranks</strong> just by avoiding guesses!
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-amber-800">
              Zero negative marks recorded in this test! Outstanding discipline and question selection.
            </p>
          )}

          {/* Interactive Extra Marks Slider */}
          <div className="pt-2 border-t border-amber-200/60">
            <div className="flex items-center justify-between text-xs text-amber-950 font-bold mb-1.5">
              <span>Interactive Simulator: What if you score extra marks?</span>
              <span className="text-amber-800 font-extrabold">+{simulatedExtraMarks} Marks</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="4"
              value={simulatedExtraMarks}
              onChange={(e) => setSimulatedExtraMarks(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            {customSimImpact && simulatedExtraMarks > 0 && (
              <div className="mt-2 p-2.5 bg-white rounded-lg border border-amber-300 text-xs text-gray-800 flex items-center justify-between">
                <span>
                  New Score: <strong>{scaledScore + simulatedExtraMarks} / 300</strong>
                </span>
                <span>
                  New Percentile: <strong className="text-blue-700">{customSimImpact.improved.percentileRangeFormatted}</strong>
                </span>
                <span className="text-emerald-700 font-black">
                  +{formatIndianNumber(customSimImpact.ranksGained)} Ranks Leap!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 6. SUBJECT-WISE BREAKDOWN (IF AVAILABLE) */}
        {subjectBreakdown.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>Subject Performance &amp; Efficiency Breakdown</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {subjectBreakdown.map((subj) => {
                const maxSubjScore = subj.total * 4;
                const pct = maxSubjScore > 0 ? Math.round((subj.score / maxSubjScore) * 100) : 0;
                const acc = subj.attempted > 0 ? Math.round((subj.correct / subj.attempted) * 100) : 0;

                return (
                  <div
                    key={subj.sectionName}
                    className="p-4 rounded-xl border border-gray-200 bg-white space-y-2 hover:border-blue-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-gray-900">
                        {subj.sectionName}
                      </span>
                      <span className="text-xs font-black text-blue-700">
                        {subj.score} / {maxSubjScore}
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 60
                            ? "bg-emerald-500"
                            : pct >= 40
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${Math.max(5, Math.min(100, pct))}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-1 text-center text-[10px] text-gray-500">
                      <div>
                        <span className="block font-bold text-gray-800">{subj.correct} Qs</span>
                        <span>Correct</span>
                      </div>
                      <div>
                        <span className="block font-bold text-rose-600">{subj.incorrect} Qs</span>
                        <span>Incorrect</span>
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-700">{acc}%</span>
                        <span>Accuracy</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
