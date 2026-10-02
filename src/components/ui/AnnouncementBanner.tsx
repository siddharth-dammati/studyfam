"use client";

import React, { useState, useEffect } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { DEFAULT_SITE_CONFIG } from "@/lib/siteConfig";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { usePathname } from "next/navigation";

export function AnnouncementBanner() {
  const pathname = usePathname();
  const { config } = useSiteConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === "/") {
    return null;
  }

  // Use default during SSR / initial hydration to eliminate mismatch with localStorage cache
  const banner = (mounted ? config?.announcement : DEFAULT_SITE_CONFIG.announcement) || DEFAULT_SITE_CONFIG.announcement;

  if (!banner || !banner.enabled || !banner.text) {
    return null;
  }

  return (
    <div className="relative z-50 bg-gradient-to-r from-[#0A1C96] via-[#1A5FE0] to-[#0A1C96] text-white text-xs py-2 px-4 border-b border-blue-400/25">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
        {banner.badge && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-extrabold uppercase tracking-wider border border-emerald-400/30 shrink-0">
            {banner.badge}
          </span>
        )}
        <span className="font-medium text-slate-100 text-[11px] sm:text-xs leading-tight">
          {banner.text}
        </span>
        {banner.linkText && banner.linkUrl && (
          <Link
            href={banner.linkUrl}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2 ml-1 transition-colors"
          >
            <span>{banner.linkText}</span>
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}
