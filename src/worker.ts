import { DEFAULT_SITE_CONFIG, parseSiteConfig } from "./lib/siteConfig";
import { ALLOWED_ADMIN_EMAILS, DEFAULT_ADMIN_PASSCODE } from "./lib/adminAuth";
import DEFAULT_ACTIVE_EXAM_PAPER from "../questions_database/active_exam_paper.json";
import CURATED_QUESTION_BANK from "../questions_database/curated_question_bank.json";
import MFT_QUESTIONS_BY_FILE from "../questions_database/mft_questions.json";

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

    // 7b. Admin User Attempts & Student Analytics
    if (pathname === "/api/admin/attempts") {
      return handleAdminAttempts(request, env);
    }

    // 8. Active Exam Paper
    if (pathname === "/api/exam/active") {
      return handleActiveExam(request, env);
    }

    // 9. Admin Exam Paper
    if (pathname === "/api/admin/exam") {
      return handleAdminExam(request, env);
    }

    // 10. Admin Exam Search Question Bank
    if (pathname === "/api/admin/exam/search" && request.method === "POST") {
      return handleAdminExamSearch(request, env);
    }

    // 11. Exam Submission & Evaluation
    if (pathname === "/api/exam/submit") {
      return handleExamSubmit(request, env);
    }

    // 12. Get exam detail by ID (used by exam player to load test)
    if (pathname === "/api/exam/detail" && request.method === "POST") {
      return handleExamDetail(request, env);
    }

    // 13. List available tests (full mocks + chapter tests)
    if (pathname === "/api/exam/tests") {
      return handleExamTests(request, env);
    }

    // 14. Exam solutions / review data
    if (pathname === "/api/exam/solutions" && request.method === "POST") {
      return handleExamSolutions(request, env);
    }

    // 15. Default: Serve Next.js static export from ASSETS binding
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

async function handleAdminAttempts(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (!isWorkerAdmin(request, env)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized access. Valid admin credentials required." }),
      { status: 401, headers: jsonHeaders }
    );
  }

  try {
    let search = "";
    let testFilter = "all";
    let sortBy = "latest";

    if (request.method === "POST") {
      const body: any = await request.json().catch(() => ({}));
      search = (body.search || "").trim().toLowerCase();
      testFilter = (body.testFilter || "all").trim().toLowerCase();
      sortBy = body.sortBy || "latest";
    } else {
      const url = new URL(request.url);
      search = (url.searchParams.get("search") || "").trim().toLowerCase();
      testFilter = (url.searchParams.get("testFilter") || "all").trim().toLowerCase();
      sortBy = url.searchParams.get("sortBy") || "latest";
    }

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey =
      env.SUPABASE_SERVICE_ROLE_KEY ||
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    const fetchHeaders = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    };

    // 1. Fetch Registrations
    const regRes = await fetch(
      `${supabaseUrl}/rest/v1/registrations?email=neq.system_config@studyfam.org&order=created_at.desc&limit=1500`,
      { headers: fetchHeaders }
    );
    const rawRegistrations = regRes.ok ? await regRes.json() : [];

    // 2. Fetch Exam Attempts
    const attemptsRes = await fetch(
      `${supabaseUrl}/rest/v1/exam_attempts?order=created_at.desc&limit=3000`,
      { headers: fetchHeaders }
    );
    const rawAttempts = attemptsRes.ok ? await attemptsRes.json() : [];

    const regMap = new Map<string, any>();
    for (const r of Array.isArray(rawRegistrations) ? rawRegistrations : []) {
      const email = (r.email || "").toLowerCase().trim();
      if (email) {
        regMap.set(email, hydrateRecord(r));
      }
    }

    // Deduplicate any duplicate attempts submitted within 3 minutes of each other for the same test
    const dedupedAttempts: any[] = [];
    for (const a of Array.isArray(rawAttempts) ? rawAttempts : []) {
      const email = (a.email || "").toLowerCase().trim();
      if (!email) continue;
      const aTime = new Date(a.created_at || 0).getTime();
      const isDup = dedupedAttempts.some((prev: any) => {
        return (
          (prev.email || "").toLowerCase().trim() === email &&
          prev.test_id === a.test_id &&
          prev.score === a.score &&
          Math.abs(new Date(prev.created_at || 0).getTime() - aTime) < 180000
        );
      });
      if (!isDup) {
        dedupedAttempts.push(a);
      }
    }

    const attemptsByUser = new Map<string, any[]>();
    for (const a of dedupedAttempts) {
      const email = (a.email || "").toLowerCase().trim();
      if (!email) continue;

      const item = {
        id: String(a.id || ""),
        testId: a.test_id || "MFT-1.pdf",
        testTitle: a.test_title || a.test_id || "JEE Main Mock Test",
        score: Number(a.score ?? 0),
        maxScore: Number(a.max_score || 300),
        percentage: Number(a.percentage || 0),
        accuracy: Number(a.accuracy || 0),
        timeSpentSeconds: Number(a.time_spent_seconds || 0),
        totalQuestions: Number(a.total_questions || 75),
        attemptedCount: Number(a.attempted_count || 0),
        correctCount: Number(a.correct_count || 0),
        incorrectCount: Number(a.incorrect_count || 0),
        sectionBreakdown: a.section_breakdown || [],
        detailedResults: a.detailed_results || [],
        questionTimes: a.question_times || {},
        tabViolations: Number(a.tab_violations || 0),
        submissionReason: a.submission_reason || undefined,
        startedAt: a.started_at || undefined,
        createdAt: a.created_at || new Date().toISOString(),
      };

      if (!attemptsByUser.has(email)) {
        attemptsByUser.set(email, []);
      }
      attemptsByUser.get(email)!.push(item);
    }

    const allEmails = new Set<string>([...regMap.keys(), ...attemptsByUser.keys()]);
    const studentList: any[] = [];

    for (const email of allEmails) {
      const reg = regMap.get(email);
      const userAttempts = (attemptsByUser.get(email) || []).sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const totalAttempts = userAttempts.length;
      let bestMarks = 0;
      let bestPercentage = 0;
      let totalScoreSum = 0;
      let totalAccSum = 0;
      let totalTimeSpentSeconds = 0;

      const mftMatrix: Record<string, any> = {};
      for (let i = 1; i <= 10; i++) {
        const code = `MFT-${i.toString().padStart(2, "0")}`;
        mftMatrix[code] = {
          code,
          title: `Major Full Test ${i}`,
          testId: `MFT-${i}.pdf`,
          attempted: false,
          attemptsCount: 0,
          bestScore: null,
          latestScore: null,
          latestPercentage: null,
          latestAccuracy: null,
          latestTimeSeconds: null,
          latestAttemptedAt: null,
        };
      }
      mftMatrix["ACTIVE_MOCK"] = {
        code: "ACTIVE",
        title: "All India Active Mock",
        testId: "active",
        attempted: false,
        attemptsCount: 0,
        bestScore: null,
        latestScore: null,
        latestPercentage: null,
        latestAccuracy: null,
        latestTimeSeconds: null,
        latestAttemptedAt: null,
      };

      for (const att of userAttempts) {
        if (att.score > bestMarks) bestMarks = att.score;
        if (att.percentage > bestPercentage) bestPercentage = att.percentage;
        totalScoreSum += att.score;
        totalAccSum += att.accuracy;
        totalTimeSpentSeconds += att.timeSpentSeconds;

        let slotKey: string | null = null;
        const match = att.testId.match(/MFT[-_ ]*0?(\d+)/i);
        if (match) {
          const num = parseInt(match[1]);
          if (num >= 1 && num <= 10) {
            slotKey = `MFT-${num.toString().padStart(2, "0")}`;
          }
        } else if (att.testId.toLowerCase().includes("active")) {
          slotKey = "ACTIVE_MOCK";
        }

        if (slotKey && mftMatrix[slotKey]) {
          const slot = mftMatrix[slotKey];
          slot.attempted = true;
          slot.attemptsCount += 1;
          if (slot.bestScore === null || att.score > slot.bestScore) {
            slot.bestScore = att.score;
          }
          if (slot.latestScore === null) {
            slot.latestScore = att.score;
            slot.latestPercentage = att.percentage;
            slot.latestAccuracy = att.accuracy;
            slot.latestTimeSeconds = att.timeSpentSeconds;
            slot.latestAttemptedAt = att.createdAt;
          }
        }
      }

      const averageMarks = totalAttempts > 0 ? Math.round((totalScoreSum / totalAttempts) * 10) / 10 : 0;
      const averageAccuracy = totalAttempts > 0 ? Math.round(totalAccSum / totalAttempts) : 0;
      const latestAttempt = userAttempts.length > 0 ? userAttempts[0] : null;

      studentList.push({
        id: reg?.id || email,
        email,
        fullName: reg?.full_name || (email.split("@")[0].replace(/[._-]/g, " ") || "Student Candidate"),
        phone: reg?.phone || "—",
        rollNo: reg?.roll_no || undefined,
        jeeStatus: reg?.jee_status || undefined,
        gender: reg?.gender || undefined,
        scholarshipTrack: reg?.scholarship_track || undefined,
        registrationStatus: reg?.status || (totalAttempts > 0 ? "attempted_only" : "registered"),
        registeredAt: reg?.created_at || (latestAttempt ? latestAttempt.createdAt : undefined),
        totalAttempts,
        bestMarks,
        bestPercentage,
        averageMarks,
        averageAccuracy,
        totalTimeSpentSeconds,
        latestAttempt,
        mftMatrix,
        attempts: userAttempts,
      });
    }

    let filteredStudents = studentList;
    if (testFilter !== "all") {
      filteredStudents = filteredStudents.filter((s: any) => {
        if (testFilter === "mft") {
          return s.attempts.some((a: any) => a.testId.toLowerCase().includes("mft"));
        }
        return s.attempts.some((a: any) => a.testId.toLowerCase().includes(testFilter));
      });
    }

    if (search) {
      filteredStudents = filteredStudents.filter((s: any) => {
        const pool = [
          s.fullName,
          s.email,
          s.phone,
          s.rollNo || "",
          s.jeeStatus || "",
          s.scholarshipTrack || "",
        ].join(" ").toLowerCase();
        return pool.includes(search);
      });
    }

    filteredStudents.sort((a: any, b: any) => {
      if (sortBy === "best_marks") return b.bestMarks - a.bestMarks;
      if (sortBy === "attempts") return b.totalAttempts - a.totalAttempts;
      if (sortBy === "name") return a.fullName.localeCompare(b.fullName);
      const timeA = a.latestAttempt ? new Date(a.latestAttempt.createdAt).getTime() : (a.registeredAt ? new Date(a.registeredAt).getTime() : 0);
      const timeB = b.latestAttempt ? new Date(b.latestAttempt.createdAt).getTime() : (b.registeredAt ? new Date(b.registeredAt).getTime() : 0);
      return timeB - timeA;
    });

    const totalAttemptingStudents = studentList.filter((s: any) => s.totalAttempts > 0).length;
    const totalAttemptsLogged = dedupedAttempts.length;
    const allScores = dedupedAttempts.map((a: any) => Number(a.score || 0));
    const highestScoreLogged = allScores.length > 0 ? Math.max(...allScores) : 0;
    const avgScoreLogged = allScores.length > 0 ? Math.round(allScores.reduce((sum: number, s: number) => sum + s, 0) / allScores.length) : 0;

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          totalRegistered: regMap.size,
          totalAttemptingStudents,
          totalAttemptsLogged,
          highestScoreLogged,
          avgScoreLogged,
        },
        students: filteredStudents,
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

async function getWorkerActivePaper(env: Env): Promise<any> {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/app_config?key=eq.active_exam_paper&select=value`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    if (res.ok) {
      const rows: any = await res.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value);
        if (parsed && Array.isArray(parsed.subjects) && parsed.subjects.length === 3) {
          return parsed;
        }
      }
    }
  } catch {}

  return DEFAULT_ACTIVE_EXAM_PAPER;
}

async function handleActiveExam(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const paper = await getWorkerActivePaper(env);
    const sanitizedSubjects = paper.subjects.map((subj: any) => ({
      name: subj.name,
      totalQuestions: subj.totalQuestions,
      mcqCount: subj.mcqCount,
      numericalCount: subj.numericalCount,
      questions: subj.questions.map((q: any) => ({
        id: q.id,
        subject: q.subject,
        section: q.section,
        type: q.type,
        questionNumber: q.questionNumber,
        overallNumber: q.overallNumber,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        imagePaths: q.imagePaths,
        chapter: q.chapter,
        difficulty: q.difficulty,
      })),
    }));

    return new Response(
      JSON.stringify({
        success: true,
        paper: {
          ...paper,
          subjects: sanitizedSubjects,
        },
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to load active exam" }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

async function handleAdminExam(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (!isWorkerAdmin(request, env)) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized access" }),
      { status: 401, headers: jsonHeaders }
    );
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

  try {
    const body: any = await request.json().catch(() => ({}));

    if (body.action === "get") {
      const paper = await getWorkerActivePaper(env);
      return new Response(JSON.stringify({ success: true, paper }), { status: 200, headers: jsonHeaders });
    }

    if (body.action === "reset") {
      await fetch(`${supabaseUrl}/rest/v1/app_config`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          key: "active_exam_paper",
          value: JSON.stringify(DEFAULT_ACTIVE_EXAM_PAPER),
          description: "Active 75-Question JEE Main Paper",
          updated_at: new Date().toISOString(),
        }),
      });

      return new Response(
        JSON.stringify({ success: true, message: "Reset to default paper", paper: DEFAULT_ACTIVE_EXAM_PAPER }),
        { status: 200, headers: jsonHeaders }
      );
    }

    if (body.paper) {
      body.paper.updatedAt = new Date().toISOString();
      await fetch(`${supabaseUrl}/rest/v1/app_config`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          key: "active_exam_paper",
          value: JSON.stringify(body.paper),
          description: "Active 75-Question JEE Main Paper",
          updated_at: new Date().toISOString(),
        }),
      });

      return new Response(
        JSON.stringify({ success: true, message: "Saved successfully", paper: body.paper }),
        { status: 200, headers: jsonHeaders }
      );
    }

    return new Response(JSON.stringify({ success: false, error: "Invalid action" }), { status: 400, headers: jsonHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: jsonHeaders });
  }
}

async function handleAdminExamSearch(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const passcodeHeader = request.headers.get("x-admin-passcode");
  const emailHeader = (request.headers.get("x-admin-email") || "").toLowerCase().trim();
  const validPasscode = env.ADMIN_PASSCODE || DEFAULT_ADMIN_PASSCODE;
  const isAuth =
    (passcodeHeader && passcodeHeader.trim() === validPasscode) ||
    (emailHeader && ALLOWED_ADMIN_EMAILS.includes(emailHeader));

  if (!isAuth) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized access" }),
      { status: 401, headers: jsonHeaders }
    );
  }

  try {
    const body: any = await request.json().catch(() => ({}));
    const subject = (body.subject || "").trim();
    const chapter = (body.chapter || "").trim();
    const query = (body.q || "").trim();
    const limit = Math.min(50, Math.max(5, Number(body.limit) || 20));

    // Tokenize search words
    const rawTokens = (query || chapter)
      .toLowerCase()
      .split(/[\s,()&_\-\/]+/)
      .filter((w: string) => w.length > 2 && !["and", "the", "for", "with", "from", "into", "that", "this"].includes(w));

    let filtered = (CURATED_QUESTION_BANK as any[]).filter((q) => {
      if (subject && q.subject.toLowerCase() !== subject.toLowerCase()) return false;
      if (rawTokens.length === 0) return true;
      const haystack = `${q.chapter} ${q.questionText}`.toLowerCase();
      return rawTokens.some((tok: string) => haystack.includes(tok));
    });

    // If query was specific and gave 0 matches, fallback to subject questions so admin is never left with an empty list
    if (filtered.length === 0 && subject) {
      filtered = (CURATED_QUESTION_BANK as any[]).filter(
        (q) => q.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    const results = filtered.slice(0, limit);
    return new Response(
      JSON.stringify({ success: true, count: results.length, questions: results }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

function checkQuestionCorrect(userAns: string, q: any): boolean {
  if (!userAns) return false;
  const rawUser = userAns.trim();
  const normUser = rawUser.toLowerCase();
  const rawCorrect = (q.correct_answer || q.correctAnswer || "").trim();
  const normCorrect = rawCorrect.toLowerCase();

  // 1. Direct string match
  if (normCorrect && normUser === normCorrect) return true;

  // 2. Letter to Number bidirectional mapping (A <-> 1, B <-> 2, C <-> 3, D <-> 4)
  const mapLetterToNum: Record<string, string> = { a: "1", b: "2", c: "3", d: "4" };
  const mapNumToLetter: Record<string, string> = { "1": "a", "2": "b", "3": "c", "4": "d" };
  if (mapLetterToNum[normUser] === normCorrect || mapLetterToNum[normCorrect] === normUser) return true;
  if (mapNumToLetter[normUser] === normCorrect || mapNumToLetter[normCorrect] === normUser) return true;

  // 3. Option text match
  const optA = (q.option_a || q.optionA || "").trim().toLowerCase();
  const optB = (q.option_b || q.optionB || "").trim().toLowerCase();
  const optC = (q.option_c || q.optionC || "").trim().toLowerCase();
  const optD = (q.option_d || q.optionD || "").trim().toLowerCase();

  let chosenText = "";
  if (normUser === "a" || normUser === "1") chosenText = optA;
  else if (normUser === "b" || normUser === "2") chosenText = optB;
  else if (normUser === "c" || normUser === "3") chosenText = optC;
  else if (normUser === "d" || normUser === "4") chosenText = optD;

  if (chosenText && normCorrect && (chosenText === normCorrect || normCorrect.includes(chosenText))) return true;

  // 4. Numerical float comparison
  const numUser = parseFloat(normUser);
  const numCorrect = parseFloat(normCorrect);
  if (!isNaN(numUser) && !isNaN(numCorrect)) {
    if (Math.abs(numUser - numCorrect) < 0.05) return true;
  }

  // 5. Solution check fallback
  const sol = (q.solution || "").trim();
  if (sol) {
    const solLower = sol.toLowerCase();

    // Check for explicit option mentions in solution
    const isLetter = ["a", "b", "c", "d"].includes(normUser);
    const isDigit = ["1", "2", "3", "4"].includes(normUser);
    if (isLetter || isDigit) {
      const letter = isLetter ? normUser : ["a", "b", "c", "d"][parseInt(normUser, 10) - 1];
      const digit = isDigit ? normUser : String(["a", "b", "c", "d"].indexOf(normUser) + 1);

      if (
        solLower.includes(`correct option is (${letter})`) ||
        solLower.includes(`correct option is ${letter}`) ||
        solLower.includes(`option (${letter}) is correct`) ||
        solLower.includes(`(${letter}) is correct`) ||
        solLower.includes(`correct option is (${digit})`) ||
        solLower.includes(`correct option is ${digit}`) ||
        solLower.includes(`option (${digit}) is correct`) ||
        solLower.includes(`(${digit}) is correct`) ||
        solLower.includes(`ans. (${digit})`) ||
        solLower.includes(`ans. (${letter})`)
      ) {
        return true;
      }
    }

    // Numerical in solution
    if (!isNaN(numUser)) {
      const patterns = [
        /(?:=|is|comes out to be|equal to|value of [a-zA-Zα-ωΑ-Ω_0-9\s]+ is|total|hence|therefore|∴|⇒)\s*(-?\d+(?:\.\d+)?)\s*(?:Ω|ohm|cm|m|s|j|kg|v|w|a|hz|k|n|c|deg|%|rad|mol|isomers|mole\/l)?(?:\.|\s|$)/gi,
      ];
      for (const pattern of patterns) {
        const matches = [...sol.matchAll(pattern)];
        for (const m of matches) {
          const extractedVal = parseFloat(m[1]);
          if (!isNaN(extractedVal) && Math.abs(numUser - extractedVal) < 0.05) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

async function handleExamSubmit(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body: any = await request.json().catch(() => ({}));
    const {
      testId,
      responses = {},
      timeSpentSeconds,
      candidateEmail,
      questionTimes,    // Record<questionId, seconds> — per-question time
      tabViolations,    // number
      submissionReason, // string
      testTitle,        // string
      startedAt,        // ISO timestamp
    } = body;

    const rawTestId = (testId || body.id || "").toString().trim();
    const cleanTestId = decodeURIComponent(rawTestId);
    const mftMatch = cleanTestId.match(/^MFT-0*(\d+)(\.pdf)?$/i);
    const resolvedFile = mftMatch ? `MFT-${mftMatch[1]}.pdf` : cleanTestId.endsWith(".pdf") ? cleanTestId : `${cleanTestId}.pdf`;

    const db = MFT_QUESTIONS_BY_FILE as Record<string, any[]>;
    const mftQuestions = (db[resolvedFile] || db[cleanTestId]) as any[];

    let evaluation: any = null;
    let totalQuestions = 0;
    let attemptedCount = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let totalScore = 0;
    const sectionBreakdown: any[] = [];
    const detailedResults: any[] = [];

    // ── Case A: Full Mock Test (MFT) ──────────────────────────────────────────
    if (mftQuestions && mftQuestions.length > 0) {
      const isMft = resolvedFile.startsWith("MFT-");
      const cleanTitle = resolvedFile.replace(/\.pdf$/i, "").replace(/_/g, " ");
      const marksPerQ = 4;
      const negMarks = 1;

      const sectionMap = new Map<string, { total: number; attempted: number; correct: number; incorrect: number; score: number }>();

      for (const q of mftQuestions) {
        totalQuestions++;
        const sec = q.subject || "General";
        if (!sectionMap.has(sec)) {
          sectionMap.set(sec, { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 });
        }
        const s = sectionMap.get(sec)!;
        s.total++;

        const userAns = (responses[q.id] || "").trim();
        const isAttempted = Boolean(userAns);
        const timeOnQuestion = (questionTimes && questionTimes[q.id]) ? Number(questionTimes[q.id]) : 0;

        let isCorrect = false;
        let marksAwarded = 0;

        if (isAttempted) {
          attemptedCount++;
          s.attempted++;

          isCorrect = checkQuestionCorrect(userAns, q);

          if (isCorrect) {
            correctCount++;
            s.correct++;
            marksAwarded = marksPerQ;
            totalScore += marksPerQ;
            s.score += marksPerQ;
          } else {
            // If answer key exists and is wrong: -1 mark
            const hasKnownAnswer = Boolean(q.correct_answer && q.correct_answer !== "—");
            if (hasKnownAnswer) {
              incorrectCount++;
              s.incorrect++;
              marksAwarded = -negMarks;
              totalScore -= negMarks;
              s.score -= negMarks;
            } else {
              // Neutral if key was dash/unavailable
              marksAwarded = 0;
            }
          }
        }

        detailedResults.push({
          questionId: q.id,
          questionNumber: q.question_number,
          subject: q.subject,
          chapter: q.chapter || "General",
          difficulty: q.difficulty || "Medium",
          questionText: q.question_text,
          optionA: q.option_a || null,
          optionB: q.option_b || null,
          optionC: q.option_c || null,
          optionD: q.option_d || null,
          imagePaths: q.image_paths || [],
          userResponse: isAttempted ? userAns : null,
          correctAnswer: q.correct_answer,
          isCorrect,
          solution: q.solution,
          marksAwarded,
          timeSpentSeconds: timeOnQuestion,
        });
      }

      const preferredOrder = ["Physics", "Chemistry", "Mathematics"];
      for (const p of preferredOrder) {
        if (sectionMap.has(p)) {
          sectionBreakdown.push({ sectionName: p, ...sectionMap.get(p)! });
          sectionMap.delete(p);
        }
      }
      for (const [name, st] of sectionMap.entries()) {
        sectionBreakdown.push({ sectionName: name, ...st });
      }

      const unattemptedCount = totalQuestions - attemptedCount;
      const maxScore = totalQuestions * marksPerQ;
      const percentage = maxScore > 0 ? Math.max(0, Math.round((totalScore / maxScore) * 100 * 10) / 10) : 0;
      const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100 * 10) / 10 : 0;

      evaluation = {
        testId: encodeURIComponent(resolvedFile),
        testTitle: testTitle || (isMft ? `JEE Main - ${cleanTitle}` : cleanTitle),
        totalQuestions,
        attemptedCount,
        correctCount,
        incorrectCount,
        unattemptedCount,
        totalScore,
        maxScore,
        percentage,
        accuracy,
        timeSpentSeconds: Number(timeSpentSeconds) || 0,
        sectionBreakdown,
        detailedResults,
        submissionReason: submissionReason || null,
        tabViolations: Number(tabViolations) || 0,
      };
    } 
    // ── Case B: Active Exam Paper ─────────────────────────────────────────────
    else {
      const paper = await getWorkerActivePaper(env);

      for (const subj of paper.subjects) {
        let secTotal = 0;
        let secAttempted = 0;
        let secCorrect = 0;
        let secIncorrect = 0;
        let secScore = 0;

        for (const q of subj.questions) {
          totalQuestions++;
          secTotal++;

          const userAns = (responses[q.id] || "").trim();
          const isAttempted = Boolean(userAns);
          const timeOnQuestion = (questionTimes && questionTimes[q.id]) ? Number(questionTimes[q.id]) : 0;

          let isCorrect = false;
          let marksAwarded = 0;

          if (isAttempted) {
            attemptedCount++;
            secAttempted++;

            if (q.type === "NUMERICAL") {
              const numUser = parseFloat(userAns);
              const numCorrect = parseFloat(q.correctAnswer);
              if (!isNaN(numUser) && !isNaN(numCorrect)) {
                isCorrect = Math.abs(numUser - numCorrect) < 0.05;
              } else {
                isCorrect = userAns.toLowerCase() === q.correctAnswer.trim().toLowerCase();
              }
            } else {
              isCorrect = userAns.toUpperCase() === q.correctAnswer.trim().toUpperCase();
            }

            if (isCorrect) {
              correctCount++;
              secCorrect++;
              marksAwarded = paper.marksPerQuestion || 4;
              totalScore += marksAwarded;
              secScore += marksAwarded;
            } else {
              incorrectCount++;
              secIncorrect++;
              marksAwarded = -(paper.negativeMarks || 1);
              totalScore += marksAwarded;
              secScore += marksAwarded;
            }
          }

          detailedResults.push({
            questionId: q.id,
            questionNumber: q.questionNumber,
            subject: q.subject,
            chapter: q.chapter || "General",
            section: q.section,
            type: q.type,
            difficulty: q.difficulty || "Medium",
            questionText: q.questionText,
            optionA: q.optionA || null,
            optionB: q.optionB || null,
            optionC: q.optionC || null,
            optionD: q.optionD || null,
            imagePaths: q.imagePaths || [],
            userResponse: isAttempted ? userAns : null,
            correctAnswer: q.correctAnswer,
            isCorrect,
            solution: q.solution,
            marksAwarded,
            timeSpentSeconds: timeOnQuestion,
          });
        }

        sectionBreakdown.push({
          sectionName: subj.name,
          total: secTotal,
          attempted: secAttempted,
          correct: secCorrect,
          incorrect: secIncorrect,
          score: secScore,
        });
      }

      const unattemptedCount = totalQuestions - attemptedCount;
      const maxScore = totalQuestions * (paper.marksPerQuestion || 4);
      const percentage = maxScore > 0 ? Math.max(0, Math.round((totalScore / maxScore) * 100 * 10) / 10) : 0;
      const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100 * 10) / 10 : 0;

      evaluation = {
        testId: paper.id,
        testTitle: testTitle || paper.title || paper.id,
        totalQuestions,
        attemptedCount,
        correctCount,
        incorrectCount,
        unattemptedCount,
        totalScore,
        maxScore,
        percentage,
        accuracy,
        timeSpentSeconds: Number(timeSpentSeconds) || 0,
        sectionBreakdown,
        detailedResults,
        submissionReason: submissionReason || null,
        tabViolations: Number(tabViolations) || 0,
      };
    }

    // ── Supabase Persistence (non-fatal) ─────────────────────────────────────
    const email = (candidateEmail || "").trim().toLowerCase();
    if (email) {
      const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
      const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

      // Build per-question time map: { questionId -> seconds }
      const questionTimesMap: Record<string, number> = {};
      for (const dr of detailedResults) {
        questionTimesMap[dr.questionId] = dr.timeSpentSeconds;
      }

      const attemptPayload = {
        email,
        test_id: evaluation.testId,
        test_title: evaluation.testTitle,
        score: evaluation.totalScore,
        max_score: evaluation.maxScore,
        percentage: evaluation.percentage,
        accuracy: evaluation.accuracy,
        time_spent_seconds: evaluation.timeSpentSeconds,
        total_questions: evaluation.totalQuestions,
        attempted_count: evaluation.attemptedCount,
        correct_count: evaluation.correctCount,
        incorrect_count: evaluation.incorrectCount,
        section_breakdown: sectionBreakdown,
        detailed_results: detailedResults,
        question_times: questionTimesMap,
        tab_violations: Number(tabViolations) || 0,
        submission_reason: submissionReason || null,
        started_at: startedAt || null,
      };

      try {
        const insRes = await fetch(`${supabaseUrl}/rest/v1/exam_attempts`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(attemptPayload),
        });
        if (insRes.ok) {
          const insertedRows: any = await insRes.json();
          if (Array.isArray(insertedRows) && insertedRows.length > 0 && insertedRows[0].id) {
            evaluation.id = insertedRows[0].id;
          }
        }
      } catch (syncErr) {
        console.warn("Supabase exam_attempts sync failed:", syncErr);
      }
    }

    return new Response(JSON.stringify({ success: true, result: evaluation }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
}

// ── Exam Detail: load a test by ID ────────────────────────────────────────────
async function handleExamDetail(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  try {
    const body: any = await request.json().catch(() => ({}));
    const rawId = (body.id || "").toString().trim();

    if (!rawId) {
      return new Response(JSON.stringify({ success: false, error: "Test ID is required" }), { status: 400, headers: jsonHeaders });
    }

    // Decode and normalise: "MFT-1.pdf", "MFT-1", "MFT-01" all resolve to "MFT-1.pdf"
    const cleanId = decodeURIComponent(rawId);
    const mftMatch = cleanId.match(/^MFT-0*(\d+)(\.pdf)?$/i);
    const resolvedFile = mftMatch ? `MFT-${mftMatch[1]}.pdf` : cleanId.endsWith(".pdf") ? cleanId : `${cleanId}.pdf`;

    const db = MFT_QUESTIONS_BY_FILE as Record<string, any[]>;
    const rows = db[resolvedFile];

    if (!rows || rows.length === 0) {
      // Try fallback without .pdf
      const rowsNoPdf = db[cleanId];
      if (!rowsNoPdf || rowsNoPdf.length === 0) {
        return new Response(JSON.stringify({ success: false, error: `Test not found: ${cleanId}` }), { status: 404, headers: jsonHeaders });
      }
    }

    const questions = (rows || db[cleanId] || []) as any[];
    const isMft = resolvedFile.startsWith("MFT-");
    const cleanTitle = resolvedFile.replace(/\.pdf$/i, "").replace(/_/g, " ");

    // Group questions into sections by subject, order: Physics → Chemistry → Mathematics
    const sectionMap = new Map<string, any[]>();
    for (const q of questions) {
      const sec = q.subject || "General";
      if (!sectionMap.has(sec)) sectionMap.set(sec, []);
      sectionMap.get(sec)!.push(q);
    }

    const preferredOrder = ["Physics", "Chemistry", "Mathematics"];
    const sections: any[] = [];
    for (const p of preferredOrder) {
      if (sectionMap.has(p)) {
        sections.push({ name: p, questions: sectionMap.get(p)!.map(sanitizeQuestion) });
        sectionMap.delete(p);
      }
    }
    for (const [name, qs] of sectionMap.entries()) {
      sections.push({ name, questions: qs.map(sanitizeQuestion) });
    }

    const test = {
      id: encodeURIComponent(resolvedFile),
      title: isMft ? `JEE Main - ${cleanTitle}` : cleanTitle,
      source_file: resolvedFile,
      total_questions: questions.length,
      duration_minutes: isMft ? 180 : Math.max(30, Math.round(questions.length * 2.4)),
      marks_per_question: 4,
      negative_marks: 1,
      sections,
    };

    return new Response(JSON.stringify({ success: true, test }), { status: 200, headers: jsonHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: jsonHeaders });
  }
}

// Strip correct_answer and solution for the player (candidates shouldn't see answers)
function sanitizeQuestion(q: any) {
  return {
    id: q.id,
    subject: q.subject,
    unit_id: q.unit_id,
    unit_name: q.unit_name,
    chapter: q.chapter,
    source_file: q.source_file,
    question_number: q.question_number,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    difficulty: q.difficulty,
    has_image: q.has_image,
    image_paths: q.image_paths,
  };
}

// ── Exam Tests: list available full mock tests ────────────────────────────────
async function handleExamTests(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  try {
    const db = MFT_QUESTIONS_BY_FILE as Record<string, any[]>;
    const fullMocks = Object.entries(db)
      .filter(([file]) => file.startsWith("MFT-"))
      .sort(([a], [b]) => {
        const na = parseInt(a.match(/\d+/)?.[0] || "0");
        const nb = parseInt(b.match(/\d+/)?.[0] || "0");
        return na - nb;
      })
      .map(([file, questions]) => {
        const cleanTitle = file.replace(/\.pdf$/i, "").replace(/_/g, " ");
        return {
          id: encodeURIComponent(file),
          title: `JEE Main - ${cleanTitle} (Official Pattern)`,
          source_file: file,
          subject: "All Subjects",
          question_count: questions.length,
          duration_minutes: 180,
          is_full_mock: true,
        };
      });

    return new Response(JSON.stringify({ success: true, fullMocks, chapterTests: [] }), { status: 200, headers: jsonHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: jsonHeaders });
  }
}

// ── Exam Solutions: load test with answers for review mode ───────────────────
async function handleExamSolutions(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  try {
    const body: any = await request.json().catch(() => ({}));
    const rawId = (body.id || "").toString().trim();

    if (!rawId) {
      return new Response(JSON.stringify({ success: false, error: "Test ID is required" }), { status: 400, headers: jsonHeaders });
    }

    const cleanId = decodeURIComponent(rawId);
    const mftMatch = cleanId.match(/^MFT-0*(\d+)(\.pdf)?$/i);
    const resolvedFile = mftMatch ? `MFT-${mftMatch[1]}.pdf` : cleanId.endsWith(".pdf") ? cleanId : `${cleanId}.pdf`;

    const db = MFT_QUESTIONS_BY_FILE as Record<string, any[]>;
    const questions = (db[resolvedFile] || db[cleanId] || []) as any[];

    if (!questions.length) {
      return new Response(JSON.stringify({ success: false, error: `Test not found: ${cleanId}` }), { status: 404, headers: jsonHeaders });
    }

    // Build evaluation result from userResponses + correct answers
    const userResponses: Record<string, string> = body.responses || {};
    const isMft = resolvedFile.startsWith("MFT-");
    const marksPerQ = 4;
    const negativeMarks = 1;

    let totalScore = 0, correct = 0, incorrect = 0, attempted = 0;
    const detailedResults: any[] = [];
    const sectionMap = new Map<string, { total: number; attempted: number; correct: number; incorrect: number; score: number }>();

    for (const q of questions) {
      const sec = q.subject || "General";
      if (!sectionMap.has(sec)) sectionMap.set(sec, { total: 0, attempted: 0, correct: 0, incorrect: 0, score: 0 });
      const s = sectionMap.get(sec)!;
      s.total++;

      const userAns = (userResponses[q.id] || "").trim();
      const isAttempted = Boolean(userAns);
      let isCorrect = false;
      let marksAwarded = 0;

      if (isAttempted) {
        attempted++;
        s.attempted++;
        isCorrect = userAns.toUpperCase() === (q.correct_answer || "").trim().toUpperCase();
        if (isCorrect) {
          correct++;
          s.correct++;
          marksAwarded = marksPerQ;
          totalScore += marksPerQ;
          s.score += marksPerQ;
        } else {
          incorrect++;
          s.incorrect++;
          marksAwarded = -negativeMarks;
          totalScore -= negativeMarks;
          s.score -= negativeMarks;
        }
      }

      detailedResults.push({
        questionId: q.id,
        questionNumber: q.question_number,
        subject: q.subject,
        chapter: q.chapter || "General",
        difficulty: q.difficulty || "Medium",
        questionText: q.question_text,
        optionA: q.option_a || null,
        optionB: q.option_b || null,
        optionC: q.option_c || null,
        optionD: q.option_d || null,
        imagePaths: q.image_paths || [],
        userResponse: isAttempted ? userAns : null,
        correctAnswer: q.correct_answer,
        isCorrect,
        solution: q.solution,
        marksAwarded,
      });
    }

    const maxScore = questions.length * marksPerQ;
    const percentage = maxScore > 0 ? Math.max(0, Math.round((totalScore / maxScore) * 1000) / 10) : 0;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 1000) / 10 : 0;
    const cleanTitle = resolvedFile.replace(/\.pdf$/i, "").replace(/_/g, " ");

    const preferredOrder = ["Physics", "Chemistry", "Mathematics"];
    const sectionBreakdown: any[] = [];
    for (const p of preferredOrder) {
      if (sectionMap.has(p)) {
        const s = sectionMap.get(p)!;
        sectionBreakdown.push({ sectionName: p, ...s });
        sectionMap.delete(p);
      }
    }
    for (const [name, s] of sectionMap.entries()) {
      sectionBreakdown.push({ sectionName: name, ...s });
    }

    const result: any = {
      testId: encodeURIComponent(resolvedFile),
      testTitle: isMft ? `JEE Main - ${cleanTitle}` : cleanTitle,
      totalQuestions: questions.length,
      attemptedCount: attempted,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: questions.length - attempted,
      totalScore,
      maxScore,
      percentage,
      accuracy,
      timeSpentSeconds: Number(body.timeSpentSeconds) || 0,
      sectionBreakdown,
      detailedResults,
    };

    // If attemptId or candidate email is provided, enrich with past attempt data from Supabase
    const attemptId = body.attemptId || null;
    const email = (body.email || body.candidateEmail || "").toLowerCase().trim();
    if (attemptId || email) {
      try {
        const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
        const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";
        
        let endpoint = attemptId
          ? `${supabaseUrl}/rest/v1/exam_attempts?id=eq.${encodeURIComponent(attemptId)}&limit=1`
          : `${supabaseUrl}/rest/v1/exam_attempts?email=eq.${encodeURIComponent(email)}&test_id=eq.${encodeURIComponent(resolvedFile)}&order=created_at.desc&limit=1`;

        const pastRes = await fetch(endpoint, {
          headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
        });
        if (pastRes.ok) {
          const pastList = await pastRes.json();
          if (Array.isArray(pastList) && pastList.length > 0) {
            const past = pastList[0];
            result.id = past.id;
            if (past.detailed_results && Array.isArray(past.detailed_results)) {
              result.detailedResults = past.detailed_results;
            }
            result.totalScore = past.score ?? result.totalScore;
            result.maxScore = past.max_score ?? result.maxScore;
            result.accuracy = past.accuracy ?? result.accuracy;
            result.percentage = past.percentage ?? result.percentage;
            result.timeSpentSeconds = past.time_spent_seconds ?? result.timeSpentSeconds;
            result.attemptedCount = past.attempted_count ?? result.attemptedCount;
            result.correctCount = past.correct_count ?? result.correctCount;
            result.incorrectCount = past.incorrect_count ?? result.incorrectCount;
            if (past.section_breakdown) result.sectionBreakdown = past.section_breakdown;
            if (past.question_times) result.questionTimes = past.question_times;
            if (past.created_at) result.createdAt = past.created_at;
          }
        }
      } catch (err) {
        // Non-fatal
      }
    }

    return new Response(JSON.stringify({ success: true, result }), { status: 200, headers: jsonHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: jsonHeaders });
  }
}
