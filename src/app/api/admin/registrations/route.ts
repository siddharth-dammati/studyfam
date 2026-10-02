import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { hydrateCandidateRecord } from "@/lib/candidateUtils";
import { CandidateRecord } from "@/components/dashboard/CandidateRegistrationCard";

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized access. Valid admin passcode or authorized email required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const search = (body.search || "").trim().toLowerCase();
    const statusFilter = body.status || "all";
    const trackFilter = body.track || "all";
    const genderFilter = body.gender || "all";
    const streamFilter = body.stream || "all";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    // Fetch all registrations except system config placeholder
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
      return NextResponse.json(
        { error: "Failed to fetch registrations: " + errorText },
        { status: 500 }
      );
    }

    const rawRows = await res.json();
    const hydratedRows: CandidateRecord[] = (Array.isArray(rawRows) ? rawRows : []).map((row: any) =>
      hydrateCandidateRecord(row)
    );

    // Calculate aggregated overview stats across all records
    const totalRegistrations = hydratedRows.length;
    const confirmedCount = hydratedRows.filter(
      (r) => r.status === "confirmed" || (r.amount_paid && r.amount_paid > 0)
    ).length;
    const waitlistCount = totalRegistrations - confirmedCount;
    const totalRevenue = confirmedCount * 27;
    const scholarshipPool = confirmedCount * 18;
    const fundedStudents = Math.floor(scholarshipPool / 900);

    const meritCount = hydratedRows.filter((r) => r.scholarship_track === "merit").length;
    const needCount = hydratedRows.filter((r) => r.scholarship_track === "need_based").length;
    const optOutCount = hydratedRows.filter((r) => r.scholarship_track === "opt_out").length;
    const boysCount = hydratedRows.filter((r) => r.gender === "boy").length;
    const girlsCount = hydratedRows.filter((r) => r.gender === "girl").length;

    // Apply filtering
    const filteredRows = hydratedRows.filter((r) => {
      // Status filter
      if (statusFilter === "confirmed") {
        const isConfirmed = r.status === "confirmed" || (r.amount_paid && r.amount_paid > 0);
        if (!isConfirmed) return false;
      } else if (statusFilter === "waitlist") {
        const isConfirmed = r.status === "confirmed" || (r.amount_paid && r.amount_paid > 0);
        if (isConfirmed) return false;
      }

      // Track filter
      if (trackFilter !== "all") {
        if (trackFilter === "merit" && r.scholarship_track !== "merit") return false;
        if (trackFilter === "need_based" && r.scholarship_track !== "need_based") return false;
        if (trackFilter === "opt_out" && r.scholarship_track !== "opt_out") return false;
      }

      // Gender filter
      if (genderFilter !== "all" && r.gender !== genderFilter) {
        return false;
      }

      // Stream filter
      if (streamFilter !== "all" && r.jee_status !== streamFilter) {
        return false;
      }

      // Search query filter
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

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error("Admin registrations fetch error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
