"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface GoogleSignInButtonProps {
  text?: "signin_with" | "continue_with" | "signup_with";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "small" | "medium" | "large";
  shape?: "rectangular" | "pill" | "circle";
  width?: number;
  className?: string;
}

declare global {
  interface Window {
    google?: any;
    __googleGsiLoaded?: boolean;
  }
}

export function GoogleSignInButton({
  text = "signin_with",
  theme = "outline",
  size = "medium",
  shape = "pill",
  width,
  className = "",
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { signInWithGoogle, profile } = useAuth();
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "655007764370-h48i629okpm01d7mfvutjsq69a6sh7uj.apps.googleusercontent.com";

  useEffect(() => {
    if (profile || !googleClientId) return;

    const initializeGsi = () => {
      if (!window.google?.accounts?.id || !containerRef.current) return;

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: { credential: string }) => {
          try {
            const supabase = createClient();
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.credential,
            });

            if (error) {
              console.error("Supabase signInWithIdToken error:", error.message, error);
            } else if (data?.user) {
              window.location.reload();
            }
          } catch (err) {
            console.error("Supabase signInWithIdToken error:", err);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render official Google button
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme,
        size,
        text,
        shape,
        logo_alignment: "left",
        width,
      });

      // Optional One-Tap prompt
      window.google.accounts.id.prompt();
    };

    if (window.google?.accounts?.id) {
      initializeGsi();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGsi;
      document.body.appendChild(script);
    }
  }, [googleClientId, profile, text, theme, size, shape, width]);

  if (profile) return null;

  // Fallback to standard OAuth button if client ID is not configured yet
  if (!googleClientId) {
    return (
      <button
        onClick={signInWithGoogle}
        className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs ${className}`}
      >
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>{text === "continue_with" ? "Continue with Google" : "Sign in"}</span>
      </button>
    );
  }

  return <div ref={containerRef} className={`inline-block ${className}`} />;
}
