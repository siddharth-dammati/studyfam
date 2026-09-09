import { NextResponse } from "next/server";
import { DEFAULT_SITE_CONFIG, parseSiteConfig } from "@/lib/siteConfig";
import { isAuthorizedAdmin } from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized access. Valid admin passcode or email required." },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

  try {
    const body = await request.json().catch(() => ({}));

    // If request is requesting current config
    if (body?.action === "get") {
      // 1. Try app_config table
      const res = await fetch(`${supabaseUrl}/rest/v1/app_config?key=eq.site_master_config&select=value`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].value) {
          try {
            return NextResponse.json({ success: true, config: parseSiteConfig(JSON.parse(rows[0].value)) });
          } catch {}
        }
      }

      // 2. Fallback to registrations config row
      const fallbackRes = await fetch(
        `${supabaseUrl}/rest/v1/registrations?email=eq.system_config@studyfam.org&select=payment_method`,
        {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        }
      );
      if (fallbackRes.ok) {
        const fbRows = await fallbackRes.json();
        if (Array.isArray(fbRows) && fbRows.length > 0 && fbRows[0].payment_method?.startsWith("config:")) {
          try {
            return NextResponse.json({
              success: true,
              config: parseSiteConfig(JSON.parse(fbRows[0].payment_method.slice(7))),
            });
          } catch {}
        }
      }

      return NextResponse.json({ success: true, config: DEFAULT_SITE_CONFIG });
    }

    // Otherwise, save/publish updated config
    const targetConfig = body.config || body;
    const updatedConfig = parseSiteConfig(targetConfig);
    updatedConfig.updatedAt = new Date().toISOString();
    const serialized = JSON.stringify(updatedConfig);

    // 1. Try upserting to app_config
    try {
      await fetch(`${supabaseUrl}/rest/v1/app_config`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          key: "site_master_config",
          value: serialized,
          description: "Master site dynamic configuration",
          updated_at: new Date().toISOString(),
        }),
      });
    } catch {}

    // 2. Guaranteed fallback persistence in registrations table
    try {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/registrations?email=eq.system_config@studyfam.org`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      const existing = await searchRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        await fetch(`${supabaseUrl}/rest/v1/registrations?id=eq.${existing[0].id}`, {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payment_method: "config:" + serialized }),
        });
      } else {
        await fetch(`${supabaseUrl}/rest/v1/registrations`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "system_config@studyfam.org",
            full_name: "SYSTEM_CONFIG",
            phone: "0000000000",
            jee_status: "class-11",
            payment_method: "config:" + serialized,
          }),
        });
      }
    } catch (e) {
      console.warn("Failed saving fallback config row:", e);
    }

    return NextResponse.json({
      success: true,
      config: updatedConfig,
      message: "Site configuration published successfully.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update configuration" }, { status: 500 });
  }
}
