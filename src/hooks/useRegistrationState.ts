
import { useState, useEffect } from "react";

export const TARGET_DATE = new Date("2026-11-27T20:27:00+05:30");

export function useRegistrationState() {
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

  const isOpen = now.getTime() >= TARGET_DATE.getTime();
  const timeRemaining = Math.max(0, TARGET_DATE.getTime() - now.getTime());

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

