"use client";

import { motion } from "framer-motion";

export function Timeline() {
  const events = [
    { date: "OPEN NOW", time: "ACTIVE", title: "REGISTRATIONS OPEN", desc: "Secure your spot for ₹27 via UPI & Cards." },
    { date: "27 DEC 2026", time: "9:00 AM – 12:00 PM IST", title: "MOCK TEST DAY", desc: "Take the All-India Mock from your device." },
    { date: "AFTER TEST", time: "TBA", title: "RESULTS & ANALYSIS", desc: "Get your expected All-India Rank & Percentile." },
  ];

  return (
    <section className="py-32 bg-[var(--background-soft)] relative">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-h2 font-bold tracking-tight text-[var(--foreground)] mb-24 text-center">
          EVENT TIMELINE
        </h2>

        <div className="relative border-l border-[var(--border-strong)] ml-4 md:ml-0 md:border-none">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-[var(--border-strong)] -translate-x-1/2 z-0" />
          
          {events.map((event, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative z-10 flex flex-col md:flex-row items-start md:items-center mb-16 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="absolute left-[-21px] md:static md:left-auto w-10 h-10 rounded-full bg-white border border-[var(--border-strong)] shadow-sm flex items-center justify-center mb-4 md:mb-0 z-10 shrink-0 md:mx-auto">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
              </div>
              
              <div className={`pl-8 md:pl-0 flex-1 w-full ${i % 2 === 0 ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}>
                <div className="figma-card p-8  inline-block w-full md:w-auto min-w-[280px]">
                  <div className="text-[var(--accent)] font-bold mb-1 tracking-wide">{event.date}</div>
                  <div className="text-[var(--foreground-muted)] text-xs font-semibold uppercase tracking-widest mb-4">{event.time}</div>
                  <div className="text-xl font-bold text-[var(--foreground)] mb-2">{event.title}</div>
                  <p className="text-sm text-[var(--foreground-secondary)] font-medium">{event.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
