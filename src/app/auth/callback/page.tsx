"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { StudyFamDirectingScreen } from "@/components/ui/StudyFamDirectingScreen";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nextDestination, setNextDestination] = useState<string>("/dashboard");

  useEffect(() => {
    let mounted = true;

    async function handleAuth() {
      try {
        const supabase = createClient();
        const code = searchParams.get("code");
        const errDesc = searchParams.get("error_description") || searchParams.get("error");

        let target = "/dashboard";
        if (typeof window !== "undefined") {
          try {
            const saved = sessionStorage.getItem("sf_auth_next");
            const fromParam = searchParams.get("next");
            target = saved || fromParam || "/dashboard";
            setNextDestination(target);
            if (saved) sessionStorage.removeItem("sf_auth_next");
          } catch {}
        }

        if (errDesc) {
          if (mounted) setErrorMessage(errDesc);
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            // Check if detectSessionInUrl already handled it
            const { data: sessData } = await supabase.auth.getSession();
            if (sessData?.session?.user && mounted) {
              router.replace(target);
              return;
            }
            if (mounted) setErrorMessage(error.message);
            return;
          }

          if (mounted) {
            router.replace(target);
          }
          return;
        }

        // If no code, check existing active session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          router.replace(target);
        } else if (!session?.user && mounted) {
          setTimeout(async () => {
            if (!mounted) return;
            const { data: retrySess } = await supabase.auth.getSession();
            if (retrySess?.session?.user) {
              router.replace(target);
            } else {
              setErrorMessage("No authentication response found. Please sign in again.");
            }
          }, 600);
        }
      } catch (err: any) {
        if (mounted) {
          setErrorMessage(err?.message || "Unexpected authentication error.");
        }
      }
    }

    handleAuth();

    return () => {
      mounted = false;
    };
  }, [searchParams, router]);

  return (
    <StudyFamDirectingScreen
      destination={nextDestination}
      error={errorMessage}
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<StudyFamDirectingScreen destination="/dashboard" />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
