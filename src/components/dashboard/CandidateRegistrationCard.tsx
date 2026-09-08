"use client";

import { useState } from "react";
import { Copy, Check, UserCheck, AlertCircle, Calendar, Hash, Phone, Mail, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface CandidateRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  jee_status: string;
  status: string;
  amount_paid: number;
  created_at: string;
}

interface Props {
  registration: CandidateRecord | null;
  loading: boolean;
  onOpenRegister: () => void;
}

export function CandidateRegistrationCard({ registration, loading, onOpenRegister }: Props) {
  const [copied, setCopied] = useState(false);

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
    const isConfirmed = registration.status === "registered" || registration.status === "confirmed";
    const streamLabel =
      registration.jee_status === "class-11"
        ? "Class 11 Aspirant"
        : registration.jee_status === "class-12"
        ? "Class 12 Aspirant"
        : "JEE Dropper / Repeater";

    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-indigo-600" />

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
              <span className="text-xs text-slate-500 font-mono">₹{registration.amount_paid} Paid</span>
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
              <Calendar size={12} /> Date Joined
            </div>
            <div className="font-semibold text-slate-900">
              {new Date(registration.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
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
