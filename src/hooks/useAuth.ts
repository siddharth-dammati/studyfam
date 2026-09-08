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
      const supabase = createClient();

      // Fast local session restore
      supabase.auth.getSession().then(({ data: { session } }) => {
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
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        setProfile(extractProfile(currentUser));
        setLoading(false);
        if (currentUser && typeof window !== "undefined" && window.google?.accounts?.id) {
          window.google.accounts.id.cancel();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      const supabase = createClient();
      const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
    } catch (err) {
      console.error("Failed to sign in with Google:", err);
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      if (typeof window !== "undefined" && window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
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
