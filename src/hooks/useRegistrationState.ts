
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export const DEFAULT_TARGET_DATE = new Date("2026-11-27T20:27:00+05:30");

export function useRegistrationState() {
  const [isClient, setIsClient] = useState(false);
  const [now, setNow] = useState(new Date());
  const [targetDate, setTargetDate] = useState<Date>(DEFAULT_TARGET_DATE);

  useEffect(() => {
    setIsClient(true);
    setNow(new Date());

    // Fetch dynamic config from Supabase
    const fetchConfig = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("app_config")
          .select("value")
          .eq("key", "registration_open_date")
          .single();

        if (data?.value) {
          const parsed = new Date(data.value);
          if (!isNaN(parsed.getTime())) {
            setTargetDate(parsed);
          }
        }
      } catch {
        // Fallback to default
      }
    };
    fetchConfig();

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isOpen = now.getTime() >= targetDate.getTime();
  const timeRemaining = Math.max(0, targetDate.getTime() - now.getTime());

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
  };
}

