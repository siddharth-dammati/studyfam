import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://wyzkhvomjwrgripytoiv.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
