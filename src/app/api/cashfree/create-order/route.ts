import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = (body.fullName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const rawPhone = (body.phone || "").trim();
    const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);
    const jeeStatus = body.jeeStatus || "class-11";
    const referralCode = body.referralCode || null;

    if (!fullName || !email || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Invalid candidate details. Name, email, and 10-digit mobile number are required." },
        { status: 400 }
      );
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const isProd = (process.env.CASHFREE_ENV || "").toLowerCase() === "production";
    const baseUrl = isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

    if (!appId || !secretKey) {
      return NextResponse.json(
        { error: "Cashfree API credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const orderId = `SF_ORD_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

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
      console.error("Cashfree Order Error:", cfData);
      return NextResponse.json(
        { error: cfData.message || "Failed to initiate Cashfree order" },
        { status: cfResponse.status }
      );
    }

    // Save pending registration in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    try {
      const fullPayload = {
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
        // Fallback with only legacy schema fields
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
          }),
        });
      }
    } catch (dbErr) {
      console.warn("Supabase record creation warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      order_id: orderId,
      payment_session_id: cfData.payment_session_id,
    });
  } catch (err: any) {
    console.error("create-order handler error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
