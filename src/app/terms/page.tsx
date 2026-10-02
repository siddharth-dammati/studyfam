import { ExternalPageShell } from "@/components/layout/ExternalPageShell";
import { ShieldAlert, AlertTriangle, FileText, CheckCircle2, Lock, Scale } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service & Examination Regulations | StudyFam",
  description: "Terms and conditions, academic integrity policies, and mock examination regulations governing StudyFam All-India Mock 2027.",
};

export default function TermsPage() {
  return (
    <ExternalPageShell
      badgeText="Legal Framework · Ref: SF-TOS-2027"
      badgeTone="blue"
      title="Terms of Service &"
      titleGradient="Test Conduct"
      subtitle="The comprehensive legal agreement and academic honor code governing candidate participation, diagnostic testing, scholarship eligibility, and anti-cheat enforcement on StudyFam."
      metaItems={[
        { label: "Effective", value: "September 2026" },
        { label: "Jurisdiction", value: "Republic of India" },
        { label: "Framework", value: "Information Technology Act, 2000" },
        { label: "Test Cycle", value: "JEE Main 2027" },
      ]}
      maxWidth="narrow"
    >
      <div className="space-y-8">
        {/* Statutory Non-Affiliation Disclaimer Banner */}
        <div className="p-6 rounded-[20px] bg-gradient-to-r from-amber-50/90 to-orange-50/70 border border-amber-200/90 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1 text-xs sm:text-sm text-[#0B1526]">
            <h4 className="font-bold text-amber-950 text-base">Statutory Non-Affiliation Notice</h4>
            <p className="text-[#4B5B76] leading-relaxed">
              StudyFam Technologies is an independent private educational technology initiative. StudyFam is <strong>NOT</strong> affiliated with, endorsed by, sponsored by, or in any way officially associated with the <strong>National Testing Agency (NTA)</strong>, the <strong>Ministry of Education (MoE)</strong>, Government of India, or any <strong>Indian Institute of Technology (IIT)</strong>. References to &quot;JEE Main&quot; and &quot;NTA&quot; are strictly descriptive for curriculum alignment under the doctrine of fair use.
            </p>
          </div>
        </div>

        {/* Section 1: Nature of the Service */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              1.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Nature of the Service & Academic Benchmark
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            1.1 <strong>Independent Diagnostic Testing:</strong> StudyFam delivers high-fidelity simulated Computer Based Testing (CBT) conforming to the official NTA 75-question syllabus pattern. Its purpose is to provide aspirants with unbiased percentile predictions, chapter-level weakness analytics, and real exam ergonomics.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            1.2 <strong>No Guarantee of Real Exam Ranks:</strong> While our statistical percentile engines are calibrated against historical national cohorts, mock scores are diagnostic benchmarks. StudyFam does not guarantee admission to any IIT, NIT, IIIT, or CFTI.
          </p>
        </div>

        {/* Section 2: Candidate Registration & Representations */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              2.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Candidate Registration & Integrity Obligations
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            2.1 <strong>Truthfulness of Information:</strong> The candidate warrants that all profile details (Full Name, Contact Number, Academic Status, Family Income Bracket) provided during test registration are authentic and verifiable.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            2.2 <strong>Strict Single-Account Rule:</strong> Each candidate is permitted exactly one registration. Creating multiple dummy accounts with alternate email addresses to preview questions or distort national percentile curves constitutes examination fraud and triggers automatic disqualification across all linked profiles.
          </p>
        </div>

        {/* Section 3: Examination Conduct & Anti-Cheat Protocols */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              3.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Examination Conduct & Anti-Cheat Protocols
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            3.1 <strong>Client Telemetry Monitoring:</strong> The CBT exam interface continuously logs window-blurring events, tab switches, developer console activations, screen-share software detection, and abnormal answering velocities (e.g., solving complex multi-step numericals in under 3 seconds).
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            3.2 <strong>Integrity Scrutiny & Invalidation:</strong> Attempts flagged for high cheating probabilities are automatically sequestered for manual review by our Academic Integrity Panel. The panel reserves absolute right to void suspicious scores from the final national merit leaderboard.
          </p>
        </div>

        {/* Section 4: Scholarship Governance */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              4.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Fee Support & Merit Scholarship Governance
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            4.1 <strong>Scholarship Contingency:</strong> Direct reimbursement of official JEE Main exam application fees is subject to full compliance with the{" "}
            <Link href="/scholarship-rules" className="text-[#1A5FE0] font-bold underline hover:text-[#0A1C96]">
              StudyFam Scholarship Rules & Policy
            </Link>
            , including submission of a valid official NTA JEE Main Application Confirmation PDF.
          </p>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            4.2 <strong>Two Distinct Tracks:</strong> Scholarship slots are divided equally: 50% Pure Merit (determined solely by test ranking) and 50% Need-Based Support (reserved for economically deserving students subject to income criteria verification).
          </p>
        </div>

        {/* Section 5: Intellectual Property */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              5.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Intellectual Property Rights
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            All question papers, detailed textbook solutions, algorithmic scoring models, branding marks, and CBT user interfaces are the proprietary intellectual property of StudyFam Technologies. Unauthorized downloading, scraping, screen recording, commercial repackaging, or unauthorized redistribution on Telegram/YouTube is strictly prohibited and subject to legal prosecution under the Copyright Act, 1957.
          </p>
        </div>

        {/* Section 6: Governing Law */}
        <div className="tokko-card p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
              6.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Governing Law & Dispute Jurisdiction
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            These Terms shall be governed by and construed in accordance with the substantive laws of the Republic of India. In the event of any statutory grievance or dispute arising out of or relating to platform usage, the courts of <strong>New Delhi, India</strong> shall possess exclusive territorial jurisdiction.
          </p>
        </div>
      </div>
    </ExternalPageShell>
  );
}
