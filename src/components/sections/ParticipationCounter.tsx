"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ParticipationCounter() {
  const [count, setCount] = useState(10000);

  useEffect(() => {
    // Simulated growth
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-[var(--background-soft)] relative ">
      <div className="max-w-[1000px] mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-h2 font-bold text-[var(--foreground)] mb-16 tracking-tight">
            THE MORE WHO TAKE IT,<br/>
            THE MORE ACCURATE YOUR PERCENTILE.
          </h2>

          <div className="figma-card relative   p-12 md:p-20 mx-auto bg-white  shadow-[var(--shadow-lg)]">
            
            {/* Elegant Background Viz */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
               {/* Minimal grid */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
               {/* Subtle progress curve */}
               <svg className="absolute bottom-0 w-full h-1/2" preserveAspectRatio="none" viewBox="0 0 100 100">
                 <defs>
                   <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                     <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                   </linearGradient>
                 </defs>
                  <path d="M0,100 C20,90 40,60 100,20 L100,100 Z" fill="currentColor" />
               </svg>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--background-subtle)] text-[var(--accent)] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
                DEMO STATE
              </div>
              
              <div className="text-[clamp(4rem,10vw,8rem)] font-bold text-[var(--foreground)] mb-2 tracking-tighter tabular-nums  leading-none">
                {count.toLocaleString()}+
              </div>
              <div className="text-xl md:text-2xl text-[var(--foreground-muted)] font-medium tracking-wide">
                JEE ASPIRANTS
              </div>
            </div>
          </div>

          <p className="mt-12 text-base text-[var(--foreground-secondary)] font-medium max-w-lg mx-auto">
            Help build India&apos;s biggest independent JEE Main 2027 mock comparison pool. 
          </p>
        </motion.div>
      </div>
    </section>
  );
}
