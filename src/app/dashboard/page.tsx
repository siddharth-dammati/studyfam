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
          remoteAttempts = data.map((d: any) => ({
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
            createdAt: d.created_at || new Date().toISOString(),
          }));
        }
      }

      // Merge remote and local attempts
      const combined = [...remoteAttempts];
      for (const loc of localAttempts) {
        const isDuplicate = combined.some(
          (rem) =>
            rem.testId === loc.testId &&
            Math.abs(new Date(rem.createdAt).getTime() - new Date(loc.createdAt).getTime()) < 180000
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Loading Candidate Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // 2. Not signed in and no order verified
  if (!profile && !candidateRecord && !loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-[28px] p-8 text-center shadow-lg">
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Sparkles size={28} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Candidate Dashboard
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Sign in with your Google account to access your official All-India Mock enrollment status, candidate reference slip, and live scholarship standings.
            </p>

            <div className="flex justify-center w-full mb-4">
              <GoogleSignInButton text="signin_with" size="large" shape="rectangular" width={320} />
            </div>

            <p className="text-[11px] text-slate-400">
              Only verified candidates can access the examination console.
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
    <div className="min-h-screen bg-slate-50/70 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 max-w-[1140px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Success Alert Banner after payment */}
        {isJustConfirmed && (
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 rounded-2xl text-white shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">Payment Verified · All-India Mock Seat Confirmed!</h4>
                <p className="text-xs text-emerald-100 mt-0.5">Your official registration for 27 Dec 2026 is confirmed. Your reference slip is below.</p>
              </div>
            </div>
            <button
              onClick={() => setIsJustConfirmed(false)}
              className="text-white/80 hover:text-white text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Welcome greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your centralized StudyFam portal for the All-India JEE Main 2027 Mock.
            </p>
          </div>
          {!profile && candidateRecord && (
            <div className="flex items-center gap-2">
              <GoogleSignInButton text="signin_with" size="medium" shape="pill" width={220} />
            </div>
          )}
        </div>

        {/* Top Quick-Status Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl flex items-center gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase text-slate-400">Mock Status</div>
              <div className="text-xs font-bold text-slate-900 truncate">
                {isConfirmed ? "Seat Locked" : "Registered"} · 27 Dec
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl flex items-center gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase text-slate-400">Candidate Roll</div>
              <div className="text-xs font-bold font-mono text-slate-900 truncate">
                {rollNumber}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl flex items-center gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Activity size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase text-slate-400">Mocks Practiced</div>
              <div className="text-xs font-bold text-slate-900 truncate">
                {attempts.length > 0 ? `${attempts.length} Attempted` : "10 Tests Ready"}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl flex items-center gap-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Trophy size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase text-slate-400">Best Score</div>
              <div className="text-xs font-bold text-slate-900 truncate">
                {highestScore > 0 ? `${highestScore} / 300` : "No attempts yet"}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Main Hubs Navigation Selector */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("all-india")}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "all-india"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Trophy size={15} className={activeTab === "all-india" ? "text-indigo-600" : "text-slate-400"} />
            <span>All-India Mock (Dec 27)</span>
            <span className="hidden sm:inline text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
              Official Hub
            </span>
          </button>

          <button
            onClick={() => setActiveTab("practice")}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "practice"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Activity size={15} className={activeTab === "practice" ? "text-indigo-600" : "text-slate-400"} />
            <span>My Practice &amp; Scores</span>
            {attempts.length > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                {attempts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck size={15} className={activeTab === "profile" ? "text-indigo-600" : "text-slate-400"} />
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

              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                    <BookOpen size={14} className="text-indigo-600" />
                    <span>Candidate Resources</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight mb-2">
                    Questions or Assistance?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Need help with browser compatibility, receipt re-issues, or scholarship criteria?
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <Link
                    href="/scholarship-rules"
                    className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <span>Scholarship &amp; Payout Rules</span>
                    <ExternalLink size={14} />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <span>Helpdesk &amp; Grievance Desk</span>
                    <HelpCircle size={14} />
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
