"use client";

import { useRegistrationState } from "@/hooks/useRegistrationState";
import { Button } from "./Button";

export function StickyCTA({ onOpenRegistration }: { onOpenRegistration: () => void }) {
  const { isOpen, isClient } = useRegistrationState();

  if (!isClient) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-md border-t border-[rgba(0,0,0,0.05)] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {isOpen ? (
        <Button size="lg" className="w-full text-base font-bold" onClick={onOpenRegistration}>
          REGISTER FOR ₹27 <span className="ml-2">→</span>
        </Button>
      ) : (
        <Button size="lg" variant="secondary" className="w-full text-sm font-bold" onClick={onOpenRegistration}>
          OPENS NOV 27 · 20:27 IST
        </Button>
      )}
    </div>
  );
}
