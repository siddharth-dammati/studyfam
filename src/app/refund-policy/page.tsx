import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Cancellation & Refund Policy | StudyFam JEE Mock",
  description: "Official cancellation, dispute resolution, and refund policy for StudyFam All-India Mock Test registrations.",
};

export default function RefundPolicyPage() {
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
            Legal Compliance · Ref: SF-REF-2027
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
            This policy defines the conditions, terms, and processes concerning payment cancellation, chargebacks, and refund requests for the StudyFam JEE Main 2027 All India Mock.
          </p>
          <p className="text-xs font-mono text-slate-400 mt-4">
            Last Updated: September 2026 · Governing Law: Information Technology Act, 2000 (India)
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-700">

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">1. Standard Registration Fee Policy</h2>
            <p>
              1.1 <strong>Non-Refundable Baseline:</strong> The standard registration fee of ₹27 (Rupees Twenty-Seven Only) is strictly non-refundable once the transaction is completed.
            </p>
            <p>
              1.2 <strong>Rationale:</strong> Upon receipt of registration, cloud compute slots, anti-cheat allocation, and ₹18.00 scholarship reserve allocations are immediately provisioned and locked. Retracting slots creates distortions in national sample sizing and scholarship pool accounting.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">2. Eligible Refund Exceptions</h2>
            <p>
              Refunds will be promptly entertained and processed under the following verified conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Duplicate Transactions:</strong> If a candidate was erroneously charged multiple times for the same email/phone number due to payment gateway lag, all surplus amounts will be refunded within 5-7 working days.</li>
              <li><strong>Major Service Outage:</strong> In the extraordinary event of an unresolvable server failure on StudyFam&apos;s end preventing more than 15% of registered candidates from taking the test on 27 December 2026 (and where no rescheduled slot is offered), a full 100% refund shall be issued.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">3. Ineligibility for Refunds</h2>
            <p>Refunds shall NOT be granted under any of the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Candidate failing to attend the examination at the scheduled slot (9:00 AM – 12:00 PM IST on 27 December 2026).</li>
              <li>Candidate experiencing personal hardware, browser, local power, or local internet connectivity failures.</li>
              <li>Candidate disqualified for cheating, unauthorized tabs, screen-recording tools, or breach of examination conduct.</li>
              <li>Dissatisfaction with test score, predicted percentile, or leaderboard rank.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">4. Dispute Escalation & Grievance Protocol</h2>
            <p>
              For duplicate charge resolution, send transaction proof (Payment UTR, registered email, and contact number) to <a href="mailto:billing@studyfam.in" className="text-indigo-600 font-semibold underline">billing@studyfam.in</a>. All legitimate claims are resolved within 48 business hours.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
