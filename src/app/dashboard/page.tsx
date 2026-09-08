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
import { HelpCircle, ExternalLink, BookOpen, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { verifyCashfreeOrder } from "@/services/paymentService";
import { hydrateCandidateRecord } from "@/lib/candidateUtils";

import { ScholarshipDossierModal } from "@/components/dashboard/ScholarshipDossierModal";

export default function DashboardPage() {
  const { profile, loading: authLoading } = useAuth();
  const { isOpen } = useRegistrationState();
  const [candidateRecord, setCandidateRecord] = useState<CandidateRecord | null>(null);
  const [loadingData, setLoadingData] = useState(true);
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
        setLoadingData(false);
        return;
      }

      const { data, error } = await query.limit(1);

      if (!error && data && data.length > 0) {
        let cachedFallback: any = null;
        try {
          const cachedRaw = localStorage.getItem("sf_candidate_record");
          if (cachedRaw) cachedFallback = JSON.parse(cachedRaw);
        } catch {}

        const rec = hydrateCandidateRecord(data[0], cachedFallback);
        const storedOrderId = typeof window !== "undefined" ? localStorage.getItem("sf_confirmed_order_id") : null;
        if (storedOrderId || rec.amount_paid >= 27) {
          rec.status = "confirmed";
          rec.amount_paid = 27;
        }
        setCandidateRecord(rec);
        try {
          localStorage.setItem("sf_candidate_record", JSON.stringify(rec));
        } catch {}
      }
    } catch {
      // Keep any already cached record
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Instantly populate from local cached record if available
    try {
      const cached = localStorage.getItem("sf_candidate_record");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && (parsed.status === "confirmed" || parsed.status === "registered" || parsed.order_id || parsed.amount_paid >= 27)) {
          const hydrated = hydrateCandidateRecord(parsed);
          setCandidateRecord(hydrated);
          setLoadingData(false);
        }
      }
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get("order_id");
    const storedOrderId = !orderIdParam ? localStorage.getItem("sf_confirmed_order_id") : null;
    const activeOrderId = orderIdParam || storedOrderId;

    if (activeOrderId) {
      if (orderIdParam) setIsJustConfirmed(true);

      verifyCashfreeOrder(activeOrderId).then((res) => {
        if (res.registration) {
          const hydrated = hydrateCandidateRecord(res.registration);
          setCandidateRecord(hydrated);
          setLoadingData(false);
          try {
            localStorage.setItem("sf_confirmed_order_id", activeOrderId);
            localStorage.setItem("sf_candidate_record", JSON.stringify(hydrated));
          } catch {}
        } else {
          fetchCandidateRecord(activeOrderId);
        }
      }).catch(() => {
        fetchCandidateRecord(activeOrderId);
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
              className="text-white/80 hover:text-white text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0"
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
              Your official StudyFam candidate portal for the All-India JEE Main 2027 Mock.
            </p>
          </div>
          {!profile && candidateRecord && (
            <div className="flex items-center gap-2">
              <GoogleSignInButton text="signin_with" size="medium" shape="pill" width={220} />
            </div>
          )}
        </div>

        {/* Candidate Registration Card */}
        <CandidateRegistrationCard
          registration={candidateRecord}
          loading={loadingData}
          onOpenRegister={() => setIsRegModalOpen(true)}
          onUpdateRegistration={(updated) => setCandidateRecord(updated)}
        />

        {/* 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MockCountdownCard />
          <MeritPoolStatusCard />
        </div>

        {/* Invite & Syllabus Links */}
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
                <span>Scholarship & Payout Rules</span>
                <ExternalLink size={14} />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-indigo-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span>Helpdesk & Grievance Desk</span>
                <HelpCircle size={14} />
              </Link>
            </div>
          </div>
        </div>
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
