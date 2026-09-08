import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Terms of Service & Examination Regulations | StudyFam",
  description: "Terms and conditions, academic integrity policies, and mock examination regulations governing StudyFam All-India Mock 2027.",
};

export default function TermsPage() {
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
            Legal Terms · Ref: SF-TOS-2027
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            Terms of Service & Test Regulations
          </h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
            Please read these terms carefully before accessing or registering on the StudyFam platform. By registering or remitting the ₹27 fee, you enter into a legally binding agreement with StudyFam Technologies.
          </p>
          <p className="text-xs font-mono text-slate-400 mt-4">
            Last Updated: September 2026 · Governing Law: Republic of India
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-700">

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">1. Nature of the Service & Legal Disclaimer</h2>
            <p>
              1.1 <strong>Independent Educational Testing:</strong> StudyFam is an independent educational technology platform providing benchmark diagnostic evaluations, analytics, and simulated Computer Based Testing (CBT) environments.
            </p>
            <p className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium leading-relaxed">
              <strong>Statutory Non-Affiliation Disclaimer:</strong> StudyFam is NOT affiliated with, authorized by, sponsored by, or in any way officially associated with the National Testing Agency (NTA), the Ministry of Education, Government of India, or any Indian Institute of Technology (IIT). &quot;JEE (Main)&quot; and &quot;NTA&quot; are registered trademarks of their respective statutory bodies and are used here solely for descriptive and comparative purposes under doctrine of fair use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">2. Candidate Registration & Representations</h2>
            <p>
              2.1 <strong>Truthfulness of Information:</strong> The candidate warrants that all profile details (Name, Grade, Contact Number) submitted during registration are accurate and authentic.
            </p>
            <p>
              2.2 <strong>One Account Per Aspirant:</strong> Each candidate may register only once. Creation of duplicate dummy accounts to test alternative question choices or inflate benchmark samples constitutes fraud and will result in permanent disqualification of all linked accounts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">3. Examination Conduct & Anti-Cheat Protocols</h2>
            <p>
              3.1 <strong>Proctoring Telemetry:</strong> The examination engine utilizes browser telemetry to identify window switching, full-screen violations, automated cursor movements, and unauthorized keystroke patterns.
            </p>
            <p>
              3.2 <strong>Disqualification:</strong> Candidates exhibiting suspicious telemetry or abnormal response speed inconsistencies (e.g. solving complex numerical problems in under 3 seconds) will have their responses submitted for manual scrutiny by our academic integrity panel. The decision of the panel regarding score invalidation is conclusive.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">4. Fee Support & Merit Scholarship Governance</h2>
            <p>
              4.1 <strong>Scholarship Contingency:</strong> Sponsorship of official JEE Main exam application fees is contingent upon fulfillment of the official <Link href="/scholarship-rules" className="text-indigo-600 underline font-semibold">Scholarship Rules</Link>, including submission of official NTA registration confirmation receipts.
            </p>
            <p>
              4.2 <strong>No Guarantee of JEE Admission:</strong> Participation in the StudyFam mock and receipt of simulated percentile reports does not constitute a guarantee of rank, admission, or seat allocation in any NIT, IIIT, GFTI, or IIT.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">5. Intellectual Property Rights</h2>
            <p>
              All mock test questions, answer keys, explanatory solutions, UI components, statistical ranking algorithms, and graphics are the proprietary intellectual property of StudyFam Technologies. Unauthorized recording, commercial redistribution, screen capturing, or sharing on Telegram/YouTube is strictly prohibited and actionable under the Copyright Act, 1957.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">6. Governing Law & Dispute Jurisdiction</h2>
            <p className="text-xs text-slate-600">
              These Terms shall be governed by and construed in accordance with the substantive laws of India. In the event of any legal dispute or claim arising out of or related to these Terms or the Mock Examination, the courts of New Delhi, India shall have sole and exclusive jurisdiction.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
