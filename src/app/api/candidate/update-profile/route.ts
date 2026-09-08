import { NextResponse } from "next/server";
import { hydrateCandidateRecord, serializeDossier } from "@/lib/candidateUtils";

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

    // 2. If record exists: UPDATE single row
    if (existingRecord) {
      const fullPatchPayload: Record<string, any> = {};
      if (fullName) fullPatchPayload.full_name = fullName;
      if (cleanPhone) fullPatchPayload.phone = cleanPhone;
      if (gender) fullPatchPayload.gender = gender;
      if (jeeStatus) fullPatchPayload.jee_status = jeeStatus;
      if (familyIncome) fullPatchPayload.family_income = familyIncome;
      if (scholarshipTrack) fullPatchPayload.scholarship_track = scholarshipTrack;
      if (scholarshipSlab) fullPatchPayload.scholarship_slab = scholarshipSlab;

      // Attempt primary update with native columns
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

      // If column is missing in schema cache (PGRST204), fallback to payment_method storage
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
        const patched = await patchRes.json();
        if (Array.isArray(patched) && patched.length > 0) {
          updatedRecord = patched[0];
        }
      }

      if (!updatedRecord) {
        updatedRecord = { ...existingRecord, ...fullPatchPayload };
      }
    } 
    // 3. If no existing row: INSERT a new single canonical row
    else {
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
        const inserted = await insertRes.json();
        if (Array.isArray(inserted) && inserted.length > 0) {
          updatedRecord = inserted[0];
        }
      }

      if (!updatedRecord) {
        updatedRecord = fullInsertPayload;
      }
    }

    const hydrated = hydrateCandidateRecord(updatedRecord, {
      gender,
      family_income: familyIncome,
      scholarship_track: scholarshipTrack,
      scholarship_slab: scholarshipSlab,
    });

    return NextResponse.json({
      success: true,
      registration: hydrated,
    });
  } catch (error: any) {
    console.error("Error updating candidate profile:", error);
    return NextResponse.json(
      { error: error.message || "Failed to synchronize candidate profile" },
      { status: 500 }
    );
  }
}
