"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export function ChallengeFriends({ onOpenShare }: { onOpenShare: () => void }) {
  return (
    <section className="py-32 bg-[var(--background)]">
      <div className="max-w-[1000px] mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-mono font-bold text-amber-800 uppercase tracking-wider mb-4">
          <span>🏆 Top Rankers Win 100% Exam Fees</span>
        </div>

        <h2 className="text-h2 font-bold tracking-tight text-[var(--foreground)] mb-4">
          WHO RANKS HIGHER?
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mb-14 leading-relaxed">
          Your friends are preparing for JEE too. Take the same All-India Mock for ₹27, compete on the national leaderboard, and rank on top of the list to win 100% of your official JEE application fees paid back!
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-14">
          <motion.div 
            initial={{ y: 20, rotate: -4 }}
            whileInView={{ y: 0, rotate: -2 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="w-48 bg-white border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-md)]"
          >
            <div className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-4">YOU</div>
            <div className="text-5xl font-bold text-[var(--foreground)] tabular-nums ">187</div>
          </motion.div>

          <div className="text-2xl font-bold text-[var(--foreground-muted)] italic px-4">vs</div>

          <motion.div 
            initial={{ y: 20, rotate: 4 }}
            whileInView={{ y: 0, rotate: 2 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
            className="w-48 bg-[var(--background-subtle)] border border-[var(--accent)]/20 rounded-2xl p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest mb-4">FRIEND</div>
            <div className="text-5xl font-bold text-[var(--accent)] tabular-nums ">176</div>
          </motion.div>
        </div>

        <Button size="lg" onClick={onOpenShare} className="group">
          CHALLENGE FRIENDS & WIN YOUR FEES
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Button>
      </div>
    </section>
  );
}
