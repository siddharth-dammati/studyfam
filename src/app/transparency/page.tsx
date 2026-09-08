import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Financial Transparency & Governance Report | StudyFam",
  description: "Audited breakdown of the ₹18 scholarship pool allocation, escrow management, and payout verification for the StudyFam JEE Main 2027 All India Mock.",
};

export default function TransparencyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-5">
            Public Transparency Statement · Ref: SF-AUDIT-2027
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            Scholarship Pool Transparency & Governance
          </h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
            Complete transparency on the student scholarship fund. We openly publish our allocation rules, escrow protections, and disbursement verification standards.
          </p>
          <p className="text-xs font-mono text-slate-400 mt-4">
            Auditing Standard: Social Governance Framework · Cycle: JEE Main 2027
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-sm leading-relaxed text-slate-700">

          {/* Allocation Breakdown */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              1. The ₹27 Registration Allocation Structure
            </h2>
            <p>
              StudyFam operates with complete clarity regarding student fee allocations. From every ₹27 registration, funds are structured into two distinct portions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-800 mb-1">₹18.00</div>
                <div className="text-xs font-mono font-bold uppercase text-emerald-900 mb-3 tracking-wide">
                  66.67% · Student Fee Support Pool
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Directly allocated into an independent escrow reserve account. 100% of these funds are dedicated to paying full JEE Main application fees for top-performing eligible students per published merit guidelines.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900 mb-1">₹9.00</div>
                <div className="text-xs font-mono font-bold uppercase text-slate-700 mb-3 tracking-wide">
                  33.33% · StudyFam Platform & Operations
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Retained by StudyFam Technologies as the platform and operations fee for software hosting, testing infrastructure, candidate management, and operational services.
                </p>
              </div>
            </div>
          </section>

          {/* Independent Escrow & Disbursement Security */}
          <section id="escrow" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              2. Independent Escrow & Scholarship Disbursement Security
            </h2>
            <p>
              2.1 <strong>Segregated Bank Accounts:</strong> All scholarship pool funds (₹18 per registration) are maintained in a dedicated bank account in India. These funds are held in trust exclusively for eligible candidate disbursements.
            </p>
            <p>
              2.2 <strong>Third-Party Reconciliation:</strong> Following the completion of the 27 December 2027 All India Mock, an independent Chartered Accountant firm will conduct a reconciliation audit verifying that 100% of the scholarship reserve is accounted for and distributed to verified student rankers.
            </p>
            <p>
              2.3 <strong>Public Proof-of-Payout:</strong> An anonymized payout ledger displaying candidate Roll Numbers, Category, Rank, and Bank UTR Transaction References will be published for public community verification upon completion of disbursements.
            </p>
          </section>

          {/* Verification Standards */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              3. Verification & Governance Safeguards
            </h2>
            <p>
              To ensure scholarship funds reach genuine candidates:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Candidates must provide official NTA JEE Main 2027 application receipts showing their application number and fee payment.</li>
              <li>Aadhaar/Identity verification is completed prior to electronic bank transfer to avoid multi-account fraud.</li>
              <li>If any candidate declines or fails verification, the scholarship moves immediately to the next eligible student on the leaderboard.</li>
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
