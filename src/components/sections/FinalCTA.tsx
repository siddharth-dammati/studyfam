"use client";

import { useRegistrationState } from "@/hooks/useRegistrationState";
import { Button } from "@/components/ui/Button";

export function FinalCTA({ onOpenRegistration }: { onOpenRegistration: () => void }) {
  const { isOpen, isClient, days, hours, minutes, seconds } = useRegistrationState();

  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    <section className="py-40 bg-white border-t border-[var(--border)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-h1 font-bold tracking-tighter text-[var(--foreground)] mb-8">
          KNOW WHERE YOU STAND.
        </h2>
        <div className="text-xl md:text-2xl text-[var(--foreground-secondary)] font-medium space-y-2 mb-16">
          <p>Thousands of aspirants.</p>
          <p>Predict your All-India Rank.</p>
          <p className="text-[var(--foreground)] font-bold tracking-wide">₹27.</p>
        </div>

        {!isClient ? (
          <div className="h-24"></div>
        ) : !isOpen ? (
          <div className="figma-card max-w-[500px] mx-auto p-10">
            <p className="eyebrow text-[var(--foreground-secondary)] mb-8">
              REGISTRATIONS OPEN 20 OCTOBER 2026
            </p>
            <div className="flex justify-center gap-4 text-center mb-10">
              {[
                { label: "DAYS", value: days },
                { label: "HOURS", value: hours },
                { label: "MINUTES", value: minutes },
                { label: "SECONDS", value: seconds },
              ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tabular-nums  tracking-tighter">
                    {pad(unit.value)}
                  </span>
                  <span className="text-[10px] md:text-xs text-[var(--foreground-muted)] mt-3 font-semibold uppercase tracking-widest">{unit.label}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="w-full" onClick={onOpenRegistration}>
              JOIN OFFICIAL WAITLIST
            </Button>
          </div>
        ) : (
          <div>
            <p className="eyebrow text-[var(--accent)] mb-8">
              REGISTRATIONS ARE OPEN
            </p>
            <Button size="lg" onClick={onOpenRegistration} className="px-12">
              REGISTER FOR ₹27
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
