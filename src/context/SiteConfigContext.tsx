"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_SITE_CONFIG, SiteConfig, parseSiteConfig } from "@/lib/siteConfig";

interface SiteConfigContextType {
  config: SiteConfig;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  updateLocalConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: DEFAULT_SITE_CONFIG,
  loading: true,
  refreshConfig: async () => {},
  updateLocalConfig: () => {},
});

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("sf_site_config");
        if (cached) {
          return parseSiteConfig(JSON.parse(cached));
        }
      } catch {}
    }
    return DEFAULT_SITE_CONFIG;
  });
  const [loading, setLoading] = useState(true);

  const fetchLatestConfig = async () => {
    try {
      const res = await fetch("/api/config", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.config) {
          const parsed = parseSiteConfig(data.config);
          setConfig(parsed);
          try {
            localStorage.setItem("sf_site_config", JSON.stringify(parsed));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Failed to fetch dynamic site config, using cached/defaults:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestConfig();
  }, []);

  const updateLocalConfig = (updater: (prev: SiteConfig) => SiteConfig) => {
    setConfig((prev) => {
      const updated = updater(prev);
      try {
        localStorage.setItem("sf_site_config", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        loading,
        refreshConfig: fetchLatestConfig,
        updateLocalConfig,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
