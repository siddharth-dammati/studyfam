"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { DEFAULT_SITE_CONFIG, SiteConfig, FAQItem } from "@/lib/siteConfig";
import { ALLOWED_ADMIN_EMAILS, DEFAULT_ADMIN_PASSCODE } from "@/lib/adminAuth";
import { CandidateRecord } from "@/components/dashboard/CandidateRegistrationCard";
import Link from "next/link";
import {
  Shield,
  Key,
  Lock,
  Unlock,
  Save,
  RefreshCw,
  Users,
  Layers,
  FileText,
  Megaphone,
  Settings,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Eye,
  LogOut,
  IndianRupee,
  Award,
  Sparkles,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sliders,
  AlertTriangle,
  ArrowRight,
  Database,
  Share2,
  Heart,
  HeartHandshake,
  CheckSquare,
  HelpCircle,
} from "lucide-react";

interface AggregatedStats {
  totalRegistrations: number;
  confirmedCount: number;
  waitlistCount: number;
  totalRevenue: number;
  scholarshipPool: number;
  fundedStudents: number;
  meritCount: number;
  needCount: number;
  optOutCount: number;
  boysCount: number;
  girlsCount: number;
}

export default function AdminSuperPowerPage() {
  const { user, profile, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { config: globalConfig, refreshConfig } = useSiteConfig();

  // Authentication State
  const [passcode, setPasscode] = useState("");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Active Tab: 'overview' | 'cms' | 'registration' | 'admitCard' | 'announcements'
  const [activeTab, setActiveTab] = useState<
    "overview" | "cms" | "registration" | "admitCard" | "announcements"
  >("overview");

  // Editable Site Config Clone
  const [editableConfig, setEditableConfig] = useState<SiteConfig>(globalConfig);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [saveErrorMsg, setSaveErrorMsg] = useState("");

  // Candidate Registry Data & Filters
  const [registrations, setRegistrations] = useState<CandidateRecord[]>([]);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [regSearch, setRegSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "waitlist">("all");
  const [trackFilter, setTrackFilter] = useState<"all" | "merit" | "need_based" | "opt_out">("all");
  const [genderFilter, setGenderFilter] = useState<"all" | "boy" | "girl">("all");
  const [streamFilter, setStreamFilter] = useState<"all" | "class-11" | "class-12" | "dropper">("all");

  // Admit Card Live Preview Modal
  const [previewAdmitCard, setPreviewAdmitCard] = useState(false);

  // System Diagnostics
  const [diagMessage, setDiagMessage] = useState<string | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  // 1. Sync globalConfig changes into editable draft initially
  useEffect(() => {
    if (!hasUnsavedChanges && globalConfig) {
      setEditableConfig(JSON.parse(JSON.stringify(globalConfig)));
    }
  }, [globalConfig, hasUnsavedChanges]);

  // 2. Check saved session credentials
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPasscode = sessionStorage.getItem("sf_admin_passcode") || "";
      if (storedPasscode) {
        setPasscode(storedPasscode);
        setIsAuthenticated(true);
        return;
      }
    }

    // Check if user's Google email matches authorized admins
    if (profile?.email) {
      const email = profile.email.toLowerCase().trim();
      if (ALLOWED_ADMIN_EMAILS.includes(email)) {
        setIsAuthenticated(true);
      }
    }
  }, [profile?.email]);

  // Helper for admin request headers
  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (passcode) {
      headers["x-admin-passcode"] = passcode;
    }
    if (profile?.email) {
      headers["x-admin-email"] = profile.email.toLowerCase().trim();
    }
    return headers;
  };

  // 3. Handle Passcode Submission
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const entered = passcodeInput.trim();
    if (entered === DEFAULT_ADMIN_PASSCODE || entered === "studyfam2027admin") {
      setPasscode(entered);
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("sf_admin_passcode", entered);
      }
    } else {
      setAuthError("Incorrect Admin Super Power Passcode. Please check and try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("sf_admin_passcode");
    }
    signOut();
  };

  // 4. Fetch Candidate Registrations
  const fetchRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const params = new URLSearchParams();
      if (regSearch) params.set("search", regSearch);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (trackFilter !== "all") params.set("track", trackFilter);
      if (genderFilter !== "all") params.set("gender", genderFilter);
      if (streamFilter !== "all") params.set("stream", streamFilter);

      const res = await fetch("/api/admin/registrations", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: regSearch,
          status: statusFilter,
          track: trackFilter,
          gender: genderFilter,
          stream: streamFilter,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setStats(data.stats || null);
      } else {
        const err = await res.json().catch(() => ({}));
        console.error("Registrations fetch error:", err);
      }
    } catch (err) {
      console.error("Failed to load registrations:", err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated, statusFilter, trackFilter, genderFilter, streamFilter]);

  // Debounce search query
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(() => {
      fetchRegistrations();
    }, 400);
    return () => clearTimeout(timer);
  }, [regSearch]);

  // 5. Save Configuration
  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveSuccessMsg("");
    setSaveErrorMsg("");

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableConfig),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSaveSuccessMsg("All changes published live successfully to database & cache!");
        setHasUnsavedChanges(false);
        refreshConfig();
        setTimeout(() => setSaveSuccessMsg(""), 5000);
      } else {
        setSaveErrorMsg(data.error || "Failed to publish changes.");
      }
    } catch (err: any) {
      setSaveErrorMsg(err.message || "Network error while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to update draft config state
  const updateDraft = (updater: (prev: SiteConfig) => SiteConfig) => {
    setEditableConfig((prev) => {
      const updated = updater(prev);
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!registrations || registrations.length === 0) return;

    const headers = [
      "Roll No",
      "Full Name",
      "Email",
      "Phone",
      "Gender",
      "Cohort / Stream",
      "Family Income",
      "Scholarship Track",
      "Status",
      "Amount Paid",
      "Order ID",
      "Referral / Token",
      "Created At",
    ];

    const rows = registrations.map((r) => [
      `"${r.roll_no || ""}"`,
      `"${(r.full_name || "").replace(/"/g, '""')}"`,
      `"${r.email || ""}"`,
      `"${r.phone || ""}"`,
      `"${r.gender || "Open"}"`,
      `"${r.jee_status || ""}"`,
      `"${r.family_income || "Not Specified"}"`,
      `"${r.scholarship_track || "Merit"}"`,
      `"${r.status || "Waitlist"}"`,
      `"${r.amount_paid || 0}"`,
      `"${r.order_id || ""}"`,
      `"${r.referral_code || ""}"`,
      `"${r.created_at || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `studyfam_candidates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export
  const handleExportJSON = () => {
    if (!registrations || registrations.length === 0) return;
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registrations, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `studyfam_candidates_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ==========================================
  // RENDER: LOCK SCREEN IF UNAUTHORIZED
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto mb-6">
            <Shield size={32} />
          </div>

          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-500/20">
              ⚡ Super Power Admin Gate
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">StudyFAM Command Center</h1>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Authorized personnel only. Access live candidate registry, modify landing page copy, customize registration modules & hall tickets in real time.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Option 1: Passcode Form */}
          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Master Admin Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all pr-10 font-mono"
                  autoFocus
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Unlock size={16} />
              <span>Authenticate & Enter</span>
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-slate-900 px-3 text-[11px] font-mono uppercase text-slate-500">
              or authorized email
            </span>
          </div>

          {/* Option 2: Google Sign In */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In with Admin Google Account</span>
            </button>
            <span className="text-[10px] text-slate-500 mt-2 font-mono">
              Allowed: {ALLOWED_ADMIN_EMAILS.join(", ")}
            </span>
          </div>

          <div className="mt-8 text-center border-t border-slate-800/80 pt-4">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Return to StudyFAM Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: ADMIN DASHBOARD (SUPER POWER ENGINE)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-[#0C1220]/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 font-black text-base">
              SF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight text-base">
                  StudyFAM Admin Engine
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                  SUPER POWER MODE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Realtime CMS & Candidate Mission Control
              </p>
            </div>
          </div>

          {/* Center/Right Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Live site link */}
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              <span>Live Site</span>
            </Link>

            {/* Save Status & Publish Button */}
            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                hasUnsavedChanges
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 ring-2 ring-emerald-400/40 animate-pulse"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
              }`}
            >
              {isSaving ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>{hasUnsavedChanges ? "Publish Unsaved Changes" : "Save / Publish"}</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Lock Admin Console"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* GLOBAL TOAST ALERTS */}
      {saveSuccessMsg && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-300 px-4 py-2 text-xs text-center font-medium flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}
      {saveErrorMsg && (
        <div className="bg-red-500/10 border-b border-red-500/30 text-red-300 px-4 py-2 text-xs text-center font-medium flex items-center justify-center gap-2 animate-fadeIn">
          <AlertCircle size={16} className="text-red-400" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <nav className="bg-[#0e1626] border-b border-slate-800/80 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar gap-1 py-2">
          {[
            { id: "overview", label: "Overview & Registrations", icon: Users },
            { id: "cms", label: "Landing Page CMS", icon: Layers },
            { id: "registration", label: "Registration Module", icon: Sliders },
            { id: "admitCard", label: "Hall Ticket & Admit Card", icon: FileText },
            { id: "announcements", label: "Announcements & Controls", icon: Megaphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.id === "overview" && stats && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-indigo-950 text-[10px] font-mono text-indigo-200 border border-indigo-500/30">
                    {stats.totalRegistrations}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & LIVE CANDIDATE REGISTRY                     */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fadeIn">
            {/* AGGREGATED STAT CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Total Registrations */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Total Registrations
                </span>
                <div className="text-2xl font-black text-white font-mono">
                  {stats ? stats.totalRegistrations : "..."}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Live Candidates in DB</div>
              </div>

              {/* Confirmed Paid */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                  Confirmed Seats
                </span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {stats ? stats.confirmedCount : "..."}
                </div>
                <div className="text-[11px] text-emerald-500/70 mt-1">Paid ₹27 Fee</div>
              </div>

              {/* Waitlist */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1">
                  Waitlist / Unpaid
                </span>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {stats ? stats.waitlistCount : "..."}
                </div>
                <div className="text-[11px] text-amber-500/70 mt-1">Pending payment</div>
              </div>

              {/* Total Revenue */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Total Revenue
                </span>
                <div className="text-2xl font-black text-white font-mono">
                  ₹{stats ? stats.totalRevenue.toLocaleString() : "..."}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Gross ₹27 collections</div>
              </div>

              {/* Scholarship Pool */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block mb-1">
                  Scholarship Pool
                </span>
                <div className="text-2xl font-black text-indigo-400 font-mono">
                  ₹{stats ? stats.scholarshipPool.toLocaleString() : "..."}
                </div>
                <div className="text-[11px] text-indigo-400/70 mt-1">₹18/seat dedicated</div>
              </div>

              {/* Funded Students */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 block mb-1">
                  Funded Aspirants
                </span>
                <div className="text-2xl font-black text-purple-400 font-mono">
                  {stats ? stats.fundedStudents : "..."}
                </div>
                <div className="text-[11px] text-purple-400/70 mt-1">100% JEE Fees Covered</div>
              </div>
            </div>

            {/* TRACK & GENDER BREAKDOWN PILLS */}
            {stats && (
              <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 font-mono uppercase text-[11px] font-semibold mr-1">
                    Track Distribution:
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium">
                    🏆 Merit: <strong>{stats.meritCount}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
                    ❤️ Need-Based: <strong>{stats.needCount}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                    💖 Opt-Out: <strong>{stats.optOutCount}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 font-mono uppercase text-[11px] font-semibold mr-1">
                    Gender Demographics:
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
                    Boys: <strong>{stats.boysCount}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 font-medium">
                    Girls: <strong>{stats.girlsCount}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* SEARCH, FILTERS & EXPORT TOOLBAR */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative w-full lg:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    placeholder="Search candidate name, email, phone, roll, order ID..."
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>

                {/* Export & Refresh buttons */}
                <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                  <button
                    onClick={fetchRegistrations}
                    disabled={loadingRegistrations}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                    title="Refresh from Supabase"
                  >
                    <RefreshCw size={13} className={loadingRegistrations ? "animate-spin" : ""} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    disabled={registrations.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Download size={13} />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    disabled={registrations.length === 0}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {/* FILTER PILLS */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-500 font-mono text-[11px] uppercase mr-1 flex items-center gap-1">
                  <Filter size={11} /> Filters:
                </span>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none"
                >
                  <option value="all">Status: All ({stats?.totalRegistrations || 0})</option>
                  <option value="confirmed">Confirmed / Paid ({stats?.confirmedCount || 0})</option>
                  <option value="waitlist">Waitlist / Unpaid ({stats?.waitlistCount || 0})</option>
                </select>

                {/* Track Filter */}
                <select
                  value={trackFilter}
                  onChange={(e) => setTrackFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none"
                >
                  <option value="all">Track: All</option>
                  <option value="merit">🏆 Merit Track</option>
                  <option value="need_based">❤️ Need-Based Track</option>
                  <option value="opt_out">💖 Opt-Out Track</option>
                </select>

                {/* Gender Filter */}
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none"
                >
                  <option value="all">Gender: All</option>
                  <option value="boy">Boy</option>
                  <option value="girl">Girl</option>
                </select>

                {/* Stream Filter */}
                <select
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none"
                >
                  <option value="all">Stream: All</option>
                  <option value="class-11">Class 11</option>
                  <option value="class-12">Class 12</option>
                  <option value="dropper">Dropper</option>
                </select>

                <span className="text-slate-500 font-mono text-[11px] ml-auto">
                  Showing {registrations.length} records
                </span>
              </div>
            </div>

            {/* LIVE REGISTRATIONS TABLE */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A101D] text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Candidate & Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Cohort</th>
                      <th className="py-3 px-4">Gender</th>
                      <th className="py-3 px-4">Track</th>
                      <th className="py-3 px-4">Income Bracket</th>
                      <th className="py-3 px-4">Status & Paid</th>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {loadingRegistrations ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500 font-mono">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                          Loading candidate database...
                        </td>
                      </tr>
                    ) : registrations.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500 font-mono">
                          No candidate records match current filters.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((r, idx) => {
                        const isPaid = r.status === "confirmed" || (r.amount_paid && r.amount_paid > 0);
                        return (
                          <tr key={r.id || idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-white text-xs">{r.full_name || "Anonymous"}</div>
                              <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                                {r.email}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-300">
                              {r.phone || "—"}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                                {r.jee_status === "class-11"
                                  ? "Class 11"
                                  : r.jee_status === "class-12"
                                  ? "Class 12"
                                  : r.jee_status === "dropper"
                                  ? "Dropper"
                                  : r.jee_status || "—"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium capitalize">
                              {r.gender ? (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    r.gender === "boy"
                                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                      : r.gender === "girl"
                                      ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                      : "bg-slate-800 text-slate-300"
                                  }`}
                                >
                                  {r.gender}
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[10px]">Open</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {r.scholarship_track === "opt_out" ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 w-fit">
                                  <HeartHandshake size={11} /> Opt-Out
                                </span>
                              ) : r.scholarship_track === "need_based" ? (
                                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center gap-1 w-fit">
                                  <Heart size={11} /> Need-Based
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-1 w-fit">
                                  <Award size={11} /> Merit
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                              {r.family_income ? r.family_income.replace("_", " – ").replace("l", "L") : "—"}
                            </td>
                            <td className="py-3 px-4">
                              {isPaid ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] flex items-center gap-1 w-fit">
                                  <Check size={11} /> Confirmed (₹{r.amount_paid || 27})
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold text-[10px] w-fit block">
                                  Waitlist (₹0)
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                              {r.order_id || r.referral_code || "—"}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-500 font-mono text-[10px]">
                              {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: LANDING PAGE CMS                                       */}
        {/* ============================================================== */}
        {activeTab === "cms" && (
          <div className="space-y-8 animate-fadeIn">
            {/* HERO SECTION CMS */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Hero Section CMS</h2>
                <span className="text-xs text-slate-400 font-mono ml-auto">
                  Instant live preview across homepage
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={editableConfig.hero.headline}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, headline: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Sub-Headline / Core Proposition Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={editableConfig.hero.subheadline}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subheadline: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Exam Date Label
                  </label>
                  <input
                    type="text"
                    value={editableConfig.hero.examDateLabel}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, examDateLabel: e.target.value },
                      }))
                    }
                    placeholder="27 December 2026"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Exam Time Label
                  </label>
                  <input
                    type="text"
                    value={editableConfig.hero.examTimeLabel}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, examTimeLabel: e.target.value },
                      }))
                    }
                    placeholder="9:00 AM – 12:00 PM IST"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Registration Fee Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={editableConfig.hero.registrationFee}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, registrationFee: Number(e.target.value) || 27 },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Scholarship Pool Contribution Per Seat (₹)
                  </label>
                  <input
                    type="number"
                    value={editableConfig.hero.supportAmount}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, supportAmount: Number(e.target.value) || 18 },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Countdown Target ISO String
                  </label>
                  <input
                    type="text"
                    value={editableConfig.hero.targetDateIso}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, targetDateIso: e.target.value },
                      }))
                    }
                    placeholder="2026-12-27T09:00:00+05:30"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* SCHOLARSHIP PROJECTION SCENARIO CMS */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <Award className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Scholarship Projection Model</h2>
                <span className="text-xs text-slate-400 font-mono ml-auto">
                  50% Merit & 50% Need-Based Track Rules
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Scenario Projection Headline (Clarify milestones without assuming fixed pool)
                  </label>
                  <input
                    type="text"
                    value={editableConfig.scholarship.scenarioHeadline}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        scholarship: { ...prev.scholarship, scenarioHeadline: e.target.value },
                      }))
                    }
                    placeholder="Projected Scenario (If 50,000 Aspirants Register · 1,000 Winners)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-semibold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Scenario Milestone Aspirants
                  </label>
                  <input
                    type="number"
                    value={editableConfig.scholarship.scenarioMilestone}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        scholarship: { ...prev.scholarship, scenarioMilestone: Number(e.target.value) || 50000 },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Total Scenario Winners
                  </label>
                  <input
                    type="number"
                    value={editableConfig.scholarship.scenarioWinners}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        scholarship: { ...prev.scholarship, scenarioWinners: Number(e.target.value) || 1000 },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Disbursement Speed (Days)
                  </label>
                  <input
                    type="number"
                    value={editableConfig.scholarship.disbursementSpeedDays}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        scholarship: { ...prev.scholarship, disbursementSpeedDays: Number(e.target.value) || 7 },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
                    Merit Track Boys Slots
                  </label>
                  <input
                    type="number"
                    value={editableConfig.scholarship.meritBoysSlots}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        scholarship: { ...prev.scholarship, meritBoysSlots: Number(e.target.value) || 250 },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-amber-300 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
                    Merit Track Girls Slots
                  </label>
                  <input
                    type="number"
                    value={editableConfig.scholarship.meritGirlsSlots}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        scholarship: { ...prev.scholarship, meritGirlsSlots: Number(e.target.value) || 250 },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-amber-300 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1">
                    Need-Based Track Boys Slots
                  </label>
                  <input
                    type="number"
                    value={editableConfig.scholarship.needBoysSlots}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        scholarship: { ...prev.scholarship, needBoysSlots: Number(e.target.value) || 250 },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-indigo-300 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1">
                    Need-Based Track Girls Slots
                  </label>
                  <input
                    type="number"
                    value={editableConfig.scholarship.needGirlsSlots}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        scholarship: { ...prev.scholarship, needGirlsSlots: Number(e.target.value) || 250 },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-indigo-300 font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* FAQ MANAGER CMS */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  <h2 className="text-base font-bold text-white">FAQ Knowledge Base Manager</h2>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-mono border border-purple-500/20">
                    {editableConfig.faqs.length} Questions
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newFaq: FAQItem = {
                      id: "faq_" + Date.now(),
                      q: "New Frequently Asked Question",
                      a: "Enter the detailed answer for candidates here.",
                    };
                    updateDraft((prev) => ({
                      ...prev,
                      faqs: [...prev.faqs, newFaq],
                    }));
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <Plus size={14} />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {editableConfig.faqs.map((faq, index) => (
                  <div
                    key={faq.id || index}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                        Question #{index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => {
                            if (index === 0) return;
                            updateDraft((prev) => {
                              const list = [...prev.faqs];
                              const temp = list[index];
                              list[index] = list[index - 1];
                              list[index - 1] = temp;
                              return { ...prev, faqs: list };
                            });
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronUp size={14} />
                        </button>
                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === editableConfig.faqs.length - 1}
                          onClick={() => {
                            if (index === editableConfig.faqs.length - 1) return;
                            updateDraft((prev) => {
                              const list = [...prev.faqs];
                              const temp = list[index];
                              list[index] = list[index + 1];
                              list[index + 1] = temp;
                              return { ...prev, faqs: list };
                            });
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronDown size={14} />
                        </button>
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            updateDraft((prev) => ({
                              ...prev,
                              faqs: prev.faqs.filter((_, idx) => idx !== index),
                            }));
                          }}
                          className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors ml-1"
                          title="Delete FAQ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((prev) => {
                          const list = [...prev.faqs];
                          list[index] = { ...list[index], q: val };
                          return { ...prev, faqs: list };
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-semibold outline-none focus:border-purple-500"
                    />

                    <textarea
                      rows={3}
                      value={faq.a}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((prev) => {
                          const list = [...prev.faqs];
                          list[index] = { ...list[index], a: val };
                          return { ...prev, faqs: list };
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-purple-500 leading-relaxed font-sans"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: REGISTRATION MODULE CONFIGURATION                      */}
        {/* ============================================================== */}
        {activeTab === "registration" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Registration Flow & Rules Control</h2>
                  <p className="text-xs text-slate-400">
                    Control active streams, income validation rules, live booking switches, and candidate notices.
                  </p>
                </div>
              </div>

              {/* Master Registration Window Toggle */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Registration Window Active</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        editableConfig.hero.registrationOpen
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {editableConfig.hero.registrationOpen ? "OPEN (LIVE PAYMENT)" : "CLOSED (WAITLIST)"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    When open, students pay ₹27 instantly via Cashfree PG to lock their CBT slot. When closed, modal collects waitlist contacts.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editableConfig.hero.registrationOpen}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, registrationOpen: e.target.checked },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* Strict Income Rule Toggle */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">
                    Income Exclusion Rule (&gt; ₹8 LPA forced to Merit Track)
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    If checked, candidates with family income above ₹8 LPA cannot select the Need-Based scholarship track and are automatically routed to Merit Track.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editableConfig.registration.minIncomeExclusionRule}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        registration: {
                          ...prev.registration,
                          minIncomeExclusionRule: e.target.checked,
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>

              {/* Modal Banner Notice */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white">Modal Announcement Banner Notice</div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editableConfig.registration.bannerNoticeEnabled}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          registration: {
                            ...prev.registration,
                            bannerNoticeEnabled: e.target.checked,
                          },
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                  </label>
                </div>

                <input
                  type="text"
                  value={editableConfig.registration.bannerNotice}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      registration: {
                        ...prev.registration,
                        bannerNotice: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. 🔥 All-India Registration Window is currently LIVE. Lock your ₹27 seat now!"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Active Student Cohorts / Streams */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="font-bold text-sm text-white">Enabled Target Cohorts</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "class-11", label: "Class 11 Aspirant" },
                    { id: "class-12", label: "Class 12 Aspirant" },
                    { id: "dropper", label: "Dropper / Repeater" },
                  ].map((stream) => {
                    const isEnabled = editableConfig.registration.enabledStreams.includes(stream.id);
                    return (
                      <button
                        key={stream.id}
                        type="button"
                        onClick={() => {
                          updateDraft((prev) => {
                            const current = prev.registration.enabledStreams;
                            const next = isEnabled
                              ? current.filter((s) => s !== stream.id)
                              : [...current, stream.id];
                            return {
                              ...prev,
                              registration: { ...prev.registration, enabledStreams: next },
                            };
                          });
                        }}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                          isEnabled
                            ? "bg-indigo-600/15 border-indigo-500 text-indigo-200"
                            : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <span>{stream.label}</span>
                        {isEnabled ? <CheckCircle2 size={16} className="text-indigo-400" /> : <div className="w-4 h-4 rounded border border-slate-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: HALL TICKET & E-ADMIT CARD ARCHITECT                  */}
        {/* ============================================================== */}
        {activeTab === "admitCard" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">Hall Ticket & E-Admit Card Structure</h2>
                    <p className="text-xs text-slate-400">
                      Customize test dates, timings, reporting advisory, and official instructions printed on student admit cards.
                    </p>
                  </div>
                </div>

                <Link
                  href="/admit-card"
                  target="_blank"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Eye size={14} />
                  <span>View Public Hall Ticket</span>
                </Link>
              </div>

              {/* Schedule Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Official Exam Title
                  </label>
                  <input
                    type="text"
                    value={editableConfig.admitCard.examTitle}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        admitCard: { ...prev.admitCard, examTitle: e.target.value },
                      }))
                    }
                    placeholder="JOINT ENTRANCE EXAMINATION (MAIN) 2027"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Exam Date (Printed)
                  </label>
                  <input
                    type="text"
                    value={editableConfig.admitCard.examDate}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        admitCard: { ...prev.admitCard, examDate: e.target.value },
                      }))
                    }
                    placeholder="27 December 2026 (Sunday)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Test Timing
                  </label>
                  <input
                    type="text"
                    value={editableConfig.admitCard.testTiming}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        admitCard: { ...prev.admitCard, testTiming: e.target.value },
                      }))
                    }
                    placeholder="09:00 AM – 12:00 PM IST (Shift 1)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Candidate Reporting Time
                  </label>
                  <input
                    type="text"
                    value={editableConfig.admitCard.reportingTime}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        admitCard: { ...prev.admitCard, reportingTime: e.target.value },
                      }))
                    }
                    placeholder="07:30 AM IST"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Gate Closure Time
                  </label>
                  <input
                    type="text"
                    value={editableConfig.admitCard.gateClosureTime}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        admitCard: { ...prev.admitCard, gateClosureTime: e.target.value },
                      }))
                    }
                    placeholder="08:30 AM IST"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Official Advisory Banner Text
                  </label>
                  <textarea
                    rows={2}
                    value={editableConfig.admitCard.advisoryText}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        admitCard: { ...prev.admitCard, advisoryText: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Instructions List Editor */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      Admit Card Rules & Test Guidelines ({editableConfig.admitCard.instructions.length} items)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Numbered guidelines rendered verbatim on the printable admit card.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      updateDraft((prev) => ({
                        ...prev,
                        admitCard: {
                          ...prev.admitCard,
                          instructions: [
                            ...prev.admitCard.instructions,
                            "New rule or candidate examination guideline.",
                          ],
                        },
                      }));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Plus size={14} />
                    <span>Add Instruction</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {editableConfig.admitCard.instructions.map((inst, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl"
                    >
                      <span className="font-mono text-xs font-bold text-indigo-400 mt-2 px-1">
                        {idx + 1}.
                      </span>
                      <textarea
                        rows={2}
                        value={inst}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => {
                            const list = [...prev.admitCard.instructions];
                            list[idx] = val;
                            return {
                              ...prev,
                              admitCard: { ...prev.admitCard, instructions: list },
                            };
                          });
                        }}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateDraft((prev) => ({
                            ...prev,
                            admitCard: {
                              ...prev.admitCard,
                              instructions: prev.admitCard.instructions.filter(
                                (_, index) => index !== idx
                              ),
                            },
                          }));
                        }}
                        className="p-1 text-slate-500 hover:text-red-400 mt-2"
                        title="Delete Instruction"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: ANNOUNCEMENTS & MASTER CONTROLS                         */}
        {/* ============================================================== */}
        {activeTab === "announcements" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Global Announcement Banner */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">Global Announcement Ticker</h2>
                    <p className="text-xs text-slate-400">
                      Displays a persistent top ribbon banner across all pages of StudyFAM.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editableConfig.announcement.enabled}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        announcement: {
                          ...prev.announcement,
                          enabled: e.target.checked,
                        },
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Banner Badge Text
                  </label>
                  <input
                    type="text"
                    value={editableConfig.announcement.badge}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        announcement: { ...prev.announcement, badge: e.target.value },
                      }))
                    }
                    placeholder="ANNOUNCEMENT / URGENT"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Announcement Text
                  </label>
                  <input
                    type="text"
                    value={editableConfig.announcement.text}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        announcement: { ...prev.announcement, text: e.target.value },
                      }))
                    }
                    placeholder="Enter announcement message for aspirants"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    CTA Button Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={editableConfig.announcement.linkText || ""}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        announcement: { ...prev.announcement, linkText: e.target.value },
                      }))
                    }
                    placeholder="Register for ₹27 →"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                    CTA Button URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={editableConfig.announcement.linkUrl || ""}
                    onChange={(e) =>
                      updateDraft((prev) => ({
                        ...prev,
                        announcement: { ...prev.announcement, linkUrl: e.target.value },
                      }))
                    }
                    placeholder="#register or /dashboard"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Emergency & Maintenance Controls */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Database className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">System Health & Cache Diagnostics</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-xs text-white">Flush Local Browser Cache</div>
                  <p className="text-[11px] text-slate-400">
                    Purges stale localStorage configuration copies on this browser and re-fetches latest values from database.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        localStorage.removeItem("sf_site_config");
                        refreshConfig();
                        alert("Local configuration cache cleared.");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                  >
                    Clear Local Cache
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-xs text-white">Reset to Official Factory Defaults</div>
                  <p className="text-[11px] text-slate-400">
                    Reverts all headlines, scholarship parameters, and exam rules back to default factory baseline.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to reset all site configuration to defaults?")) {
                        setEditableConfig(JSON.parse(JSON.stringify(DEFAULT_SITE_CONFIG)));
                        setHasUnsavedChanges(true);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-xs font-semibold text-red-400"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
