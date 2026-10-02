import { ExternalPageShell } from "@/components/layout/ExternalPageShell";
import { ContactForm } from "@/components/ui/ContactForm";
import { Mail, Clock, ShieldCheck, Headphones, MessageSquare, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Contact & Grievance Redressal | StudyFam",
  description: "Official contact details, candidate support channels, and statutory Grievance Officer information for StudyFam Technologies.",
};

export default function ContactPage() {
  return (
    <ExternalPageShell
      badgeText="Candidate Support & Grievance Desk"
      badgeTone="blue"
      title="Contact &"
      titleGradient="Student Support"
      subtitle="Have questions regarding your CBT exam slot, admit card credentials, scholarship disbursement, or technical issues? Our support and academic integrity desks are here to assist."
      metaItems={[
        { label: "Candidate Desk", value: "support@studyfam.in" },
        { label: "Escrow Desk", value: "scholarships@studyfam.in" },
        { label: "Support Hours", value: "Mon – Sat (09:00 – 19:00 IST)" },
        { label: "Exam Day", value: "24/7 Live Helpline" },
      ]}
      maxWidth="wide"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
        {/* Left Form: Wrapped in Tokko 20px Card */}
        <div className="lg:col-span-7 tokko-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E3EAF6] pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A5FE0] bg-[#EFF5FF] px-2.5 py-1 rounded-md inline-block mb-2">
              Direct Query Ticket
            </span>
            <h3 className="text-xl font-bold text-[#0B1526] tracking-tight">
              Submit a Candidate Support Request
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5B76] mt-1">
              Fill out the form below. We typically respond within 24 business hours.
            </p>
          </div>

          <ContactForm />
        </div>

        {/* Right Cards: Direct Channels, Grievance, Operational Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Support Channels */}
          <div className="tokko-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0B1526]">
              <Mail className="w-4 h-4 text-[#1A5FE0]" />
              <span>Official Email Channels</span>
            </div>
            <div className="space-y-3 text-xs text-[#4B5B76] font-mono">
              <div className="p-3 rounded-xl bg-[#F6F9FF] border border-[#E3EAF6]">
                <div className="text-[#7A8CA8] text-[10px] uppercase font-bold">Candidate Inquiries</div>
                <a href="mailto:support@studyfam.in" className="text-[#1A5FE0] font-bold text-xs underline">
                  support@studyfam.in
                </a>
              </div>
              <div className="p-3 rounded-xl bg-[#F6F9FF] border border-[#E3EAF6]">
                <div className="text-[#7A8CA8] text-[10px] uppercase font-bold">Scholarship &amp; Escrow Desk</div>
                <a href="mailto:scholarships@studyfam.in" className="text-[#1A5FE0] font-bold text-xs underline">
                  scholarships@studyfam.in
                </a>
              </div>
              <div className="p-3 rounded-xl bg-[#F6F9FF] border border-[#E3EAF6]">
                <div className="text-[#7A8CA8] text-[10px] uppercase font-bold">Institutional / School Outreach</div>
                <a href="mailto:partners@studyfam.in" className="text-[#1A5FE0] font-bold text-xs underline">
                  partners@studyfam.in
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#7A8CA8] text-[11px] pt-1">
              <Clock size={13} className="text-emerald-600 shrink-0" />
              <span>Average response time: 24–48 Business Hours</span>
            </div>
          </div>

          {/* Statutory Grievance Redressal (IT Act 2021 & DPDP Act 2023) */}
          <div id="grievance" className="tokko-card p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0B1526]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Statutory Grievance Redressal</span>
            </div>
            <p className="text-xs text-[#4B5B76] leading-relaxed">
              Designated pursuant to Section 5(1) of the Information Technology Rules, 2021 and Section 32 of the DPDP Act 2023:
            </p>
            <div className="space-y-1.5 font-mono text-xs text-[#0B1526] bg-[#F6F9FF] p-4 rounded-xl border border-[#E3EAF6]">
              <div><strong>Officer:</strong> Chief Legal &amp; Compliance Officer</div>
              <div>
                <strong>Email:</strong>{" "}
                <a href="mailto:grievance@studyfam.in" className="text-[#1A5FE0] font-bold underline">
                  grievance@studyfam.in
                </a>
              </div>
              <div className="text-[#7A8CA8] text-[11px] pt-1">
                Formal complaints resolved within 15 working days.
              </div>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="tokko-card p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#0B1526]">
              <Clock className="w-4 h-4 text-[#7A8CA8]" />
              <span>Operational Schedule</span>
            </div>
            <p className="text-[#4B5B76] text-[11px] leading-relaxed">
              StudyFam operates as an All-India digital testing platform. Candidate support is active Monday through Saturday, 09:00 – 19:00 IST. On Sunday, 27 December 2026, 24/7 technical monitoring is active.
            </p>
          </div>
        </div>
      </div>
    </ExternalPageShell>
  );
}
