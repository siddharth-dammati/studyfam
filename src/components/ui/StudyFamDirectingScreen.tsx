"use client";

import React from "react";
import Link from "next/link";

interface StudyFamDirectingScreenProps {
  destination?: string;
  error?: string | null;
}

export function StudyFamDirectingScreen({
  destination = "/dashboard",
  error = null,
}: StudyFamDirectingScreenProps) {
  return (
    <div className="min-h-screen bg-[#F6F9FF] flex flex-col items-center justify-center p-4 select-none">
      <div className="max-w-sm w-full bg-white border border-[#E3EAF6] rounded-3xl p-8 sm:p-10 text-center shadow-lg">
        {error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-slate-900">Sign-in Unsuccessful</h2>
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl leading-relaxed">
              {error}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-[#0B1526] hover:bg-[#1A5FE0] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Simple, sleek StudyFAM animated icon */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              {/* Clean rotating ring */}
              <div className="absolute inset-0 rounded-2xl border-2 border-blue-100 border-t-[#1A5FE0] animate-spin" />
              {/* StudyFAM Icon with subtle breathing pulse */}
              <div className="w-14 h-14 bg-white rounded-xl shadow-xs flex items-center justify-center p-1.5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icon-512.png"
                  alt="StudyFAM"
                  className="w-full h-full object-contain animate-pulse"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute("src", "/apple-touch-icon.png");
                  }}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0B1526] tracking-tight">
                Directing to Dashboard...
              </h2>
              <p className="text-xs text-[#4B5B76] mt-1">
                Please wait a moment
              </p>
            </div>

            <div className="pt-2">
              <a
                href={destination}
                className="text-[11px] text-[#1A5FE0] hover:underline font-medium"
              >
                Click here if you are not redirected automatically
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
