import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body.order_id;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
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

    // 1. Fetch order status from Cashfree
    const cfRes = await fetch(`${baseUrl}/orders/${orderId}`, {
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
    });

    const orderData: any = await cfRes.json();

    if (!cfRes.ok) {
      return NextResponse.json(
        { error: orderData.message || "Failed to fetch order from Cashfree" },
        { status: cfRes.status }
      );
    }

    const isPaid = orderData.order_status === "PAID";
    let paymentId = "";
    let paymentMethod = "online";

    if (isPaid) {
      // Fetch payment details
      try {
        const paymentsRes = await fetch(`${baseUrl}/orders/${orderId}/payments`, {
          headers: {
            "x-client-id": appId,
            "x-client-secret": secretKey,
            "x-api-version": "2023-08-01",
          },
        });
        const paymentsData: any = await paymentsRes.json();
        if (Array.isArray(paymentsData) && paymentsData.length > 0) {
          const successPayment = paymentsData.find((p: any) => p.payment_status === "SUCCESS") || paymentsData[0];
          paymentId = String(successPayment.cf_payment_id || "");
          paymentMethod = String(successPayment.payment_group || "online");
        }
      } catch (err) {
        console.warn("Could not fetch payment sub-details:", err);
      }

      // Update Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

      let registrationId = "";
      try {
        const patchRes = await fetch(`${supabaseUrl}/rest/v1/registrations?order_id=eq.${encodeURIComponent(orderId)}`, {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            status: "registered",
            amount_paid: 27,
            payment_status: "success",
            payment_id: paymentId,
            payment_method: paymentMethod,
          }),
        });
        const patched = await patchRes.json();
        if (Array.isArray(patched) && patched.length > 0) {
          registrationId = patched[0].id;
        }
      } catch (dbErr) {
        console.warn("Failed to update Supabase on payment verification:", dbErr);
      }

      return NextResponse.json({
        success: true,
        order_id: orderId,
        payment_id: paymentId,
        registration_id: registrationId,
        status: "PAID",
      });
    }

    return NextResponse.json({
      success: false,
      order_id: orderId,
      status: orderData.order_status,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
