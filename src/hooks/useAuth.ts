"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AuthUserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const extractProfile = (currentUser: User | null): AuthUserProfile | null => {
    if (!currentUser) return null;
    const meta = currentUser.user_metadata || {};
    return {
      id: currentUser.id,
      email: currentUser.email || meta.email || "",
      fullName: meta.full_name || meta.name || currentUser.email?.split("@")[0] || "Student",
      avatarUrl: meta.avatar_url || meta.picture || undefined,
    };
  };

  useEffect(() => {
    try {
      const supabase: any = createClient();

      // Check if URL has OAuth code or error to process immediately
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const authErr = urlParams.get("error_description") || urlParams.get("error");

        if (authErr) {
          console.error("Supabase OAuth error in URL:", authErr);
        } else if (code) {
          // Explicitly exchange the code on mount
          supabase.auth.exchangeCodeForSession(code).then(({ data, error }: any) => {
            if (error) {
              console.warn("Could not exchange code in useAuth (may have been handled by callback):", error.message);
            } else if (data?.session?.user) {
              setUser(data.session.user);
              setProfile(extractProfile(data.session.user));
            }
            // Clean code query param so refreshes don't re-attempt
            const cleanUrl = window.location.pathname + (window.location.hash || "");
            window.history.replaceState({}, document.title, cleanUrl);
          }).catch((err: any) => {
            console.warn("Exchange code exception in useAuth:", err);
          });
        }
      }

      // Fast local session restore
      supabase.auth.getSession().then(({ data: { session } }: any) => {
        const currentUser = session?.user || null;
        if (currentUser) {
          setUser(currentUser);
          setProfile(extractProfile(currentUser));
          if (typeof window !== "undefined" && window.google?.accounts?.id) {
            window.google.accounts.id.cancel();
          }
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
        const currentUser = session?.user || null;
        const newProfile = extractProfile(currentUser);
        setUser(currentUser);
        setProfile(newProfile);
        setLoading(false);

        if (typeof window !== "undefined") {
          if (event === "SIGNED_OUT" || !currentUser) {
            try {
              localStorage.removeItem("sf_candidate_record");
              localStorage.removeItem("sf_confirmed_order_id");
              sessionStorage.clear();
            } catch {}
          } else if (newProfile?.email) {
            try {
              const cachedRaw = localStorage.getItem("sf_candidate_record");
              if (cachedRaw) {
                const parsed = JSON.parse(cachedRaw);
                if (parsed?.email && parsed.email.toLowerCase() !== newProfile.email.toLowerCase()) {
                  localStorage.removeItem("sf_candidate_record");
                  localStorage.removeItem("sf_confirmed_order_id");
                }
              }
            } catch {}
          }

          if (currentUser && window.google?.accounts?.id) {
            window.google.accounts.id.cancel();
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async (nextPathOrEvent?: any) => {
    try {
      const supabase: any = createClient();
      const targetNext =
        typeof nextPathOrEvent === "string"
          ? nextPathOrEvent
          : typeof window !== "undefined"
          ? window.location.pathname
          : "/dashboard";

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("sf_auth_next", targetNext);
        } catch {}
      }

      // Always prioritize the official studyfam domain so users are never redirected to localhost
      const origin =
        typeof window !== "undefined" && window.location.origin.includes("studyfam")
          ? window.location.origin
          : "https://studyfam.in";

      // Clean callback URL without query params to avoid Supabase strict whitelist rejection
      const redirectTo = `${origin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        console.error("Failed to sign in with Google:", error);
        alert("Google sign in error: " + error.message);
        return;
      }

      if (data?.url && typeof window !== "undefined") {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Failed to sign in with Google:", err);
      alert("Error initiating Google sign in: " + (err?.message || "Unknown error"));
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("sf_candidate_record");
          localStorage.removeItem("sf_confirmed_order_id");
          sessionStorage.clear();
        } catch {}
        if (window.google?.accounts?.id) {
          window.google.accounts.id.disableAutoSelect();
        }
      }
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut,
  };
}
