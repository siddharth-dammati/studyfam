"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { verifyCashfreeOrder } from "@/services/paymentService";
import { CandidateRecord } from "@/components/dashboard/CandidateRegistrationCard";
import { hydrateCandidateRecord } from "@/lib/candidateUtils";
import { PremiumAdmitCard } from "@/components/dashboard/PremiumAdmitCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Footer } from "@/components/sections/Footer";
import { Search, Loader2, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function AdmitCardContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("order_id");
  const { profile, loading: authLoading } = useAuth();

  const [candidate, setCandidate] = useState<CandidateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  // 1. Automatic lookup from searchParams, local cache, or logged-in profile
  useEffect(() => {
    let isMounted = true;

    async function loadRecord() {
      setLoading(true);
      setErrorMsg("");

      try {
        // A. If order_id param is provided
        if (orderIdParam) {
          try {
            const res = await verifyCashfreeOrder(orderIdParam);
            if (res.registration && isMounted) {
              setCandidate(hydrateCandidateRecord(res.registration));
              setLoading(false);
              return;
            }
          } catch {}

          // Fallback Supabase query with orderIdParam
          const supabase = createClient();
          const { data } = await supabase
            .from("registrations")
            .select("*")
            .or(`referral_code.eq.${orderIdParam},id.eq.${orderIdParam}`)
            .limit(1);

          if (data && data.length > 0 && isMounted) {
            setCandidate(hydrateCandidateRecord(data[0]));
            setLoading(false);
            return;
          }
        }

        // B. Check localStorage for active session
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("sf_candidate_record");
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (parsed && (parsed.status === "confirmed" || parsed.status === "registered" || parsed.order_id || parsed.amount_paid >= 27)) {
                if (isMounted) {
                  setCandidate(hydrateCandidateRecord(parsed));
                  setLoading(false);
                  return;
                }
              }
            } catch {}
          }
        }

        // C. If user is signed in with email
        if (profile?.email) {
          const supabase = createClient();
          const { data } = await supabase
            .from("registrations")
            .select("*")
            .eq("email", profile.email.toLowerCase().trim())
            .order("created_at", { ascending: false })
            .limit(1);

          if (data && data.length > 0 && isMounted) {
            const rec = hydrateCandidateRecord(data[0]);
            if (rec.amount_paid >= 27 || rec.status === "confirmed" || rec.status === "registered") {
              setCandidate(rec);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err: any) {
        console.error("Failed to load admit card:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!authLoading) {
      loadRecord();
    }

    return () => {
      isMounted = false;
    };
  }, [orderIdParam, profile?.email, authLoading]);

  // Manual Candidate Lookup (Phone / Order ID / Email)
  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setErrorMsg("");

    try {
      const q = searchQuery.trim();
      const supabase = createClient();

      // Check by Phone or Email or ID or Order ID
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .or(`phone.eq.${q},email.eq.${q.toLowerCase()},id.eq.${q},referral_code.eq.${q}`)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) {
        // Try verifying directly with Cashfree if it looks like an order ID
        if (q.startsWith("SF_") || q.startsWith("order_")) {
          const cfRes = await verifyCashfreeOrder(q);
          if (cfRes.registration) {
            setCandidate(hydrateCandidateRecord(cfRes.registration));
            return;
          }
        }
        setErrorMsg("No confirmed registration found matching this Mobile Number or Order Reference. Please verify and try again.");
      } else {
        setCandidate(hydrateCandidateRecord(data[0]));
      }
    } catch (err) {
      setErrorMsg("Unable to retrieve candidate record. Please check your network and try again.");
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8">
        <Loader2 className="w-9 h-9 text-indigo-600 animate-spin" />
        <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">
          Retrieving Official Examination Slip...
        </p>
      </div>
    );
  }

  // If candidate is confirmed, render the full premium admit card
  if (candidate) {
    return (
      <div className="max-w-[920px] mx-auto px-4 py-6 sm:py-10">
        <PremiumAdmitCard registration={candidate} isStandalone={true} />
      </div>
    );
  }

  // If not found, show candidate retrieval console
  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-lg text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <Sparkles size={28} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Candidate Admit Card Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          Enter your registered <strong>10-digit Mobile Number</strong> or <strong>Cashfree Order ID</strong> to instantly retrieve, preview, and print your official E-Admit Slip.
        </p>

        <form onSubmit={handleManualSearch} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5">
              Mobile Number or Order ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. 9876543210 or SF_1741..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                required
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={searching}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {searching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching Examination Records...</span>
              </>
            ) : (
              <span>Retrieve Admit Card →</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-indigo-600 font-semibold transition-colors">
            ← Return to Dashboard
          </Link>
          <Link href="/contact" className="hover:text-indigo-600 transition-colors">
            Need Help? Contact Examination Desk
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdmitCardPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col">
      <div className="print:hidden">
        <DashboardHeader />
      </div>

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          }
        >
          <AdmitCardContent />
        </Suspense>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
