export interface Env {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
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

    if (!existingRecord && orderId) {
      const orderSearchRes = await fetch(
        `${supabaseUrl}/rest/v1/registrations?or=(order_id.eq.${encodeURIComponent(orderId)},referral_code.eq.${encodeURIComponent(orderId)})&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (orderSearchRes.ok) {
        const found: any = await orderSearchRes.json();
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
      JSON.stringify({
        success: true,
        registration: hydrated,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to synchronize candidate profile" }),
      { status: 500, headers: jsonHeaders }
    );
  }
}
