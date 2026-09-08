import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Mail, Clock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Contact & Grievance Redressal | StudyFam",
  description: "Official contact details, candidate support channels, and statutory Grievance Officer information for StudyFam Technologies.",
};

export default function ContactPage() {
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
      <main className="flex-1 pt-36 pb-24 max-w-[900px] mx-auto px-6 w-full">
        {/* Header */}
        <div className="mb-14 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-5">
            Support & Redressal Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">
            Contact & Candidate Support
          </h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
            Have questions regarding test scheduling, admit credentials, scholarship disbursement, or technical issues? Our support and academic integrity desks are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Submit an Inquiry</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">Full Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors" placeholder="e.g. Aryan Sharma" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">Registered Email</label>
                  <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors" placeholder="student@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">WhatsApp / Phone</label>
                  <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">Inquiry Department</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors">
                  <option>Mock Test Registration & Payment Confirmation</option>
                  <option>CBT Examination Engine & Browser Compatibility</option>
                  <option>Top N Scholarship Verification & Payout</option>
                  <option>Question Key Challenge & Score Audit</option>
                  <option>Other Institutional / Partnership Queries</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">Detailed Message</label>
                <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors resize-none" placeholder="Describe your query in detail..."></textarea>
              </div>
              <Button type="submit" size="lg" className="w-full mt-2">
                Submit Support Ticket
              </Button>
            </form>
          </div>

          {/* Right Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Support Channels */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                Official Communication Channels
              </h4>
              <div className="space-y-2 text-slate-600 font-mono">
                <p><strong>Candidate Desk:</strong> <a href="mailto:support@studyfam.in" className="text-indigo-600 underline">support@studyfam.in</a></p>
                <p><strong>Fee Support Escrow:</strong> <a href="mailto:scholarships@studyfam.in" className="text-indigo-600 underline">scholarships@studyfam.in</a></p>
                <p><strong>Institutional Desk:</strong> <a href="mailto:partners@studyfam.in" className="text-indigo-600 underline">partners@studyfam.in</a></p>
              </div>
              <div className="flex items-center gap-2 text-slate-500 pt-2 border-t border-slate-200 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Response SLA: Within 24-48 Business Hours</span>
              </div>
            </div>

            {/* Grievance Redressal (IT Act Statutory Requirement) */}
            <div id="grievance" className="p-6 rounded-2xl bg-white border border-slate-200 text-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Statutory Grievance Redressal
              </h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Appointed pursuant to Section 5(1) of the Information Technology Rules, 2021 & Section 32 of the DPDP Act 2023:
              </p>
              <div className="space-y-1 font-mono text-[11px] text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p><strong>Officer:</strong> Legal & Compliance Head</p>
                <p><strong>Email:</strong> <a href="mailto:grievance@studyfam.in" className="text-indigo-600 underline">grievance@studyfam.in</a></p>
                <p><strong>Resolution Timeline:</strong> Within 15 working days</p>
              </div>
            </div>

            {/* Operational Desk */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Operational Hours
              </h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                StudyFam operates as a pan-India digital testing platform. Candidate support and verification inquiries are managed online Monday through Saturday, 09:00 - 19:00 IST.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
