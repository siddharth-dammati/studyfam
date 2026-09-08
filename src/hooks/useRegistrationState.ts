
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

// Registrations are now open (default date set to past)
export const DEFAULT_TARGET_DATE = new Date("2026-01-01T00:00:00+05:30");

export function useRegistrationState() {
  const [isClient, setIsClient] = useState(false);
  const [now, setNow] = useState(new Date());
  const [targetDate, setTargetDate] = useState<Date>(DEFAULT_TARGET_DATE);
  const [forceOpen, setForceOpen] = useState(true);

  useEffect(() => {
    setIsClient(true);
    setNow(new Date());

    // Fetch dynamic config from Supabase
    const fetchConfig = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("app_config")
          .select("key, value")
          .in("key", ["registration_open", "registration_open_date"]);

        if (data && data.length > 0) {
          const openToggle = data.find((d) => d.key === "registration_open");
          if (openToggle?.value === "true" || openToggle?.value === "1") {
            setForceOpen(true);
            return;
          }

          const dateConfig = data.find((d) => d.key === "registration_open_date");
          if (dateConfig?.value) {
            const parsed = new Date(dateConfig.value);
            if (!isNaN(parsed.getTime())) {
              setTargetDate(parsed);
              setForceOpen(false);
            }
          }
        }
      } catch {
        // Fallback to default open
      }
    };
    fetchConfig();

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isOpen = forceOpen || now.getTime() >= targetDate.getTime();
  const timeRemaining = isOpen ? 0 : Math.max(0, targetDate.getTime() - now.getTime());

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  return {
    isOpen: isClient ? isOpen : true,
    days,
    hours,
    minutes,
    seconds,
    isClient,
  };
}


