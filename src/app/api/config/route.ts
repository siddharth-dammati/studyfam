import { NextResponse } from "next/server";
import { DEFAULT_SITE_CONFIG, parseSiteConfig } from "@/lib/siteConfig";

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    // 1. Try app_config table
    const res = await fetch(`${supabaseUrl}/rest/v1/app_config?key=eq.site_master_config&select=value`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].value) {
        try {
          const parsed = JSON.parse(rows[0].value);
          return NextResponse.json({ success: true, config: parseSiteConfig(parsed) });
        } catch {}
      }
    }

    // 2. Fallback: query registrations table config row
    const fallbackRes = await fetch(`${supabaseUrl}/rest/v1/registrations?email=eq.system_config@studyfam.org&select=payment_method`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (fallbackRes.ok) {
      const fbRows = await fallbackRes.json();
      if (Array.isArray(fbRows) && fbRows.length > 0 && fbRows[0].payment_method?.startsWith("config:")) {
        try {
          const parsed = JSON.parse(fbRows[0].payment_method.slice(7));
          return NextResponse.json({ success: true, config: parseSiteConfig(parsed) });
        } catch {}
      }
    }

    return NextResponse.json({ success: true, config: DEFAULT_SITE_CONFIG });
  } catch (err: any) {
    return NextResponse.json({ success: true, config: DEFAULT_SITE_CONFIG, warning: err.message });
  }
}
