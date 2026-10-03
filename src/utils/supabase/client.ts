import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://wyzkhvomjwrgripytoiv.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (typeof window === "undefined") {
    return createBrowserClient(supabaseUrl, supabaseKey);
  }

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseKey, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return browserClient;
};

