import { DEFAULT_SITE_CONFIG, parseSiteConfig } from "./lib/siteConfig";
import { ALLOWED_ADMIN_EMAILS, DEFAULT_ADMIN_PASSCODE } from "./lib/adminAuth";

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
  ADMIN_PASSCODE?: string;
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

function serializeDossier(data: { gender?: any; family_income?: any; scholarship_track?: any; scholarship_slab?: any }) {
  return "dossier:" + JSON.stringify({
    gender: data.gender || null,
    family_income: data.family_income || null,
    scholarship_track: data.scholarship_track || "merit",
    scholarship_slab: data.scholarship_slab || (data.scholarship_track === "opt_out" ? "opt_out" : "full_fee_100"),
  });
}

function hydrateRecord(raw: any, fallback?: any) {
  if (!raw) return raw;
  let dossier: any = {};
  if (raw.payment_method && typeof raw.payment_method === "string" && raw.payment_method.startsWith("dossier:")) {
    try {
      dossier = JSON.parse(raw.payment_method.slice(8)) || {};
    } catch {}
  }
  const fb = fallback || {};
  return {
    ...raw,
    gender: raw.gender || dossier.gender || fb.gender || undefined,
    family_income: raw.family_income || dossier.family_income || fb.family_income || undefined,
    scholarship_track: raw.scholarship_track || dossier.scholarship_track || fb.scholarship_track || undefined,
    scholarship_slab: raw.scholarship_slab || dossier.scholarship_slab || fb.scholarship_slab || undefined,
  };
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

    // 3. Candidate Profile Update & Dossier Sync
    if (pathname === "/api/candidate/update-profile" && request.method === "POST") {
      return handleCandidateUpdateProfile(request, env);
    }

    // 4. Webhook
    if (pathname === "/api/cashfree/webhook" && request.method === "POST") {
      return handleWebhook(request, env);
    }

    // 5. Public Site Config
    if (pathname === "/api/config") {
      return handleSiteConfig(request, env);
    }

    // 6. Admin Site Config
    if (pathname === "/api/admin/config") {
      return handleAdminConfig(request, env);
    }

    // 7. Admin Registrations & Stats
    if (pathname === "/api/admin/registrations") {
      return handleAdminRegistrations(request, env);
    }

    // 8. Default: Serve Next.js static export from ASSETS binding
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
            payment_method: serializeDossier({
              gender,
              family_income: familyIncome,
              scholarship_track: scholarshipTrack,
              scholarship_slab: scholarshipSlab,
            }),
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

async function handleCandidateUpdateProfile(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body: any = await request.json().catch(() => ({}));
    const email = (body.email || "").trim().toLowerCase();
    const fullName = (body.fullName || "").trim();
    const rawPhone = (body.phone || "").trim();
    const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);
    const gender = body.gender || null;
    const jeeStatus = body.jeeStatus || "class-11";
    const familyIncome = body.familyIncome || null;
    let scholarshipTrack = body.scholarshipTrack || "merit";
    if (familyIncome === "above_8l" && scholarshipTrack === "need_based") {
      scholarshipTrack = "merit";
    }
    const scholarshipSlab = body.scholarshipSlab || (scholarshipTrack === "opt_out" ? "opt_out" : "full_fee_100");
    const orderId = body.orderId || null;

    if (!email && !orderId && cleanPhone.length !== 10) {
      return new Response(
        JSON.stringify({ error: "Email or verified order reference is required." }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey =
      env.SUPABASE_SERVICE_ROLE_KEY ||
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    let existingRecord: any = null;

    if (email) {
      const searchRes = await fetch(
        `${supabaseUrl}/rest/v1/registrations?email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (searchRes.ok) {
        const found: any = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) {
          existingRecord = found[0];
        }
      }
    }

    let updatedRecord: any = null;

    if (existingRecord) {
      const fullPatchPayload: Record<string, any> = {};
      if (fullName) fullPatchPayload.full_name = fullName;
      if (cleanPhone) fullPatchPayload.phone = cleanPhone;
      if (gender) fullPatchPayload.gender = gender;
      if (jeeStatus) fullPatchPayload.jee_status = jeeStatus;
      if (familyIncome) fullPatchPayload.family_income = familyIncome;
      if (scholarshipTrack) fullPatchPayload.scholarship_track = scholarshipTrack;
      if (scholarshipSlab) fullPatchPayload.scholarship_slab = scholarshipSlab;

      let patchRes = await fetch(
        `${supabaseUrl}/rest/v1/registrations?id=eq.${encodeURIComponent(existingRecord.id)}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(fullPatchPayload),
        }
      );

      if (!patchRes.ok) {
        const fallbackPatchPayload: Record<string, any> = {
          payment_method: serializeDossier({
            gender,
            family_income: familyIncome,
            scholarship_track: scholarshipTrack,
            scholarship_slab: scholarshipSlab,
          }),
        };
        if (fullName) fallbackPatchPayload.full_name = fullName;
        if (cleanPhone) fallbackPatchPayload.phone = cleanPhone;
        if (jeeStatus) fallbackPatchPayload.jee_status = jeeStatus;

        patchRes = await fetch(
          `${supabaseUrl}/rest/v1/registrations?id=eq.${encodeURIComponent(existingRecord.id)}`,
          {
            method: "PATCH",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify(fallbackPatchPayload),
          }
        );
      }

      if (patchRes.ok) {
        const patched: any = await patchRes.json();
        if (Array.isArray(patched) && patched.length > 0) {
          updatedRecord = patched[0];
        }
      }

      if (!updatedRecord) {
        updatedRecord = { ...existingRecord, ...fullPatchPayload };
      }
    } else {
      const fullInsertPayload: Record<string, any> = {
        email,
        full_name: fullName || "Candidate",
        phone: cleanPhone || "0000000000",
        gender,
        jee_status: jeeStatus,
        family_income: familyIncome,
        scholarship_track: scholarshipTrack,
        scholarship_slab: scholarshipSlab,
        status: "waitlist",
        amount_paid: 0,
        order_id: orderId || null,
        referral_code: orderId || null,
        payment_status: "pending",
      };

      let insertRes = await fetch(`${supabaseUrl}/rest/v1/registrations`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(fullInsertPayload),
      });

      if (!insertRes.ok) {
        const fallbackInsertPayload = {
          email,
          full_name: fullName || "Candidate",
          phone: cleanPhone || "0000000000",
          jee_status: jeeStatus,
          status: "waitlist",
          amount_paid: 0,
          order_id: orderId || null,
          referral_code: orderId || null,
          payment_status: "pending",
          payment_method: serializeDossier({
            gender,
            family_income: familyIncome,
            scholarship_track: scholarshipTrack,
            scholarship_slab: scholarshipSlab,
          }),
        };

        insertRes = await fetch(`${supabaseUrl}/rest/v1/registrations`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(fallbackInsertPayload),
        });
      }

      if (insertRes.ok) {
        const inserted: any = await insertRes.json();
        if (Array.isArray(inserted) && inserted.length > 0) {
          updatedRecord = inserted[0];
        }
      }

      if (!updatedRecord) {
        updatedRecord = fullInsertPayload;
      }
    }

    const hydrated = hydrateRecord(updatedRecord, {
      gender,
      family_income: familyIncome,
      scholarship_track: scholarshipTrack,
      scholarship_slab: scholarshipSlab,
    });

    return new Response(
      JSON.stringify({ success: true, registration: hydrated }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

function isWorkerAdmin(request: Request, env: Env): boolean {
  const passcodeHeader = request.headers.get("x-admin-passcode");
  const emailHeader = (request.headers.get("x-admin-email") || "").toLowerCase().trim();
  const validPasscode = env.ADMIN_PASSCODE || DEFAULT_ADMIN_PASSCODE;

  if (passcodeHeader && passcodeHeader.trim() === validPasscode) {
    return true;
  }
  if (emailHeader && ALLOWED_ADMIN_EMAILS.includes(emailHeader)) {
    return true;
  }
  return false;
}

async function handleSiteConfig(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey =
      env.SUPABASE_SERVICE_ROLE_KEY ||
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    const res = await fetch(`${supabaseUrl}/rest/v1/app_config?key=eq.site_master_config&select=value`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });

    if (res.ok) {
      const rows: any = await res.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].value) {
        try {
          return new Response(
            JSON.stringify({ success: true, config: parseSiteConfig(JSON.parse(rows[0].value)) }),
            { status: 200, headers: jsonHeaders }
          );
        } catch {}
      }
    }

    const fallbackRes = await fetch(
      `${supabaseUrl}/rest/v1/registrations?email=eq.system_config@studyfam.org&select=payment_method`,
      {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      }
    );

    if (fallbackRes.ok) {
      const fbRows: any = await fallbackRes.json();
      if (Array.isArray(fbRows) && fbRows.length > 0 && fbRows[0].payment_method?.startsWith("config:")) {
        try {
          return new Response(
            JSON.stringify({
              success: true,
              config: parseSiteConfig(JSON.parse(fbRows[0].payment_method.slice(7))),
            }),
            { status: 200, headers: jsonHeaders }
          );
        } catch {}
      }
    }

    return new Response(
      JSON.stringify({ success: true, config: DEFAULT_SITE_CONFIG }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: true, config: DEFAULT_SITE_CONFIG, warning: err.message }),
      { status: 200, headers: jsonHeaders }
    );
  }
}

async function handleAdminConfig(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (!isWorkerAdmin(request, env)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized access. Valid admin passcode or email required." }),
      { status: 401, headers: jsonHeaders }
    );
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
  const supabaseKey =
    env.SUPABASE_SERVICE_ROLE_KEY ||
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

  try {
    let body: any = {};
    if (request.method === "POST") {
      body = await request.json().catch(() => ({}));
    }

    if (request.method === "GET" || body?.action === "get") {
      const res = await fetch(`${supabaseUrl}/rest/v1/app_config?key=eq.site_master_config&select=value`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      if (res.ok) {
        const rows: any = await res.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].value) {
          try {
            return new Response(
              JSON.stringify({ success: true, config: parseSiteConfig(JSON.parse(rows[0].value)) }),
              { status: 200, headers: jsonHeaders }
            );
          } catch {}
        }
      }

      const fallbackRes = await fetch(
        `${supabaseUrl}/rest/v1/registrations?email=eq.system_config@studyfam.org&select=payment_method`,
        {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        }
      );
      if (fallbackRes.ok) {
        const fbRows: any = await fallbackRes.json();
        if (Array.isArray(fbRows) && fbRows.length > 0 && fbRows[0].payment_method?.startsWith("config:")) {
          try {
            return new Response(
              JSON.stringify({
                success: true,
                config: parseSiteConfig(JSON.parse(fbRows[0].payment_method.slice(7))),
              }),
              { status: 200, headers: jsonHeaders }
            );
          } catch {}
        }
      }

      return new Response(
        JSON.stringify({ success: true, config: DEFAULT_SITE_CONFIG }),
        { status: 200, headers: jsonHeaders }
      );
    }

    // Save updated configuration
    const targetConfig = body.config || body;
    const updatedConfig = parseSiteConfig(targetConfig);
    updatedConfig.updatedAt = new Date().toISOString();
    const serialized = JSON.stringify(updatedConfig);

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

    try {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/registrations?email=eq.system_config@studyfam.org`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      const existing: any = await searchRes.json();
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
      console.warn("Worker fallback save failed:", e);
    }

    return new Response(
      JSON.stringify({
        success: true,
        config: updatedConfig,
        message: "Site configuration published successfully.",
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to update configuration" }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

async function handleAdminRegistrations(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (!isWorkerAdmin(request, env)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized access. Valid admin passcode or email required." }),
      { status: 401, headers: jsonHeaders }
    );
  }

  try {
    let search = "";
    let statusFilter = "all";
    let trackFilter = "all";
    let genderFilter = "all";
    let streamFilter = "all";

    if (request.method === "POST") {
      const body: any = await request.json().catch(() => ({}));
      search = (body.search || "").trim().toLowerCase();
      statusFilter = body.status || "all";
      trackFilter = body.track || "all";
      genderFilter = body.gender || "all";
      streamFilter = body.stream || "all";
    } else {
      const url = new URL(request.url);
      search = (url.searchParams.get("search") || "").trim().toLowerCase();
      statusFilter = url.searchParams.get("status") || "all";
      trackFilter = url.searchParams.get("track") || "all";
      genderFilter = url.searchParams.get("gender") || "all";
      streamFilter = url.searchParams.get("stream") || "all";
    }

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey =
      env.SUPABASE_SERVICE_ROLE_KEY ||
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    const res = await fetch(
      `${supabaseUrl}/rest/v1/registrations?email=neq.system_config@studyfam.org&order=created_at.desc&limit=1000`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return new Response(
        JSON.stringify({ error: "Failed to fetch registrations: " + errorText }),
        { status: 500, headers: jsonHeaders }
      );
    }

    const rawRows: any = await res.json();
    const hydratedRows = (Array.isArray(rawRows) ? rawRows : []).map((row: any) =>
      hydrateRecord(row)
    );

    const totalRegistrations = hydratedRows.length;
    const confirmedCount = hydratedRows.filter(
      (r: any) => r.status === "confirmed" || (r.amount_paid && r.amount_paid > 0)
    ).length;
    const waitlistCount = totalRegistrations - confirmedCount;
    const totalRevenue = confirmedCount * 27;
    const scholarshipPool = confirmedCount * 18;
    const fundedStudents = Math.floor(scholarshipPool / 900);

    const meritCount = hydratedRows.filter((r: any) => r.scholarship_track === "merit").length;
    const needCount = hydratedRows.filter((r: any) => r.scholarship_track === "need_based").length;
    const optOutCount = hydratedRows.filter((r: any) => r.scholarship_track === "opt_out").length;
    const boysCount = hydratedRows.filter((r: any) => r.gender === "boy").length;
    const girlsCount = hydratedRows.filter((r: any) => r.gender === "girl").length;

    const filteredRows = hydratedRows.filter((r: any) => {
      if (statusFilter === "confirmed") {
        const isConfirmed = r.status === "confirmed" || (r.amount_paid && r.amount_paid > 0);
        if (!isConfirmed) return false;
      } else if (statusFilter === "waitlist") {
        const isConfirmed = r.status === "confirmed" || (r.amount_paid && r.amount_paid > 0);
        if (isConfirmed) return false;
      }

      if (trackFilter !== "all") {
        if (trackFilter === "merit" && r.scholarship_track !== "merit") return false;
        if (trackFilter === "need_based" && r.scholarship_track !== "need_based") return false;
        if (trackFilter === "opt_out" && r.scholarship_track !== "opt_out") return false;
      }

      if (genderFilter !== "all" && r.gender !== genderFilter) {
        return false;
      }

      if (streamFilter !== "all" && r.jee_status !== streamFilter) {
        return false;
      }

      if (search) {
        const searchPool = [
          r.full_name || "",
          r.email || "",
          r.phone || "",
          r.roll_no || "",
          r.order_id || "",
          r.referral_code || "",
        ].join(" ").toLowerCase();

        if (!searchPool.includes(search)) return false;
      }

      return true;
    });

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalRegistrations,
          confirmedCount,
          waitlistCount,
          totalRevenue,
          scholarshipPool,
          fundedStudents,
          meritCount,
          needCount,
          optOutCount,
          boysCount,
          girlsCount,
        },
        registrations: filteredRows,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: jsonHeaders }
    );
  }
}
