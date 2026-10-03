"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface StudyFamDirectingScreenProps {
  destination?: string;
  candidateName?: string;
  delayMs?: number;
  onComplete?: () => void;
  error?: string | null;
}

export function StudyFamDirectingScreen({
  destination = "/dashboard",
  candidateName,
  delayMs = 1500,
  onComplete,
  error = null,
}: StudyFamDirectingScreenProps) {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Verifying Google credentials...");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (error) return;

    // Stage 1: Initializing
    const t1 = setTimeout(() => {
      setProgress(45);
      setStatusText("Synchronizing candidate profile & mock tests...");
    }, Math.floor(delayMs * 0.28));

    // Stage 2: Preparing dashboard
    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusText("Preparing your candidate console...");
      setIsReady(true);
    }, Math.floor(delayMs * 0.65));

    // Stage 3: Directing
    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Redirecting to your dashboard...");
      if (onComplete) {
        onComplete();
      } else {
        window.location.href = destination;
      }
    }, delayMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [destination, delayMs, onComplete, error]);

  return (
    <div className="min-h-screen bg-[#F6F9FF] text-[#0B1526] font-sans flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Scoped CSS animations for StudyFAM icon directing animation */}
      <style>{`
        @keyframes sf-ripple-pulse {
          0% {
            transform: scale(0.92);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.25;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }
        @keyframes sf-orbit-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sf-icon-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.03);
          }
        }
        @keyframes sf-glow-pulse {
          0%, 100% {
            opacity: 0.6;
            filter: blur(28px);
          }
          50% {
            opacity: 0.9;
            filter: blur(40px);
          }
        }
        .sf-ripple-1 {
          animation: sf-ripple-pulse 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
        }
        .sf-ripple-2 {
          animation: sf-ripple-pulse 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 0.7s;
        }
        .sf-orbit-ring {
          animation: sf-orbit-spin 3.2s linear infinite;
        }
        .sf-floating-icon {
          animation: sf-icon-float 2.6s ease-in-out infinite;
        }
      `}</style>

      {/* Background ambient color glow blobs matching Tokko palette */}
      <div
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-300/35 pointer-events-none"
        style={{ animation: "sf-glow-pulse 4s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-purple-300/35 pointer-events-none"
        style={{ animation: "sf-glow-pulse 4s ease-in-out infinite 2s" }}
      />

      <div className="max-w-[440px] w-full bg-white/95 backdrop-blur-xl border border-[#E3EAF6] rounded-[32px] p-8 sm:p-10 text-center shadow-[0_24px_50px_-12px_rgba(10,28,150,0.12)] relative z-10">
        {/* 1. Official StudyFAM Animated Icon Stage */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          {/* Concentric ambient ripples */}
          <div className="absolute inset-0 rounded-full bg-blue-400/20 sf-ripple-1" />
          <div className="absolute inset-0 rounded-full bg-indigo-500/15 sf-ripple-2" />

          {/* Luminous spinning gradient ring */}
          <div
            className="absolute inset-2 rounded-full sf-orbit-ring p-[3px]"
            style={{
              background:
                "conic-gradient(from 0deg, #1A5FE0, #0A1C96, #D6AEF2, #38BDF8, #1A5FE0)",
            }}
          >
            <div className="w-full h-full bg-white rounded-full" />
          </div>

          {/* Central floating StudyFAM icon container */}
          <div className="relative w-24 h-24 rounded-2xl bg-white shadow-[0_12px_28px_-6px_rgba(10,28,150,0.22)] border border-[#E3EAF6] flex items-center justify-center p-3 sf-floating-icon overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon-512.png"
              alt="StudyFAM"
              className="w-full h-full object-contain drop-shadow-sm rounded-xl"
              onError={(e) => {
                // Fallback to apple-touch-icon if icon-512 fails
                (e.target as HTMLElement).setAttribute("src", "/apple-touch-icon.png");
              }}
            />

            {/* Corner success tick badge when verified */}
            {isReady && (
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs transition-all duration-300 scale-105">
                <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
              </div>
            )}
          </div>
        </div>

        {/* 2. Brand Identity Header */}
        <div className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-blue.png"
            alt="StudyFAM Logo"
            className="h-7 w-auto mx-auto object-contain mb-3"
          />

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Authenticated with Google
          </span>
        </div>

        {/* 3. Status Headings */}
        {error ? (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-rose-600">Sign-in interrupted</h2>
            <p className="text-xs text-rose-600/90 bg-rose-50 border border-rose-200 p-3 rounded-xl">
              {error}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0B1526] hover:bg-[#1A5FE0] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B1526] tracking-tight">
              Directing to Dashboard...
            </h2>
            <p className="text-xs sm:text-[13px] text-[#4B5B76] leading-relaxed max-w-xs mx-auto">
              {candidateName
                ? `Welcome back, ${candidateName}! Opening your examination console.`
                : "Setting up your candidate reference slip, mock tests & scholarship rank."}
            </p>

            {/* 4. Animated Progress Bar */}
            <div className="pt-4 pb-2">
              <div className="w-full h-2 bg-[#E3EAF6] rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, #1A5FE0 0%, #0A1C96 50%, #D6AEF2 100%)",
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px] text-[#4B5B76] font-medium">
                <span className="truncate pr-2">{statusText}</span>
                <span className="font-mono font-bold text-[#1A5FE0] shrink-0">{progress}%</span>
              </div>
            </div>

            {/* 5. Fallback Manual Link */}
            <div className="pt-3">
              <a
                href={destination}
                className="inline-flex items-center gap-1.5 text-xs text-[#1A5FE0] hover:text-[#0A1C96] font-bold transition-colors cursor-pointer group"
              >
                <span>Click here if not redirected automatically</span>
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
