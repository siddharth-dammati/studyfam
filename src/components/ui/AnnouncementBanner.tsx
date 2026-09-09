"use client";

import React from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function AnnouncementBanner() {
  const { config } = useSiteConfig();
  const banner = config?.announcement;

  if (!banner || !banner.enabled || !banner.text) {
    return null;
  }

  return (
    <div className="relative z-50 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white text-xs py-2 px-4 border-b border-indigo-500/30">
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
