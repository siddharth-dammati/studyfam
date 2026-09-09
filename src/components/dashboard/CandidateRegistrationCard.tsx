"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle, Calendar, Phone, Mail, Award, ShieldCheck, Sparkles, CreditCard, FileText, Printer, X, ExternalLink, HeartHandshake, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { PremiumAdmitCard } from "./PremiumAdmitCard";
import { ScholarshipDossierModal } from "./ScholarshipDossierModal";

export interface CandidateRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  jee_status: string;
  status: string;
  amount_paid: number;
  created_at: string;
  order_id?: string;
  payment_id?: string;
  payment_status?: string;
  payment_method?: string;
  roll_no?: string;
  referral_code?: string;
  gender?: "boy" | "girl" | "other" | string;
  family_income?: string;
  scholarship_track?: "merit" | "need_based" | "opt_out" | string;
  scholarship_slab?: string;
}

interface Props {
  registration: CandidateRecord | null;
  loading: boolean;
  onOpenRegister: () => void;
  onUpdateRegistration?: (updated: CandidateRecord) => void;
}

export function CandidateRegistrationCard({ registration, loading, onOpenRegister, onUpdateRegistration }: Props) {
  const [copied, setCopied] = useState(false);
  const [showAdmitSlipModal, setShowAdmitSlipModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 animate-pulse shadow-xs">
        <div className="h-6 bg-slate-200 rounded-lg w-1/3 mb-4" />
        <div className="h-4 bg-slate-100 rounded-lg w-1/2 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="h-16 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Candidate is registered
  if (registration) {
    const isConfirmed =
      registration.amount_paid >= 27 ||
      registration.status === "registered" ||
      registration.status === "confirmed" ||
      registration.payment_status === "success" ||
      Boolean(registration.order_id) ||
      Boolean(registration.payment_id);

    const streamLabel =
      registration.jee_status === "class-11"
        ? "Class 11 Aspirant"
        : registration.jee_status === "class-12"
        ? "Class 12 Aspirant"
        : "JEE Dropper / Repeater";

    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
            isConfirmed
              ? "from-emerald-500 via-indigo-500 to-indigo-600"
              : "from-amber-400 via-amber-500 to-indigo-500"
          }`}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isConfirmed
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {isConfirmed ? "Registration Confirmed" : "Waitlist Active"}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {isConfirmed ? `₹${registration.amount_paid || 27} Paid` : "₹0 Paid"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {registration.full_name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate Enrolled · {streamLabel}
            </p>
          </div>

          {/* Reference ID Pill */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between sm:justify-start gap-3">
            <div>
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">
                Candidate Ref ID
              </div>
              <div className="font-mono text-xs font-semibold text-slate-900 select-all">
                {registration.id.slice(0, 18)}...
              </div>
            </div>
            <button
              onClick={() => handleCopy(registration.id)}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-2xs border border-transparent hover:border-slate-200"
              title="Copy Full Reference ID"
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Candidate Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1 flex items-center gap-1">
              <Mail size={12} /> Registered Email
            </div>
            <div className="font-semibold text-slate-900 truncate" title={registration.email}>
              {registration.email}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1 flex items-center gap-1">
              <Phone size={12} /> WhatsApp / Phone
            </div>
            <div className="font-semibold text-slate-900">
              {registration.phone}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1 flex items-center gap-1">
              <Award size={12} /> Target Batch
            </div>
            <div className="font-semibold text-slate-900">
              {streamLabel}
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div className="text-slate-400 text-[10px] font-mono uppercase mb-1 flex items-center gap-1">
              <Calendar size={12} /> Exam Date
            </div>
            <div className="font-semibold text-slate-900">
              27 Dec 2026 · 9:00 AM
            </div>
          </div>
        </div>

        {/* Scholarship Dossier Bar / Action Banner */}
        {registration.gender && registration.family_income && registration.scholarship_track ? (
          <div className="mt-4 p-3 bg-slate-50/80 border border-slate-200/90 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
              <span>Gender: <strong className="text-slate-900">{registration.gender === "boy" ? "👦 Boy (Male)" : registration.gender === "girl" ? "👧 Girl (Female)" : "⚪ Other"}</strong></span>
              <span>Income: <strong className="text-slate-900 font-mono">{registration.family_income === "below_1.5l" ? "< ₹1.5L" : registration.family_income === "1.5l_3l" ? "₹1.5L–3L" : registration.family_income === "3l_6l" ? "₹3L–6L" : registration.family_income === "6l_8l" ? "₹6L–8L" : "> ₹8L"}</strong></span>
              <span>Track: <strong className="text-indigo-700 font-bold">{registration.scholarship_track === "opt_out" ? "💖 Opted Out (Donated Slot)" : registration.scholarship_track === "need_based" ? "❤️ Need-Based Support" : "🏆 Merit Track"}</strong></span>
            </div>
            <button
              onClick={() => setShowDossierModal(true)}
              className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold px-2.5 py-1 rounded-lg hover:bg-white transition-all shadow-2xs border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <Edit3 size={12} />
              <span>Edit Dossier</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="font-bold text-indigo-950 text-xs">Action Required: Complete Your Scholarship Dossier</div>
                <p className="text-slate-600 mt-0.5 text-[11px]">
                  Specify your gender, family income, and scholarship track to be placed in the Merit or Need-Based pool (slots scale dynamically with total registrations).
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDossierModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              Complete Dossier →
            </button>
          </div>
        )}

        {/* Payment Confirmation Banner & Action Toolbar */}
        {isConfirmed ? (
          <div className="mt-5 space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                  <span>Payment Verified · Official CBT Seat Guaranteed</span>
                </div>
                <p className="text-emerald-800 leading-relaxed text-xs">
                  Your seat for the All-India Mock on <strong>27 Dec 2026 (9:00 AM – 12:00 PM IST)</strong> is locked. Admit card and test portal access credentials will be delivered to your WhatsApp (<strong>{registration.phone}</strong>) 24 hours prior.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-emerald-900">
                  {registration.order_id && (
                    <span>Order: <strong>{registration.order_id}</strong></span>
                  )}
                  {registration.payment_id && (
                    <span>Payment ID: <strong>{registration.payment_id}</strong></span>
                  )}
                  <span>Gateway: <strong>Cashfree Production (₹27.00)</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowAdmitSlipModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
                  title="View Official E-Admit Card & Candidate Slip"
                >
                  <FileText size={15} />
                  <span>View Official Admit Slip</span>
                </button>
                <Link
                  href={`/admit-card?order_id=${encodeURIComponent(registration.order_id || registration.payment_id || registration.id)}`}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold text-xs transition-colors shadow-2xs"
                  title="Open Dedicated Printable Hall Ticket"
                >
                  <Printer size={14} />
                  <span>Print PDF</span>
                  <ExternalLink size={12} className="opacity-60" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Sparkles size={15} className="text-amber-600 shrink-0" />
                <span>Mock Registrations are Open!</span>
              </div>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                You are on the waitlist. Pay <strong>₹27</strong> to lock your official All-India CBT seat and compete for the ₹5,000+ fee scholarship pool.
              </p>
            </div>
            <Button size="sm" onClick={onOpenRegister} className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
              Complete Registration — ₹27
            </Button>
          </div>
        )}

        {/* Fullscreen Admit Card Modal */}
        {showAdmitSlipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-4xl my-auto">
              <button
                onClick={() => setShowAdmitSlipModal(false)}
                className="print:hidden absolute -top-3 -right-2 sm:-right-4 w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center shadow-lg border border-white/20 transition-all z-20 cursor-pointer"
                title="Close Modal"
              >
                <X size={18} />
              </button>
              <div className="max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-100/95 p-2 sm:p-4 shadow-2xl">
                <PremiumAdmitCard
                  registration={registration}
                  onClose={() => setShowAdmitSlipModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Scholarship Dossier Modal */}
        {showDossierModal && (
          <ScholarshipDossierModal
            isOpen={showDossierModal}
            onClose={() => setShowDossierModal(false)}
            candidateRecord={registration}
            onSuccess={(updated) => {
              if (onUpdateRegistration) onUpdateRegistration(updated);
              setShowDossierModal(false);
            }}
          />
        )}
      </div>
    );
  }

  // Not yet registered
  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/40 border border-indigo-100 rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold mb-3">
          <AlertCircle size={14} />
          <span>Registration Pending</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Reserve Your All-India Mock Spot
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          You are signed in with Google, but have not yet completed candidate enrollment. Enter your mobile number and JEE target stream to lock in your spot for <strong>₹27</strong>.
        </p>
        <Button size="lg" onClick={onOpenRegister}>
          Complete Registration — ₹27
        </Button>
      </div>
    </div>
  );
}

