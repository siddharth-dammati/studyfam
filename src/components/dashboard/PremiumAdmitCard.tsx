"use client";

import React, { useState } from "react";
import { CandidateRecord } from "./CandidateRegistrationCard";
import { 
  Printer, 
  Share2, 
  Check, 
  Copy, 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  Heart, 
  Clock, 
  Calendar, 
  Monitor, 
  FileText, 
  AlertTriangle,
  QrCode,
  CheckCircle2,
  ExternalLink,
  HeartHandshake
} from "lucide-react";
import Link from "next/link";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface PremiumAdmitCardProps {
  registration: CandidateRecord;
  onClose?: () => void;
  isStandalone?: boolean;
}

// Generates realistic SVG barcode bars from any string seed
function SvgBarcode({ value }: { value: string }) {
  const bars = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    const sequence: number[] = [];
    const seed = Math.abs(hash);
    for (let i = 0; i < 48; i++) {
      const w = ((seed >> (i % 24)) ^ (i * 7)) % 3 + 1; // 1, 2, or 3 width
      sequence.push(w);
    }
    return sequence;
  }, [value]);

  let currentX = 10;
  return (
    <div className="flex flex-col items-center">
      <svg
        className="w-full max-w-[220px] h-10"
        viewBox="0 0 240 40"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {bars.map((w, idx) => {
          const x = currentX;
          currentX += w + 2;
          if (idx % 2 === 0) {
            return <rect key={idx} x={x} y="0" width={w} height="36" fill="#0f172a" />;
          }
          return null;
        })}
      </svg>
      <span className="font-mono text-[10px] tracking-widest text-slate-600 font-semibold uppercase mt-0.5">
        *{value}*
      </span>
    </div>
  );
}

export function PremiumAdmitCard({
  registration,
  onClose,
  isStandalone = false,
}: PremiumAdmitCardProps) {
  const { config } = useSiteConfig();
  const [copied, setCopied] = useState(false);

  // Deterministic Roll Number & Application Number
  const cleanId = (registration.id || "STUDYFAM2027").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const rollNumber = `SF27-M26-${cleanId.slice(0, 6).padEnd(6, "8")}`;
  const appNumber = `26SF${cleanId.slice(6, 12).padEnd(6, "4")}`;
  const orderRef = registration.order_id || registration.payment_id || `ORD-${cleanId.slice(0, 8)}`;

  const streamLabel =
    registration.jee_status === "class-11"
      ? "Class 11 Aspirant (Target JEE 2028)"
      : registration.jee_status === "class-12"
      ? "Class 12 Aspirant (Target JEE 2027)"
      : "JEE Dropper / Repeater (Target JEE 2027)";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/admit-card?order_id=${encodeURIComponent(orderRef)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== "undefined") {
      const text = `🏆 *My Official StudyFAM All-India JEE Main 2027 Mock Admit Card*\n\nCandidate: *${registration.full_name}*\nRoll No: *${rollNumber}*\nExam Date: *Sunday, 27 Dec 2026 (9:00 AM IST)*\nCompete for the ₹5,000+ Merit & Need-Based Scholarship pool!\n\nRegister & verify your admit card at: https://studyfam.com`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <div className="w-full">
      {/* Screen Toolbar (Hidden when printing) */}
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3 p-4 bg-white/95 backdrop-blur border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
          )}
          {isStandalone && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Dashboard</span>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <CheckCircle2 size={13} className="text-emerald-600" />
              Verified Hall Ticket
            </span>
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">
              Roll: {rollNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all shadow-2xs"
            title="Copy verification link"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy Link"}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-2xs"
            title="Share Admit Card on WhatsApp"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Print or Save as PDF"
          >
            <Printer size={15} />
            <span>Print Hall Ticket (PDF)</span>
          </button>
        </div>
      </div>

      {/* 
        PRINTABLE ADMIT CARD CONTAINER
        Optimized strictly for standard A4 portrait printout
      */}
      <div
        id="sf-admit-card-printable"
        className="sf-admit-card bg-white text-slate-900 border-2 border-slate-900 rounded-2xl shadow-xl overflow-hidden print:border-2 print:border-black print:rounded-none print:shadow-none print:m-0 print:p-0"
        style={{ maxWidth: "860px", margin: "0 auto" }}
      >
        {/* National Indian Tricolor Header Strip */}
        <div className="h-2 w-full grid grid-cols-3">
          <div className="bg-[#FF9933]" />
          <div className="bg-white border-y border-slate-200" />
          <div className="bg-[#138808]" />
        </div>

        {/* Inner Padding container */}
        <div className="p-6 sm:p-8 print:p-6 print:text-[11px]">
          {/* Top Council Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
            {/* Left: Official StudyFam Logo & Examination Title */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="shrink-0 pt-0.5">
                <img
                  src="/logo-dark.png"
                  srcSet="/logo-dark.png 1x, /logo-dark@2x.png 2x"
                  alt="StudyFam"
                  className="h-10 sm:h-12 w-auto object-contain block"
                  draggable={false}
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase">
                  {config?.admitCard?.examTitle || "StudyFAM All-India JEE (Main) 2027 Mock"}
                </h1>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Provisional E-Admit Card & Candidate Examination Allotment Slip
                </div>
                <div className="inline-block mt-1 px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[9px] font-bold tracking-wider rounded uppercase">
                  Session: Computer-Based Test (CBT) · December 2026 Cycle
                </div>
              </div>
            </div>

            {/* Right: Barcode & Quick Verification Badge */}
            <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0">
              <SvgBarcode value={rollNumber} />
              <div className="flex items-center gap-1.5 text-[9px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 size={11} className="text-emerald-600" />
                <span>OFFICIAL VERIFIED HALL TICKET</span>
              </div>
            </div>
          </div>

          {/* Security & Verification Banner */}
          <div className="my-3 py-1.5 px-3 bg-slate-100/90 border border-slate-300 rounded text-[10px] font-mono text-slate-700 flex flex-wrap items-center justify-between gap-2">
            <div>
              <strong>AUTHENTICATED RECORD:</strong> {cleanId.slice(0, 20)}
            </div>
            <div>
              <strong>DISBURSEMENT POOL:</strong> ₹5,000+ MERIT & NEED-BASED TRACK
            </div>
            <div>
              <strong>STATUS:</strong> <span className="text-emerald-700 font-bold">SEAT CONFIRMED (PAID)</span>
            </div>
          </div>

          {/* CANDIDATE DOSSIER & PARTICULARS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b-2 border-slate-900">
            {/* Particulars (3 cols on md) */}
            <div className="md:col-span-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-indigo-600" />
                <span>1. Candidate Identification Particulars</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">
                    Candidate Roll No.
                  </span>
                  <span className="font-mono font-bold text-slate-950 text-sm tracking-wide">
                    {rollNumber}
                  </span>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">
                    Application Number
                  </span>
                  <span className="font-mono font-bold text-slate-950 text-sm">
                    {appNumber}
                  </span>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">
                    Target Paper / Course
                  </span>
                  <span className="font-bold text-slate-900">
                    B.E. / B.Tech (Paper 1)
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-2 p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">
                    Candidate Full Name (As Registered)
                  </span>
                  <span className="font-extrabold text-slate-950 text-sm uppercase tracking-wide">
                    {registration.full_name}
                  </span>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">
                    Candidate Gender
                  </span>
                  <span className="font-bold text-slate-900 text-[11px]">
                    {registration.gender === "boy"
                      ? "MALE (BOY)"
                      : registration.gender === "girl"
                      ? "FEMALE (GIRL)"
                      : "ALL-INDIA OPEN"}
                  </span>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">
                    Academic Cohort
                  </span>
                  <span className="font-semibold text-slate-900 text-[11px]">
                    {streamLabel}
                  </span>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">
                    Registered Mobile / WhatsApp
                  </span>
                  <span className="font-mono font-semibold text-slate-900">
                    {registration.phone}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-3 p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">
                    Candidate Email ID
                  </span>
                  <span className="font-mono font-semibold text-slate-900 truncate block">
                    {registration.email}
                  </span>
                </div>
              </div>

              {/* Dual-Track Entitlement Ribbon */}
              <div className="mt-3 p-2.5 rounded bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                {registration.scholarship_track === "opt_out" ? (
                  <div className="flex items-center gap-2">
                    <HeartHandshake size={16} className="text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-950">
                        Voluntary Scholarship Opt-Out:
                      </span>{" "}
                      <span className="text-slate-700 text-[11px]">
                        Candidate opted out of cash grants to donate scholarship slot to a peer in financial need. All-India Rank (AIR) will be fully calculated.
                      </span>
                    </div>
                  </div>
                ) : registration.scholarship_track === "need_based" ? (
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-indigo-950">
                        Need-Based Support Track Allotted:
                      </span>{" "}
                      <span className="text-slate-700 text-[11px]">
                        ❤️ 50% Need-Based Assistance Pool — slot count scales with total registrations; socio-economic verification applies.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold text-indigo-950">
                        Merit Scholarship Track Allotted:
                      </span>{" "}
                      <span className="text-slate-700 text-[11px]">
                        🏆 50% Merit Track — top boys & girls selected 100% on Mock AIR; slot count scales with total registrations.
                      </span>
                    </div>
                  </div>
                )}
                <div className="font-mono text-[10px] font-bold text-indigo-800 shrink-0 bg-white px-2 py-1 rounded border border-indigo-200">
                  {registration.scholarship_track === "opt_out" ? "DONOR SLOT" : "SLOT: CONFIRMED"}
                </div>
              </div>
            </div>

            {/* Candidate Photo & Verified Stamp Box (1 col on md) */}
            <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50/50 relative overflow-hidden">
              {/* Photo placeholder / avatar */}
              <div className="w-28 h-32 bg-slate-200 border-2 border-slate-400 rounded flex flex-col items-center justify-center text-center p-2 relative shadow-inner">
                <div className="w-14 h-14 rounded-full bg-slate-300 border border-slate-400 flex items-center justify-center text-slate-600 font-bold text-xl mb-1">
                  {registration.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[9px] font-mono uppercase font-bold text-slate-600 leading-tight">
                  CANDIDATE BIOMETRIC
                </span>

                {/* Stamp overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[-15deg]">
                  <div className="border-2 border-emerald-600 bg-emerald-500/10 rounded-full w-24 h-24 flex flex-col items-center justify-center text-center p-1 text-emerald-700 font-black uppercase tracking-tighter">
                    <span className="text-[7px]">★ STUDYFAM ★</span>
                    <span className="text-[8px] leading-tight">SEAT VERIFIED</span>
                    <span className="text-[6px]">DEC 2026 CBT</span>
                  </div>
                </div>
              </div>

              {/* Digital Signature Specimen */}
              <div className="w-28 mt-2 pt-1 border-t border-slate-300 text-center">
                <div className="font-serif italic text-xs text-slate-700 select-none">
                  {registration.full_name.toLowerCase()}
                </div>
                <span className="text-[8px] font-mono text-slate-400 uppercase block">
                  Digital Signature
                </span>
              </div>
            </div>
          </div>

          {/* EXAMINATION DETAILS & SCHEDULE MATRIX */}
          <div className="py-4 border-b-2 border-slate-900">
            <div className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-600" />
              <span>2. Examination Schedule & Test Console Matrix</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-900 text-white font-mono text-[10px] uppercase">
                    <th className="border border-slate-300 p-2">Exam Date</th>
                    <th className="border border-slate-300 p-2">Examination Timing</th>
                    <th className="border border-slate-300 p-2">Test Mode</th>
                    <th className="border border-slate-300 p-2">Question Breakdown</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-slate-200">
                    <td className="border border-slate-300 p-2.5 font-bold text-slate-900">
                      {config?.admitCard?.examDate || "Sunday, 27 Dec 2026"}
                    </td>
                    <td className="border border-slate-300 p-2.5 font-extrabold text-slate-950">
                      {config?.admitCard?.testTiming || "09:00 AM – 12:00 PM IST (3 Hours)"}
                    </td>
                    <td className="border border-slate-300 p-2.5 font-medium text-slate-800">
                      Online Computer-Based Test (CBT)
                    </td>
                    <td className="border border-slate-300 p-2.5 text-[11px]">
                      75 Questions · 300 Marks<br />
                      <span className="text-slate-500 font-mono text-[10px]">
                        Physics (25), Chemistry (25), Maths (25)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Test Console Access Box */}
            <div className="mt-3 p-3 bg-slate-50 border border-slate-300 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Monitor size={14} className="text-indigo-600" />
                  <span>Test Center Venue: StudyFAM Secure Cloud CBT Terminal</span>
                </div>
                <div className="text-slate-600 text-[11px] mt-0.5">
                  URL: <strong className="font-mono text-indigo-700">https://cbt.studyfam.com</strong> · Accessible on Google Chrome / Microsoft Edge (Laptop, PC, or Android Tablet).
                </div>
              </div>
              <div className="font-mono text-[10px] text-right text-slate-500">
                <span>Reporting Time: <strong>{config?.admitCard?.reportingTime || "07:30 AM IST"}</strong></span><br />
                <span>Gate Closes: <strong>{config?.admitCard?.gateClosureTime || "08:30 AM IST"}</strong></span>
              </div>
            </div>
          </div>

          {/* CANDIDATE UNDERTAKING & IMPORTANT CBT INSTRUCTIONS */}
          <div className="py-4 border-b-2 border-slate-900">
            <div className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>3. Crucial Candidate Guidelines & Test Day Protocol</span>
            </div>

            <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-700 leading-relaxed">
              {(config?.admitCard?.instructions && config.admitCard.instructions.length > 0
                ? config.admitCard.instructions
                : [
                    `The examination will be conducted entirely in Computer Based Test (CBT) mode on Sunday, ${config?.admitCard?.examDate || "27 Dec 2026"}.`,
                    "Candidates must log in with their Registered Mobile Number or Order Reference ID at least 30 minutes before commencement.",
                    "The test interface utilizes browser tab-lock and window-blur tracking. Attempting to switch tabs, minimize windows, or use unauthorized AI toolbars will result in automatic score nullification.",
                    "Scoring & Marking Scheme: 4 marks for each correct response, -1 penalty mark for incorrect answers. Unattempted questions receive 0 marks.",
                    "50% Merit & 50% Need-Based Dual Track: Top-ranked boys & girls earn merit scholarships purely by test percentile. Need-based assistance will be verified independently post-exam.",
                    "Rough Sheets & Calculations: Blank physical paper and ballpoint pens are permitted at your study desk. Electronic calculators or smartwatches are strictly forbidden.",
                    "Results & Scholarship Disbursement: All-India Percentile & Merit Ranks will be declared within 48 hours. Direct bank/UPI fee reimbursements will commence following roll verification.",
                  ]
              ).map((rule, idx) => (
                <li key={idx}>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* SIGNATURES & OFFICIAL SEALS FOOTER */}
          <div className="pt-4 flex flex-col sm:flex-row items-end justify-between gap-6">
            {/* Candidate Undertaking */}
            <div className="text-left">
              <div className="w-48 border-b border-slate-800 pb-1 mb-1 font-serif italic text-xs text-slate-700">
                {registration.full_name}
              </div>
              <span className="text-[9px] font-mono uppercase font-bold text-slate-600 block">
                Candidate Declaration Signature
              </span>
              <span className="text-[8px] text-slate-400">
                Verified IP: {cleanId.slice(0, 8)} · Timestamp: {new Date(registration.created_at || Date.now()).toLocaleDateString("en-IN")}
              </span>
            </div>

            {/* Official StudyFam Digital Authentication Seal */}
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl border border-emerald-600 bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-xs text-slate-950 uppercase tracking-wide">
                    StudyFAM Examination Authority
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700">
                    Officially Authenticated & Issued
                  </div>
                </div>
              </div>
              <span className="text-[8px] font-mono text-slate-400 uppercase">
                Digital Verification Seal · StudyFAM All-India Mock 2027
              </span>
            </div>
          </div>

          {/* Anti-tampering Footer microtext */}
          <div className="mt-4 pt-2 border-t border-slate-200 text-center font-mono text-[8px] text-slate-400 uppercase tracking-widest">
            THIS IS A COMPUTER-GENERATED PROVISIONAL E-ADMIT CARD · SECURE HASH: {cleanId} · VALID FOR 27 DEC 2026 CYCLE ONLY
          </div>
        </div>
      </div>
    </div>
  );
}
