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
    const orderId = body.order_id;

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Missing order_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const appId = env.CASHFREE_APP_ID || process.env.CASHFREE_APP_ID;
    const secretKey = env.CASHFREE_SECRET_KEY || process.env.CASHFREE_SECRET_KEY;
    const isProd = (env.CASHFREE_ENV || process.env.CASHFREE_ENV || "").toLowerCase() === "production";
    const baseUrl = isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    if (appId && secretKey) {
      // 1. Fetch order details from Cashfree
      const cfRes = await fetch(`${baseUrl}/orders/${orderId}`, {
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2023-08-01",
        },
      });

      const orderData: any = await cfRes.json();

      if (!cfRes.ok) {
        return new Response(
          JSON.stringify({ error: orderData.message || "Failed to fetch order from Cashfree" }),
          { status: cfRes.status, headers: { "Content-Type": "application/json" } }
        );
      }

      const isPaid = orderData.order_status === "PAID";
      let paymentId = "";
      let paymentMethod = "online";

      if (isPaid) {
        // Fetch payment details
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

        const customerEmail = (orderData.customer_details?.customer_email || "").toLowerCase().trim();
        const customerName = orderData.customer_details?.customer_name || "Candidate";
        const customerPhone = orderData.customer_details?.customer_phone || "";

        let registrationId = "";
        let registrationRecord: any = null;

        try {
          // Update Supabase
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
          const patched: any = await patchRes.json();
          if (Array.isArray(patched) && patched.length > 0) {
            registrationId = patched[0].id;
            registrationRecord = patched[0];
          } else if (customerEmail) {
            const emailPatchRes = await fetch(`${supabaseUrl}/rest/v1/registrations?email=eq.${encodeURIComponent(customerEmail)}`, {
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
                referral_code: orderId,
              }),
            });
            const emailPatched: any = await emailPatchRes.json();
            if (Array.isArray(emailPatched) && emailPatched.length > 0) {
              registrationId = emailPatched[0].id;
              registrationRecord = emailPatched[0];
            }
          }
        } catch (e) {}

        if (!registrationRecord) {
          registrationRecord = {
            id: `sf_${orderId}`,
            full_name: customerName,
            email: customerEmail,
            phone: customerPhone,
            jee_status: "class-11",
            status: "confirmed",
            amount_paid: Number(orderData.order_amount) || 27,
            order_id: orderId,
            payment_id: paymentId || `pay_${orderId.slice(0, 12)}`,
            payment_status: "success",
            payment_method: paymentMethod || "online",
            created_at: orderData.created_at || new Date().toISOString(),
          };
          registrationId = registrationRecord.id;
        } else {
          registrationRecord.status = "confirmed";
          registrationRecord.amount_paid = 27;
          registrationRecord.order_id = orderId;
          registrationRecord.payment_id = paymentId || registrationRecord.payment_id;
          registrationRecord.payment_status = "success";
        }

        return new Response(
          JSON.stringify({
            success: true,
            order_id: orderId,
            payment_id: paymentId,
            registration_id: registrationId,
            status: "PAID",
            registration: registrationRecord,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          order_id: orderId,
          status: orderData.order_status,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fallback simulation mode
    return new Response(
      JSON.stringify({
        success: true,
        order_id: orderId,
        payment_id: `sim_pay_${Date.now()}`,
        status: "PAID",
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
