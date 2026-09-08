import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Privacy Policy | StudyFam (DPDP Act 2023 Compliant)",
  description: "Official Privacy Policy of StudyFam Technologies. Explaining student data protection, DPDP Act 2023 compliance, telemetry encryption, and Grievance Officer details.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
        <div className="w-full max-w-[1100px] figma-nav pointer-events-auto px-6 py-3 bg-white/95 backdrop-blur-md shadow-sm border border-slate-200 flex items-center justify-between">
          <Link href="/" aria-label="Home">
            <Logo className="h-8" textClassName="text-lg" />
          </Link>
          <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-36 pb-24 max-w-[840px] mx-auto px-6 w-full">
        {/* Header */}
        <div className="mb-14 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-5">
            Legal Compliance · Ref: SF-PRIV-2027
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            Privacy Policy & Data Protection Framework
          </h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
            StudyFam Technologies Private Limited is dedicated to safeguarding the privacy and personal data of students, parents, and visitors under the provisions of the Digital Personal Data Protection (DPDP) Act, 2023 and Information Technology Act, 2000.
          </p>
          <p className="text-xs font-mono text-slate-400 mt-4">
            Last Updated: September 2026 · Jurisdiction: Republic of India
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-700">

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">1. Notice of Data Collection as Data Fiduciary</h2>
            <p>
              StudyFam acts as the &quot;Data Fiduciary&quot; for all information submitted by users (&quot;Data Principals&quot;). We process information solely on the basis of informed, unambiguous, and revocable consent provided during test registration.
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Contact Identification:</strong> Full Name, Email Address, and WhatsApp / Mobile Number.</li>
              <li><strong>Academic Profile:</strong> Class (11, 12, or Dropper), Target Exam Year (2027), and Optional City/State for regional percentile computation.</li>
              <li><strong>Financial Transactions:</strong> Tokenized payment transaction IDs. StudyFam does not capture or store raw credit/debit card numbers or UPI PINs. All payment processing occurs through PCI-DSS Level 1 certified gateways.</li>
              <li><strong>Examination Telemetry:</strong> Response timestamps, question option selections, time-spent per question, and browser focus events for anti-cheat verification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">2. Lawful Purpose of Processing</h2>
            <p>We process your personal data exclusively for:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Issuing authenticated admit credentials and test slot access tokens.</li>
              <li>Generating statistically accurate percentile models, scorecards, and question-level analytics.</li>
              <li>Verifying merit leaderboard ranks for the Top N JEE Fee Scholarship Pool.</li>
              <li>Sending transactional notifications regarding registration confirmation and result declaration.</li>
            </ul>
            <p className="font-semibold text-slate-900 pt-1">
              Zero Data Monetization Guarantee: StudyFam never sells, rents, or licenses candidate phone numbers, scores, or emails to coaching centers, private colleges, or third-party marketing telecallers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">3. Data of Minors (Students Under 18 Years)</h2>
            <p>
              In strict adherence to Section 9 of the DPDP Act 2023, where candidates are under 18 years of age, registration must be undertaken with the knowledge and consent of a lawful parent or guardian. We do not engage in behavioral tracking or targeted commercial advertising directed at minor students.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">4. Data Retention & Erasure Rights</h2>
            <p>
              Candidates maintain the absolute right to access, rectify, or request permanent deletion of their personal data from our servers. Requests for data erasure may be lodged via email to our Privacy Officer. Performance benchmarking data is anonymized post-cycle for aggregate research.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">5. Data Security Standards</h2>
            <p>
              We implement industry-grade technical and organizational safeguards including 256-bit TLS encryption in transit, AES-256 encryption at rest, secure VPC cloud infrastructure hosted within India, and strict role-based access control (RBAC).
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">6. Statutory Grievance Redressal Officer</h2>
            <p>
              In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and DPDP Act 2023, the details of the designated Grievance Officer are:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono">
              <p><strong>Designation:</strong> Chief Data & Grievance Officer</p>
              <p><strong>Entity:</strong> StudyFam Technologies Private Limited</p>
              <p><strong>Email:</strong> <a href="mailto:grievance@studyfam.in" className="text-indigo-600 underline">grievance@studyfam.in</a></p>
              <p><strong>Acknowledgment SLA:</strong> 24 business hours · Resolution SLA: Within 15 calendar days</p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
