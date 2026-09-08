import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || "").trim().toLowerCase();
    const fullName = (body.fullName || "").trim();
    const rawPhone = (body.phone || "").trim();
    const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);
    const gender = body.gender || null; // 'boy' | 'girl' | 'other'
    const jeeStatus = body.jeeStatus || "class-11";
    const familyIncome = body.familyIncome || null;
    let scholarshipTrack = body.scholarshipTrack || "merit"; // 'merit' | 'need_based' | 'opt_out'
    if (familyIncome === "above_8l" && scholarshipTrack === "need_based") {
      scholarshipTrack = "merit";
    }
    const scholarshipSlab = body.scholarshipSlab || (scholarshipTrack === "opt_out" ? "opt_out" : "full_fee_100");
    const orderId = body.orderId || null;

    if (!email && !orderId && cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Email or verified order reference is required to synchronize candidate profile." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    // 1. Search for existing registration by email or order_id to prevent duplicates
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
        const found = await searchRes.json();
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
        const found = await orderSearchRes.json();
        if (Array.isArray(found) && found.length > 0) {
          existingRecord = found[0];
        }
      }
    }

    let updatedRecord: any = null;

    // 2. If record exists: UPDATE single row (preserves payment details, order_id, etc.)
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
        const patched = await patchRes.json();
        if (Array.isArray(patched) && patched.length > 0) {
          updatedRecord = patched[0];
        }
      }

      if (!updatedRecord) {
        // Fallback merge
        updatedRecord = { ...existingRecord, ...patchPayload };
      }
    } 
    // 3. If no existing row: INSERT a new single canonical row
    else {
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
        const inserted = await insertRes.json();
        if (Array.isArray(inserted) && inserted.length > 0) {
          updatedRecord = inserted[0];
        }
      }

      if (!updatedRecord) {
        updatedRecord = insertPayload;
      }
    }

    return NextResponse.json({
      success: true,
      registration: updatedRecord,
    });
  } catch (error: any) {
    console.error("Error updating candidate profile:", error);
    return NextResponse.json(
      { error: error.message || "Failed to synchronize candidate profile" },
      { status: 500 }
    );
  }
}
