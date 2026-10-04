import { ExternalPageShell } from "@/components/layout/ExternalPageShell";
import { ShieldCheck, AlertCircle, RefreshCw, Mail, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | StudyFam JEE Mock",
  description: "Official cancellation, dispute resolution, and refund policy for StudyFam All-India Mock Test registrations.",
  alternates: {
    canonical: "/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <ExternalPageShell
      badgeText="Legal Compliance · Ref: SF-REF-2027"
      badgeTone="indigo"
      title="Cancellation &"
      titleGradient="Refund Policy"
      subtitle="Clear, legally binding guidelines on payment cancellations, duplicate charge resolutions, and refund eligibility for StudyFam All-India JEE Main 2027 mock test registrations."
      metaItems={[
        { label: "Effective", value: "September 2026" },
        { label: "Governing Law", value: "Information Technology Act, 2000 (India)" },
        { label: "Cycle", value: "JEE Main 2027" },
        { label: "Resolution SLA", value: "48 Business Hours" },
      ]}
      maxWidth="narrow"
    >
      <div className="space-y-8">
        {/* Important Notice Callout */}
        <div className="p-6 rounded-[20px] bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/80 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1 text-xs sm:text-sm text-[#4B5B76]">
            <h4 className="font-bold text-[#0B1526] text-base">Key Policy Summary</h4>
            <p className="leading-relaxed">
              Upon successful registration, your ₹27 fee is partitioned immediately: <strong>₹18.00</strong> is locked into the student scholarship escrow reserve and <strong>₹9.00</strong> provisions your proctored test seat and cloud servers. Due to automatic resource locking, fees are baseline non-refundable except in verified duplicate transaction scenarios.
            </p>
          </div>
        </div>

        {/* Section 1: Standard Registration Fee Policy */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              1.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Standard Registration Fee Policy
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            1.1 <strong>Non-Refundable Baseline:</strong> The standard registration fee of ₹27 (Rupees Twenty-Seven Only) is strictly non-refundable once the transaction is completed through the authorized payment gateway (Cashfree PG / UPI / Cards).
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            1.2 <strong>Rationale & Accounting Integrity:</strong> Upon receipt of registration, cloud compute slots, anti-cheat telemetry pipelines, and ₹18.00 scholarship reserve allocations are immediately provisioned and locked in the candidate ledger. Retracting individual slots creates distortions in national sample sizing and public scholarship pool accounting.
          </p>
        </div>

        {/* Section 2: Eligible Refund Exceptions */}
        <div className="tokko-card p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              2.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Eligible Refund Exceptions
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Refunds will be promptly entertained and processed under the following verified conditions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 size={16} />
                <span>Duplicate Transactions</span>
              </div>
              <p className="text-xs text-[#4B5B76] leading-relaxed">
                If a candidate was erroneously debited multiple times for the same email address or mobile number due to network lag, all duplicate charges are refunded within <strong>5–7 working days</strong> to the original payment source.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 size={16} />
                <span>Major Service Outage</span>
              </div>
              <p className="text-xs text-[#4B5B76] leading-relaxed">
                In the extraordinary event of an unresolvable server failure on StudyFam&apos;s infrastructure preventing &gt;15% of registered candidates from taking the test on 27 December 2026 without an alternative slot, a <strong>100% full refund</strong> will be issued.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Ineligibility for Refunds */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
              3.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Ineligibility for Refunds
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Refunds shall NOT be granted under any of the following circumstances:
          </p>
          <ul className="space-y-2.5 text-sm text-[#4B5B76]">
            <li className="flex items-start gap-2.5">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>Candidate failing to attend the examination during the designated test window (09:00 AM – 12:00 PM IST on Sunday, 27 December 2026).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>Candidate experiencing personal hardware defects, browser crashes, local electricity disruption, or personal ISP connectivity failures.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>Candidate disqualified by the proctoring engine for tab switching, screen recording, virtual machine use, or academic misconduct.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span>Dissatisfaction with test score, predicted percentile, chapter diagnostic feedback, or leaderboard ranking.</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Dispute Escalation & Grievance Protocol */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              4.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Dispute Escalation & Grievance Protocol
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            For duplicate transaction claims, please email our finance desk at{" "}
            <a href="mailto:billing@studyfam.in" className="text-[#1A5FE0] font-bold underline hover:text-[#0A1C96]">
              billing@studyfam.in
            </a>{" "}
            with the following required details:
          </p>
          <div className="bg-[#F6F9FF] border border-[#E3EAF6] rounded-xl p-4 text-xs font-mono text-[#0B1526] space-y-1">
            <div>1. Registered Candidate Email Address</div>
            <div>2. 10-Digit Mobile Number used during checkout</div>
            <div>3. Payment Gateway Order ID / Bank UTR Reference</div>
            <div>4. Screenshot of the bank debit sms / statement</div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#7A8CA8] pt-2">
            <Clock size={14} />
            <span>All verified duplicate claims are resolved within 48 business hours.</span>
          </div>
        </div>
      </div>
    </ExternalPageShell>
  );
}
