"use client";

import { useState, useEffect } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";

// Registrations target opening date: October 20, 2026
export const DEFAULT_TARGET_DATE = new Date("2026-10-20T00:00:00+05:30");

export function useRegistrationState() {
  const { config } = useSiteConfig();
  const [isClient, setIsClient] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setIsClient(true);
    setNow(new Date());

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const targetDate = config?.hero?.targetDateIso
    ? new Date(config.hero.targetDateIso)
    : DEFAULT_TARGET_DATE;

  // Master switch: if config says open, it's open; otherwise open once target date passes
  const isManuallyOpen = Boolean(config?.hero?.registrationOpen);
  const isTimeOpen = now.getTime() >= targetDate.getTime();
  const isOpen = isManuallyOpen || isTimeOpen;

  const timeRemaining = isOpen ? 0 : Math.max(0, targetDate.getTime() - now.getTime());

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  return {
    isOpen: isClient ? isOpen : false,
    days,
    hours,
    minutes,
    seconds,
    isClient,
    targetDate,
  };
}
