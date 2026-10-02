"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  BookOpen,
  ArrowLeft,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  ShieldAlert,
  HelpCircle,
  LayoutGrid,
  List,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Printer,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  Flame,
  Zap,
  Compass,
} from "lucide-react";
import { EvaluationResult } from "@/lib/examDb";
import { formatQuestionText, formatOptionText, formatSolutionText } from "@/lib/questionFormatter";

interface TcsIonResultViewProps {
  testTitle: string;
  result: EvaluationResult;
  candidateName?: string;
  onRetake: () => void;
}

export function TcsIonResultView({
  testTitle,
  result,
  candidateName = "Candidate",
  onRetake,
}: TcsIonResultViewProps) {
  // Main Analysis Tabs: "diagnostic" (JEE Deep Dive & Weak Chapters) | "interactive" (Questions & Solutions) | "list" (Full Paper)
  const [activeTab, setActiveTab] = useState<"diagnostic" | "interactive" | "list">("diagnostic");

  // Selected question index within the active filtered list
  const [selectedQIndex, setSelectedQIndex] = useState<number>(0);

  // Filters
  const [filterSubject, setFilterSubject] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterChapter, setFilterChapter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // In list mode, expanded solutions map
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState<boolean>(true);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  // 1. JEE Main Percentile & All-India Rank (AIR) Prediction Engine
  const jeePrediction = useMemo(() => {
    const rawScore = result.totalScore;
    const maxScore = result.maxScore || 300;
    const scaledScore = Math.max(-75, Math.min(300, Math.round((rawScore / maxScore) * 300)));

    let percentile = 0;
    let rankRange = "";
    let collegeTier = "";
    let advancedEligible = false;

    if (scaledScore >= 270) {
      percentile = 99.95;
      rankRange = "AIR 1 - 400";
      collegeTier = "Top 3 NITs (Trichy, Surathkal, Warangal) Computer Science Guaranteed";
      advancedEligible = true;
    } else if (scaledScore >= 240) {
      percentile = 99.60;
      rankRange = "AIR 400 - 2,500";
      collegeTier = "Top 5 NITs (CSE / ECE) & IIIT Hyderabad / Allahabad";
      advancedEligible = true;
    } else if (scaledScore >= 210) {
      percentile = 99.05;
      rankRange = "AIR 2,500 - 8,000";
      collegeTier = "Premier NITs (Mechanical, EEE, CSE in Tier-2 NITs)";
      advancedEligible = true;
    } else if (scaledScore >= 180) {
      percentile = 98.10;
      rankRange = "AIR 8,000 - 18,000";
      collegeTier = "Core branches in Top 10 NITs & Reputed IIITs";
      advancedEligible = true;
    } else if (scaledScore >= 150) {
      percentile = 96.20;
      rankRange = "AIR 18,000 - 38,000";
      collegeTier = "Mid-tier NITs / Top State Government Engineering Colleges";
      advancedEligible = true;
    } else if (scaledScore >= 120) {
      percentile = 92.40;
      rankRange = "AIR 38,000 - 75,000";
      collegeTier = "Safe for JEE Advanced Qualification | Regional NITs & Top GFTIs";
      advancedEligible = true;
    } else if (scaledScore >= 90) {
      percentile = 86.80;
      rankRange = "AIR 75,000 - 1,45,000";
      collegeTier = "Near General Category Cutoff | Reputed State Universities & GFTIs";
      advancedEligible = true;
    } else if (scaledScore >= 60) {
      percentile = 74.50;
      rankRange = "AIR 1,45,000 - 2,60,000";
      collegeTier = "Push 35+ more marks in high-yield chapters to comfortably clear cutoff";
      advancedEligible = false;
    } else {
      percentile = Math.max(15, Math.round((Math.max(0, scaledScore) / 60) * 60 * 10) / 10);
      rankRange = "AIR > 2,60,000";
      collegeTier = "High-priority syllabus completion & formula revision needed";
      advancedEligible = false;
    }

    return {
      scaledScore,
      percentile,
      rankRange,
      collegeTier,
      advancedEligible,
    };
  }, [result.totalScore, result.maxScore]);

  // 2. Chapter-wise Performance & "Chapters Lagging Behind" Diagnostic
  const chapterBreakdown = useMemo(() => {
    const map = new Map<
      string,
      {
        chapter: string;
        subject: string;
        total: number;
        attempted: number;
        correct: number;
        incorrect: number;
        unattempted: number;
        score: number;
        marksLost: number;
      }
    >();

    for (const q of result.detailedResults) {
      const ch = q.chapter?.trim() || "General / Mixed";
      const key = `${q.subject}:::${ch}`;
      if (!map.has(key)) {
        map.set(key, {
          chapter: ch,
          subject: q.subject,
          total: 0,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          unattempted: 0,
          score: 0,
          marksLost: 0,
        });
      }
      const entry = map.get(key)!;
      entry.total += 1;

      if (q.userResponse) {
        entry.attempted += 1;
        if (q.isCorrect) {
          entry.correct += 1;
          entry.score += 4;
        } else {
          entry.incorrect += 1;
          entry.score -= 1;
          entry.marksLost += 5; // 4 missed + 1 negative mark
        }
      } else {
        entry.unattempted += 1;
        entry.marksLost += 4; // Missed opportunity
      }
    }

    return Array.from(map.values())
      .map((entry) => {
        const accuracy =
          entry.attempted > 0 ? Math.round((entry.correct / entry.attempted) * 100) : 0;
        let status: "WEAK" | "AVERAGE" | "STRONG" = "AVERAGE";

        if (entry.incorrect > 0 && entry.correct === 0) {
          status = "WEAK";
        } else if (accuracy < 50 && entry.attempted > 0) {
          status = "WEAK";
        } else if (accuracy >= 75 && entry.correct >= 1) {
          status = "STRONG";
        }

        return {
          ...entry,
          accuracy,
          status,
        };
      })
      .sort((a, b) => {
        // Priority to chapters with highest mistakes / negative marks
        if (b.incorrect !== a.incorrect) return b.incorrect - a.incorrect;
        return b.marksLost - a.marksLost;
      });
  }, [result.detailedResults]);

  // Distinct Weak and Strong chapters
  const weakChapters = useMemo(
    () => chapterBreakdown.filter((c) => c.status === "WEAK" || c.incorrect > 0),
    [chapterBreakdown]
  );
  const strongChapters = useMemo(
    () => chapterBreakdown.filter((c) => c.status === "STRONG"),
    [chapterBreakdown]
  );

  // 3. Negative Marking & Silly Mistakes Leakage Diagnostic
  const marksLostToNegatives = result.incorrectCount * 1;
  const marksLostOpportunity = result.incorrectCount * 5;
  const potentialScoreWithoutNegatives = result.totalScore + marksLostToNegatives;
  const potentialScoreIfAllCorrect = result.totalScore + marksLostOpportunity;

  // 4. Speed & Time Efficiency Analytics
  const avgTimePerAttempt =
    result.attemptedCount > 0 ? Math.round(result.timeSpentSeconds / result.attemptedCount) : 0;

  // Filter questions based on subject, status, chapter, and search query
  const filteredQuestions = useMemo(() => {
    return result.detailedResults.filter((q) => {
      if (filterSubject !== "ALL" && q.subject.toLowerCase() !== filterSubject.toLowerCase()) {
        return false;
      }
      if (filterStatus === "CORRECT" && !q.isCorrect) return false;
      if (filterStatus === "INCORRECT" && (q.isCorrect || !q.userResponse)) return false;
      if (filterStatus === "UNATTEMPTED" && Boolean(q.userResponse)) return false;
      if (filterChapter !== "ALL" && (q.chapter || "General / Mixed") !== filterChapter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch = (q.questionText || "").toLowerCase().includes(query);
        const qNumMatch = String(q.questionNumber).includes(query);
        const subjMatch = (q.subject || "").toLowerCase().includes(query);
        const chMatch = (q.chapter || "").toLowerCase().includes(query);
        const solMatch = (q.solution || "").toLowerCase().includes(query);
        if (!textMatch && !qNumMatch && !subjMatch && !chMatch && !solMatch) return false;
      }

      return true;
    });
  }, [result.detailedResults, filterSubject, filterStatus, filterChapter, searchQuery]);

  // Safe question index for interactive mode
  const safeIndex = Math.min(Math.max(0, selectedQIndex), Math.max(0, filteredQuestions.length - 1));
  const activeQuestion = filteredQuestions[safeIndex] || result.detailedResults[0];

  // Keyboard navigation for interactive review mode (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== "interactive") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowLeft") {
        setSelectedQIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedQIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, filteredQuestions.length]);

  const toggleSolution = (qId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleToggleAllSolutions = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const newMap: Record<string, boolean> = {};
    for (const q of result.detailedResults) {
      newMap[q.questionId] = nextState;
    }
    setExpandedSolutions(newMap);
  };

  // Jump to review a specific chapter
  const handleReviewChapter = (chapterName: string, subjectName: string) => {
    setFilterSubject(subjectName);
    setFilterChapter(chapterName);
    setFilterStatus("ALL");
    setSelectedQIndex(0);
    setActiveTab("interactive");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] font-sans pb-16">
      {/* 1. TOP HEADER */}
      <header className="bg-white border-b border-gray-300 shadow-xs px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/exam"
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Test Series</span>
          </Link>
          <span className="text-gray-300">|</span>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
              {testTitle}
            </h1>
            <p className="text-[11px] text-gray-500 font-medium">
              National Level JEE Performance Analytics &amp; Solution Engine
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
            title="Print Scorecard & Analysis Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onRetake}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Exam</span>
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 2. SECURITY AUTO-SUBMIT WARNING BANNER (IF APPLICABLE) */}
        {result.submissionReason === "EXCEEDED_TAB_SWITCH_LIMIT" && (
          <div className="bg-rose-50 border-2 border-rose-500 rounded-xl p-5 shadow-sm flex items-start space-x-4 animate-in fade-in">
            <div className="w-11 h-11 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-rose-900">
                  Examination Auto-Submitted Due to Security Violation
                </h3>
                <span className="px-2.5 py-0.5 bg-rose-200 text-rose-900 text-[10px] font-black uppercase tracking-wider rounded-full border border-rose-300">
                  Tab Switch Limit Exceeded (&gt; 3 Times)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-800 mt-1.5 leading-relaxed">
                This test was automatically locked and submitted by the proctoring engine because the candidate switched tabs or left the active examination window more than 3 times. All responses recorded prior to auto-submission have been graded and evaluated below.
              </p>
            </div>
          </div>
        )}

        {/* 3. EXECUTIVE SCORECARD & PREDICTED PERCENTILE HERO BANNER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Candidate & Net Score */}
            <div className="flex items-center space-x-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  Candidate: <span className="text-gray-900 font-extrabold">{candidateName}</span>
                </p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-gray-900">
                    {result.totalScore}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-400">
                    / {result.maxScore}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {result.percentage}% Score
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {result.accuracy}% Accuracy
                  </span>
                </div>
              </div>
            </div>

            {/* JEE Prediction Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              {/* Predicted Percentile */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl text-center shadow-2xs">
                <div className="flex items-center justify-center space-x-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Predicted Percentile</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-950">
                  {jeePrediction.percentile.toFixed(2)}
                  <span className="text-sm font-semibold text-blue-600">%ile</span>
                </div>
                <span className="text-[10px] text-gray-500 block mt-0.5">Based on official NTA shifts</span>
              </div>

              {/* Projected AIR */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-xl text-center shadow-2xs">
                <div className="flex items-center justify-center space-x-1.5 text-purple-700 font-bold text-xs uppercase tracking-wider mb-1">
                  <Target className="w-4 h-4" />
                  <span>Projected AIR Range</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-purple-950">
                  {jeePrediction.rankRange}
                </div>
                <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">All India Ranking</span>
              </div>

              {/* JEE Advanced Eligibility */}
              <div className={`p-4 rounded-xl text-center border shadow-2xs ${
                jeePrediction.advancedEligible
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}>
                <div className="flex items-center justify-center space-x-1.5 font-bold text-xs uppercase tracking-wider mb-1">
                  <Zap className="w-4 h-4" />
                  <span>JEE Adv. Cutoff</span>
                </div>
                <div className="text-sm font-black mt-1">
                  {jeePrediction.advancedEligible ? (
                    <span className="text-emerald-700 flex items-center justify-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Likely Qualified</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center justify-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Needs Push</span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 block mt-0.5">General Cutoff ~92%ile</span>
              </div>
            </div>
          </div>

          {/* Core Counters Row */}
          <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-center">
              <span className="text-xs font-bold text-emerald-700 block">Correct (+4)</span>
              <span className="text-xl font-extrabold text-emerald-800">{result.correctCount} Qs</span>
              <span className="text-[10px] text-emerald-600 block">+{result.correctCount * 4} Marks</span>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-center">
              <span className="text-xs font-bold text-rose-700 block">Incorrect (-1)</span>
              <span className="text-xl font-extrabold text-rose-800">{result.incorrectCount} Qs</span>
              <span className="text-[10px] text-rose-600 block">-{marksLostToNegatives} Marks Penalty</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-xs font-bold text-slate-700 block">Skipped (0)</span>
              <span className="text-xl font-extrabold text-slate-800">{result.unattemptedCount} Qs</span>
              <span className="text-[10px] text-slate-500 block">{result.totalQuestions - result.attemptedCount} Unattempted</span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-center">
              <span className="text-xs font-bold text-amber-700 block">Avg Time / Q</span>
              <span className="text-xl font-extrabold text-amber-800">{avgTimePerAttempt}s</span>
              <span className="text-[10px] text-amber-600 block">Ideal: ~144s (2.4m)</span>
            </div>
          </div>
        </div>

        {/* 4. MAIN NAVIGATION TABS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("diagnostic")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "diagnostic"
                ? "bg-[#1e3a8a] text-white shadow-xs"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Deep Diagnostic &amp; Chapters Lagging Behind</span>
          </button>

          <button
            onClick={() => setActiveTab("interactive")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "interactive"
                ? "bg-[#1e3a8a] text-white shadow-xs"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Interactive Question Explorer &amp; Solutions</span>
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-[#1e3a8a] text-white shadow-xs"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <List className="w-4 h-4" />
            <span>Complete Question Paper &amp; Solutions</span>
          </button>
        </div>

        {/* TAB 1: IN-DEPTH JEE DIAGNOSTIC & CHAPTERS LACKING BEHIND */}
        {activeTab === "diagnostic" && (
          <div className="space-y-6">
            {/* A. CRITICAL SCORE LEAKAGE & NEGATIVE MARKING DIAGNOSTIC */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-gray-900">
                      Negative Marking &amp; Mark Leakage Diagnostic
                    </h2>
                    <p className="text-xs text-gray-500">
                      What every JEE mentor looks at first: The 5-Mark Mistake Trap
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-extrabold">
                  -{marksLostOpportunity} Marks Lost Potential
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Direct Negative Penalty
                  </span>
                  <div className="text-2xl font-black text-rose-700">
                    -{marksLostToNegatives} Marks
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Deducted strictly due to {result.incorrectCount} wrong answers at -1 penalty.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Score If Unsure Qs Were Skipped
                  </span>
                  <div className="text-2xl font-black text-amber-800">
                    {potentialScoreWithoutNegatives} Marks
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    If you had simply skipped the {result.incorrectCount} uncertain questions without guessing.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Potential Score If Attempted Correctly
                  </span>
                  <div className="text-2xl font-black text-emerald-800">
                    {potentialScoreIfAllCorrect} Marks
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Every incorrect answer loses +4 missed marks plus -1 penalty = a <strong>5-mark swing</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 text-xs text-blue-900 leading-relaxed flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Strategic Mentor Note:</strong> In JEE Main, eliminating just 5 silly mistakes or blind guesses increases your net score by <strong>25 marks</strong>, which typically boosts your rank by <strong>15,000 to 25,000 ranks</strong>!
                </div>
              </div>
            </div>

            {/* B. CHAPTERS LACKING BEHIND (WEAK CHAPTERS REQUIRING IMMEDIATE ATTENTION) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-gray-900">
                      Topic &amp; Chapter Mastery: Chapters Lagging Behind
                    </h2>
                    <p className="text-xs text-gray-500">
                      Identified based on incorrect questions, low accuracy, and marks lost in this mock
                    </p>
                  </div>
                </div>

                <div className="text-xs font-semibold text-gray-600">
                  <span className="font-bold text-rose-600">{weakChapters.length}</span> Chapters Need Revision
                </div>
              </div>

              {weakChapters.length === 0 ? (
                <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-emerald-900">Outstanding Chapter Mastery!</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    You did not have significant score leakage in any chapter. Keep up the high accuracy!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                    ⚠️ High-Priority Weak Chapters (Click to Review Questions &amp; Solutions):
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {weakChapters.map((ch) => (
                      <div
                        key={`${ch.subject}-${ch.chapter}`}
                        className="p-4 rounded-xl border-2 border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-400 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                              {ch.subject}
                            </span>
                            <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                              -{ch.marksLost} Marks Leakage
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 mt-2">
                            {ch.chapter}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                            <span>Accuracy: <strong className="text-rose-600">{ch.accuracy}%</strong></span>
                            <span>•</span>
                            <span>{ch.incorrect} Wrong</span>
                            <span>•</span>
                            <span>{ch.correct} Correct of {ch.total} Qs</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleReviewChapter(ch.chapter, ch.subject)}
                          className="w-full py-1.5 px-3 bg-white hover:bg-rose-600 hover:text-white border border-rose-300 text-rose-800 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                        >
                          <span>Review {ch.chapter} Questions</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strong Chapters */}
              {strongChapters.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-2 flex items-center space-x-1">
                    <Flame className="w-4 h-4 text-emerald-600" />
                    <span>Strong Chapters (High Accuracy &amp; Solid Retention):</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {strongChapters.map((ch) => (
                      <div
                        key={`${ch.subject}-${ch.chapter}`}
                        className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center space-x-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ch.chapter} ({ch.subject})</span>
                        <span className="text-[10px] bg-white px-1.5 py-0.2 rounded text-emerald-700">
                          {ch.accuracy}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* C. SUBJECT-WISE DETAILED MATRIX */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Subject-wise Strategy &amp; Efficiency Breakdown</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-[11px] tracking-wider border-b">
                    <tr>
                      <th className="p-3">Subject</th>
                      <th className="p-3 text-center">Attempt Rate</th>
                      <th className="p-3 text-center">Accuracy</th>
                      <th className="p-3 text-center text-emerald-700">Correct</th>
                      <th className="p-3 text-center text-rose-600">Incorrect</th>
                      <th className="p-3 text-center font-bold">Net Score</th>
                      <th className="p-3 text-center">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium">
                    {result.sectionBreakdown.map((s) => {
                      const maxSec = s.total * 4;
                      const attemptRate = s.total > 0 ? Math.round((s.attempted / s.total) * 100) : 0;
                      const accuracy = s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0;
                      const efficiency = maxSec > 0 ? Math.round((Math.max(0, s.score) / maxSec) * 100) : 0;

                      return (
                        <tr key={s.sectionName} className="hover:bg-gray-50/80">
                          <td className="p-3 font-bold text-gray-900">{s.sectionName}</td>
                          <td className="p-3 text-center text-gray-600">
                            {s.attempted} / {s.total} ({attemptRate}%)
                          </td>
                          <td className="p-3 text-center font-extrabold text-blue-700">
                            {accuracy}%
                          </td>
                          <td className="p-3 text-center font-bold text-emerald-600">{s.correct}</td>
                          <td className="p-3 text-center font-bold text-rose-600">{s.incorrect}</td>
                          <td className="p-3 text-center font-black text-blue-900">
                            {s.score} / {maxSec}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              efficiency >= 60
                                ? "bg-emerald-100 text-emerald-800"
                                : efficiency >= 40
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}>
                              {efficiency}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* D. ACTIONABLE JEE ASPIRANT 3-STEP REVISION CHECKLIST */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl shadow-md p-6 space-y-4">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold">
                  Personalized JEE Topper Action Plan
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
                <div className="bg-white/10 rounded-lg p-4 border border-white/10 space-y-1.5">
                  <span className="font-extrabold text-amber-300 uppercase tracking-wider block">
                    Step 1: Fix High-Leakage Chapters
                  </span>
                  <p className="text-gray-200">
                    Immediately review the solutions for{" "}
                    <strong>{weakChapters.slice(0, 2).map((c) => c.chapter).join(", ") || "your mistakes"}</strong>.
                    Re-derive formulas and do 15 targeted practice problems.
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/10 space-y-1.5">
                  <span className="font-extrabold text-amber-300 uppercase tracking-wider block">
                    Step 2: Negative Marking Control
                  </span>
                  <p className="text-gray-200">
                    You had {result.incorrectCount} negative marks. In the next mock, strictly follow the rule: if you cannot eliminate at least 2 options, do NOT guess.
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/10 space-y-1.5">
                  <span className="font-extrabold text-amber-300 uppercase tracking-wider block">
                    Step 3: Speed &amp; Chemistry Time Banking
                  </span>
                  <p className="text-gray-200">
                    Average pace was {avgTimePerAttempt}s. Aim to finish Chemistry in under 42 minutes to bank at least 70+ minutes for lengthy Mathematics calculations.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setFilterStatus("INCORRECT");
                    setActiveTab("interactive");
                    setSelectedQIndex(0);
                  }}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Review All {result.incorrectCount} Mistakes Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE QUESTION-BY-QUESTION EXPLORER */}
        {activeTab === "interactive" && (
          <div className="space-y-4">
            {/* Filter Sub-Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedQIndex(0);
                    }}
                    placeholder="Search question text, keyword, chapter, or number..."
                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select
                    value={filterSubject}
                    onChange={(e) => {
                      setFilterSubject(e.target.value);
                      setFilterChapter("ALL");
                      setSelectedQIndex(0);
                    }}
                    className="border border-gray-300 rounded px-2.5 py-1 text-xs font-bold bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ALL">All Subjects</option>
                    {result.sectionBreakdown.map((s) => (
                      <option key={s.sectionName} value={s.sectionName}>
                        {s.sectionName}
                      </option>
                    ))}
                  </select>

                  {filterChapter !== "ALL" && (
                    <button
                      onClick={() => setFilterChapter("ALL")}
                      className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-bold text-xs flex items-center space-x-1"
                    >
                      <span>Chapter: {filterChapter}</span>
                      <span>✕</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                {[
                  { key: "ALL", label: `All (${result.totalQuestions})` },
                  { key: "INCORRECT", label: `❌ Mistakes (${result.incorrectCount})`, highlight: true },
                  { key: "UNATTEMPTED", label: `⚪ Skipped (${result.unattemptedCount})` },
                  { key: "CORRECT", label: `✅ Correct (${result.correctCount})` },
                ].map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => {
                      setFilterStatus(pill.key);
                      setSelectedQIndex(0);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      filterStatus === pill.key
                        ? "bg-[#1e3a8a] text-white shadow-2xs"
                        : pill.highlight && result.incorrectCount > 0
                        ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Grid & Explorer */}
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center space-y-3">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">No Questions Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  No questions match your filter criteria.
                </p>
                <button
                  onClick={() => {
                    setFilterSubject("ALL");
                    setFilterStatus("ALL");
                    setFilterChapter("ALL");
                    setSearchQuery("");
                    setSelectedQIndex(0);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT / CENTER (8 cols): ACTIVE QUESTION & DETAILED SOLUTION */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-blue-950">
                          Question {activeQuestion?.questionNumber}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {activeQuestion?.subject}
                        </span>
                        {activeQuestion?.chapter && (
                          <span className="text-xs px-2.5 py-0.5 rounded font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {activeQuestion.chapter}
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div>
                        {activeQuestion?.isCorrect ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Correct (+4 Marks)</span>
                          </span>
                        ) : activeQuestion?.userResponse ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Incorrect (-1 Mark)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Skipped (0 Marks)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Body */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Text */}
                      <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-gray-900 font-medium select-text">
                        {formatQuestionText(activeQuestion?.questionText)}
                      </div>

                      {/* Images */}
                      {activeQuestion?.imagePaths && activeQuestion.imagePaths.length > 0 && (
                        <div className="flex flex-wrap gap-3 py-2">
                          {activeQuestion.imagePaths.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Diagram ${i + 1}`}
                              className="max-h-64 max-w-full rounded border border-gray-200 bg-white object-contain"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}

                      {/* Options Analysis */}
                      {activeQuestion?.optionA || activeQuestion?.optionB || activeQuestion?.optionC || activeQuestion?.optionD ? (
                        <div className="space-y-2.5 pt-3 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Options Analysis:
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              { key: "A", val: activeQuestion.optionA },
                              { key: "B", val: activeQuestion.optionB },
                              { key: "C", val: activeQuestion.optionC },
                              { key: "D", val: activeQuestion.optionD },
                            ].map((opt) => {
                              if (!opt.val) return null;
                              const isUserChoice = activeQuestion.userResponse?.trim().toUpperCase() === opt.key;
                              const isCorrectOption =
                                activeQuestion.correctAnswer?.trim().toUpperCase() === opt.key ||
                                activeQuestion.correctAnswer?.trim().toLowerCase() === opt.val?.trim().toLowerCase();

                              let cardClass = "bg-white border-gray-200 text-gray-700";
                              let badge = null;

                              if (isUserChoice && activeQuestion.isCorrect) {
                                cardClass = "bg-emerald-50 border-emerald-400 text-emerald-950 shadow-2xs font-medium";
                                badge = (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center space-x-1 shrink-0">
                                    <Check className="w-3 h-3" />
                                    <span>Your Answer (Correct)</span>
                                  </span>
                                );
                              } else if (isUserChoice && !activeQuestion.isCorrect) {
                                cardClass = "bg-rose-50 border-rose-400 text-rose-950 shadow-2xs font-medium";
                                badge = (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white flex items-center space-x-1 shrink-0">
                                    <X className="w-3 h-3" />
                                    <span>Your Answer (Incorrect)</span>
                                  </span>
                                );
                              } else if (isCorrectOption) {
                                cardClass = "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium";
                                badge = (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1 shrink-0">
                                    <Check className="w-3 h-3 text-emerald-700" />
                                    <span>Correct Answer</span>
                                  </span>
                                );
                              }

                              return (
                                <div
                                  key={opt.key}
                                  className={`p-3 rounded-lg border-2 flex items-start justify-between gap-3 text-xs sm:text-sm transition-all ${cardClass}`}
                                >
                                  <div className="flex items-start space-x-2.5 flex-1 min-w-0">
                                    <span className="font-extrabold text-xs w-6 h-6 rounded bg-gray-200/70 flex items-center justify-center shrink-0">
                                      {opt.key}
                                    </span>
                                    <span className="break-words leading-relaxed whitespace-normal pt-0.5">
                                      {formatOptionText(opt.val)}
                                    </span>
                                  </div>
                                  {badge}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Numerical Answer Comparison:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className={`p-4 rounded-lg border-2 text-center ${
                              activeQuestion?.isCorrect
                                ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                                : activeQuestion?.userResponse
                                ? "bg-rose-50 border-rose-400 text-rose-900"
                                : "bg-slate-50 border-slate-300 text-slate-700"
                            }`}>
                              <span className="text-[11px] font-bold uppercase tracking-wider block text-gray-500">
                                Your Entered Answer
                              </span>
                              <span className="text-xl font-black mt-1 block">
                                {activeQuestion?.userResponse || "Not Attempted"}
                              </span>
                            </div>

                            <div className="p-4 rounded-lg border-2 border-emerald-400 bg-emerald-50 text-emerald-950 text-center">
                              <span className="text-[11px] font-bold uppercase tracking-wider block text-emerald-700">
                                Official Correct Value
                              </span>
                              <span className="text-xl font-black mt-1 block">
                                {activeQuestion?.correctAnswer || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Official Step-by-Step Solution Card */}
                      <div className="mt-5 rounded-xl border-2 border-blue-200 bg-blue-50/50 p-5 space-y-3">
                        <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-sm border-b border-blue-200 pb-2">
                          <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Official Step-by-Step Solution &amp; Explanation</span>
                        </div>

                        {activeQuestion?.correctAnswer && (
                          <div className="text-xs sm:text-sm font-bold text-gray-800">
                            Official Correct Option / Value:{" "}
                            <span className="text-emerald-700 font-extrabold">
                              {activeQuestion.correctAnswer}
                            </span>
                          </div>
                        )}

                        {activeQuestion?.solution ? (
                          <div className="text-xs sm:text-sm text-gray-800 leading-relaxed bg-white p-4 rounded-lg border border-blue-100 whitespace-pre-wrap font-sans select-text">
                            {formatSolutionText(activeQuestion.solution)}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic bg-white p-3 rounded border border-gray-200">
                            Official step-by-step solution is not available for this question.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Navigator */}
                    <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedQIndex((prev) => Math.max(0, prev - 1))}
                        disabled={safeIndex === 0}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-xs font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      <span className="text-xs font-semibold text-gray-500">
                        Question <strong className="text-gray-800">{safeIndex + 1}</strong> of{" "}
                        <strong className="text-gray-800">{filteredQuestions.length}</strong>
                      </span>

                      <button
                        onClick={() => setSelectedQIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                        disabled={safeIndex === filteredQuestions.length - 1}
                        className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT (4 cols): QUESTION PALETTE JUMP GRID */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3 sticky top-20">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                        Question Palette ({filteredQuestions.length})
                      </h3>
                      <span className="text-[11px] text-gray-500">Click to jump</span>
                    </div>

                    {/* Color Legend */}
                    <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold text-center">
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 py-1 rounded">
                        Correct ({result.correctCount})
                      </div>
                      <div className="bg-rose-50 text-rose-800 border border-rose-200 py-1 rounded">
                        Wrong ({result.incorrectCount})
                      </div>
                      <div className="bg-slate-100 text-slate-700 border border-slate-200 py-1 rounded">
                        Skipped ({result.unattemptedCount})
                      </div>
                    </div>

                    {/* Grid */}
                    <div className="max-h-[380px] overflow-y-auto pr-1">
                      <div className="grid grid-cols-5 gap-2 justify-items-center">
                        {filteredQuestions.map((q, idx) => {
                          const isSelected = idx === safeIndex;
                          let btnColor = "bg-slate-200 text-slate-700 hover:bg-slate-300"; // Unattempted
                          if (q.userResponse) {
                            if (q.isCorrect) {
                              btnColor = "bg-emerald-600 text-white hover:bg-emerald-700";
                            } else {
                              btnColor = "bg-rose-600 text-white hover:bg-rose-700";
                            }
                          }

                          return (
                            <button
                              key={q.questionId}
                              onClick={() => setSelectedQIndex(idx)}
                              className={`w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${btnColor} ${
                                isSelected
                                  ? "ring-3 ring-blue-600 ring-offset-2 scale-110 z-10 shadow-md font-black"
                                  : "opacity-90 hover:opacity-100"
                              }`}
                              title={`Q.${q.questionNumber} (${q.subject} - ${q.chapter || "Mixed"}) - ${
                                q.isCorrect ? "Correct" : q.userResponse ? "Incorrect" : "Skipped"
                              }`}
                            >
                              {q.questionNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shortcut: Review Mistakes */}
                    {result.incorrectCount > 0 && filterStatus !== "INCORRECT" && (
                      <button
                        onClick={() => {
                          setFilterStatus("INCORRECT");
                          setSelectedQIndex(0);
                        }}
                        className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Filter All Mistakes ({result.incorrectCount})</span>
                      </button>
                    )}

                    <div className="pt-2 border-t text-[11px] text-gray-500 text-center">
                      Keyboard tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded font-mono text-[10px]">→</kbd> to navigate.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPLETE PAPER & SOLUTIONS LIST */}
        {activeTab === "list" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Full Question Paper Booklet &amp; Solutions ({filteredQuestions.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Complete sequence with answers and explanations
                </p>
              </div>
              <button
                onClick={handleToggleAllSolutions}
                className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>{allExpanded ? "Collapse All Solutions" : "Expand All Solutions"}</span>
              </button>
            </div>

            <div className="space-y-6">
              {filteredQuestions.map((q) => {
                const isExpanded = expandedSolutions[q.questionId] !== false;

                return (
                  <div
                    key={q.questionId}
                    className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-gray-900">
                          Q.{q.questionNumber}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">
                          {q.subject}
                        </span>
                        {q.chapter && (
                          <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded font-medium">
                            {q.chapter}
                          </span>
                        )}
                      </div>

                      <div>
                        {q.isCorrect ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Correct (+4)
                          </span>
                        ) : q.userResponse ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Incorrect (-1)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Unattempted (0)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900 font-medium select-text">
                      {formatQuestionText(q.questionText)}
                    </div>

                    {/* Diagrams */}
                    {q.imagePaths && q.imagePaths.length > 0 && (
                      <div className="flex flex-wrap gap-3 py-2">
                        {q.imagePaths.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Diagram ${i + 1}`}
                            className="max-h-56 max-w-full rounded border border-gray-200 bg-white object-contain"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}

                    {/* Options */}
                    {(q.optionA || q.optionB || q.optionC || q.optionD) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm pt-2">
                        {[
                          { key: "A", val: q.optionA },
                          { key: "B", val: q.optionB },
                          { key: "C", val: q.optionC },
                          { key: "D", val: q.optionD },
                        ].map((opt) => {
                          if (!opt.val) return null;
                          const isChosen = q.userResponse?.trim().toUpperCase() === opt.key;
                          const isAns =
                            q.correctAnswer?.trim().toLowerCase() === opt.key.toLowerCase() ||
                            q.correctAnswer?.trim().toLowerCase() === opt.val?.trim().toLowerCase();

                          let optClass = "bg-white border-gray-200 text-gray-700";
                          if (isChosen && q.isCorrect) {
                            optClass = "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold";
                          } else if (isChosen && !q.isCorrect) {
                            optClass = "bg-rose-50 border-rose-400 text-rose-900 font-semibold";
                          } else if (isAns) {
                            optClass = "bg-emerald-50/60 border-emerald-200 text-emerald-800 font-medium";
                          }

                          return (
                            <div
                              key={opt.key}
                              className={`p-3 rounded-lg border-2 flex items-start space-x-2 ${optClass}`}
                            >
                              <span className="font-bold shrink-0">({opt.key})</span>
                              <span className="flex-1 break-words whitespace-normal leading-relaxed">
                                {formatOptionText(opt.val)}
                              </span>
                              {isChosen && (
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                                  Your Choice
                                </span>
                              )}
                              {isAns && (
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                                  Correct
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Numerical Comparison */}
                    {!q.optionA && !q.optionB && (
                      <div className="flex flex-wrap gap-4 text-xs font-semibold p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          Your Answer:{" "}
                          <span className={q.isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                            {q.userResponse || "Skipped"}
                          </span>
                        </div>
                        <div>
                          Correct Value:{" "}
                          <span className="text-emerald-700 font-bold">{q.correctAnswer}</span>
                        </div>
                      </div>
                    )}

                    {/* Solution */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleSolution(q.questionId)}
                        className="flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span>Hide Solution</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>Show Solution</span>
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 p-4 bg-blue-50/70 rounded-lg border border-blue-200 text-xs sm:text-sm text-gray-800 space-y-2 animate-in fade-in duration-150">
                          {q.correctAnswer && (
                            <div className="font-bold text-blue-950">
                              Official Correct Option / Value:{" "}
                              <span className="text-emerald-700">{q.correctAnswer}</span>
                            </div>
                          )}
                          {q.solution ? (
                            <div>
                              <span className="font-bold text-blue-950 block mb-1">
                                Step-by-step Solution:
                              </span>
                              <div className="whitespace-pre-wrap leading-relaxed text-gray-800 bg-white p-3 rounded border border-blue-100 font-sans text-xs select-text">
                                {formatSolutionText(q.solution)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500 italic">
                              Official step-by-step explanation is not available for this question.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
