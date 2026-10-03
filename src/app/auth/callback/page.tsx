"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { StudyFamDirectingScreen } from "@/components/ui/StudyFamDirectingScreen";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [candidateName, setCandidateName] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [nextDestination, setNextDestination] = useState<string>("/dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("sf_auth_next");
        const fromParam = searchParams.get("next");
        const resolved = saved || fromParam || "/dashboard";
        setNextDestination(resolved);
        if (saved) sessionStorage.removeItem("sf_auth_next");
      } catch {}
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    async function handleAuth() {
      try {
        const supabase = createClient();
        const code = searchParams.get("code");
        const errDesc = searchParams.get("error_description") || searchParams.get("error");

        if (errDesc) {
          if (mounted) {
            setErrorMessage(errDesc);
          }
          return;
        }

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            // Check if detectSessionInUrl already successfully established the session
            const { data: sessData } = await supabase.auth.getSession();
            if (sessData?.session?.user) {
              const meta = sessData.session.user.user_metadata || {};
              const name = meta.full_name || meta.name;
              if (mounted && name) setCandidateName(name);
              return;
            }
            if (mounted) {
              setErrorMessage(error.message);
            }
            return;
          }

          if (data?.session?.user && mounted) {
            const meta = data.session.user.user_metadata || {};
            const name = meta.full_name || meta.name;
            if (name) setCandidateName(name);
          }
          return;
        }

        // If no code in query params, check existing active session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const meta = session.user.user_metadata || {};
          const name = meta.full_name || meta.name;
          if (name) setCandidateName(name);
        } else if (!session?.user && mounted) {
          // If neither code nor session, give a small grace period for storage sync
          setTimeout(async () => {
            if (!mounted) return;
            const { data: retrySess } = await supabase.auth.getSession();
            if (retrySess?.session?.user) {
              const meta = retrySess.session.user.user_metadata || {};
              const name = meta.full_name || meta.name;
              if (name) setCandidateName(name);
            } else {
              setErrorMessage("No authentication response found. Please sign in again.");
            }
          }, 800);
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
  }, [searchParams]);

  return (
    <StudyFamDirectingScreen
      destination={nextDestination}
      candidateName={candidateName}
      delayMs={1600}
      onComplete={() => {
        router.replace(nextDestination);
      }}
      error={errorMessage}
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <StudyFamDirectingScreen
          destination="/dashboard"
          delayMs={2000}
        />
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
