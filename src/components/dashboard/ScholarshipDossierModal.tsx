"use client";

import React, { useState, useEffect } from "react";
import { CandidateRecord } from "./CandidateRegistrationCard";
import { updateCandidateProfile } from "@/services/paymentService";
import {
  X,
  Award,
  Heart,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  candidateRecord: CandidateRecord | null;
  userEmail?: string | null;
  userFullName?: string | null;
  onSuccess: (updatedRecord: CandidateRecord) => void;
  isMandatoryPrompt?: boolean;
}

export function ScholarshipDossierModal({
  isOpen,
  onClose,
  candidateRecord,
  userEmail,
  userFullName,
  onSuccess,
  isMandatoryPrompt = false,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"boy" | "girl" | "other">("boy");
  const [jeeStatus, setJeeStatus] = useState<"class-11" | "class-12" | "dropper">("class-11");
  const [familyIncome, setFamilyIncome] = useState<string>("1.5l_3l");
  const [scholarshipTrack, setScholarshipTrack] = useState<"merit" | "need_based" | "opt_out">("merit");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  // Pre-populate fields from candidateRecord or userProfile
  useEffect(() => {
    if (candidateRecord) {
      if (candidateRecord.full_name) setFullName(candidateRecord.full_name);
      if (candidateRecord.phone) setPhone(candidateRecord.phone);
      if (candidateRecord.gender) setGender(candidateRecord.gender as any);
      if (candidateRecord.jee_status) setJeeStatus(candidateRecord.jee_status as any);
      if (candidateRecord.family_income) setFamilyIncome(candidateRecord.family_income);
      if (candidateRecord.scholarship_track) setScholarshipTrack(candidateRecord.scholarship_track as any);
    } else {
      if (userFullName && !fullName) setFullName(userFullName);
    }
  }, [candidateRecord, userFullName, isOpen]);

  if (!isOpen) return null;

  const emailToUse = candidateRecord?.email || userEmail || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setErrorMsg("Please enter a valid 10-digit WhatsApp or mobile number.");
      return;
    }

    if (!emailToUse && !candidateRecord?.order_id) {
      setErrorMsg("No authenticated email or order ID found. Please log in first.");
      return;
    }

    setLoading(true);

    try {
      const slabToSubmit = scholarshipTrack === "opt_out" ? "opt_out" : "full_fee_100";

      const res = await updateCandidateProfile({
        email: emailToUse,
        fullName: fullName.trim(),
        phone: cleanDigits.slice(-10),
        gender,
        jeeStatus,
        familyIncome,
        scholarshipTrack,
        scholarshipSlab: slabToSubmit,
        orderId: candidateRecord?.order_id,
      });

      if (res.success && res.registration) {
        setShowSuccessBadge(true);
        setTimeout(() => {
          onSuccess(res.registration);
          setShowSuccessBadge(false);
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.error || "Failed to update profile. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 sm:p-8 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close button (only if not strictly mandatory or user can dismiss) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Dismiss for now"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200/80 rounded-full text-xs font-bold text-indigo-700 mb-2.5">
            <Sparkles size={14} className="text-indigo-600" />
            <span>Official Candidate & Scholarship Dossier</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Complete Your Candidate Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            StudyFAM awards <strong>500 Merit Scholarships</strong> (Top 250 Boys & Top 250 Girls) and reserves <strong>500 Need-Based slots</strong>. Please confirm your academic & socio-economic details to ensure accurate pool allocation.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {showSuccessBadge ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Scholarship Dossier Synchronized!</h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Database updated · Verified single candidate record
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left text-xs">
            {/* 1. Full Name & Registered Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aditya Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                  Registered Email ID
                </label>
                <input
                  type="email"
                  value={emailToUse}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-500 text-xs cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Canonical primary key · No duplicate records
                </span>
              </div>
            </div>

            {/* 2. Gender Selection (CRITICAL FOR TOP 250 BOYS / TOP 250 GIRLS SPLIT) */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                Gender * <span className="text-indigo-600 lowercase font-normal">(required for 250 boys & 250 girls rank split)</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "boy", label: "👦 Boy / Male" },
                  { id: "girl", label: "👧 Girl / Female" },
                  { id: "other", label: "⚪ Other" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGender(g.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      gender === g.id
                        ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-2xs"
                        : "border-slate-200 bg-slate-50 hover:bg-white text-slate-700"
                    }`}
                  >
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Mobile Number & Target Class Stream */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                  WhatsApp / Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-slate-400 text-xs">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                  Academic Class Stream *
                </label>
                <select
                  value={jeeStatus}
                  onChange={(e) => setJeeStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
                >
                  <option value="class-11">Class 11 Aspirant (Target JEE 2028)</option>
                  <option value="class-12">Class 12 Aspirant (Target JEE 2027)</option>
                  <option value="dropper">JEE Dropper / Repeater (Target JEE 2027)</option>
                </select>
              </div>
            </div>

            {/* 4. Annual Family Income Bracket */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                Annual Family Income Bracket *
              </label>
              <select
                value={familyIncome}
                onChange={(e) => setFamilyIncome(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
              >
                <option value="below_1.5l">Below ₹1.5 Lakh / year (High Financial Need)</option>
                <option value="1.5l_3l">₹1.5 Lakh – ₹3 Lakh / year (Moderate Need)</option>
                <option value="3l_6l">₹3 Lakh – ₹6 Lakh / year</option>
                <option value="6l_8l">₹6 Lakh – ₹8 Lakh / year</option>
                <option value="above_8l">Above ₹8 Lakh / year (Standard Income)</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Used to determine eligibility for the 50% Need-Based assistance pool.
              </span>
            </div>

            {/* 5. Scholarship Track Selection & Opt-Out Option */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1.5">
                Scholarship Category & Track *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Merit Track */}
                <div
                  onClick={() => setScholarshipTrack("merit")}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    scholarshipTrack === "merit"
                      ? "border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-400"
                      : "border-slate-200 bg-slate-50/70 hover:bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs mb-1">
                      <Award size={15} className="text-amber-600 shrink-0" />
                      <span>🏆 Merit Track</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      100% Mock score based. Top 250 boys & Top 250 girls receive direct fee grants.
                    </p>
                  </div>
                  <span className="mt-2 inline-block font-mono text-[9px] font-bold text-amber-800 uppercase">
                    Open to All
                  </span>
                </div>

                {/* Need-Based Track */}
                <div
                  onClick={() => setScholarshipTrack("need_based")}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    scholarshipTrack === "need_based"
                      ? "border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500"
                      : "border-slate-200 bg-slate-50/70 hover:bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs mb-1">
                      <Heart size={15} className="text-indigo-600 shrink-0" />
                      <span>❤️ Need-Based Track</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      50% slots reserved for verified financial assistance pool (next 250 boys & girls).
                    </p>
                  </div>
                  <span className="mt-2 inline-block font-mono text-[9px] font-bold text-indigo-800 uppercase">
                    50% Reserved
                  </span>
                </div>

                {/* Opt-Out & Give Chance */}
                <div
                  onClick={() => setScholarshipTrack("opt_out")}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    scholarshipTrack === "opt_out"
                      ? "border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500"
                      : "border-slate-200 bg-slate-50/70 hover:bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs mb-1">
                      <HeartHandshake size={15} className="text-emerald-600 shrink-0" />
                      <span>💖 Opt Out / Donate</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      I do not need cash aid. I donate my grant slot to a peer who genuinely needs it.
                    </p>
                  </div>
                  <span className="mt-2 inline-block font-mono text-[9px] font-bold text-emerald-800 uppercase">
                    Generous Aspirant
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Scholarship Entitlement (100% Full Fee Support) */}
            {scholarshipTrack !== "opt_out" ? (
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-slate-700 mb-1">
                  Scholarship Entitlement Level
                </label>
                <div className="p-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">100% Full NTA Application Fee Grant</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">
                        Direct grant of ₹1,000 for Boys and ₹800 for Girls (100% exam fee covered).
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shrink-0 shadow-2xs">
                    100% FULL FEE
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <HeartHandshake size={18} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>Thank you!</strong> Your test rank will be calculated on the All-India leaderboard, but your monetary scholarship grant will be given to a student from an underprivileged background.
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              {!isMandatoryPrompt && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin mr-2" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Lock Scholarship Dossier</span>
                    <ArrowRight size={15} className="ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
