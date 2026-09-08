"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export function ChallengeFriends({ onOpenShare }: { onOpenShare: () => void }) {
  return (
    <section className="py-32 bg-[var(--background)]">
      <div className="max-w-[1000px] mx-auto px-4 text-center">
        <h2 className="text-h2 font-bold tracking-tight text-[var(--foreground)] mb-20">
          WHO RANKS HIGHER?
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-20">
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

        <p className="text-lg text-[var(--foreground-secondary)] mb-10 max-w-xl mx-auto">
          Your friends are preparing for JEE too. Get them into the same mock and see who ranks higher.
        </p>

        <Button size="lg" onClick={onOpenShare} className="group">
          CHALLENGE YOUR FRIENDS 
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Button>
      </div>
    </section>
  );
}
