export interface Env {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body: any = await context.request.json().catch(() => ({}));
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

    const supabaseUrl = context.env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey =
      context.env.SUPABASE_SERVICE_ROLE_KEY ||
      context.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
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
      const patchPayload: Record<string, any> = {};
      if (fullName) patchPayload.full_name = fullName;
      if (cleanPhone) patchPayload.phone = cleanPhone;
      if (gender) patchPayload.gender = gender;
      if (jeeStatus) patchPayload.jee_status = jeeStatus;
      if (familyIncome) patchPayload.family_income = familyIncome;
      if (scholarshipTrack) patchPayload.scholarship_track = scholarshipTrack;
      if (scholarshipSlab) patchPayload.scholarship_slab = scholarshipSlab;

      const patchRes = await fetch(
        `${supabaseUrl}/rest/v1/registrations?id=eq.${encodeURIComponent(existingRecord.id)}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(patchPayload),
        }
      );

      if (patchRes.ok) {
        const patched: any = await patchRes.json();
        if (Array.isArray(patched) && patched.length > 0) {
          updatedRecord = patched[0];
        }
      }

      if (!updatedRecord) {
        updatedRecord = { ...existingRecord, ...patchPayload };
      }
    } else {
      const newId = `sf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const insertPayload = {
        id: newId,
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
        payment_status: "pending",
      };

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/registrations`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(insertPayload),
      });

      if (insertRes.ok) {
        const inserted: any = await insertRes.json();
        if (Array.isArray(inserted) && inserted.length > 0) {
          updatedRecord = inserted[0];
        }
      }

      if (!updatedRecord) {
        updatedRecord = insertPayload;
      }
    }

    return new Response(
      JSON.stringify({ success: true, registration: updatedRecord }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: jsonHeaders }
    );
  }
}
