import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { hydrateCandidateRecord } from "@/lib/candidateUtils";

export interface StudentAttemptItem {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeSpentSeconds: number;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  sectionBreakdown?: any[];
  detailedResults?: any[];
  questionTimes?: Record<string, number>;
  tabViolations?: number;
  submissionReason?: string;
  startedAt?: string;
  createdAt: string;
}

export interface StudentMftSlot {
  code: string;
  title: string;
  testId: string;
  attempted: boolean;
  attemptsCount: number;
  bestScore: number | null;
  latestScore: number | null;
  latestPercentage: number | null;
  latestAccuracy: number | null;
  latestTimeSeconds: number | null;
  latestAttemptedAt: string | null;
}

export interface StudentAdminProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  rollNo?: string;
  jeeStatus?: string;
  gender?: string;
  scholarshipTrack?: string;
  registrationStatus?: string;
  registeredAt?: string;
  
  // Aggregate KPIs
  totalAttempts: number;
  bestMarks: number;
  bestPercentage: number;
  averageMarks: number;
  averageAccuracy: number;
  totalTimeSpentSeconds: number;

  // Latest attempt
  latestAttempt: StudentAttemptItem | null;

  // MFT Matrix (MFT-01 to MFT-10 + Active Mock)
  mftMatrix: Record<string, StudentMftSlot>;

  // All attempts by this student
  attempts: StudentAttemptItem[];
}

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized access. Valid admin credentials required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const search = (body.search || "").trim().toLowerCase();
    const testFilter = (body.testFilter || "all").trim().toLowerCase();
    const sortBy = body.sortBy || "latest"; // 'latest' | 'best_marks' | 'attempts' | 'name'

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wyzkhvomjwrgripytoiv.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_OAyjUsFt2m1hx6qQgAp7NA_lhQEhXte";

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    };

    // 1. Fetch Candidate Registrations
    const regRes = await fetch(
      `${supabaseUrl}/rest/v1/registrations?email=neq.system_config@studyfam.org&order=created_at.desc&limit=1500`,
      { headers }
    );
    const rawRegistrations = regRes.ok ? await regRes.json() : [];

    // 2. Fetch Exam Attempts
    const attemptsRes = await fetch(
      `${supabaseUrl}/rest/v1/exam_attempts?order=created_at.desc&limit=3000`,
      { headers }
    );
    const rawAttempts = attemptsRes.ok ? await attemptsRes.json() : [];

    // Create lookup of registrations by email
    const regMap = new Map<string, any>();
    for (const r of Array.isArray(rawRegistrations) ? rawRegistrations : []) {
      const email = (r.email || "").toLowerCase().trim();
      if (email) {
        regMap.set(email, hydrateCandidateRecord(r));
      }
    }

    // Group attempts by user email
    const attemptsByUser = new Map<string, StudentAttemptItem[]>();
    for (const a of Array.isArray(rawAttempts) ? rawAttempts : []) {
      const email = (a.email || "").toLowerCase().trim();
      if (!email) continue;

      const item: StudentAttemptItem = {
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

    // Helper to initialize MFT 1-10 + Active Mock slots
    const createEmptyMftMatrix = (): Record<string, StudentMftSlot> => {
      const matrix: Record<string, StudentMftSlot> = {};
      for (let i = 1; i <= 10; i++) {
        const code = `MFT-${i.toString().padStart(2, "0")}`;
        matrix[code] = {
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
      matrix["ACTIVE_MOCK"] = {
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
      return matrix;
    };

    // Combine all students (those who registered + those who attempted tests)
    const allEmails = new Set<string>([...regMap.keys(), ...attemptsByUser.keys()]);
    const studentList: StudentAdminProfile[] = [];

    for (const email of allEmails) {
      const reg = regMap.get(email);
      const userAttempts = (attemptsByUser.get(email) || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Aggregate statistics
      const totalAttempts = userAttempts.length;
      let bestMarks = 0;
      let bestPercentage = 0;
      let totalScoreSum = 0;
      let totalAccSum = 0;
      let totalTimeSpentSeconds = 0;

      const mftMatrix = createEmptyMftMatrix();

      for (const att of userAttempts) {
        if (att.score > bestMarks) {
          bestMarks = att.score;
        }
        if (att.percentage > bestPercentage) {
          bestPercentage = att.percentage;
        }
        totalScoreSum += att.score;
        totalAccSum += att.accuracy;
        totalTimeSpentSeconds += att.timeSpentSeconds;

        // Map to MFT slot
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
            // First one encountered is newest due to sorting
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

    // Filter by test if requested
    let filteredStudents = studentList;
    if (testFilter !== "all") {
      filteredStudents = filteredStudents.filter((s) => {
        if (testFilter === "mft") {
          return s.attempts.some((a) => a.testId.toLowerCase().includes("mft"));
        }
        return s.attempts.some((a) => a.testId.toLowerCase().includes(testFilter));
      });
    }

    // Search query filter
    if (search) {
      filteredStudents = filteredStudents.filter((s) => {
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

    // Sort students
    filteredStudents.sort((a, b) => {
      if (sortBy === "best_marks") {
        return b.bestMarks - a.bestMarks;
      }
      if (sortBy === "attempts") {
        return b.totalAttempts - a.totalAttempts;
      }
      if (sortBy === "name") {
        return a.fullName.localeCompare(b.fullName);
      }
      // default: latest attempt date
      const timeA = a.latestAttempt ? new Date(a.latestAttempt.createdAt).getTime() : (a.registeredAt ? new Date(a.registeredAt).getTime() : 0);
      const timeB = b.latestAttempt ? new Date(b.latestAttempt.createdAt).getTime() : (b.registeredAt ? new Date(b.registeredAt).getTime() : 0);
      return timeB - timeA;
    });

    // Compute top-level overview metrics
    const totalAttemptingStudents = studentList.filter((s) => s.totalAttempts > 0).length;
    const totalAttemptsLogged = Array.isArray(rawAttempts) ? rawAttempts.length : 0;
    const allScores = (Array.isArray(rawAttempts) ? rawAttempts : []).map((a: any) => Number(a.score || 0));
    const highestScoreLogged = allScores.length > 0 ? Math.max(...allScores) : 0;
    const avgScoreLogged = allScores.length > 0 ? Math.round(allScores.reduce((sum, s) => sum + s, 0) / allScores.length) : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalRegistered: regMap.size,
        totalAttemptingStudents,
        totalAttemptsLogged,
        highestScoreLogged,
        avgScoreLogged,
      },
      students: filteredStudents,
    });
  } catch (error: any) {
    console.error("Admin attempts API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
