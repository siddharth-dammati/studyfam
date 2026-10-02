import { ExternalPageShell } from "@/components/layout/ExternalPageShell";
import { Award, Heart, CheckCircle2, ShieldCheck, Scale, ArrowRight, Clock, HelpCircle, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Fee Support & Merit Scholarship Rules | StudyFam JEE 2027",
  description: "Official legal documentation and rules governing the StudyFam JEE Main 2027 fee support pool, Top N scholarship allocation, and gender parity distribution.",
};

export default function ScholarshipRulesPage() {
  return (
    <ExternalPageShell
      badgeText="Official Policy · Ref: SF-SCH-2027-V1"
      badgeTone="emerald"
      title="Fee Support &"
      titleGradient="Scholarship Rules"
      subtitle="The legally binding terms, mathematical models, eligibility criteria, and disbursement protocols governing the StudyFam JEE Application Fee Support Pool."
      metaItems={[
        { label: "Effective", value: "September 2026" },
        { label: "Cycle", value: "JEE Main 2027" },
        { label: "Fee Split", value: "₹18 Escrow / ₹9 Ops" },
        { label: "Representation", value: "50:50 Gender Parity" },
        { label: "Disbursement SLA", value: "7 Business Days" },
      ]}
      maxWidth="narrow"
    >
      <div className="space-y-8">
        {/* Foundation Banner */}
        <div className="p-6 sm:p-8 rounded-[20px] bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg space-y-3 relative overflow-hidden">
          <div
            className="absolute w-72 h-72 rounded-full -top-20 -right-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.35), transparent 70%)" }}
          />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 bg-white/10 border border-white/20 px-3 py-1 rounded-full inline-block">
            Escrow Trust Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight tokko-font-sora">
            100% of the ₹18.00 scholarship allocation is held in dedicated trust to reimburse official NTA exam fees.
          </h2>
          <p className="text-emerald-100/90 text-sm leading-relaxed max-w-2xl">
            StudyFam operates on zero profit from the scholarship reserve. Every rupee contributed to the pool is disbursed directly to deserving top rankers and students requiring financial assistance.
          </p>
        </div>

        {/* Section 1: The Statutory Funding Mechanism */}
        <div id="framework" className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              1.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              The Statutory Funding Mechanism
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            1.1 <strong>Allocation of Registration Fees:</strong> For every candidate registered for the StudyFam All-India Mock Test at the standard fee of ₹27 (inclusive of applicable gateway fees), a fixed and non-dilutable sum of exactly <strong>₹18.00 (66.67%)</strong> is mandatorily escrowed into the <em>StudyFam JEE Fee Support Pool</em>.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            1.2 <strong>Platform &amp; Operations Fee:</strong> The remaining <strong>₹9.00 (33.33%)</strong> is retained by StudyFam Technologies to cover proctoring infrastructure, anti-cheat machine learning pipelines, cloud servers, and question bank development.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            1.3 <strong>Pool Non-Dilution:</strong> The ₹18.00 per candidate reserve is locked in trust exclusively for student fee sponsorships and cannot be diverted to platform operational expenses.
          </p>
        </div>

        {/* Section 2: Mathematical Scaling & Slot Allocation Model */}
        <div id="formula" className="tokko-card p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              2.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Mathematical Scaling &amp; Dual Track Allocation
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            2.1 <strong>Dynamic Scale:</strong> The number of scholarship beneficiaries scales directly with candidate participation without arbitrary caps. Official NTA JEE Main application fee benchmarks are:
          </p>
          <ul className="space-y-1.5 text-sm text-[#4B5B76] pl-2 font-mono">
            <li>• <strong>Male Candidates (General / OBC-NCL / EWS):</strong> ₹1,000.00 fee</li>
            <li>• <strong>Female Candidates (All Categories):</strong> ₹800.00 fee</li>
          </ul>

          {/* 50k Illustration Card */}
          <div className="p-5 rounded-2xl bg-[#F6F9FF] border border-[#E3EAF6] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-[#0B1526] uppercase">
                Projected Scenario: 50,000 Aspirants · 1,000 Winners
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                Mathematical Model
              </span>
            </div>
            <p className="text-xs text-[#4B5B76] leading-relaxed">
              At 50,000 registrations: Total Escrow Pool = 50,000 × ₹18 = <strong>₹9,00,000.00</strong>. This funds exactly 1,000 candidates:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Merit Track */}
              <div className="bg-white p-4 rounded-xl border border-emerald-200/90 shadow-2xs space-y-1.5">
                <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <Award size={16} className="text-emerald-600" />
                  <span>Merit Track (50% of Slots)</span>
                </div>
                <div className="text-xs font-bold text-[#0B1526]">Top 250 Boys + Top 250 Girls</div>
                <p className="text-[11px] text-[#4B5B76] leading-relaxed">
                  100% based on All-India mock test rank. Zero income screening. Sized at ₹2.5L (Boys) + ₹2.0L (Girls) = ₹4.5L.
                </p>
              </div>

              {/* Need-Based Track */}
              <div className="bg-white p-4 rounded-xl border border-blue-200/90 shadow-2xs space-y-1.5">
                <div className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                  <Heart size={16} className="text-[#1A5FE0]" />
                  <span>Need-Based Track (50% of Slots)</span>
                </div>
                <div className="text-xs font-bold text-[#0B1526]">Next 250 Boys + Next 250 Girls</div>
                <p className="text-[11px] text-[#4B5B76] leading-relaxed">
                  50% reserved for students from economically modest backgrounds with verified financial need. Sized at ₹4.5L.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3EAF6] flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-[#0B1526]">
              <span>Disbursed: ₹4,50,000 + ₹4,50,000 = ₹9,00,000.00</span>
              <span className="text-emerald-700">1,000 Candidates Funded</span>
            </div>
          </div>
        </div>

        {/* Section 3: Eligibility & Verification */}
        <div id="eligibility" className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              3.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Eligibility &amp; Verification Protocol
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            3.1 <strong>Aspirant Qualification:</strong> Candidates must be currently enrolled in Class 11, Class 12, or be an active dropper preparing for JEE (Main) 2027 under NTA guidelines.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            3.2 <strong>Audit Documentation:</strong> Within 14 calendar days of rank declaration, eligible candidates upload:
          </p>
          <ul className="space-y-2 text-sm text-[#4B5B76] pl-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>Government Photo ID (Aadhaar Card, Passport, or valid School ID)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>Official NTA JEE (Main) 2027 Application Confirmation PDF showing application number</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>Student or Guardian Bank Account details (Account Number, IFSC) or valid UPI VPA</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Voluntary Opt-Out & Roll-Down */}
        <div id="rollover" className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              4.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Voluntary Opt-Out &amp; Waterfall Roll-Down
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            4.1 <strong>Pass the Support:</strong> Rank-holders from affluent backgrounds who do not require fee support may choose the <em>&quot;Pass the Support&quot;</em> option on their dashboard.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            4.2 <strong>Waterfall Allocation:</strong> When a scholarship is declined or if a candidate fails to claim within 14 days, the grant automatically cascades to the next eligible rank-holder (Rank N+1) in the corresponding category. Zero funds revert to the company.
          </p>
        </div>

        {/* Section 5: Direct Disbursement Timeline */}
        <div id="disbursement" className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              5.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Direct Benefit Transfer (DBT) &amp; Public Ledger
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Reimbursements are issued directly to verified student bank accounts via NEFT/RTGS or UPI within <strong>7 business days</strong> of verification. A pseudonymized public ledger showing Roll Numbers, Cities, Mock Ranks, and Bank UTR Transaction References is published on our{" "}
            <Link href="/transparency" className="text-[#1A5FE0] font-bold underline hover:text-[#0A1C96]">
              Transparency &amp; Governance Page
            </Link>
            .
          </p>
        </div>
      </div>
    </ExternalPageShell>
  );
}
