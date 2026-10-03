"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CandidateRegistrationCard, CandidateRecord } from "@/components/dashboard/CandidateRegistrationCard";
import { MockCountdownCard } from "@/components/dashboard/MockCountdownCard";
import { MeritPoolStatusCard } from "@/components/dashboard/MeritPoolStatusCard";
import { InviteAndShareCard } from "@/components/dashboard/InviteAndShareCard";
import { RegistrationModal } from "@/components/ui/RegistrationModal";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";
import { Footer } from "@/components/sections/Footer";
import { useRegistrationState } from "@/hooks/useRegistrationState";
import {
  HelpCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
  Loader2,
  Trophy,
  Activity,
  UserCheck,
  CheckCircle2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { verifyCashfreeOrder } from "@/services/paymentService";
import { hydrateCandidateRecord } from "@/lib/candidateUtils";

import { ScholarshipDossierModal } from "@/components/dashboard/ScholarshipDossierModal";
import { MockPerformanceCard, MockAttemptRecord } from "@/components/dashboard/MockPerformanceCard";
import { AllIndiaMockUpdatesCard } from "@/components/dashboard/AllIndiaMockUpdatesCard";

export default function DashboardPage() {
  const { profile, loading: authLoading } = useAuth();
  const { isOpen } = useRegistrationState();
  const [candidateRecord, setCandidateRecord] = useState<CandidateRecord | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [attempts, setAttempts] = useState<MockAttemptRecord[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [activeTab, setActiveTab] = useState<"all-india" | "practice" | "profile">("all-india");
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [dossierPrompted, setDossierPrompted] = useState(false);
  const [isJustConfirmed, setIsJustConfirmed] = useState(false);

  const fetchCandidateRecord = async (targetOrderId?: string | null) => {
    try {
      const supabase = createClient();
      let query = supabase.from("registrations").select("*");

      if (profile?.email) {
        query = query.eq("email", profile.email.toLowerCase().trim()).order("created_at", { ascending: false });
      } else if (targetOrderId) {
        query = query.eq("referral_code", targetOrderId);
      } else {
        setCandidateRecord(null);
        setLoadingData(false);
        return;
      }

      const { data, error } = await query.limit(1);

      if (!error && data && data.length > 0) {
        let cachedFallback: any = null;
        try {
          const cachedRaw = localStorage.getItem("sf_candidate_record");
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw);
            if (parsed && parsed.email?.toLowerCase() === data[0].email?.toLowerCase()) {
              cachedFallback = parsed;
            }
          }
        } catch {}

        const rec = hydrateCandidateRecord(data[0], cachedFallback);
        const storedOrderId = typeof window !== "undefined" ? localStorage.getItem("sf_confirmed_order_id") : null;
        if (storedOrderId === rec.order_id || rec.amount_paid >= 27) {
          rec.status = "confirmed";
          rec.amount_paid = 27;
        }
        setCandidateRecord(rec);
        try {
          localStorage.setItem("sf_candidate_record", JSON.stringify(rec));
        } catch {}
      } else {
        // No record in DB for this authenticated user
        setCandidateRecord(null);
        try {
          const cachedRaw = localStorage.getItem("sf_candidate_record");
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw);
            if (!profile?.email || parsed?.email?.toLowerCase() === profile.email.toLowerCase()) {
              localStorage.removeItem("sf_candidate_record");
              localStorage.removeItem("sf_confirmed_order_id");
            }
          }
        } catch {}
      }
    } catch {
      // Keep any already cached record if network failed
    } finally {
      setLoadingData(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      setLoadingAttempts(true);
      let localAttempts: MockAttemptRecord[] = [];
      try {
        const cachedRaw = localStorage.getItem("sf_recent_attempts");
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (Array.isArray(parsed)) {
            localAttempts = parsed;
          }
        }
      } catch {}

      let remoteAttempts: MockAttemptRecord[] = [];
      const currentEmail = profile?.email?.toLowerCase().trim();
      if (currentEmail) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("exam_attempts")
          .select("*")
          .eq("email", currentEmail)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const dedupedData: any[] = [];
          for (const d of data) {
            const dTime = new Date(d.created_at || 0).getTime();
            const isDup = dedupedData.some(
              (prev) =>
                prev.test_id === d.test_id &&
                prev.score === d.score &&
                Math.abs(new Date(prev.created_at || 0).getTime() - dTime) < 180000
            );
            if (!isDup) {
              dedupedData.push(d);
            }
          }

          remoteAttempts = dedupedData.map((d: any) => ({
            id: String(d.id || `${d.test_id}_${d.created_at}`),
            testId: d.test_id || "MFT-1.pdf",
            testTitle: d.test_id?.startsWith("MFT-")
              ? `Major Full Test ${d.test_id.match(/MFT-(\d+)/)?.[1] || ""}`
              : d.test_id?.replace(/_/g, " ") || "JEE Main Mock Test",
            score: Number(d.score ?? 0),
            maxScore: Number(d.max_score || 300),
            percentage: Number(d.percentage || 0),
            accuracy: Number(d.accuracy || 0),
            totalQuestions: Number(d.total_questions || 75),
            attemptedCount: Number(d.attempted_count || 0),
            correctCount: Number(d.correct_count || 0),
            incorrectCount: Number(d.incorrect_count || 0),
            timeSpentSeconds: Number(d.time_spent_seconds || 0),
            sectionBreakdown: d.section_breakdown || [],
            questionTimes: d.question_times || {},
            createdAt: d.created_at || new Date().toISOString(),
          }));
        }
      }

      // Clean and deduplicate localAttempts
      const cleanedLocal: MockAttemptRecord[] = [];
      for (const loc of localAttempts) {
        const locTime = new Date(loc.createdAt || 0).getTime();
        const isDup = cleanedLocal.some(
          (prev) =>
            prev.id === loc.id ||
            (prev.testId === loc.testId &&
              prev.score === loc.score &&
              Math.abs(new Date(prev.createdAt || 0).getTime() - locTime) < 180000)
        );
        if (!isDup) cleanedLocal.push(loc);
      }
      try {
        localStorage.setItem("sf_recent_attempts", JSON.stringify(cleanedLocal));
      } catch {}

      // Merge remote and local attempts
      const combined = [...remoteAttempts];
      for (const loc of cleanedLocal) {
        const isDuplicate = combined.some(
          (rem) =>
            rem.id === loc.id ||
            (rem.testId === loc.testId &&
              Math.abs(new Date(rem.createdAt).getTime() - new Date(loc.createdAt).getTime()) < 180000)
        );
        if (!isDuplicate) {
          combined.push(loc);
        }
      }

      combined.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAttempts(combined);
    } catch (err) {
      console.warn("Failed to load student mock attempts:", err);
    } finally {
      setLoadingAttempts(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    fetchAttempts();

    const currentEmail = profile?.email?.toLowerCase().trim();

    // 1. Instantly populate from local cached record ONLY if it matches the current user
    try {
      const cached = localStorage.getItem("sf_candidate_record");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (currentEmail) {
          if (parsed && parsed.email?.toLowerCase() === currentEmail) {
            const hydrated = hydrateCandidateRecord(parsed);
            setCandidateRecord(hydrated);
            setLoadingData(false);
          } else {
            // Stale cache from a different account! Discard immediately
            setCandidateRecord(null);
            localStorage.removeItem("sf_candidate_record");
            localStorage.removeItem("sf_confirmed_order_id");
          }
        } else if (!authLoading) {
          // Guest mode
          if (parsed && (parsed.status === "confirmed" || parsed.status === "registered" || parsed.order_id || parsed.amount_paid >= 27)) {
            const hydrated = hydrateCandidateRecord(parsed);
            setCandidateRecord(hydrated);
            setLoadingData(false);
          }
        }
      } else if (currentEmail) {
        setCandidateRecord(null);
      }
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get("order_id");

    // ONLY verify order if order_id is explicitly passed in URL query param (e.g. redirected from Cashfree checkout)
    if (orderIdParam) {
      setIsJustConfirmed(true);

      verifyCashfreeOrder(orderIdParam).then((res) => {
        if (res.registration) {
          const hydrated = hydrateCandidateRecord(res.registration);
          if (!currentEmail || hydrated.email?.toLowerCase() === currentEmail) {
            setCandidateRecord(hydrated);
            setLoadingData(false);
            try {
              localStorage.setItem("sf_confirmed_order_id", orderIdParam);
              localStorage.setItem("sf_candidate_record", JSON.stringify(hydrated));
            } catch {}
          }
        } else {
          fetchCandidateRecord(orderIdParam);
        }
      }).catch(() => {
        fetchCandidateRecord(orderIdParam);
      });
    } else if (!authLoading) {
      fetchCandidateRecord();
    }
  }, [profile?.email, authLoading]);

  // 2. Automatically prompt for missing scholarship dossier if user has candidate record
  useEffect(() => {
    if (loadingData || authLoading || dossierPrompted) return;

    if (candidateRecord) {
      const isMissingDossier =
        !candidateRecord.gender ||
        !candidateRecord.family_income ||
        !candidateRecord.scholarship_track;

      const dismissalKey = `sf_dossier_dismissed_${candidateRecord.email || candidateRecord.order_id}`;
      const wasDismissed = typeof window !== "undefined" && sessionStorage.getItem(dismissalKey) === "true";

      if (isMissingDossier && !wasDismissed) {
        setIsDossierModalOpen(true);
        setDossierPrompted(true);
      }
    }
  }, [candidateRecord, loadingData, authLoading, dossierPrompted]);

  // 1. Loading state
  if (authLoading && loadingData) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-radial from-[#d6aef2]/20 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-radial from-[#2f8fff]/15 to-transparent blur-3xl pointer-events-none -z-10" />
        
        <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-100 border-t-[#1a5fe0] animate-spin" />
          <div className="w-14 h-14 bg-white rounded-2xl shadow-[0_12px_28px_-8px_rgba(10,28,150,0.15)] border border-[rgba(26,26,26,0.08)] flex items-center justify-center p-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-512.png" alt="StudyFAM" className="w-full h-full object-contain animate-pulse" />
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight">
          Loading Candidate Dashboard...
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-mono">
          Verifying All-India Mock credentials
        </p>
      </div>
    );
  }

  // 2. Not signed in and no order verified
  if (!profile && !candidateRecord && !loadingData) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col relative overflow-hidden selection:bg-[#1a5fe0] selection:text-white">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#d6aef2]/20 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-radial from-[#2f8fff]/15 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(26,26,26,0.035)_1.2px,transparent_1.8px)] [background-size:24px_24px] pointer-events-none -z-10" />

        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
          <div className="max-w-md w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] p-8 sm:p-10 text-center shadow-[0_25px_60px_-20px_rgba(10,28,150,0.12)]">
            <div className="w-14 h-14 bg-gradient-to-br from-[#0a1c96] to-[#1f6ff2] text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_12px_24px_-8px_rgba(26,95,224,0.45)]">
              <Sparkles size={26} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f3e9fd] border border-[#d6aef2]/70 rounded-full text-xs text-[#7c3aed] font-semibold mb-3">
              <span>Candidate Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">
              Sign In to Dashboard
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Access your All-India Mock enrollment status, official candidate reference slip, and live merit pool leaderboard.
            </p>

            <div className="flex justify-center w-full mb-5">
              <GoogleSignInButton text="signin_with" size="large" shape="pill" width={320} />
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Only verified candidate accounts can access the examination console.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = profile?.fullName || candidateRecord?.full_name || "Candidate";
  const firstName = displayName.split(" ")[0];

  const isConfirmed = Boolean(
    (candidateRecord?.amount_paid && candidateRecord.amount_paid >= 27) ||
    candidateRecord?.status === "confirmed" ||
    candidateRecord?.status === "registered"
  );

  const rollNumber = candidateRecord?.order_id
    ? `SF-${candidateRecord.order_id.slice(-6).toUpperCase()}`
    : candidateRecord?.id
    ? `SF-${candidateRecord.id.slice(0, 6).toUpperCase()}`
    : "SF-CANDIDATE";

  const highestScore = attempts.reduce((max, a) => Math.max(max, a.score), 0);

  // 3. Authenticated or order-verified state
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] flex flex-col relative overflow-hidden selection:bg-[#1a5fe0] selection:text-white">
      {/* Tokko Ambient Glow Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#d6aef2]/18 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-40 w-[520px] h-[520px] rounded-full bg-radial from-[#2f8fff]/12 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(26,26,26,0.035)_1.2px,transparent_1.8px)] [background-size:24px_24px] pointer-events-none -z-10" />

      <DashboardHeader />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Success Alert Banner after payment */}
        {isJustConfirmed && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0a1c96] via-[#1a5fe0] to-[#16a34a] rounded-[24px] text-white shadow-[0_16px_36px_-12px_rgba(26,95,224,0.5)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">Payment Verified · All-India Mock Seat Confirmed!</h4>
                <p className="text-xs text-blue-100 mt-0.5">Your official registration for 27 Dec 2026 is confirmed. Your reference slip is below.</p>
              </div>
            </div>
            <button
              onClick={() => setIsJustConfirmed(false)}
              className="text-white/90 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-all shrink-0 cursor-pointer active:scale-95"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Welcome greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-[rgba(26,26,26,0.08)] rounded-full px-3.5 py-1 text-xs font-semibold shadow-2xs mb-2">
              <span className="w-2 h-2 rounded-full bg-[#1a5fe0] animate-pulse" />
              <span className="text-slate-600">Candidate Command Hub</span>
              <span className="text-slate-300">·</span>
              <span className="text-[#0a1c96] font-mono font-bold">JEE Main 2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your centralized StudyFam portal for the 27 Dec 2026 National Mock &amp; 10 MFT practice tests.
            </p>
          </div>
          {!profile && candidateRecord && (
            <div className="flex items-center gap-2 self-start sm:self-center">
              <GoogleSignInButton text="signin_with" size="medium" shape="pill" width={220} />
            </div>
          )}
        </div>

        {/* Top Quick-Status Ribbon - Tokko Bento Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 bg-white border border-[rgba(26,26,26,0.08)] rounded-[22px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_36px_-15px_rgba(10,28,150,0.08)] hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#dcfce7] text-[#16a34a] border border-[#86efac]/80 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Mock Status</div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {isConfirmed ? "Seat Locked" : "Registered"} · 27 Dec
              </div>
              <div className="text-[11px] text-emerald-600 font-medium truncate">
                {isConfirmed ? "Official Slot Confirmed" : "Pre-Registered"}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[rgba(26,26,26,0.08)] rounded-[22px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_36px_-15px_rgba(10,28,150,0.08)] hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#f3e9fd] text-[#7c3aed] border border-[#d6aef2]/70 flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Candidate Roll</div>
              <div className="text-sm font-bold font-mono text-slate-900 truncate">
                {rollNumber}
              </div>
              <div className="text-[11px] text-[#7c3aed] font-medium truncate">
                Shift 1 (09:00 AM IST)
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[rgba(26,26,26,0.08)] rounded-[22px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_36px_-15px_rgba(10,28,150,0.08)] hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#e9f1fd] text-[#1a5fe0] border border-[#1a5fe0]/20 flex items-center justify-center shrink-0">
              <Activity size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Mocks Practiced</div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {attempts.length > 0 ? `${attempts.length} Attempted` : "10 Tests Ready"}
              </div>
              <div className="text-[11px] text-[#1a5fe0] font-medium truncate">
                MFT Series (75 Qs CBT)
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[rgba(26,26,26,0.08)] rounded-[22px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_36px_-15px_rgba(10,28,150,0.08)] hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
              <Trophy size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Best Score</div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {highestScore > 0 ? `${highestScore} / 300` : "No attempts yet"}
              </div>
              <div className="text-[11px] text-amber-600 font-medium truncate">
                {highestScore > 0 ? "Verified Simulation" : "Target: 200+ for 99%ile"}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Main Hubs Navigation Selector - Tokko Floating Dock */}
        <div className="bg-white/90 backdrop-blur-md border border-[rgba(26,26,26,0.09)] shadow-[0_10px_30px_-12px_rgba(10,28,150,0.08)] rounded-full p-1.5 inline-flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("all-india")}
            className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
              activeTab === "all-india"
                ? "bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] text-white shadow-[0_8px_20px_-6px_rgba(26,95,224,0.5)]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <Trophy size={15} className={activeTab === "all-india" ? "text-amber-300" : "text-slate-400"} />
            <span>All-India Mock (Dec 27)</span>
            <span className={`hidden sm:inline text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${
              activeTab === "all-india" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}>
              Official
            </span>
          </button>

          <button
            onClick={() => setActiveTab("practice")}
            className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
              activeTab === "practice"
                ? "bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] text-white shadow-[0_8px_20px_-6px_rgba(26,95,224,0.5)]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <Activity size={15} className={activeTab === "practice" ? "text-white" : "text-slate-400"} />
            <span>My Practice &amp; Scores</span>
            {attempts.length > 0 && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === "practice" ? "bg-emerald-400 text-emerald-950" : "bg-emerald-100 text-emerald-800"
              }`}>
                {attempts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-[#0a1c96] to-[#1f6ff2] text-white shadow-[0_8px_20px_-6px_rgba(26,95,224,0.5)]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <UserCheck size={15} className={activeTab === "profile" ? "text-white" : "text-slate-400"} />
            <span>Profile &amp; Slip</span>
          </button>
        </div>

        {/* Tab 1: All-India Mock Test 2026 Event Hub */}
        {activeTab === "all-india" && (
          <div className="space-y-6">
            <AllIndiaMockUpdatesCard
              candidateRecord={candidateRecord}
              onSwitchToPractice={() => setActiveTab("practice")}
            />
            <MeritPoolStatusCard />
          </div>
        )}

        {/* Tab 2: Student Practice, MFT Test Launcher & Recent Attempts */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            <MockPerformanceCard attempts={attempts} loading={loadingAttempts} />
          </div>
        )}

        {/* Tab 3: Candidate Registration, Slip, Dossier & Support */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <CandidateRegistrationCard
              registration={candidateRecord}
              loading={loadingData}
              onOpenRegister={() => setIsRegModalOpen(true)}
              onUpdateRegistration={(updated) => setCandidateRecord(updated)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InviteAndShareCard />
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-[32px] p-6 sm:p-7 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3e9fd] text-[#7c3aed] border border-[#d6aef2]/60 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                    <BookOpen size={13} />
                    <span>Candidate Resources</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1a1a1a] tracking-tight mb-2">
                    Questions or Assistance?
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Need help with browser compatibility, receipt re-issues, or scholarship criteria?
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-[rgba(26,26,26,0.08)]">
                  <Link
                    href="/scholarship-rules"
                    className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-[#0a1c96] px-3.5 py-2.5 rounded-full bg-[#fafafa] hover:bg-white border border-[rgba(26,26,26,0.06)] hover:border-[#1a5fe0]/30 transition-all shadow-2xs"
                  >
                    <span>Scholarship &amp; Payout Rules</span>
                    <ExternalLink size={13} />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-[#0a1c96] px-3.5 py-2.5 rounded-full bg-[#fafafa] hover:bg-white border border-[rgba(26,26,26,0.06)] hover:border-[#1a5fe0]/30 transition-all shadow-2xs"
                  >
                    <span>Helpdesk &amp; Grievance Desk</span>
                    <HelpCircle size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => {
          setIsRegModalOpen(false);
          fetchCandidateRecord();
        }}
        isMockOpen={isOpen}
      />

      <ScholarshipDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => {
          setIsDossierModalOpen(false);
          if (candidateRecord) {
            try {
              sessionStorage.setItem(`sf_dossier_dismissed_${candidateRecord.email || candidateRecord.order_id}`, "true");
            } catch {}
          }
        }}
        candidateRecord={candidateRecord}
        userEmail={profile?.email}
        userFullName={profile?.fullName}
        onSuccess={(updated) => {
          const hydrated = hydrateCandidateRecord(updated);
          setCandidateRecord(hydrated);
          setIsDossierModalOpen(false);
          setDossierPrompted(true);
          try {
            localStorage.setItem("sf_candidate_record", JSON.stringify(hydrated));
            sessionStorage.setItem(`sf_dossier_dismissed_${hydrated.email || hydrated.order_id}`, "true");
          } catch {}
        }}
      />
    </div>
  );
}
