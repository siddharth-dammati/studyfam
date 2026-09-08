"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Who can take this mock test?",
    a: "Any student preparing for JEE Main 2027 — Class 11, Class 12, or a dropper. The test is open to all Indian students regardless of coaching or school affiliation."
  },
  {
    q: "What is the exam date and time?",
    a: "The mock test will be held on 27 December 2026 from 9:00 AM to 12:00 PM IST. Mark it in your calendar. It is a single-slot, single-day national event."
  },
  {
    q: "Why is the fee only ₹27?",
    a: "The goal is maximum participation. A higher fee reduces the pool size — which makes the rank data less meaningful. ₹27 is intentionally low to include every serious JEE aspirant."
  },
  {
    q: "What do I get after taking the test?",
    a: "You receive a complete performance report: your score, subject-wise breakdown, time analysis, predicted All-India Rank, percentile, and comparison with the national pool."
  },
  {
    q: "How can I win my official JEE Main exam fees?",
    a: "Top-performing students on the All-India Mock leaderboard receive full reimbursement of their official NTA JEE Main 2027 application fees as a merit scholarship. The scholarship pool is funded directly by allocating ₹18 from every ₹27 mock test registration."
  },
  {
    q: "How many students (Top N) receive the scholarship?",
    a: "The number of sponsored students (N) expands dynamically with registrations with equal gender representation. For example, with 1,000 registrations (₹18,000 pool): Top 10 Boys receive ₹1,000 each (₹10,000) and Top 10 Girls receive ₹800 each (₹8,000), funding Top 20 students in total (₹10,000 + ₹8,000 = ₹18,000). At 10,000 registrations, Top 100 Boys + Top 100 Girls (200 students) win; and at 50,000 registrations, Top 1,000 students win!"
  },
  {
    q: "How is the ₹18 fee support allocated?",
    a: "₹18 from each ₹27 registration deposits directly into the scholarship pool. Awards are distributed in rank order based on official NTA category exam fees (₹1,000 for male candidates / ₹800 for female candidates). If a student voluntarily declines, the grant passes to the next eligible rank on the leaderboard."
  },
  {
    q: "Can I take the test from home?",
    a: "Yes. The mock is computer-based and accessible from any device with a browser. You will interact with a simulation of the official NTA CBT interface."
  },
  {
    q: "What happens after registration opens?",
    a: "Once you register, you will receive your candidate details, test slot confirmation, and a preparation guide. Notify Me ensures you don't miss the registration window."
  },
  {
    q: "Is the question paper the same for everyone?",
    a: "Yes. One common paper, across all students, on the same day at the same time. This is what makes the All-India comparison meaningful."
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 bg-[var(--surface-1)] border-t border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Left sticky header */}
          <div className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start">
            <span className="text-[var(--indigo-500)] text-xs font-mono uppercase tracking-widest mb-5 block">FAQ</span>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-6">
              Common<br />questions.
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Everything you need to know before registering. Can&apos;t find your answer?
            </p>
            <a href="mailto:support@studyfam.in" className="inline-flex items-center gap-1.5 text-[var(--indigo-600)] text-sm font-semibold mt-4 hover:opacity-80 transition-opacity">
              Email us →
            </a>
          </div>

          {/* Right: Accordion */}
          <div className="lg:col-span-3 space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--border-strong)] transition-colors"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${open === i ? "rotate-180 text-[var(--indigo-500)]" : ""}`}
                  />
                </button>
                {open === i && (
                  <div className="px-6 pb-5 -mt-1">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
