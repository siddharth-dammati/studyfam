import { ExternalPageShell } from "@/components/layout/ExternalPageShell";
import { ShieldCheck, Lock, EyeOff, UserCheck, Server, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | StudyFam (DPDP Act 2023 Compliant)",
  description: "Official Privacy Policy of StudyFam Technologies. Explaining student data protection, DPDP Act 2023 compliance, telemetry encryption, and Grievance Officer details.",
};

export default function PrivacyPage() {
  return (
    <ExternalPageShell
      badgeText="DPDP Act 2023 Compliant · Ref: SF-PRIV-2027"
      badgeTone="emerald"
      title="Privacy Policy &"
      titleGradient="Data Safeguards"
      subtitle="How StudyFam protects student personal data, encrypted test telemetries, and financial transactions in strict compliance with the Digital Personal Data Protection Act, 2023."
      metaItems={[
        { label: "Compliance", value: "DPDP Act, 2023 (India)" },
        { label: "Data Fiduciary", value: "StudyFam Technologies" },
        { label: "Encryption", value: "256-bit TLS + AES-256" },
        { label: "Hosting", value: "Secured VPCs (India)" },
      ]}
      maxWidth="narrow"
    >
      <div className="space-y-8">
        {/* Zero Data Monetization Guarantee Banner */}
        <div className="p-6 rounded-[20px] bg-gradient-to-r from-emerald-50/90 to-teal-50/70 border border-emerald-200/90 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <EyeOff size={20} />
          </div>
          <div className="space-y-1 text-xs sm:text-sm text-[#0B1526]">
            <h4 className="font-bold text-emerald-950 text-base">Zero Data Monetization Guarantee</h4>
            <p className="text-[#4B5B76] leading-relaxed">
              StudyFam firmly rejects the exploitative practices of ed-tech lead brokers. We <strong>NEVER</strong> sell, rent, license, or share candidate phone numbers, scores, or emails with third-party coaching centers, private colleges, or aggressive telecalling firms. Your data is used exclusively to simulate your CBT test and compute your performance diagnostics.
            </p>
          </div>
        </div>

        {/* Section 1: Notice of Data Collection */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              1.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Notice of Data Collection as Data Fiduciary
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            StudyFam acts as the designated <strong>Data Fiduciary</strong> for all information submitted by users (<em>Data Principals</em>). We collect only the minimal data strictly necessary for examination delivery:
          </p>
          <ul className="space-y-2 text-sm text-[#4B5B76]">
            <li className="flex items-start gap-2.5">
              <span className="text-[#1A5FE0] font-bold mt-0.5">•</span>
              <span><strong>Contact Identification:</strong> Full Name, Email Address, and 10-digit WhatsApp / Mobile Number.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#1A5FE0] font-bold mt-0.5">•</span>
              <span><strong>Academic Profile:</strong> JEE Status (Class 11, Class 12, or Dropper) and Target Exam Year (2027).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#1A5FE0] font-bold mt-0.5">•</span>
              <span><strong>Payment Transactions:</strong> Tokenized gateway transaction IDs. StudyFam does not capture or store raw credit/debit card numbers or UPI PINs. All processing is handled through PCI-DSS Level 1 certified gateways (Cashfree PG).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#1A5FE0] font-bold mt-0.5">•</span>
              <span><strong>Examination Telemetry:</strong> Question responses, time-spent timestamps per question, and browser focus events for anti-cheat verification.</span>
            </li>
          </ul>
        </div>

        {/* Section 2: Lawful Purpose of Processing */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              2.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Lawful Purpose of Processing
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Personal data is processed strictly for legitimate educational evaluation purposes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#4B5B76]">
            <div className="p-3.5 rounded-xl bg-[#F6F9FF] border border-[#E3EAF6] flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Issuing official admit cards &amp; candidate roll numbers</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F6F9FF] border border-[#E3EAF6] flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Generating percentile rankings &amp; chapter diagnostics</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F6F9FF] border border-[#E3EAF6] flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Verifying merit rankings for the Fee Support Pool</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F6F9FF] border border-[#E3EAF6] flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Sending critical test slot &amp; score alerts</span>
            </div>
          </div>
        </div>

        {/* Section 3: Minors Protection (DPDP Act Section 9) */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
              3.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Data of Minors (Students Under 18 Years)
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            In strict compliance with Section 9 of the DPDP Act 2023, where candidates are under 18 years of age, registration must be undertaken with the knowledge and informed consent of a lawful parent or legal guardian. StudyFam never executes behavioral ad-profiling or commercial micro-targeting against minor candidates.
          </p>
        </div>

        {/* Section 4: Data Retention & Security */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              4.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Data Retention, Erasure Rights & Security
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            Candidates maintain the uninhibited statutory right to access, export, or permanently erase their personal data from our servers. All communications are protected by <strong>256-bit TLS encryption in transit</strong>, <strong>AES-256 encryption at rest</strong>, and isolated database clusters hosted within Indian jurisdiction.
          </p>
        </div>

        {/* Section 5: Grievance Officer */}
        <div className="tokko-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-[#1A5FE0] bg-[#EFF5FF] border border-[#D7E4FA] px-2.5 py-1 rounded-md">
              5.0
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
              Statutory Grievance Redressal Officer
            </h2>
          </div>
          <p className="text-sm text-[#4B5B76] leading-relaxed">
            In accordance with the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and DPDP Act 2023, you may contact our designated Data Protection Officer:
          </p>
          <div className="bg-[#F6F9FF] border border-[#E3EAF6] rounded-xl p-5 text-xs font-mono text-[#0B1526] space-y-2">
            <div><strong>Entity:</strong> StudyFam Technologies Private Limited</div>
            <div><strong>Designation:</strong> Chief Data &amp; Grievance Officer</div>
            <div>
              <strong>Email:</strong>{" "}
              <a href="mailto:grievance@studyfam.in" className="text-[#1A5FE0] font-bold underline hover:text-[#0A1C96]">
                grievance@studyfam.in
              </a>
            </div>
            <div className="text-[#7A8CA8] pt-1">
              Acknowledgment SLA: 24 Business Hours · Resolution SLA: Within 15 Calendar Days
            </div>
          </div>
        </div>
      </div>
    </ExternalPageShell>
  );
}
