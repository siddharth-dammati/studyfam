"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  Trophy,
  Target,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  Sparkles,
  BarChart3,
  Award,
  FileText,
  Check,
  Copy,
  X,
  Sliders,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { StudentAdminProfile, StudentAttemptItem } from "@/app/api/admin/attempts/route";

interface Props {
  getAuthHeaders: () => Record<string, string>;
}

export function AdminUserAttemptsView({ getAuthHeaders }: Props) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentAdminProfile[]>([]);
  const [stats, setStats] = useState<{
    totalRegistered: number;
    totalAttemptingStudents: number;
    totalAttemptsLogged: number;
    highestScoreLogged: number;
    avgScoreLogged: number;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [testFilter, setTestFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "best_marks" | "attempts" | "name">("latest");
  const [selectedStudent, setSelectedStudent] = useState<StudentAdminProfile | null>(null);
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchAttemptsData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/attempts", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search,
          testFilter,
          sortBy,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        setStats(data.stats || null);
        // If a student is currently selected, update their reference
        if (selectedStudent) {
          const updated = (data.students || []).find((s: StudentAdminProfile) => s.email === selectedStudent.email);
          if (updated) setSelectedStudent(updated);
        }
      } else {
        console.error("Failed to fetch admin attempts data");
      }
    } catch (e) {
      console.error("Error fetching admin attempts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttemptsData();
  }, [testFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAttemptsData();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatDuration = (totalSecs: number) => {
    if (!totalSecs || totalSecs <= 0) return "0m";
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs > 0 ? `${secs}s` : ""}`.trim();
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Global KPIs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400">
              <Award size={16} />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Student Performance &amp; Mock Attempts Registry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            User Attempts &amp; Student Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live monitoring of all student test attempts across Major Full Tests (MFT 1–10) and Active Mock.
            Click any student to view their latest attempt, attempt duration, best score, MFT-wise marks matrix, and question times.
          </p>
        </div>

        <button
          onClick={fetchAttemptsData}
          disabled={loading}
          className="self-start md:self-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-mono text-[11px] uppercase tracking-wider">Total Attempts</span>
              <FileText size={15} className="text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
              {stats.totalAttemptsLogged}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Across all tests in database
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-mono text-[11px] uppercase tracking-wider">Test Takers</span>
              <Users size={15} className="text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400">
              {stats.totalAttemptingStudents}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Out of {stats.totalRegistered} registered
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-mono text-[11px] uppercase tracking-wider">Highest Score</span>
              <Trophy size={15} className="text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400">
              {stats.highestScoreLogged}
              <span className="text-xs text-slate-500 font-normal ml-1">/ 300</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Top recorded score
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-mono text-[11px] uppercase tracking-wider">Average Score</span>
              <Target size={15} className="text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-400">
              {stats.avgScoreLogged}
              <span className="text-xs text-slate-500 font-normal ml-1">/ 300</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Mean score across attempts
            </div>
          </div>
        </div>
      )}

      {/* 2. Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, roll no..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none pr-10"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
            <Search size={16} />
          </button>
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          {/* Test Filter */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Filter:</span>
            <select
              value={testFilter}
              onChange={(e) => setTestFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">All Tests</option>
              <option value="mft">All MFTs (1–10)</option>
              <option value="active">Active Mock Only</option>
              <option value="mft-1">MFT-01</option>
              <option value="mft-2">MFT-02</option>
              <option value="mft-3">MFT-03</option>
              <option value="mft-4">MFT-04</option>
              <option value="mft-5">MFT-05</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="latest">Latest Attempt</option>
              <option value="best_marks">Highest Marks</option>
              <option value="attempts">Most Attempts</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Students Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-indigo-400" />
            <h3 className="font-bold text-sm text-white">
              Students Registry ({students.length} found)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Click any row to open deep-dive analysis
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-indigo-400" />
            <p className="text-xs">Loading students attempt records from database...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-semibold">No students found matching your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing search filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Stream &amp; Roll No</th>
                  <th className="py-3.5 px-4 text-center">Attempts</th>
                  <th className="py-3.5 px-4 text-center">Best Marks</th>
                  <th className="py-3.5 px-4">Latest Attempt</th>
                  <th className="py-3.5 px-4">Duration Spent</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map((student) => {
                  const hasAttempts = student.totalAttempts > 0;
                  const latest = student.latestAttempt;
                  const isSelected = selectedStudent?.email === student.email;

                  return (
                    <tr
                      key={student.email}
                      onClick={() => setSelectedStudent(student)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isSelected ? "bg-indigo-950/40 border-l-4 border-indigo-500" : ""
                      }`}
                    >
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white truncate max-w-[200px]">
                          {student.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                          {student.email}
                        </div>
                        {student.phone && student.phone !== "—" && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            {student.phone}
                          </div>
                        )}
                      </td>

                      {/* Stream & Roll */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-300">
                          {student.rollNo ? (
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 font-bold">
                              {student.rollNo}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 capitalize">
                          {student.jeeStatus?.replace(/-/g, " ") || "JEE Main"}
                        </div>
                      </td>

                      {/* Total Attempts */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
                            hasAttempts
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {student.totalAttempts}
                        </span>
                      </td>

                      {/* Best Marks */}
                      <td className="py-3.5 px-4 text-center">
                        {hasAttempts ? (
                          <div>
                            <span className="font-mono font-extrabold text-emerald-400 text-sm">
                              {student.bestMarks}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono"> / 300</span>
                            <div className="text-[10px] text-slate-400 font-mono">
                              ({student.bestPercentage}%)
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-mono">—</span>
                        )}
                      </td>

                      {/* Latest Attempt */}
                      <td className="py-3.5 px-4">
                        {latest ? (
                          <div>
                            <div className="font-medium text-slate-200 truncate max-w-[180px]">
                              {latest.testTitle.replace(/\.pdf$/i, "")}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <Calendar size={10} />
                              {formatDate(latest.createdAt)}
                            </div>
                            <div className="text-[11px] font-mono text-indigo-300 mt-0.5">
                              Score: {latest.score}/300 · {latest.accuracy}% acc
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Not attempted yet</span>
                        )}
                      </td>

                      {/* Attempt Duration */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {latest && latest.timeSpentSeconds > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-amber-400" />
                            <span>{formatDuration(latest.timeSpentSeconds)}</span>
                          </div>
                        ) : hasAttempts ? (
                          <span className="text-slate-500">Untimed</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-200 hover:text-white font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Eye size={13} />
                          <span>Deep Dive</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Student Deep Dive Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-600/30">
                  {selectedStudent.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {selectedStudent.fullName}
                    </h2>
                    {selectedStudent.rollNo && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                        ROLL: {selectedStudent.rollNo}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-xs capitalize">
                      {selectedStudent.jeeStatus?.replace(/-/g, " ") || "JEE 2026"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail size={12} className="text-slate-500" />
                      {selectedStudent.email}
                    </span>
                    {selectedStudent.phone && selectedStudent.phone !== "—" && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-slate-500" />
                        {selectedStudent.phone}
                      </span>
                    )}
                    {selectedStudent.scholarshipTrack && (
                      <span className="text-emerald-400 capitalize">
                        Track: {selectedStudent.scholarshipTrack.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(
                      `Name: ${selectedStudent.fullName}\nEmail: ${selectedStudent.email}\nPhone: ${selectedStudent.phone}\nRoll: ${selectedStudent.rollNo || "N/A"}\nBest Marks: ${selectedStudent.bestMarks}/300\nTotal Attempts: ${selectedStudent.totalAttempts}`,
                      "student_card"
                    )
                  }
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Copy student record"
                >
                  {copiedText === "student_card" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Summary KPIs for this Student */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
                  <div className="text-[11px] font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
                    <span>Best Score</span>
                    <Trophy size={13} className="text-amber-400" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-amber-400">
                    {selectedStudent.bestMarks}
                    <span className="text-xs text-slate-500 font-normal"> / 300</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {selectedStudent.bestPercentage}% peak score
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
                  <div className="text-[11px] font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
                    <span>Average Score</span>
                    <Target size={13} className="text-indigo-400" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-indigo-300">
                    {selectedStudent.averageMarks}
                    <span className="text-xs text-slate-500 font-normal"> / 300</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {selectedStudent.averageAccuracy}% average accuracy
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
                  <div className="text-[11px] font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
                    <span>Total Attempts</span>
                    <FileText size={13} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-emerald-400">
                    {selectedStudent.totalAttempts}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Tests logged in system
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
                  <div className="text-[11px] font-mono uppercase text-slate-400 mb-1 flex items-center justify-between">
                    <span>Total Time Spent</span>
                    <Clock size={13} className="text-cyan-400" />
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-cyan-400">
                    {formatDuration(selectedStudent.totalTimeSpentSeconds)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Time solving questions
                  </div>
                </div>
              </div>

              {/* MFT-Wise Marks Matrix (MFT-01 to MFT-10 + Active Mock) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <h3 className="font-bold text-sm text-white">
                      MFT-Wise Marks Matrix (Major Full Tests 01–10)
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    10 National Tests + Active Mock
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {Object.values(selectedStudent.mftMatrix).map((slot) => {
                    const isAttempted = slot.attempted;
                    return (
                      <div
                        key={slot.code}
                        className={`p-3 rounded-2xl border transition-all ${
                          isAttempted
                            ? "bg-slate-950/80 border-indigo-500/40 hover:border-indigo-400"
                            : "bg-slate-950/30 border-slate-800/80 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                              isAttempted
                                ? "bg-indigo-500/20 text-indigo-300"
                                : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            {slot.code}
                          </span>
                          <span
                            className={`text-[10px] ${
                              isAttempted ? "text-emerald-400 font-bold" : "text-slate-600"
                            }`}
                          >
                            {isAttempted ? `${slot.attemptsCount} attempt${slot.attemptsCount > 1 ? "s" : ""}` : "Not Taken"}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-slate-200 truncate">
                          {slot.title}
                        </div>

                        {isAttempted ? (
                          <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1 font-mono text-[11px]">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Best:</span>
                              <span className="font-bold text-amber-400">
                                {slot.bestScore} / 300
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-400">
                              <span>Accuracy:</span>
                              <span className="text-slate-200">{slot.latestAccuracy}%</span>
                            </div>
                            {slot.latestTimeSeconds ? (
                              <div className="flex justify-between items-center text-[10px] text-slate-400">
                                <span>Duration:</span>
                                <span className="text-cyan-400">
                                  {formatDuration(slot.latestTimeSeconds)}
                                </span>
                              </div>
                            ) : null}
                            {slot.latestAttemptedAt ? (
                              <div className="text-[9px] text-slate-500 truncate pt-0.5">
                                {formatDate(slot.latestAttemptedAt)}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <div className="mt-2 pt-2 border-t border-slate-800/40 text-[11px] font-mono text-slate-600 text-center py-1">
                            — / 300
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* All Chronological Attempts with Question-by-Question Deep Dive */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-indigo-400" />
                    <h3 className="font-bold text-sm text-white">
                      All Exam Attempts &amp; Question Pacing ({selectedStudent.attempts.length})
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Click an attempt to inspect question-by-question time
                  </span>
                </div>

                {selectedStudent.attempts.length === 0 ? (
                  <div className="p-8 text-center border border-slate-800 rounded-2xl bg-slate-950/40 text-slate-400 text-xs">
                    This candidate has registered but has not submitted any mock exam attempts yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedStudent.attempts.map((att, idx) => {
                      const isExpanded = expandedAttemptId === att.id;
                      const hasDetailedResults = Array.isArray(att.detailedResults) && att.detailedResults.length > 0;
                      const hasQuestionTimes = att.questionTimes && Object.keys(att.questionTimes).length > 0;

                      return (
                        <div
                          key={att.id || idx}
                          className="border border-slate-800 rounded-2xl bg-slate-950/80 overflow-hidden transition-all"
                        >
                          {/* Attempt Header Bar */}
                          <div
                            onClick={() => setExpandedAttemptId(isExpanded ? null : att.id)}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors cursor-pointer"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                                  Attempt #{selectedStudent.attempts.length - idx}
                                </span>
                                <span className="font-bold text-sm text-white">
                                  {att.testTitle.replace(/\.pdf$/i, "")}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  {att.score} / {att.maxScore || 300} Marks ({att.percentage}%)
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Calendar size={11} />
                                  {formatDate(att.createdAt)}
                                </span>
                                <span>•</span>
                                <span className="text-emerald-400">{att.correctCount} Correct</span>
                                <span>•</span>
                                <span className="text-rose-400">{att.incorrectCount} Incorrect</span>
                                <span>•</span>
                                <span className="text-slate-300">{att.accuracy}% Accuracy</span>
                                {att.timeSpentSeconds > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-cyan-400 flex items-center gap-1">
                                      <Clock size={11} />
                                      {formatDuration(att.timeSpentSeconds)}
                                    </span>
                                  </>
                                )}
                                {att.tabViolations && att.tabViolations > 0 ? (
                                  <>
                                    <span>•</span>
                                    <span className="text-amber-400 flex items-center gap-1">
                                      <AlertTriangle size={11} />
                                      {att.tabViolations} Tab switches
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Link
                                href={`/exam/player?id=${encodeURIComponent(att.testId)}&review=1&attemptId=${encodeURIComponent(att.id)}`}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <span>Full Solutions</span>
                                <ExternalLink size={12} />
                              </Link>

                              <button className="p-1 text-slate-400">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details: Subject Breakdown & Question Times */}
                          {isExpanded && (
                            <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-4 animate-fadeIn">
                              {/* Subject Breakdown if available */}
                              {Array.isArray(att.sectionBreakdown) && att.sectionBreakdown.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 font-bold">
                                    Subject-Wise Breakdown
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {att.sectionBreakdown.map((sec: any, sIdx: number) => (
                                      <div
                                        key={sIdx}
                                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800"
                                      >
                                        <div className="font-bold text-xs text-white capitalize mb-1">
                                          {sec.name || sec.subject || `Subject ${sIdx + 1}`}
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-mono">
                                          <span className="text-slate-400">Marks:</span>
                                          <span className="font-bold text-amber-400">
                                            {sec.score ?? 0}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-0.5">
                                          <span>Correct / Wrong:</span>
                                          <span>
                                            <span className="text-emerald-400">{sec.correct ?? 0}</span> /{" "}
                                            <span className="text-rose-400">{sec.incorrect ?? 0}</span>
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Question-By-Question Inspection */}
                              {hasDetailedResults ? (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">
                                      Question-by-Question Response &amp; Time
                                    </h4>
                                    <span className="text-[11px] font-mono text-slate-500">
                                      Total {att.detailedResults!.length} Questions
                                    </span>
                                  </div>

                                  <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-800 divide-y divide-slate-800/80 bg-slate-950">
                                    {att.detailedResults!.map((q: any, qIdx: number) => {
                                      const isCorrect = q.isCorrect;
                                      const isAttempted = q.userResponse !== undefined && q.userResponse !== null && q.userResponse !== "";
                                      const timeSpent =
                                        q.timeSpentSeconds ||
                                        (att.questionTimes ? att.questionTimes[q.questionId || q.id] : undefined) ||
                                        0;

                                      return (
                                        <div
                                          key={qIdx}
                                          className="p-2.5 px-3 flex items-center justify-between gap-3 text-xs"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className="font-mono text-slate-400 text-[11px] w-8 shrink-0">
                                              Q{qIdx + 1}
                                            </span>
                                            <span
                                              className={`w-2 h-2 rounded-full shrink-0 ${
                                                !isAttempted
                                                  ? "bg-slate-600"
                                                  : isCorrect
                                                  ? "bg-emerald-400"
                                                  : "bg-rose-500"
                                              }`}
                                            />
                                            <span className="text-slate-300 font-medium truncate max-w-[200px]">
                                              {q.subject || "Question"}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
                                            <div className="text-slate-400">
                                              Ans:{" "}
                                              <span className="text-white font-bold">
                                                {isAttempted ? String(q.userResponse) : "Skipped"}
                                              </span>
                                              {isAttempted && !isCorrect && q.correctAnswer && (
                                                <span className="text-emerald-400 ml-1">
                                                  (Correct: {String(q.correctAnswer)})
                                                </span>
                                              )}
                                            </div>

                                            <div className="w-12 text-right">
                                              <span
                                                className={`font-bold ${
                                                  !isAttempted
                                                    ? "text-slate-500"
                                                    : isCorrect
                                                    ? "text-emerald-400"
                                                    : "text-rose-400"
                                                }`}
                                              >
                                                {isCorrect ? "+4" : isAttempted ? "-1" : "0"}
                                              </span>
                                            </div>

                                            <div className="w-16 text-right text-slate-400">
                                              {timeSpent > 0 ? (
                                                <span
                                                  className={
                                                    timeSpent >= 150 && !isCorrect
                                                      ? "text-rose-400 font-bold"
                                                      : "text-slate-300"
                                                  }
                                                >
                                                  {formatDuration(timeSpent)}
                                                </span>
                                              ) : (
                                                "—"
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : hasQuestionTimes ? (
                                <div>
                                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 font-bold">
                                    Question Time Log
                                  </h4>
                                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {Object.entries(att.questionTimes!).map(([qId, secs]) => (
                                      <div
                                        key={qId}
                                        className="p-2 rounded bg-slate-950 border border-slate-800 text-center font-mono text-[11px]"
                                      >
                                        <div className="text-slate-500 truncate text-[10px]">{qId}</div>
                                        <div className="text-indigo-300 font-bold">{formatDuration(secs)}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic">
                                  No question-level response log recorded for this legacy attempt.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Student ID: {selectedStudent.id}
              </span>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
