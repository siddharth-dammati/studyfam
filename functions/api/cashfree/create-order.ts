interface Env {
  CASHFREE_APP_ID?: string;
  CASHFREE_SECRET_KEY?: string;
  CASHFREE_ENV?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const body: any = await request.json();

    const fullName = (body.fullName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const rawPhone = (body.phone || "").trim();
    const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);
    const jeeStatus = body.jeeStatus || "class-11";
    const referralCode = body.referralCode || null;
    const gender = body.gender || null;
    const familyIncome = body.familyIncome || null;
    let scholarshipTrack = body.scholarshipTrack || null;
    if (familyIncome === "above_8l" && scholarshipTrack === "need_based") {
      scholarshipTrack = "merit";
    }
    const scholarshipSlab = body.scholarshipSlab || (scholarshipTrack === "opt_out" ? "opt_out" : "full_fee_100");

    if (!fullName || !email || cleanPhone.length !== 10) {
      return new Response(
        JSON.stringify({ error: "Invalid candidate details. Name, email, and 10-digit phone are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const appId = env.CASHFREE_APP_ID || process.env.CASHFREE_APP_ID;
    const secretKey = env.CASHFREE_SECRET_KEY || process.env.CASHFREE_SECRET_KEY;
    const isProd = (env.CASHFREE_ENV || process.env.CASHFREE_ENV || "").toLowerCase() === "production";
    const baseUrl = isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

    const orderId = `SF_ORD_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // If Cashfree keys are configured, call Cashfree PG API
    if (appId && secretKey) {
      const originHeader = request.headers.get("origin") || request.headers.get("referer");
      let siteOrigin = "https://studyfam.in";
      if (originHeader) {
        try {
          const parsed = new URL(originHeader);
          if (parsed.protocol === "https:") {
            siteOrigin = parsed.origin;
          }
        } catch {}
      }

      const cfResponse = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: 27.0,
          order_currency: "INR",
          customer_details: {
            customer_id: `cust_${cleanPhone}_${Date.now()}`,
            customer_name: fullName,
            customer_email: email,
            customer_phone: cleanPhone,
          },
          order_meta: {
            return_url: `${siteOrigin}/dashboard?order_id={order_id}`,
          },
          order_note: "StudyFam All-India JEE Main Mock Test Entry Fee (₹27)",
        }),
      });

      const cfData: any = await cfResponse.json();

      if (!cfResponse.ok) {
        return new Response(
          JSON.stringify({ error: cfData.message || "Failed to initiate Cashfree order" }),
          { status: cfResponse.status, headers: { "Content-Type": "application/json" } }
        );
      }

      // Record pending registration in Supabase
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
      const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

      try {
        const fullPayload: any = {
          full_name: fullName,
          email,
          phone: cleanPhone,
          jee_status: jeeStatus,
          status: "waitlist",
          amount_paid: 0,
          order_id: orderId,
          payment_status: "pending",
          referral_code: referralCode || orderId,
        };
        if (gender) fullPayload.gender = gender;
        if (familyIncome) fullPayload.family_income = familyIncome;
        if (scholarshipTrack) fullPayload.scholarship_track = scholarshipTrack;
        if (scholarshipSlab) fullPayload.scholarship_slab = scholarshipSlab;

        const res = await fetch(`${supabaseUrl}/rest/v1/registrations`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(fullPayload),
        });

        if (!res.ok) {
          const serializedDossier = "dossier:" + JSON.stringify({
            gender,
            family_income: familyIncome,
            scholarship_track: scholarshipTrack,
            scholarship_slab: scholarshipSlab,
          });

          await fetch(`${supabaseUrl}/rest/v1/registrations`, {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              full_name: fullName,
              email,
              phone: cleanPhone,
              jee_status: jeeStatus,
              status: "waitlist",
              amount_paid: 0,
              referral_code: referralCode || orderId,
              payment_method: serializedDossier,
            }),
          });
        }
      } catch (e) {}

      return new Response(
        JSON.stringify({
          success: true,
          order_id: orderId,
          payment_session_id: cfData.payment_session_id,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sandbox Simulation Mode if keys are not yet deployed in Cloudflare env
    return new Response(
      JSON.stringify({
        success: true,
        order_id: orderId,
        is_simulation: true,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
