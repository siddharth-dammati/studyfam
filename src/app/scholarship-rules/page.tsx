import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata = {
  title: "Fee Support & Merit Scholarship Rules | StudyFam JEE 2027",
  description: "Official legal documentation and rules governing the StudyFam JEE Main 2027 fee support pool, Top N scholarship allocation, and gender parity distribution.",
};

export default function ScholarshipRulesPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-5">
            Official Policy · Document Ref: SF-SCH-2027-V1
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            JEE Fee Support & Scholarship Governance Rules
          </h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
            This document outlines the legally binding terms, mathematical models, eligibility criteria, and disbursement protocols governing the StudyFam JEE Fee Support Pool.
          </p>
          <p className="text-xs font-mono text-slate-400 mt-4">
            Effective Date: September 2026 · Cycle: JEE Main 2027
          </p>
        </div>

        {/* Legal Documentation Content */}
        <div className="space-y-12 text-sm leading-relaxed text-slate-700">
          
          {/* Section 1 */}
          <section id="framework" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-emerald-600 font-mono text-base">1.0</span> The Statutory Funding Mechanism
            </h2>
            <p>
              1.1 <strong>Allocation of Registration Fees:</strong> For every candidate registered for the StudyFam All-India Mock Test at the standard fee of ₹27 (inclusive of applicable taxes and payment gateway charges), a fixed and non-dilutable sum of exactly <strong>₹18.00 (66.67%)</strong> is mandatorily escrowed into the <em>StudyFam JEE Fee Support Pool</em>.
            </p>
            <p>
              1.2 <strong>Platform & Operations Fee:</strong> The remaining <strong>₹9.00 (33.33%)</strong> is retained by StudyFam Technologies as the platform and operational fee.
            </p>
            <p>
              1.3 <strong>Scholarship Pool Integrity:</strong> The ₹18.00 allocated per registration is held in trust exclusively for student fee sponsorships and cannot be redirected to cover platform operating deficits.
            </p>
          </section>

          {/* Section 2 */}
          <section id="formula" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-emerald-600 font-mono text-base">2.0</span> Mathematical Formulation of Top N Beneficiaries
            </h2>
            <p>
              2.1 <strong>Dynamic Scale:</strong> The number of scholarship beneficiaries (N) is mathematically coupled to the total verified participant count (P). As participation expands, N scales proportionally without arbitrary caps.
            </p>
            <p>
              2.2 <strong>Official Benchmark Fees:</strong> Sizing calculations conform to the official examination fee structure promulgated by the National Testing Agency (NTA) for JEE (Main):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Male Candidates (General / Gen-EWS / OBC-NCL):</strong> ₹1,000.00 per session.</li>
              <li><strong>Female Candidates (All Categories):</strong> ₹800.00 per session.</li>
            </ul>
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 my-4">
              <div className="font-mono text-xs font-bold text-slate-900 uppercase">
                The 1,000 Registrations Statutory Model (P = 1,000)
              </div>
              <p className="text-xs text-slate-600">
                Total Pool Accumulated: 1,000 × ₹18 = <strong>₹18,000.00</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900">Top 10 Male Merit Rankers</div>
                  <div className="text-emerald-700 font-mono font-medium">10 × ₹1,000 = ₹10,000.00</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="font-semibold text-slate-900">Top 10 Female Merit Rankers</div>
                  <div className="text-emerald-700 font-mono font-medium">10 × ₹800 = ₹8,000.00</div>
                </div>
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 pt-2 border-t border-slate-200">
                Total Disbursed: ₹10,000 + ₹8,000 = ₹18,000.00 (Exactly 20 Students Funded)
              </div>
            </div>
            <p>
              2.3 <strong>Gender Parity Mandate:</strong> Beneficiary allotments shall be divided equally by gender quota (50% male rankers, 50% female rankers) to encourage female STEM participation in engineering streams across India.
            </p>
          </section>

          {/* Section 3 */}
          <section id="eligibility" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-emerald-600 font-mono text-base">3.0</span> Eligibility & Candidate Verification Protocol
            </h2>
            <p>
              3.1 <strong>Legitimate Aspirant Requirement:</strong> To claim fee reimbursement, candidate must be enrolled in Class 11, Class 12, or be an active dropper candidate eligible to appear for JEE (Main) 2027 per NTA guidelines.
            </p>
            <p>
              3.2 <strong>Documentation Audit:</strong> Within 14 calendar days of rank declaration, eligible Top N candidates must submit:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Government-issued photo identification (Aadhaar Card / School ID / Passport).</li>
              <li>Official NTA JEE (Main) 2027 application confirmation receipt or admit card showing application number.</li>
              <li>Active verified Bank Account (in student or legal guardian&apos;s name) or valid UPI VPA.</li>
            </ul>
            <p>
              3.3 <strong>Integrity Screening:</strong> Any attempt to use automated scripts, multiple proxy accounts, browser extensions, or unauthorized assistance will result in instantaneous forfeiture of rank and scholarship eligibility.
            </p>
          </section>

          {/* Section 4 */}
          <section id="rollover" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-emerald-600 font-mono text-base">4.0</span> Voluntary Opt-Out and Waterfall Roll-Over
            </h2>
            <p>
              4.1 <strong>Opt-Out Privilege:</strong> Candidates from affluent backgrounds who do not require fee assistance are explicitly encouraged to select the <em>&quot;Pass the Support&quot;</em> opt-out option upon rank declaration.
            </p>
            <p>
              4.2 <strong>Automated Roll-Down:</strong> Upon receipt of a voluntary decline or in the event of candidate non-responsiveness after 14 calendar days, the scholarship allocation immediately cascades to the next eligible rank holder (e.g. Rank N+1) in the respective category.
            </p>
            <p>
              4.3 <strong>Zero Residual Balance:</strong> All funds accumulated in the pool must be exhausted toward student sponsorships. No unspent surplus shall revert to StudyFam Technologies.
            </p>
          </section>

          {/* Section 5 */}
          <section id="disbursement" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-emerald-600 font-mono text-base">5.0</span> Disbursement Timeline & Public Audit
            </h2>
            <p>
              5.1 <strong>Direct Benefit Transfer (DBT):</strong> Reimbursements are processed directly to verified bank accounts via NEFT/RTGS or UPI within 7 business days following official verification of the candidate&apos;s NTA application confirmation.
            </p>
            <p>
              5.2 <strong>Public Ledger:</strong> A pseudonymized transparency ledger (displaying Roll Numbers, City, Mock Rank, and Bank UTR Transaction References) will be published on the StudyFam portal for public community audit, maintaining data protection compliance.
            </p>
          </section>

          {/* Section 6 */}
          <section id="grievance" className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">6.0 Grievance & Arbitration</h2>
            <p className="text-xs text-slate-600">
              Any dispute concerning leaderboard scoring or scholarship distribution shall be subject to review by the independent Academic Review Board of StudyFam Technologies. Decisions rendered by the Board upon re-evaluation shall be final and binding. All legal proceedings are subject to the exclusive jurisdiction of the courts of New Delhi, India.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
