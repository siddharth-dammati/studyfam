"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Save,
  RotateCcw,
  ExternalLink,
  Search,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  Lock,
  ArrowLeft,
  X,
  Plus,
  RefreshCw,
} from "lucide-react";
import { ActiveExamPaper, ActiveExamQuestion } from "@/lib/activeExamService";

const POPULAR_CHAPTERS: Record<string, string[]> = {
  Physics: [
    "Units and Dimensions",
    "Laws of Motion",
    "Work Power Energy",
    "Gravitation",
    "Thermodynamics (Physics)",
    "Current Electricity",
    "Magnetic Effects of Current",
    "Ray Optics",
    "Wave Optics",
    "Oscillations",
    "Semiconductors",
  ],
  Chemistry: [
    "Structure of Atom",
    "Chemical Bonding and Molecular Structure",
    "Thermodynamics (Chemistry)",
    "Chemical Equilibrium",
    "Solutions",
    "Electrochemistry",
    "Chemical Kinetics",
    "Hydrocarbons",
    "Haloalkanes and Haloarenes",
    "Amines",
    "Biomolecules",
  ],
  Mathematics: [
    "Sets and Relations",
    "Functions",
    "Quadratic Equation",
    "Complex Number",
    "Sequences and Series",
    "Limits",
    "Continuity and Differentiability",
    "Application of Derivatives",
    "Indefinite Integration",
    "Differential Equations",
    "Vector Algebra",
    "Three Dimensional Geometry",
    "Probability",
    "Matrices",
  ],
};

export default function AdminExamManagerPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paper, setPaper] = useState<ActiveExamPaper | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active view filters
  const [activeSubject, setActiveSubject] = useState<"Physics" | "Chemistry" | "Mathematics">("Physics");
  const [activeSectionFilter, setActiveSectionFilter] = useState<"ALL" | "MCQ" | "NUMERICAL">("ALL");

  // Edit Modal State
  const [editingQuestion, setEditingQuestion] = useState<ActiveExamQuestion | null>(null);

  // Database Question Selector Modal State
  const [selectorTargetQ, setSelectorTargetQ] = useState<ActiveExamQuestion | null>(null);
  const [dbSearchQuery, setDbSearchQuery] = useState("");
  const [dbSearchResults, setDbSearchResults] = useState<any[]>([]);
  const [isSearchingDb, setIsSearchingDb] = useState(false);

  // Check saved passcode on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("sf_admin_passcode");
    if (saved) {
      setPasscode(saved);
      verifyAndLoad(saved);
    }
  }, []);

  const verifyAndLoad = async (codeToTest: string) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": codeToTest,
        },
        body: JSON.stringify({ action: "get" }),
      });
      const data = await res.json();
      if (data.success && data.paper) {
        setIsAuthenticated(true);
        setPaper(data.paper);
        sessionStorage.setItem("sf_admin_passcode", codeToTest);
      } else {
        setIsAuthenticated(false);
        setStatusMessage({ type: "error", text: data.error || "Incorrect admin passcode." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to connect to admin API" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    verifyAndLoad(passcode.trim());
  };

  const handleSaveChanges = async () => {
    if (!paper) return;
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({ paper }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: "Successfully saved 75-question active test paper!" });
        setPaper(data.paper);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to save paper" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Network error while saving" });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm("Are you sure you want to reset all 75 questions to the default JEE mock questions?")) {
      return;
    }
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: "Paper reset to standard 75 default questions." });
        setPaper(data.paper);
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to reset" });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEditedQuestion = (updated: ActiveExamQuestion) => {
    if (!paper) return;
    const newSubjects = paper.subjects.map((s) => {
      if (s.name !== updated.subject) return s;
      const updatedQuestions = s.questions.map((q) => (q.id === updated.id ? updated : q));
      return { ...s, questions: updatedQuestions };
    });
    setPaper({ ...paper, subjects: newSubjects });
    setEditingQuestion(null);
    setStatusMessage({ type: "success", text: `Updated Q.${updated.questionNumber} (${updated.subject}). Click 'Save Paper' to commit changes.` });
  };

  // Search 9,395 questions database
  const searchDb = async (subj: string, queryStr: string) => {
    setIsSearchingDb(true);
    try {
      const res = await fetch("/api/admin/exam/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          subject: subj,
          q: queryStr,
          limit: 25,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        setDbSearchResults(data.questions);
      } else {
        setDbSearchResults([]);
      }
    } catch (e) {
      console.error("Search DB error:", e);
      setDbSearchResults([]);
    } finally {
      setIsSearchingDb(false);
    }
  };

  const handleSelectFromDb = (dbQ: any) => {
    if (!paper || !selectorTargetQ) return;

    const isNum = selectorTargetQ.type === "NUMERICAL";
    const updated: ActiveExamQuestion = {
      ...selectorTargetQ,
      questionText: dbQ.questionText,
      optionA: isNum ? undefined : dbQ.optionA || "Option A",
      optionB: isNum ? undefined : dbQ.optionB || "Option B",
      optionC: isNum ? undefined : dbQ.optionC || "Option C",
      optionD: isNum ? undefined : dbQ.optionD || "Option D",
      correctAnswer: isNum ? (dbQ.correctAnswer || "10") : (dbQ.correctAnswer || "A"),
      solution: dbQ.solution || "Step-by-step solution from database.",
      chapter: dbQ.chapter || selectorTargetQ.chapter,
      imagePaths: dbQ.imagePaths || [],
    };

    handleSaveEditedQuestion(updated);
    setSelectorTargetQ(null);
    setDbSearchResults([]);
  };

  // Filter current subject questions
  const currentSubjectData = paper?.subjects.find((s) => s.name === activeSubject);
  const displayedQuestions = (currentSubjectData?.questions || []).filter((q) => {
    if (activeSectionFilter === "MCQ") return q.type === "MCQ";
    if (activeSectionFilter === "NUMERICAL") return q.type === "NUMERICAL";
    return true;
  });

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight">Admin Test Paper Console</h1>
            <p className="text-xs text-slate-400">
              Enter admin passcode to configure the 75 active questions (Physics, Chemistry, Maths).
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {statusMessage && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-rose-300 text-xs text-center">
                {statusMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-98 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Unlock Test Editor"}
            </button>
          </form>

          <div className="text-center">
            <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-300">
              ← Return to Main Admin Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Console
  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 font-sans pb-20">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
          <span className="text-slate-700">|</span>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center space-x-2">
              <span>75-Question Test Paper Manager</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase font-mono">
                TCS iON Pattern
              </span>
            </h1>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetToDefault}
            disabled={saving}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>

          <Link
            href="/exam/player?id=active"
            target="_blank"
            className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test in Player</span>
          </Link>

          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-extrabold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Paper"}</span>
          </button>
        </div>
      </header>

      {/* Notifications */}
      {statusMessage && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
              statusMessage.type === "success"
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
                : "bg-rose-950/60 border-rose-800 text-rose-300"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="cursor-pointer text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Overview Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">{paper?.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact official pattern: 20 MCQs + 5 Numericals per subject (Physics, Chemistry, Maths). Total 75 Qs · 300 Marks · 180 Minutes.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Physics: </span>
              <span className="text-blue-400 font-bold">25 Qs</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Chemistry: </span>
              <span className="text-blue-400 font-bold">25 Qs</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400">Maths: </span>
              <span className="text-blue-400 font-bold">25 Qs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs: Subject Switcher */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-3">
          {/* 3 Subject Tabs */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(["Physics", "Chemistry", "Mathematics"] as const).map((subj) => (
              <button
                key={subj}
                onClick={() => setActiveSubject(subj)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSubject === subj
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {subj} (25)
              </button>
            ))}
          </div>

          {/* Section Filter */}
          <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSectionFilter("ALL")}
              className={`px-3 py-1.5 rounded font-semibold cursor-pointer ${
                activeSectionFilter === "ALL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All (25)
            </button>
            <button
              onClick={() => setActiveSectionFilter("MCQ")}
              className={`px-3 py-1.5 rounded font-semibold cursor-pointer ${
                activeSectionFilter === "MCQ" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Section A: MCQs (20)
            </button>
            <button
              onClick={() => setActiveSectionFilter("NUMERICAL")}
              className={`px-3 py-1.5 rounded font-semibold cursor-pointer ${
                activeSectionFilter === "NUMERICAL" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Section B: Numericals (5)
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {displayedQuestions.map((q) => {
            const isNum = q.type === "NUMERICAL";

            return (
              <div
                key={q.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-extrabold text-sm flex items-center justify-center">
                      {q.questionNumber}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white">
                        {q.subject} · {q.section}
                      </span>
                      {q.chapter && <span className="text-[11px] text-slate-400 ml-2">({q.chapter})</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        isNum
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {isNum ? "Numerical Value" : "MCQ Single Choice"}
                    </span>

                    <button
                      onClick={() => {
                        setSelectorTargetQ(q);
                        const initialQuery = (q.chapter || "").split(/[\s,()&_\-\/]+/)[0] || "";
                        setDbSearchQuery(q.chapter || "");
                        searchDb(q.subject, initialQuery);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer border border-slate-700"
                      title="Pick a replacement question from the 9,395 questions database"
                    >
                      <Search className="w-3 h-3" />
                      <span>Pick from Bank</span>
                    </button>

                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line text-slate-200">
                  {q.questionText}
                </div>

                {/* Diagrams if any */}
                {q.imagePaths && q.imagePaths.length > 0 && (
                  <div className="flex flex-wrap gap-3 py-2">
                    {q.imagePaths.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="Diagram"
                        className="max-h-48 max-w-full rounded border border-slate-700 bg-white object-contain"
                      />
                    ))}
                  </div>
                )}

                {/* Options / Answer Preview */}
                {!isNum ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {[
                      { key: "A", val: q.optionA },
                      { key: "B", val: q.optionB },
                      { key: "C", val: q.optionC },
                      { key: "D", val: q.optionD },
                    ].map((opt) => {
                      const isCorrect = q.correctAnswer.toUpperCase() === opt.key;
                      return (
                        <div
                          key={opt.key}
                          className={`p-2.5 rounded-lg border flex items-start space-x-2 ${
                            isCorrect
                              ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-300 font-semibold"
                              : "bg-slate-800/40 border-slate-800 text-slate-300"
                          }`}
                        >
                          <span className="font-bold">({opt.key})</span>
                          <span className="whitespace-pre-line flex-1">{opt.val || `Option ${opt.key}`}</span>
                          {isCorrect && (
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-purple-950/30 border border-purple-800/40 p-3 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">Correct Numerical Value: </span>
                      <span className="font-mono font-extrabold text-purple-300 text-sm">{q.correctAnswer}</span>
                    </div>
                    <span className="text-[11px] text-purple-400 italic">Entered via Virtual Keypad</span>
                  </div>
                )}

                {/* Solution Preview */}
                {q.solution && (
                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 space-y-1">
                    <span className="font-bold text-slate-300 block">Explanation / Solution:</span>
                    <p className="whitespace-pre-line leading-relaxed font-mono">{q.solution}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL 1: Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                Edit Question {editingQuestion.questionNumber} ({editingQuestion.subject})
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question Text</label>
                <textarea
                  rows={4}
                  value={editingQuestion.questionText}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, questionText: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-xs font-sans focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic / Chapter</label>
                  <input
                    type="text"
                    value={editingQuestion.chapter || ""}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, chapter: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Question Type</label>
                  <select
                    value={editingQuestion.type}
                    onChange={(e) => {
                      const val = e.target.value as "MCQ" | "NUMERICAL";
                      setEditingQuestion({
                        ...editingQuestion,
                        type: val,
                        section: val === "MCQ" ? "Section A (MCQ)" : "Section B (Numerical)",
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="MCQ">Section A: Multiple Choice Question (MCQ)</option>
                    <option value="NUMERICAL">Section B: Numerical Value Question</option>
                  </select>
                </div>
              </div>

              {/* Options if MCQ */}
              {editingQuestion.type === "MCQ" ? (
                <div className="space-y-3 pt-2">
                  <span className="block text-slate-300 font-semibold">Options &amp; Correct Answer</span>
                  {(["A", "B", "C", "D"] as const).map((optKey) => {
                    const optField = `option${optKey}` as "optionA" | "optionB" | "optionC" | "optionD";
                    const isCorrect = editingQuestion.correctAnswer.toUpperCase() === optKey;

                    return (
                      <div key={optKey} className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingQuestion({ ...editingQuestion, correctAnswer: optKey })}
                          className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                            isCorrect ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                          title={isCorrect ? "Correct Option" : "Click to set as correct option"}
                        >
                          {optKey}
                        </button>
                        <input
                          type="text"
                          value={editingQuestion[optField] || ""}
                          onChange={(e) =>
                            setEditingQuestion({ ...editingQuestion, [optField]: e.target.value })
                          }
                          placeholder={`Text for option ${optKey}`}
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Correct Numerical Value (e.g. 4, 15, 2.5, -3)
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.correctAnswer}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Detailed Step-by-Step Solution / Explanation
                </label>
                <textarea
                  rows={4}
                  value={editingQuestion.solution}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, solution: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEditedQuestion(editingQuestion)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Database Question Selector from 9,395 Questions Bank */}
      {selectorTargetQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">
                  Pick Question for Q.{selectorTargetQ.questionNumber} ({selectorTargetQ.subject})
                </h3>
                <p className="text-xs text-slate-400">
                  Search through 9,395 curated JEE Main questions to replace this slot.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectorTargetQ(null);
                  setDbSearchResults([]);
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder={`Search ${selectorTargetQ.subject} questions by chapter, keyword, or text...`}
                  value={dbSearchQuery}
                  onChange={(e) => setDbSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchDb(selectorTargetQ.subject, dbSearchQuery)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => searchDb(selectorTargetQ.subject, dbSearchQuery)}
                disabled={isSearchingDb}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isSearchingDb ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Quick Chapter Filter Chips */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-500 font-bold uppercase text-[9px] shrink-0 mr-1">Chapters:</span>
              {(POPULAR_CHAPTERS[selectorTargetQ.subject] || []).map((chap) => (
                <button
                  key={chap}
                  onClick={() => {
                    setDbSearchQuery(chap);
                    searchDb(selectorTargetQ.subject, chap);
                  }}
                  className={`px-2.5 py-1 rounded-full border shrink-0 transition-colors cursor-pointer text-[11px] ${
                    dbSearchQuery === chap
                      ? "bg-blue-600 text-white border-blue-500 font-bold shadow-xs"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {chap}
                </button>
              ))}
              <button
                onClick={() => {
                  setDbSearchQuery("");
                  searchDb(selectorTargetQ.subject, "");
                }}
                className="px-2.5 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 shrink-0 font-bold cursor-pointer transition-colors text-[11px]"
              >
                All {selectorTargetQ.subject}
              </button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {isSearchingDb && (
                <div className="text-center py-12 text-slate-400">Searching database...</div>
              )}

              {!isSearchingDb && dbSearchResults.length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <p className="text-slate-400 text-xs">
                    No questions matched &quot;{dbSearchQuery}&quot;.
                  </p>
                  <button
                    onClick={() => {
                      setDbSearchQuery("");
                      searchDb(selectorTargetQ.subject, "");
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-colors"
                  >
                    Browse All Available {selectorTargetQ.subject} Questions
                  </button>
                </div>
              )}

              {!isSearchingDb &&
                dbSearchResults.map((resQ) => (
                  <div
                    key={resQ.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 space-y-3 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">
                        {resQ.chapter || resQ.subject}
                      </span>
                      <button
                        onClick={() => handleSelectFromDb(resQ)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                      >
                        Use This Question
                      </button>
                    </div>

                    <p className="text-slate-200 whitespace-pre-line leading-relaxed">
                      {resQ.questionText}
                    </p>

                    {(resQ.optionA || resQ.optionB) && (
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        {resQ.optionA && <div>(A) {resQ.optionA}</div>}
                        {resQ.optionB && <div>(B) {resQ.optionB}</div>}
                        {resQ.optionC && <div>(C) {resQ.optionC}</div>}
                        {resQ.optionD && <div>(D) {resQ.optionD}</div>}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
