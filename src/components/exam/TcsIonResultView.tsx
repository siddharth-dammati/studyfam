"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { EvaluationResult } from "@/lib/examDb";

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
  const [filterSubject, setFilterSubject] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  const toggleSolution = (qId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  const filteredQuestions = result.detailedResults.filter((q) => {
    if (filterSubject !== "ALL" && q.subject !== filterSubject) return false;
    if (filterStatus === "CORRECT" && !q.isCorrect) return false;
    if (filterStatus === "INCORRECT" && (q.isCorrect || !q.userResponse)) return false;
    if (filterStatus === "UNATTEMPTED" && q.userResponse) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] font-sans pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 shadow-xs px-4 sm:px-8 py-4 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/exam"
            className="flex items-center space-x-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Test Series</span>
          </Link>
          <span className="text-gray-300">|</span>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-800">{testTitle}</h1>
            <p className="text-xs text-gray-500">Official Exam Scorecard &amp; Analysis</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Scorecard Hero Banner */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  Candidate: {candidateName}
                </p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                    {result.totalScore}
                  </span>
                  <span className="text-xl sm:text-2xl font-semibold text-gray-400">
                    / {result.maxScore}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-semibold mt-1">
                  Overall Score ({result.percentage}% marks)
                </p>
              </div>
            </div>

            {/* Core KPI badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-1 text-emerald-700 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold">Correct (+4)</span>
                </div>
                <div className="text-xl font-extrabold text-emerald-800">{result.correctCount}</div>
              </div>

              <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-1 text-rose-700 mb-1">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">Incorrect (-1)</span>
                </div>
                <div className="text-xl font-extrabold text-rose-800">{result.incorrectCount}</div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-1 text-blue-700 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-bold">Accuracy</span>
                </div>
                <div className="text-xl font-extrabold text-blue-800">{result.accuracy}%</div>
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
        </div>

        {/* Section Breakdown Matrix */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Subject-wise Performance Breakdown</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase font-semibold text-[11px] tracking-wider border-b">
                <tr>
                  <th className="p-3">Section</th>
                  <th className="p-3 text-center">Total Questions</th>
                  <th className="p-3 text-center">Attempted</th>
                  <th className="p-3 text-center text-emerald-700">Correct</th>
                  <th className="p-3 text-center text-rose-600">Incorrect</th>
                  <th className="p-3 text-center font-bold">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium">
                {result.sectionBreakdown.map((s) => (
                  <tr key={s.sectionName} className="hover:bg-gray-50/80">
                    <td className="p-3 font-bold text-gray-900">{s.sectionName}</td>
                    <td className="p-3 text-center text-gray-600">{s.total}</td>
                    <td className="p-3 text-center text-gray-600">{s.attempted}</td>
                    <td className="p-3 text-center font-bold text-emerald-600">{s.correct}</td>
                    <td className="p-3 text-center font-bold text-rose-600">{s.incorrect}</td>
                    <td className="p-3 text-center font-extrabold text-blue-800">
                      {s.score} / {s.total * 4}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Solutions & Question-by-Question Review */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Detailed Solutions &amp; Explanations
              </h2>
              <p className="text-xs text-gray-500">
                Showing {filteredQuestions.length} of {result.totalQuestions} questions
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Subjects</option>
                {result.sectionBreakdown.map((s) => (
                  <option key={s.sectionName} value={s.sectionName}>
                    {s.sectionName}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="CORRECT">Correct</option>
                <option value="INCORRECT">Incorrect</option>
                <option value="UNATTEMPTED">Unattempted</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = Boolean(expandedSolutions[q.questionId]);

              let statusBadge = (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                  Unattempted (0)
                </span>
              );
              if (q.userResponse) {
                if (q.isCorrect) {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Correct (+4)
                    </span>
                  );
                } else {
                  statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Incorrect (-1)
                    </span>
                  );
                }
              }

              return (
                <div
                  key={q.questionId}
                  className="p-5 rounded-lg border border-gray-200 bg-gray-50/50 space-y-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-gray-900">
                        Q.{idx + 1} ({q.subject})
                      </span>
                    </div>
                    <div>{statusBadge}</div>
                  </div>

                  {/* Question Text */}
                  <div className="text-sm leading-relaxed whitespace-pre-line text-gray-900 font-medium">
                    {q.questionText}
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

                  {/* Options List */}
                  {(q.optionA || q.optionB || q.optionC || q.optionD) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm pt-2">
                      {[
                        { key: "A", val: q.optionA },
                        { key: "B", val: q.optionB },
                        { key: "C", val: q.optionC },
                        { key: "D", val: q.optionD },
                      ].map((opt) => {
                        if (!opt.val) return null;
                        const isChosen = q.userResponse?.toUpperCase() === opt.key;
                        const isAns =
                          q.correctAnswer.trim().toLowerCase() === opt.key.toLowerCase() ||
                          q.correctAnswer.trim().toLowerCase() === opt.val.trim().toLowerCase();

                        let optClass = "bg-white border-gray-200 text-gray-700";
                        if (isChosen && q.isCorrect) {
                          optClass = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold";
                        } else if (isChosen && !q.isCorrect) {
                          optClass = "bg-rose-50 border-rose-300 text-rose-900 font-semibold";
                        } else if (isAns) {
                          optClass = "bg-emerald-50/60 border-emerald-200 text-emerald-800 font-medium";
                        }

                        return (
                          <div
                            key={opt.key}
                            className={`p-3 rounded-lg border flex items-start space-x-2 ${optClass}`}
                          >
                            <span className="font-bold">({opt.key})</span>
                            <span className="whitespace-pre-line flex-1">{opt.val}</span>
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

                  {/* Correct Answer & Solution Accordion */}
                  <div className="pt-2">
                    <button
                      onClick={() => toggleSolution(q.questionId)}
                      className="flex items-center space-x-2 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Hide Detailed Solution</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>View Detailed Solution &amp; Explanation</span>
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
                            <div className="whitespace-pre-line leading-relaxed text-gray-800 bg-white p-3 rounded border border-blue-100 font-mono text-xs">
                              {q.solution}
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
      </main>
    </div>
  );
}
