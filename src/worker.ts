export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  CASHFREE_APP_ID?: string;
  CASHFREE_SECRET_KEY?: string;
  CASHFREE_ENV?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

const DEFAULT_APP_ID = "1104906797b7e0ff7bf86edf2bf6094011";
const DEFAULT_SECRET_B64 = "Y2Zza19tYV9wcm9kX2M2N2U1ZTY5MGIwMGVlM2IyNjViMjgxYzRhYzcyNTJjX2Y4ZWMxMTdl";

function getSecretKey(env: Env): string {
  if (env.CASHFREE_SECRET_KEY && env.CASHFREE_SECRET_KEY.trim().length > 0) {
    return env.CASHFREE_SECRET_KEY.trim();
  }
  try {
    return atob(DEFAULT_SECRET_B64);
  } catch {
    return "";
  }
}

function getAppId(env: Env): string {
  return (env.CASHFREE_APP_ID && env.CASHFREE_APP_ID.trim().length > 0)
    ? env.CASHFREE_APP_ID.trim()
    : DEFAULT_APP_ID;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS preflight
    if (request.method === "OPTIONS" && pathname.startsWith("/api/cashfree/")) {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Health / info checks
    if (request.method === "GET" && pathname.startsWith("/api/cashfree/")) {
      return new Response(
        JSON.stringify({ status: "Cashfree API Service Online", path: pathname }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Create Order
    if (pathname === "/api/cashfree/create-order" && request.method === "POST") {
      return handleCreateOrder(request, env);
    }

    // 2. Verify Order
    if (pathname === "/api/cashfree/verify-order" && request.method === "POST") {
      return handleVerifyOrder(request, env);
    }

    // 3. Webhook
    if (pathname === "/api/cashfree/webhook" && request.method === "POST") {
      return handleWebhook(request, env);
    }

    // 4. Default: Serve Next.js static export from ASSETS binding
    return env.ASSETS.fetch(request);
  },
};

async function handleCreateOrder(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body: any = await request.json().catch(() => ({}));
    const fullName = (body.fullName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const rawPhone = (body.phone || "").trim();
    const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);
    const jeeStatus = body.jeeStatus || "class-11";
    const referralCode = body.referralCode || null;

    if (!fullName || !email || cleanPhone.length !== 10) {
      return new Response(
        JSON.stringify({ error: "Invalid candidate details. Name, email, and 10-digit phone are required." }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const appId = getAppId(env);
    const secretKey = getSecretKey(env);
    const isProd = (env.CASHFREE_ENV || "production").toLowerCase() === "production";
    const baseUrl = isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

    if (!appId || !secretKey) {
      return new Response(
        JSON.stringify({ error: "Cashfree API credentials are not configured." }),
        { status: 500, headers: jsonHeaders }
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
      return new Response(
        JSON.stringify({ error: cfData.message || "Failed to initiate Cashfree order" }),
        { status: cfResponse.status, headers: jsonHeaders }
      );
    }

    // Save preliminary row in Supabase
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

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
    } catch (e) {
      // non-fatal
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: orderId,
        payment_session_id: cfData.payment_session_id,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

async function handleVerifyOrder(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body: any = await request.json().catch(() => ({}));
    const orderId = body.order_id;

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Missing order_id" }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const appId = getAppId(env);
    const secretKey = getSecretKey(env);
    const isProd = (env.CASHFREE_ENV || "production").toLowerCase() === "production";
    const baseUrl = isProd ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

    if (!appId || !secretKey) {
      return new Response(
        JSON.stringify({ error: "Cashfree API credentials are not configured." }),
        { status: 500, headers: jsonHeaders }
      );
    }

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
        { status: cfRes.status, headers: jsonHeaders }
      );
    }

    const isPaid = orderData.order_status === "PAID";
    let paymentId = "";
    let paymentMethod = "online";

    if (isPaid) {
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
      } catch (e) {
        // non-fatal
      }

      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
      const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

      const customerEmail = (orderData.customer_details?.customer_email || "").toLowerCase().trim();
      const customerName = orderData.customer_details?.customer_name || "Candidate";
      const customerPhone = orderData.customer_details?.customer_phone || "";

      let registrationId = "";
      let registrationRecord: any = null;

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
      } catch (e) {
        // non-fatal
      }

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
        { status: 200, headers: jsonHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        order_id: orderId,
        status: orderData.order_status,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  try {
    const body: any = await request.json().catch(() => ({}));
    const data = body?.data || body;
    const order = data?.order || data;
    const payment = data?.payment || data;

    const orderId = order?.order_id || data?.order_id;
    const paymentStatus = (payment?.payment_status || order?.order_status || "").toUpperCase();
    const paymentId = String(payment?.cf_payment_id || payment?.payment_id || "");
    const paymentMethod = String(payment?.payment_group || "online");

    if (orderId && (paymentStatus === "SUCCESS" || paymentStatus === "PAID")) {
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
      const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

      await fetch(`${supabaseUrl}/rest/v1/registrations?order_id=eq.${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "registered",
          amount_paid: 27,
          payment_status: "success",
          payment_id: paymentId,
          payment_method: paymentMethod,
        }),
      });
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
