import { ExternalPageShell } from "@/components/layout/ExternalPageShell";
import { ShieldCheck, PieChart, CheckCircle2, Lock, ArrowUpRight, Scale, Eye, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Financial Transparency & Governance Report | StudyFam",
  description: "Audited breakdown of the ₹18 scholarship pool allocation, escrow management, and payout verification for the StudyFam JEE Main 2027 All India Mock.",
};

export default function TransparencyPage() {
  const milestones = [
    { candidates: "1,000", pool: "₹18,000", meritSlots: "10 Boys + 10 Girls", totalSponsored: "20 Students" },
    { candidates: "5,000", pool: "₹90,000", meritSlots: "50 Boys + 50 Girls", totalSponsored: "100 Students" },
    { candidates: "10,000", pool: "₹1,80,000", meritSlots: "100 Boys + 100 Girls", totalSponsored: "200 Students" },
    { candidates: "25,000", pool: "₹4,50,000", meritSlots: "250 Boys + 250 Girls", totalSponsored: "500 Students" },
    { candidates: "50,000", pool: "₹9,00,000", meritSlots: "500 Boys + 500 Girls", totalSponsored: "1,000 Students" },
    { candidates: "1,00,000", pool: "₹18,00,000", meritSlots: "1,000 Boys + 1,000 Girls", totalSponsored: "2,000 Students" },
  ];

  return (
    <ExternalPageShell
      badgeText="Public Statement · Ref: SF-AUDIT-2027"
      badgeTone="indigo"
      title="Financial Transparency &"
      titleGradient="Fund Governance"
      subtitle="Complete, uncompromising transparency on the student scholarship fund. We publish our exact mathematical allocation, escrow protections, and disbursement verification standards."
      metaItems={[
        { label: "Auditing Model", value: "Public Community Ledger" },
        { label: "Reserve Allocation", value: "66.67% (₹18.00)" },
        { label: "Operations Retention", value: "33.33% (₹9.00)" },
        { label: "Accounting Audit", value: "Independent CA Reconciliation" },
      ]}
      maxWidth="narrow"
    >
      <div className="space-y-8">
        {/* Foundation Principle Banner */}
        <div className="p-6 sm:p-8 rounded-[20px] bg-gradient-to-br from-[#0B1526] via-[#122448] to-[#0A1C96] text-white shadow-lg space-y-3 relative overflow-hidden">
          <div
            className="absolute w-72 h-72 rounded-full -top-20 -right-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(47, 143, 255, 0.35), transparent 70%)" }}
          />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300 bg-white/10 border border-white/20 px-3 py-1 rounded-full inline-block">
            Open Ledger Commitment
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight tokko-font-sora">
            Zero hidden deductions. Zero marketing siphoning. Every rupee of the scholarship reserve is accounted for.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            StudyFam believes an educational institution must be accountable to its students. We maintain a segregated escrow account and publish all disbursement UTRs for community audit.
          </p>
        </div>

        {/* Section 1: The ₹27 Registration Allocation Structure */}
        <div className="tokko-card p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              1.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              The ₹27 Registration Allocation Structure
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            From every single ₹27 registration received for the All-India Mock Test, funds are partitioned into two strictly segregated channels:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 66.67% Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-800 tokko-font-sora">₹18.00</span>
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase">66.67% of Fee</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-emerald-900 font-mono">
                Student Fee Support Pool (Escrowed)
              </div>
              <p className="text-xs text-[#4B5B76] leading-relaxed">
                Directly locked into a segregated escrow reserve account in India. 100% of these funds are dedicated to refunding full JEE Main application fees for top-performing rankers and students with verified financial need.
              </p>
            </div>

            {/* 33.33% Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#0B1526] tokko-font-sora">₹9.00</span>
                <span className="text-xs font-mono font-bold text-[#7A8CA8] uppercase">33.33% of Fee</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-[#0B1526] font-mono">
                StudyFam Platform &amp; Operations
              </div>
              <p className="text-xs text-[#4B5B76] leading-relaxed">
                Retained by StudyFam Technologies to cover high-concurrency cloud servers, anti-cheat machine learning pipelines, question bank development by IITians, and payment gateway transaction commissions.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Milestone Projections Ledger Table */}
        <div className="tokko-card p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              2.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Milestone Scaling Projections Ledger
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            The scholarship pool scales dynamically without caps. As candidate enrollment increases, more students receive 100% NTA fee sponsorships:
          </p>

          <div className="border border-[#E3EAF6] rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#EFF5FF] text-[#0B1526] font-bold border-b border-[#E3EAF6] font-mono">
                  <tr>
                    <th className="py-3 px-4">Participants</th>
                    <th className="py-3 px-4">Escrow Pool (₹18)</th>
                    <th className="py-3 px-4">Slot Breakdown (50:50)</th>
                    <th className="py-3 px-4">Total Sponsored</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3EAF6] bg-white text-[#4B5B76]">
                  {milestones.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0B1526]">{m.candidates}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{m.pool}</td>
                      <td className="py-3 px-4">{m.meritSlots}</td>
                      <td className="py-3 px-4 font-bold text-[#0B1526]">{m.totalSponsored}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 3: Escrow & Payout Safeguards */}
        <div id="escrow" className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              3.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Independent Escrow &amp; Disbursement Security
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            3.1 <strong>Segregated Bank Accounts:</strong> All scholarship pool funds are maintained in a dedicated bank account in India, legally isolated from company working capital.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            3.2 <strong>Third-Party Reconciliation:</strong> Following the completion of the 27 December 2026 examination, an independent Chartered Accountant firm conducts a comprehensive audit certifying that 100% of the scholarship reserve is disbursed to verified student rankers.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            3.3 <strong>Public Proof-of-Payout:</strong> An anonymized payout ledger displaying candidate Roll Numbers, Category, Rank, and Bank UTR Transaction References will be published for public scrutiny upon completion of disbursements.
          </p>
        </div>

        {/* Section 4: Verification Standards */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              4.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Verification &amp; Governance Safeguards
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            To guarantee that scholarship grants reach genuine, deserving aspirants:
          </p>
          <ul className="space-y-2 text-sm text-[#4B5B76] pl-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>Candidates must supply official NTA JEE (Main) 2027 application receipts displaying their official application number and fee debit.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>Aadhaar/Identity verification is completed prior to electronic bank transfer to prevent dummy or proxy claims.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>If any candidate declines or fails verification, the scholarship moves immediately to the next eligible rank-holder on the leaderboard.</span>
            </li>
          </ul>
        </div>
      </div>
    </ExternalPageShell>
  );
}
