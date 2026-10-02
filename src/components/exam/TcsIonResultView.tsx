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
  // View mode: "interactive" (Question-by-Question Explorer) | "list" (All questions)
  const [viewMode, setViewMode] = useState<"interactive" | "list">("interactive");

  // Selected question index within the active filtered list
  const [selectedQIndex, setSelectedQIndex] = useState<number>(0);

  // Filters
  const [filterSubject, setFilterSubject] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // In list mode, expanded solutions map
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState<boolean>(true);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  // Filter questions based on subject, status, and search query
  const filteredQuestions = useMemo(() => {
    return result.detailedResults.filter((q) => {
      if (filterSubject !== "ALL" && q.subject.toLowerCase() !== filterSubject.toLowerCase()) {
        return false;
      }
      if (filterStatus === "CORRECT" && !q.isCorrect) return false;
      if (filterStatus === "INCORRECT" && (q.isCorrect || !q.userResponse)) return false;
      if (filterStatus === "UNATTEMPTED" && Boolean(q.userResponse)) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch = (q.questionText || "").toLowerCase().includes(query);
        const qNumMatch = String(q.questionNumber).includes(query);
        const subjMatch = (q.subject || "").toLowerCase().includes(query);
        const solMatch = (q.solution || "").toLowerCase().includes(query);
        if (!textMatch && !qNumMatch && !subjMatch && !solMatch) return false;
      }

      return true;
    });
  }, [result.detailedResults, filterSubject, filterStatus, searchQuery]);

  // Ensure selected question index is always within range
  const safeIndex = Math.min(Math.max(0, selectedQIndex), Math.max(0, filteredQuestions.length - 1));
  const activeQuestion = filteredQuestions[safeIndex] || result.detailedResults[0];

  // Keyboard navigation for interactive review mode (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "interactive") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowLeft") {
        setSelectedQIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedQIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, filteredQuestions.length]);

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

  // Jump to next mistake
  const handleJumpToNextMistake = () => {
    setFilterStatus("INCORRECT");
    setSelectedQIndex(0);
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
              Post-Exam Performance Scorecard &amp; Solutions
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
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

        {/* 3. SCORECARD HERO BANNER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  Candidate: <span className="text-gray-800">{candidateName}</span>
                </p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-gray-900">
                    {result.totalScore}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-400">
                    / {result.maxScore}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-bold mt-1">
                  Overall Score ({result.percentage}% marks)
                </p>
              </div>
            </div>

            {/* Core KPI badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
              <div
                onClick={() => {
                  setFilterStatus("CORRECT");
                  setSelectedQIndex(0);
                }}
                className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 p-3 rounded-lg text-center cursor-pointer transition-all"
                title="Filter correct answers"
              >
                <div className="flex items-center justify-center space-x-1 text-emerald-700 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold">Correct (+4)</span>
                </div>
                <div className="text-xl font-extrabold text-emerald-800">{result.correctCount}</div>
              </div>

              <div
                onClick={() => {
                  setFilterStatus("INCORRECT");
                  setSelectedQIndex(0);
                }}
                className="bg-rose-50 hover:bg-rose-100/80 border border-rose-200 p-3 rounded-lg text-center cursor-pointer transition-all"
                title="Filter incorrect answers"
              >
                <div className="flex items-center justify-center space-x-1 text-rose-700 mb-1">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">Incorrect (-1)</span>
                </div>
                <div className="text-xl font-extrabold text-rose-800">{result.incorrectCount}</div>
              </div>

              <div
                onClick={() => {
                  setFilterStatus("UNATTEMPTED");
                  setSelectedQIndex(0);
                }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-lg text-center cursor-pointer transition-all"
                title="Filter unattempted questions"
              >
                <div className="flex items-center justify-center space-x-1 text-slate-700 mb-1">
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">Skipped (0)</span>
                </div>
                <div className="text-xl font-extrabold text-slate-800">{result.unattemptedCount}</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-1 text-amber-700 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold">Time Taken</span>
                </div>
                <div className="text-lg font-extrabold text-amber-800">
                  {formatTime(result.timeSpentSeconds)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Subject Performance Row */}
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {result.sectionBreakdown.map((sec) => {
              const accuracy = sec.attempted > 0 ? Math.round((sec.correct / sec.attempted) * 100) : 0;
              const isSelected = filterSubject.toLowerCase() === sec.sectionName.toLowerCase();
              return (
                <button
                  key={sec.sectionName}
                  onClick={() => {
                    setFilterSubject(isSelected ? "ALL" : sec.sectionName);
                    setSelectedQIndex(0);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 border-blue-500 ring-2 ring-blue-400"
                      : "bg-gray-50/80 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-gray-800 mb-1">
                    <span>{sec.sectionName}</span>
                    <span className="text-blue-700">{sec.score} / {sec.total * 4}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Accuracy: {accuracy}%</span>
                    <span>{sec.correct} Correct | {sec.incorrect} Wrong</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. MODE SWITCHER & QUESTION FILTER TOOLBAR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* View Mode Toggle: Interactive Explorer vs Full List */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
              <button
                onClick={() => setViewMode("interactive")}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "interactive"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Question-by-Question Explorer</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Complete Paper &amp; Solutions</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedQIndex(0);
                }}
                placeholder="Search question text, keyword, or number..."
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
          </div>

          {/* Filter Pills (Subject & Status) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
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

            {/* Subject Selector */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500 font-semibold">Subject:</span>
              <select
                value={filterSubject}
                onChange={(e) => {
                  setFilterSubject(e.target.value);
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
            </div>
          </div>
        </div>

        {/* 5. MAIN CONTENT AREA */}
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center space-y-3">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">No Questions Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No questions matched the active filter ({filterSubject} | {filterStatus})
              {searchQuery ? ` matching "${searchQuery}"` : ""}.
            </p>
            <button
              onClick={() => {
                setFilterSubject("ALL");
                setFilterStatus("ALL");
                setSearchQuery("");
                setSelectedQIndex(0);
              }}
              className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "interactive" ? (
          /* MODE A: INTERACTIVE QUESTION-BY-QUESTION EXPLORER */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT / CENTER (8 cols): ACTIVE QUESTION & DETAILED SOLUTION */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Question Header Bar */}
                <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-blue-950">
                      Question {activeQuestion?.questionNumber}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      {activeQuestion?.subject}
                    </span>
                  </div>

                  {/* Marks & Status Badge */}
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
                  {/* Question Text */}
                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-gray-900 font-medium select-text">
                    {formatQuestionText(activeQuestion?.questionText)}
                  </div>

                  {/* Diagrams / Images */}
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

                  {/* Options Comparison (MCQ vs Numerical) */}
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
                    /* Numerical Value Question Comparison */
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        Numerical Answer Analysis:
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

                  {/* Highlighted Step-by-Step Official Solution Box */}
                  <div className="mt-5 rounded-xl border-2 border-blue-200 bg-blue-50/50 p-5 space-y-3">
                    <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-sm border-b border-blue-200 pb-2">
                      <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Official Step-by-Step Solution &amp; Explanation</span>
                    </div>

                    {activeQuestion?.correctAnswer && (
                      <div className="text-xs sm:text-sm font-bold text-gray-800">
                        Official Answer:{" "}
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

                {/* Bottom Navigation Bar */}
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

            {/* RIGHT (4 cols): INTERACTIVE QUESTION PALETTE JUMP GRID */}
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

                {/* Question Buttons Grid */}
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
                          title={`Q.${q.questionNumber} (${q.subject}) - ${
                            q.isCorrect ? "Correct" : q.userResponse ? "Incorrect" : "Skipped"
                          }`}
                        >
                          {q.questionNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Mistake Review Shortcut */}
                {result.incorrectCount > 0 && filterStatus !== "INCORRECT" && (
                  <button
                    onClick={handleJumpToNextMistake}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Review All Mistakes ({result.incorrectCount})</span>
                  </button>
                )}

                <div className="pt-2 border-t text-[11px] text-gray-500 text-center">
                  Keyboard tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded font-mono text-[10px]">→</kbd> to flip questions.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MODE B: COMPLETE PAPER & SOLUTIONS LIST VIEW */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  All Questions &amp; Solutions ({filteredQuestions.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Complete paper review with detailed answers
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
              {filteredQuestions.map((q, idx) => {
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

                    {/* Diagrams / Images */}
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

                    {/* Options Grid */}
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
                            q.correctAnswer?.trim().toLowerCase() === opt.val.trim().toLowerCase();

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

                    {/* Numerical question comparison in list view */}
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

                    {/* Solution Accordion */}
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
                              Official Correct Answer:{" "}
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
