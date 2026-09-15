"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  FileText,
  Info,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { TestDetail, QuestionRecord } from "@/lib/examDb";
import { TcsIonSubmitModal, SectionSummaryStat } from "./TcsIonSubmitModal";
import { TcsIonQuestionPaperModal } from "./TcsIonQuestionPaperModal";

export type QuestionStatus =
  | "NOT_VISITED"
  | "NOT_ANSWERED"
  | "ANSWERED"
  | "MARKED_FOR_REVIEW"
  | "ANSWERED_AND_MARKED_FOR_REVIEW";

interface TcsIonPlayerProps {
  test: TestDetail;
  candidateName?: string;
  candidateRoll?: string;
  candidateAvatar?: string;
  onSubmitExam: (responses: Record<string, string>, timeSpentSeconds: number) => Promise<void>;
  onBackToInstructions?: () => void;
  submitting?: boolean;
}

export function TcsIonPlayer({
  test,
  candidateName = "Candidate Name",
  candidateRoll = "ROLL-2026-NTA",
  candidateAvatar,
  onSubmitExam,
  onBackToInstructions,
  submitting = false,
}: TcsIonPlayerProps) {
  // Navigation state
  const [currentSecIdx, setCurrentSecIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);

  // Response & Status maps
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>({});

  // Palette collapse state
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAutoSubmit, setIsAutoSubmit] = useState(false);
  const [isQuestionPaperOpen, setIsQuestionPaperOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  // Timer state (seconds)
  const totalDurationSeconds = test.duration_minutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalDurationSeconds);

  // Refs for scrolling
  const questionContentRef = useRef<HTMLDivElement>(null);
  const topAnchorRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  // Active section and question
  const currentSection = test.sections[currentSecIdx] || test.sections[0];
  const currentQuestion = currentSection?.questions[currentQIdx] || currentSection?.questions[0];

  // Storage key for state persistence
  const storageKey = `sf_exam_state_${test.id}`;

  // 1. Initialize or restore state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.responses) setResponses(parsed.responses);
        if (parsed.statuses) setStatuses(parsed.statuses);
        if (typeof parsed.secondsLeft === "number" && parsed.secondsLeft > 0) {
          setSecondsLeft(parsed.secondsLeft);
        }
        if (typeof parsed.secIdx === "number") setCurrentSecIdx(parsed.secIdx);
        if (typeof parsed.qIdx === "number") setCurrentQIdx(parsed.qIdx);
      } else {
        // Initial status: question 1 of section 1 is visited -> NOT_ANSWERED
        if (currentQuestion) {
          setStatuses({ [currentQuestion.id]: "NOT_ANSWERED" });
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  // 2. Persist state to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          responses,
          statuses,
          secondsLeft,
          secIdx: currentSecIdx,
          qIdx: currentQIdx,
        })
      );
    } catch {}
  }, [responses, statuses, secondsLeft, currentSecIdx, currentQIdx, storageKey]);

  // 3. Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsAutoSubmit(true);
      setIsSubmitModalOpen(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsAutoSubmit(true);
          setIsSubmitModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTimer = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Switch question helper
  const navigateToQuestion = (targetSecIdx: number, targetQIdx: number) => {
    const targetSec = test.sections[targetSecIdx];
    if (!targetSec) return;
    const targetQ = targetSec.questions[targetQIdx];
    if (!targetQ) return;

    // Mark current question as NOT_ANSWERED if it was NOT_VISITED or unassigned
    const curQ = currentQuestion;
    if (curQ && !responses[curQ.id] && (!statuses[curQ.id] || statuses[curQ.id] === "NOT_VISITED")) {
      setStatuses((prev) => ({ ...prev, [curQ.id]: "NOT_ANSWERED" }));
    }

    // Mark target question as NOT_ANSWERED if unvisited
    if (!statuses[targetQ.id] || statuses[targetQ.id] === "NOT_VISITED") {
      setStatuses((prev) => ({ ...prev, [targetQ.id]: "NOT_ANSWERED" }));
    }

    setCurrentSecIdx(targetSecIdx);
    setCurrentQIdx(targetQIdx);

    // Scroll to top of question window
    topAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Option selection
  const handleSelectOption = (optKey: string) => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const currentVal = responses[qId];

    // Toggle: deselect if already chosen
    if (currentVal === optKey) {
      const next = { ...responses };
      delete next[qId];
      setResponses(next);
      setStatuses((prev) => ({ ...prev, [qId]: "NOT_ANSWERED" }));
    } else {
      setResponses((prev) => ({ ...prev, [qId]: optKey }));
      setStatuses((prev) => ({ ...prev, [qId]: "ANSWERED" }));
    }
  };

  // Button: Save & Next
  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const hasAnswer = Boolean(responses[qId]);

    setStatuses((prev) => ({
      ...prev,
      [qId]: hasAnswer ? "ANSWERED" : "NOT_ANSWERED",
    }));

    // Move to next question or next section
    if (currentQIdx < currentSection.questions.length - 1) {
      navigateToQuestion(currentSecIdx, currentQIdx + 1);
    } else if (currentSecIdx < test.sections.length - 1) {
      navigateToQuestion(currentSecIdx + 1, 0);
    }
  };

  // Button: Clear Response
  const handleClearResponse = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const next = { ...responses };
    delete next[qId];
    setResponses(next);
    setStatuses((prev) => ({ ...prev, [qId]: "NOT_ANSWERED" }));
  };

  // Button: Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const hasAnswer = Boolean(responses[qId]);

    setStatuses((prev) => ({
      ...prev,
      [qId]: hasAnswer ? "ANSWERED_AND_MARKED_FOR_REVIEW" : "MARKED_FOR_REVIEW",
    }));

    // Move to next question or next section
    if (currentQIdx < currentSection.questions.length - 1) {
      navigateToQuestion(currentSecIdx, currentQIdx + 1);
    } else if (currentSecIdx < test.sections.length - 1) {
      navigateToQuestion(currentSecIdx + 1, 0);
    }
  };

  // Scroll shortcuts
  const scrollToTop = () => topAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBottom = () => bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth" });

  // Calculate section summary statistics for legend and submit modal
  const sectionStats: SectionSummaryStat[] = useMemo(() => {
    return test.sections.map((sec) => {
      let answered = 0;
      let notAnswered = 0;
      let markedForReview = 0;
      let answeredAndMarkedForReview = 0;
      let notVisited = 0;

      for (const q of sec.questions) {
        const st = statuses[q.id] || "NOT_VISITED";
        if (st === "ANSWERED") answered++;
        else if (st === "NOT_ANSWERED") notAnswered++;
        else if (st === "MARKED_FOR_REVIEW") markedForReview++;
        else if (st === "ANSWERED_AND_MARKED_FOR_REVIEW") answeredAndMarkedForReview++;
        else notVisited++;
      }

      return {
        sectionName: sec.name,
        total: sec.questions.length,
        answered,
        notAnswered,
        markedForReview,
        answeredAndMarkedForReview,
        notVisited,
      };
    });
  }, [test.sections, statuses]);

  // Overall counts for active section
  const currentSecStats = sectionStats[currentSecIdx] || {
    answered: 0,
    notAnswered: 0,
    markedForReview: 0,
    answeredAndMarkedForReview: 0,
    notVisited: 0,
  };

  const handleFinalSubmit = async () => {
    try {
      const timeSpent = totalDurationSeconds - secondsLeft;
      await onSubmitExam(responses, timeSpent);
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Helper renderer for question number button shape
  const renderQuestionButton = (q: QuestionRecord, index: number) => {
    const isCurrent = index === currentQIdx;
    const st = statuses[q.id] || "NOT_VISITED";

    let btnClass = "bg-gray-100 text-gray-800 border border-gray-300"; // NOT_VISITED
    let clipPathStyle = {};

    if (st === "ANSWERED") {
      btnClass = "bg-[#16a34a] text-white";
      clipPathStyle = { clipPath: "polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)" };
    } else if (st === "NOT_ANSWERED") {
      btnClass = "bg-[#e11d48] text-white";
      clipPathStyle = { clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)" };
    } else if (st === "MARKED_FOR_REVIEW") {
      btnClass = "bg-[#7c3aed] text-white rounded-full";
    } else if (st === "ANSWERED_AND_MARKED_FOR_REVIEW") {
      btnClass = "bg-[#7c3aed] text-white rounded-full relative";
    } else {
      // NOT_VISITED
      btnClass = "bg-white text-gray-800 border border-gray-300 rounded";
    }

    return (
      <button
        key={q.id}
        onClick={() => navigateToQuestion(currentSecIdx, index)}
        style={clipPathStyle}
        className={`w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer select-none ${btnClass} ${
          isCurrent ? "ring-3 ring-blue-500 ring-offset-2 scale-105 z-10" : "hover:opacity-90"
        }`}
        title={`Question ${index + 1} (${st})`}
      >
        <span>{index + 1}</span>
        {st === "ANSWERED_AND_MARKED_FOR_REVIEW" && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] text-[#1e293b] font-sans select-none overflow-hidden">
      {/* 1. TOP HEADER */}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs z-30">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
              {test.title}
            </h1>
            <span className="text-[11px] text-gray-500 font-medium">
              National Testing Agency | Computer Based Test (CBT)
            </span>
          </div>
        </div>

        {/* Candidate details & Countdown Timer */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Candidate Info Box */}
          <div className="hidden md:flex items-center space-x-2 text-right">
            <div className="flex flex-col text-xs">
              <span className="font-bold text-gray-800">{candidateName}</span>
              <span className="text-[10px] text-gray-500 font-mono">{candidateRoll}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700">
              {candidateAvatar ? (
                <img src={candidateAvatar} alt="Candidate" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center space-x-2 bg-[#1e293b] text-white px-3 sm:px-4 py-1.5 rounded-md shadow-xs border border-gray-700">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="flex flex-col leading-none">
              <span className="text-[9px] uppercase tracking-wider text-gray-400">Time Left</span>
              <span className="text-sm sm:text-base font-mono font-extrabold tracking-widest text-amber-400">
                {formatTimer(secondsLeft)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SUB-HEADER: SECTION TABS & MODAL SHORTCUTS */}
      <div className="bg-[#e2e8f0] border-b border-gray-300 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20">
        {/* Section Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-0.5">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide mr-1 hidden sm:inline">
            Sections:
          </span>
          {test.sections.map((sec, idx) => {
            const isActive = idx === currentSecIdx;
            return (
              <button
                key={sec.name}
                onClick={() => navigateToQuestion(idx, 0)}
                className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-t-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#1e3a8a] text-white shadow-xs"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {sec.name} ({sec.questions.length})
              </button>
            );
          })}
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsQuestionPaperOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-white hover:bg-gray-100 border border-gray-300 rounded text-blue-800 shadow-2xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Question Paper</span>
          </button>
          <button
            onClick={() => setIsInstructionsOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-white hover:bg-gray-100 border border-gray-300 rounded text-gray-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instructions</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT: QUESTION WORKSPACE & COLLAPSIBLE PALETTE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT / CENTER: QUESTION WINDOW */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Question Sub-Bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <span className="text-sm sm:text-base font-extrabold text-blue-900">
                Question No. {currentQIdx + 1}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                (currentQuestion as any)?.type === "NUMERICAL" || (currentQuestion as any)?.section?.includes("Numerical") || currentQIdx >= 20
                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}>
                {(currentQuestion as any)?.type === "NUMERICAL" || (currentQuestion as any)?.section?.includes("Numerical") || currentQIdx >= 20
                  ? "Numerical Value Question"
                  : "Multiple Choice Question"}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-xs font-semibold text-gray-600">
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-green-700 font-bold">+4</span>
                <span className="text-gray-300">|</span>
                <span className="text-red-600 font-bold">-1</span>
              </div>

              {/* Scroll Shortcuts */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={scrollToTop}
                  title="Scroll to Top"
                  className="w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={scrollToBottom}
                  title="Scroll to Bottom"
                  className="w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Scrollable Canvas */}
          <div
            ref={questionContentRef}
            className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 text-gray-900"
          >
            <div ref={topAnchorRef} />

            {/* Question Text */}
            <div className="text-sm sm:text-base font-medium leading-relaxed whitespace-pre-line">
              {currentQuestion?.question_text}
            </div>

            {/* Question Diagrams / Images */}
            {currentQuestion?.image_paths && currentQuestion.image_paths.length > 0 && (
              <div className="flex flex-wrap gap-4 py-3">
                {currentQuestion.image_paths.map((imgUrl, i) => (
                  <div key={i} className="border border-gray-300 rounded-lg p-2 bg-white shadow-2xs">
                    <img
                      src={imgUrl}
                      alt={`Question Diagram ${i + 1}`}
                      className="max-h-72 max-w-full object-contain rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Options or Numerical Keypad */}
            {((currentQuestion as any)?.type === "NUMERICAL" || (currentQuestion as any)?.section?.includes("Numerical") || currentQIdx >= 20 || (!currentQuestion?.option_a && !currentQuestion?.option_b)) ? (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 max-w-md space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Enter Numerical Value Answer:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={responses[currentQuestion?.id || ""] || ""}
                      onChange={(e) => {
                        if (!currentQuestion) return;
                        const val = e.target.value;
                        setResponses((prev) => ({ ...prev, [currentQuestion.id]: val }));
                        setStatuses((prev) => ({
                          ...prev,
                          [currentQuestion.id]: val.trim() ? "ANSWERED" : "NOT_ANSWERED",
                        }));
                      }}
                      placeholder="Type or click keypad"
                      className="flex-1 text-lg font-mono font-bold px-3.5 py-2 border-2 border-blue-600 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      onClick={handleClearResponse}
                      className="px-3.5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Use your keyboard or the on-screen keypad below. Nearest integer or decimal.
                  </p>
                </div>

                {/* Virtual Numeric Keypad (Official TCS iON CBT style) */}
                <div className="bg-gray-100 border border-gray-300 rounded-xl p-3.5 max-w-xs space-y-2.5 shadow-2xs">
                  <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider text-center border-b pb-1">
                    Virtual Numeric Keypad
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "-"].map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (!currentQuestion) return;
                          const cur = responses[currentQuestion.id] || "";
                          const next = cur + key;
                          setResponses((prev) => ({ ...prev, [currentQuestion.id]: next }));
                          setStatuses((prev) => ({ ...prev, [currentQuestion.id]: "ANSWERED" }));
                        }}
                        className="py-2.5 bg-white hover:bg-blue-50 active:bg-blue-100 border border-gray-300 hover:border-blue-400 rounded-lg font-bold text-base text-gray-800 shadow-2xs transition-colors cursor-pointer active:scale-95 select-none"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentQuestion) return;
                        const cur = responses[currentQuestion.id] || "";
                        const next = cur.slice(0, -1);
                        setResponses((prev) => ({ ...prev, [currentQuestion.id]: next }));
                        setStatuses((prev) => ({
                          ...prev,
                          [currentQuestion.id]: next.trim() ? "ANSWERED" : "NOT_ANSWERED",
                        }));
                      }}
                      className="py-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 rounded-lg font-bold text-xs cursor-pointer active:scale-95 transition-colors"
                    >
                      ⌫ Backspace
                    </button>
                    <button
                      type="button"
                      onClick={handleClearResponse}
                      className="py-2 bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-900 rounded-lg font-bold text-xs cursor-pointer active:scale-95 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {[
                  { key: "A", label: currentQuestion?.option_a },
                  { key: "B", label: currentQuestion?.option_b },
                  { key: "C", label: currentQuestion?.option_c },
                  { key: "D", label: currentQuestion?.option_d },
                ].map((opt) => {
                  if (!opt.label && !currentQuestion?.option_a) return null;
                  const isSelected = responses[currentQuestion?.id || ""] === opt.key;

                  return (
                    <label
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`flex items-start space-x-3 p-3.5 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="pt-0.5">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? "border-blue-600 bg-blue-600" : "border-gray-400 bg-white"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="flex-1 text-xs sm:text-sm text-gray-800 leading-normal">
                        <span className="font-bold mr-2">({opt.key})</span>
                        <span className="whitespace-pre-line">{opt.label || `Option ${opt.key}`}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <div ref={bottomAnchorRef} />
          </div>

          {/* Bottom Action Footer Bar */}
          <div className="bg-gray-100 border-t border-gray-300 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkForReviewAndNext}
                className="py-2 px-3 sm:px-4 rounded text-xs sm:text-sm font-semibold bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-xs transition-colors cursor-pointer active:scale-98"
              >
                Mark for Review &amp; Next
              </button>
              <button
                onClick={handleClearResponse}
                className="py-2 px-3 sm:px-4 rounded text-xs sm:text-sm font-semibold bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 shadow-2xs transition-colors cursor-pointer active:scale-98"
              >
                Clear Response
              </button>
            </div>

            <button
              onClick={handleSaveAndNext}
              className="py-2 px-6 sm:px-8 rounded text-xs sm:text-sm font-bold bg-[#1e3a8a] hover:bg-[#172554] text-white shadow-xs transition-all cursor-pointer active:scale-98 ml-auto"
            >
              Save &amp; Next
            </button>
          </div>
        </div>

        {/* PALETTE TOGGLE BUTTON */}
        <button
          onClick={() => setIsPaletteOpen((prev) => !prev)}
          title={isPaletteOpen ? "Collapse Question Palette" : "Expand Question Palette"}
          className="absolute top-1/2 -translate-y-1/2 z-30 w-5 h-14 bg-gray-600 hover:bg-gray-800 text-white rounded-l flex items-center justify-center transition-all cursor-pointer shadow-md"
          style={{ right: isPaletteOpen ? "320px" : "0px" }}
        >
          {isPaletteOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* RIGHT: QUESTION PALETTE PANEL */}
        {isPaletteOpen && (
          <aside className="w-80 bg-white border-l border-gray-300 flex flex-col shrink-0 shadow-lg z-20">
            {/* Candidate Box */}
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center space-x-3">
              <div className="w-11 h-11 rounded bg-blue-200 border border-blue-300 flex items-center justify-center text-blue-800 font-bold shrink-0">
                {candidateAvatar ? (
                  <img src={candidateAvatar} alt="Candidate" className="w-full h-full object-cover rounded" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div className="flex flex-col text-xs overflow-hidden">
                <span className="font-bold text-gray-900 truncate">{candidateName}</span>
                <span className="text-[11px] text-gray-500 font-mono">{candidateRoll}</span>
              </div>
            </div>

            {/* Question Status Legend Counters */}
            <div className="p-3 bg-white border-b border-gray-200 text-[11px] font-medium space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-6 h-6 text-white font-bold flex items-center justify-center text-[10px]"
                    style={{
                      backgroundColor: "#16a34a",
                      clipPath: "polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
                    }}
                  >
                    {currentSecStats.answered}
                  </span>
                  <span className="text-gray-700">Answered</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className="w-6 h-6 text-white font-bold flex items-center justify-center text-[10px]"
                    style={{
                      backgroundColor: "#e11d48",
                      clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)",
                    }}
                  >
                    {currentSecStats.notAnswered}
                  </span>
                  <span className="text-gray-700">Not Answered</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded bg-gray-200 text-gray-800 font-bold flex items-center justify-center text-[10px] border border-gray-300">
                    {currentSecStats.notVisited}
                  </span>
                  <span className="text-gray-700">Not Visited</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center text-[10px]">
                    {currentSecStats.markedForReview}
                  </span>
                  <span className="text-gray-700">Marked for Review</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1 border-t border-gray-100">
                <span className="relative w-6 h-6 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  {currentSecStats.answeredAndMarkedForReview}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
                </span>
                <span className="text-gray-700 text-[10px] leading-tight">
                  Ans &amp; Marked for Review (will be evaluated)
                </span>
              </div>
            </div>

            {/* Section Question Grid */}
            <div className="bg-[#1e3a8a] text-white px-4 py-2 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Section: {currentSection.name}</span>
              <span className="text-[11px] font-normal">{currentSection.questions.length} Qs</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {currentSection.questions.length >= 25 ? (
                <>
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded mb-2 border border-gray-200">
                      <span>Section A: MCQs</span>
                      <span className="text-gray-500 font-normal">Q.1 - 20</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 justify-items-center">
                      {currentSection.questions.slice(0, 20).map((q, idx) => renderQuestionButton(q, idx))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-900 bg-purple-50 px-2 py-1 rounded mb-2 border border-purple-200">
                      <span>Section B: Numericals</span>
                      <span className="text-purple-600 font-normal">Q.21 - 25</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 justify-items-center">
                      {currentSection.questions.slice(20, 25).map((q, idx) => renderQuestionButton(q, 20 + idx))}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-[11px] font-bold text-gray-500 mb-2">Choose a Question:</p>
                  <div className="grid grid-cols-5 gap-2 justify-items-center">
                    {currentSection.questions.map((q, idx) => renderQuestionButton(q, idx))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Exam Button */}
            <div className="p-3 bg-gray-50 border-t border-gray-300">
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                disabled={submitting}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-98"
              >
                Submit Exam
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* 4. SUBMIT CONFIRMATION MODAL */}
      <TcsIonSubmitModal
        isOpen={isSubmitModalOpen}
        isAutoSubmit={isAutoSubmit}
        stats={sectionStats}
        onConfirm={handleFinalSubmit}
        onCancel={() => setIsSubmitModalOpen(false)}
        submitting={submitting}
      />

      {/* 5. QUESTION PAPER MODAL */}
      <TcsIonQuestionPaperModal
        isOpen={isQuestionPaperOpen}
        sections={test.sections}
        onClose={() => setIsQuestionPaperOpen(false)}
      />

      {/* 6. INSTRUCTIONS REFERENCE MODAL */}
      {isInstructionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 border border-gray-300 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-800">Exam Instructions Reference</h3>
              <button
                onClick={() => setIsInstructionsOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed pr-2">
              <p>
                <strong>Marking Scheme:</strong> For each correct answer in Multiple Choice Questions,
                <strong> +4 marks</strong> are awarded. For each incorrect answer, <strong>-1 mark</strong> will be deducted.
                Unattempted questions receive <strong>0 marks</strong>.
              </p>
              <p>
                <strong>Question Palette:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Green tag:</strong> You have answered the question.
                </li>
                <li>
                  <strong>Red tag:</strong> You have visited but not answered the question.
                </li>
                <li>
                  <strong>White/Gray box:</strong> You have not visited the question yet.
                </li>
                <li>
                  <strong>Purple circle:</strong> Marked for review without answering.
                </li>
                <li>
                  <strong>Purple circle with green dot:</strong> Answered and marked for review (counted in final score).
                </li>
              </ul>
              <p>
                <strong>Navigation:</strong> You can switch between sections (Physics, Chemistry, Mathematics) anytime.
                Click <strong>&quot;Save &amp; Next&quot;</strong> to save your answer and proceed.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t flex justify-end">
              <button
                onClick={() => setIsInstructionsOpen(false)}
                className="py-1.5 px-5 bg-blue-600 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
