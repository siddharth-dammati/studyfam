/**
 * StudyFAM JEE Main 2026 Percentile & AIR Analyzer
 * Based on official NTA 2026 reference feed & product spec.
 * Total unique Paper 1 appeared candidates: 15,38,468.
 * Maximum score: 300 marks (75 questions, +4 / -1 / 0).
 */

export interface ScoreBand {
  minMarks: number;
  maxMarks: number;
  percentileMin: number;
  percentileMax: number;
  airMin: number;
  airMax: number;
}

export interface ShiftInfo {
  id: string;
  name: string;
  session: "January" | "April";
  difficulty: "Tough" | "Moderate" | "Easy";
  marksAt99Percentile: number; // reference marks for 99th percentile
  deltaMarks: number; // offset relative to baseline (175 marks)
  description: string;
}

export const TOTAL_CANDIDATE_POOL_2026 = 1538468;
export const TOTAL_REGISTERED_2026 = 1604854;
export const MAX_PAPER1_MARKS = 300;
export const BASELINE_99_MARKS = 175; // Average marks for 99th percentile across all shifts

// StudyFAM Pooled 2026 Marks -> Percentile -> AIR Baseline Table (Page 4 of spec)
export const POOLED_2026_BANDS: ScoreBand[] = [
  { minMarks: 271, maxMarks: 300, percentileMin: 99.99, percentileMax: 100.0, airMin: 1, airMax: 154 },
  { minMarks: 250, maxMarks: 270, percentileMin: 99.95, percentileMax: 99.99, airMin: 154, airMax: 769 },
  { minMarks: 230, maxMarks: 249, percentileMin: 99.87, percentileMax: 99.95, airMin: 769, airMax: 2000 },
  { minMarks: 210, maxMarks: 229, percentileMin: 99.69, percentileMax: 99.87, airMin: 2000, airMax: 4769 },
  { minMarks: 190, maxMarks: 209, percentileMin: 99.41, percentileMax: 99.69, airMin: 4769, airMax: 9077 },
  { minMarks: 170, maxMarks: 189, percentileMin: 98.88, percentileMax: 99.41, airMin: 9077, airMax: 17231 },
  { minMarks: 160, maxMarks: 169, percentileMin: 98.53, percentileMax: 98.88, airMin: 17231, airMax: 22615 },
  { minMarks: 150, maxMarks: 159, percentileMin: 98.09, percentileMax: 98.53, airMin: 22615, airMax: 29385 },
  { minMarks: 140, maxMarks: 149, percentileMin: 97.54, percentileMax: 98.09, airMin: 29385, airMax: 37846 },
  { minMarks: 130, maxMarks: 139, percentileMin: 96.88, percentileMax: 97.54, airMin: 37846, airMax: 48000 },
  { minMarks: 120, maxMarks: 129, percentileMin: 96.07, percentileMax: 96.88, airMin: 48000, airMax: 60462 },
  { minMarks: 110, maxMarks: 119, percentileMin: 95.06, percentileMax: 96.07, airMin: 60462, airMax: 76000 },
  { minMarks: 100, maxMarks: 109, percentileMin: 93.8, percentileMax: 95.06, airMin: 76000, airMax: 95385 },
  { minMarks: 90, maxMarks: 99, percentileMin: 92.22, percentileMax: 93.8, airMin: 95385, airMax: 119693 },
  { minMarks: 80, maxMarks: 89, percentileMin: 90.28, percentileMax: 92.22, airMin: 119693, airMax: 149539 },
  { minMarks: 70, maxMarks: 79, percentileMin: 87.52, percentileMax: 90.28, airMin: 149539, airMax: 192001 },
  { minMarks: 60, maxMarks: 69, percentileMin: 83.89, percentileMax: 87.52, airMin: 192001, airMax: 247847 },
  { minMarks: 40, maxMarks: 59, percentileMin: 69.58, percentileMax: 83.89, airMin: 247847, airMax: 468002 },
  { minMarks: 20, maxMarks: 39, percentileMin: 36.58, percentileMax: 69.58, airMin: 468002, airMax: 975696 },
  { minMarks: 0, maxMarks: 19, percentileMin: 5.71, percentileMax: 36.58, airMin: 975696, airMax: 1450621 },
];

// Public shift-wise analyses from 2026 (Page 5 of spec)
export const SHIFTS_2026: ShiftInfo[] = [
  // Presets
  {
    id: "preset_tough",
    name: "Tough Shift Scenario",
    session: "April",
    difficulty: "Tough",
    marksAt99Percentile: 153,
    deltaMarks: -22,
    description: "Lower score cutoff required due to high paper difficulty (e.g. 6 Apr S1, 22 Jan S2).",
  },
  {
    id: "preset_moderate",
    name: "Moderate Shift Scenario",
    session: "January",
    difficulty: "Moderate",
    marksAt99Percentile: 175,
    deltaMarks: 0,
    description: "Average difficulty shift representing the 2026 pooled normalisation baseline.",
  },
  {
    id: "preset_easy",
    name: "Easy / High-Scoring Shift",
    session: "April",
    difficulty: "Easy",
    marksAt99Percentile: 193,
    deltaMarks: 18,
    description: "Higher marks required for top percentiles due to straightforward paper (e.g. 4 Apr S2).",
  },
  // Specific shifts
  { id: "apr_06_s1", name: "6 Apr - Shift 1 (Toughest Shift)", session: "April", difficulty: "Tough", marksAt99Percentile: 153, deltaMarks: -22, description: "99th percentile at ~151-155 marks." },
  { id: "apr_08_s2", name: "8 Apr - Shift 2", session: "April", difficulty: "Tough", marksAt99Percentile: 158, deltaMarks: -17, description: "99th percentile at ~156-160 marks." },
  { id: "apr_06_s2", name: "6 Apr - Shift 2", session: "April", difficulty: "Moderate", marksAt99Percentile: 163, deltaMarks: -12, description: "99th percentile at ~161-165 marks." },
  { id: "apr_05_s2", name: "5 Apr - Shift 2", session: "April", difficulty: "Moderate", marksAt99Percentile: 168, deltaMarks: -7, description: "99th percentile at ~166-170 marks." },
  { id: "apr_05_s1", name: "5 Apr - Shift 1", session: "April", difficulty: "Moderate", marksAt99Percentile: 173, deltaMarks: -2, description: "99th percentile at ~171-175 marks." },
  { id: "apr_02_s1", name: "2 Apr - Shift 1", session: "April", difficulty: "Moderate", marksAt99Percentile: 178, deltaMarks: 3, description: "99th percentile at ~176-180 marks." },
  { id: "apr_02_s2", name: "2 Apr - Shift 2", session: "April", difficulty: "Moderate", marksAt99Percentile: 183, deltaMarks: 8, description: "99th percentile at ~181-185 marks." },
  { id: "apr_04_s1", name: "4 Apr - Shift 1", session: "April", difficulty: "Easy", marksAt99Percentile: 188, deltaMarks: 13, description: "99th percentile at ~186-190 marks." },
  { id: "apr_04_s2", name: "4 Apr - Shift 2 (Highest Scoring)", session: "April", difficulty: "Easy", marksAt99Percentile: 193, deltaMarks: 18, description: "99th percentile at ~191-195 marks." },
  // January shifts
  { id: "jan_22_s2", name: "22 Jan - Shift 2", session: "January", difficulty: "Tough", marksAt99Percentile: 155, deltaMarks: -20, description: "99th percentile at ~155+ marks." },
  { id: "jan_22_s1", name: "22 Jan - Shift 1", session: "January", difficulty: "Tough", marksAt99Percentile: 158, deltaMarks: -17, description: "99th percentile at ~158+ marks." },
  { id: "jan_23_s1", name: "23 Jan - Shift 1", session: "January", difficulty: "Tough", marksAt99Percentile: 158, deltaMarks: -17, description: "99th percentile at ~158+ marks." },
  { id: "jan_24_s2", name: "24 Jan - Shift 2", session: "January", difficulty: "Moderate", marksAt99Percentile: 160, deltaMarks: -15, description: "99th percentile at ~160+ marks." },
  { id: "jan_28_s1", name: "28 Jan - Shift 1", session: "January", difficulty: "Moderate", marksAt99Percentile: 161, deltaMarks: -14, description: "99th percentile at ~161+ marks." },
  { id: "jan_24_s1", name: "24 Jan - Shift 1", session: "January", difficulty: "Moderate", marksAt99Percentile: 162, deltaMarks: -13, description: "99th percentile at ~162+ marks." },
  { id: "jan_28_s2", name: "28 Jan - Shift 2", session: "January", difficulty: "Moderate", marksAt99Percentile: 162, deltaMarks: -13, description: "99th percentile at ~162+ marks." },
  { id: "jan_23_s2", name: "23 Jan - Shift 2", session: "January", difficulty: "Moderate", marksAt99Percentile: 163, deltaMarks: -12, description: "99th percentile at ~163+ marks." },
  { id: "jan_21_s1", name: "21 Jan - Shift 1", session: "January", difficulty: "Moderate", marksAt99Percentile: 167, deltaMarks: -8, description: "99th percentile at ~167+ marks." },
  { id: "jan_21_s2", name: "21 Jan - Shift 2", session: "January", difficulty: "Moderate", marksAt99Percentile: 171, deltaMarks: -4, description: "99th percentile at ~171+ marks." },
];

export interface CategoryCutoff {
  category: string;
  label: string;
  minPercentile: number;
  qualified: boolean;
}

export interface AnalysisPrediction {
  rawMarks: number;
  maxMarks: number;
  mode: "quick" | "advanced";
  percentileMin: number;
  percentileMax: number;
  percentileRangeFormatted: string;
  percentileMid: number;
  airMin: number;
  airMax: number;
  airRangeFormatted: string;
  confidence: "Low" | "Moderate" | "High";
  confidenceReason: string;
  collegeTier: string;
  collegeTierDescription: string;
  advancedEligible: boolean;
  categoryCutoffs: CategoryCutoff[];
  shiftInfo?: ShiftInfo;
  isNegativeScore: boolean;
}

/**
 * Maps a single percentile to an approximate AIR based on the 1,538,468 pool.
 * Formula from Page 4: AIR approx = (100 - percentile) * 1538468 / 100
 */
export function estimateAirFromPercentile(percentile: number): number {
  if (percentile >= 100) return 1;
  if (percentile <= 0) return TOTAL_CANDIDATE_POOL_2026;
  const rawAir = ((100 - percentile) * TOTAL_CANDIDATE_POOL_2026) / 100;
  return Math.max(1, Math.min(TOTAL_CANDIDATE_POOL_2026, Math.round(rawAir)));
}

/**
 * Formats a number with Indian comma grouping (e.g. 15,38,468 or 17,231)
 */
export function formatIndianNumber(num: number): string {
  return num.toLocaleString("en-IN");
}

/**
 * Core estimation function implementing the StudyFAM 2026 Product Spec.
 */
export function analyzeJeeScore(
  rawMarks: number,
  options?: {
    mode?: "quick" | "advanced";
    shiftId?: string;
    shiftDifficulty?: "Tough" | "Moderate" | "Easy";
  }
): AnalysisPrediction {
  const mode = options?.mode || "quick";
  const clampedMarks = Math.max(-75, Math.min(MAX_PAPER1_MARKS, Math.round(rawMarks)));
  const isNegativeScore = clampedMarks < 0;

  // Find shift offset if in advanced mode
  let shift: ShiftInfo | undefined;
  let effectiveMarks = clampedMarks;

  if (mode === "advanced") {
    if (options?.shiftId) {
      shift = SHIFTS_2026.find((s) => s.id === options.shiftId);
    } else if (options?.shiftDifficulty) {
      const diffKey = options.shiftDifficulty.toLowerCase();
      shift = SHIFTS_2026.find((s) => s.id === `preset_${diffKey}`);
    } else {
      shift = SHIFTS_2026.find((s) => s.id === "preset_moderate");
    }

    if (shift) {
      // In a tough shift (e.g. -22 delta), you need fewer marks to get the same percentile
      // So your effective marks for lookup in pooled baseline are scaled higher:
      const shiftScaleFactor = BASELINE_99_MARKS / shift.marksAt99Percentile;
      effectiveMarks = Math.round(clampedMarks * shiftScaleFactor);
      effectiveMarks = Math.max(0, Math.min(MAX_PAPER1_MARKS, effectiveMarks));
    }
  }

  // Lookup band from POOLED_2026_BANDS
  let band: ScoreBand | undefined;
  if (effectiveMarks >= 0) {
    band = POOLED_2026_BANDS.find(
      (b) => effectiveMarks >= b.minMarks && effectiveMarks <= b.maxMarks
    );
  }

  let pMin = 0;
  let pMax = 0;
  let airMin = TOTAL_CANDIDATE_POOL_2026;
  let airMax = TOTAL_CANDIDATE_POOL_2026;

  if (isNegativeScore) {
    pMin = 0.01;
    pMax = 5.7;
    airMin = 1450621;
    airMax = TOTAL_CANDIDATE_POOL_2026;
  } else if (band) {
    // Interpolate within the band for smooth range progression
    const bandSpan = Math.max(1, band.maxMarks - band.minMarks);
    const progress = Math.min(1, Math.max(0, (effectiveMarks - band.minMarks) / bandSpan));

    // Calculate fine-grained percentile range (width depends on mode)
    const bandPWidth = band.percentileMax - band.percentileMin;
    const interpolatedCenter = band.percentileMin + progress * bandPWidth;

    // Quick mode gives wider range for safety, Advanced gives narrower range
    const halfSpread = mode === "advanced" ? Math.max(0.1, bandPWidth * 0.25) : Math.max(0.25, bandPWidth * 0.45);

    pMin = Math.max(band.percentileMin, Math.round((interpolatedCenter - halfSpread) * 100) / 100);
    pMax = Math.min(band.percentileMax, Math.round((interpolatedCenter + halfSpread) * 100) / 100);

    // Calculate AIR range
    airMin = estimateAirFromPercentile(pMax);
    airMax = estimateAirFromPercentile(pMin);
  } else {
    // Fallback if > 300
    pMin = 99.99;
    pMax = 100.0;
    airMin = 1;
    airMax = 154;
  }

  const pMid = Math.round(((pMin + pMax) / 2) * 100) / 100;
  const percentileRangeFormatted = `${pMin.toFixed(2)} - ${pMax.toFixed(2)} %ile`;
  const airRangeFormatted = `AIR ${formatIndianNumber(airMin)} - ${formatIndianNumber(airMax)}`;

  // Confidence assessment as specified in the PDF
  let confidence: "Low" | "Moderate" | "High" = "Moderate";
  let confidenceReason = "";

  if (mode === "quick") {
    confidence = "Moderate";
    confidenceReason = "Pooled 2026 normalisation baseline. Switch to Advanced mode to simulate specific shift difficulty.";
  } else if (shift) {
    confidence = "High";
    confidenceReason = `Calibrated against ${shift.name} (${shift.difficulty} difficulty, 99th %ile at ${shift.marksAt99Percentile} marks).`;
  } else {
    confidence = "Moderate";
    confidenceReason = "Shift-aware curve applied.";
  }

  // JEE Advanced Category Cutoffs (Standard 2026/2025 Benchmarks)
  const categoryCutoffs: CategoryCutoff[] = [
    { category: "GEN", label: "General (Open)", minPercentile: 93.2, qualified: pMid >= 93.2 },
    { category: "GEN-EWS", label: "General - EWS", minPercentile: 81.3, qualified: pMid >= 81.3 },
    { category: "OBC-NCL", label: "OBC-NCL", minPercentile: 79.2, qualified: pMid >= 79.2 },
    { category: "SC", label: "Scheduled Caste (SC)", minPercentile: 60.1, qualified: pMid >= 60.1 },
    { category: "ST", label: "Scheduled Tribe (ST)", minPercentile: 46.7, qualified: pMid >= 46.7 },
  ];

  const advancedEligible = pMid >= 93.2;

  // College & Branch Tiering
  let collegeTier = "";
  let collegeTierDescription = "";

  if (pMid >= 99.8) {
    collegeTier = "Top 3 NITs (Trichy, Surathkal, Warangal) - Computer Science";
    collegeTierDescription = "Guaranteed top-tier branches in premier NITs, IIIT Hyderabad, and top IIITs.";
  } else if (pMid >= 99.0) {
    collegeTier = "Top 7 NITs (CSE / ECE / Data Science)";
    collegeTierDescription = "High probability of CSE / Circuit branches in Trichy, Surathkal, Warangal, Rourkela, Calicut, Allahabad.";
  } else if (pMid >= 98.0) {
    collegeTier = "Top 10 NITs & Reputed IIITs (Core / IT Branches)";
    collegeTierDescription = "Strong prospects for Electrical, Mechanical in Top NITs; IT / CSE in IIIT Jabalpur, Lucknow, Gwalior.";
  } else if (pMid >= 95.0) {
    collegeTier = "Mid-tier NITs & Top State Gov Colleges";
    collegeTierDescription = "Comfortable entry into NIT Silchar, Durgapur, Jalandhar, Raipur, and premier State Engineering Colleges.";
  } else if (pMid >= 90.0) {
    collegeTier = "JEE Advanced Qualified | Regional NITs & GFTIs";
    collegeTierDescription = "Easily qualifies for JEE Advanced. Core branches in North-East NITs, BIT Mesra, and top state universities.";
  } else if (pMid >= 75.0) {
    collegeTier = "Category Cutoff Clearance | State Counseling";
    collegeTierDescription = "Strong eligibility for OBC/EWS/SC/ST cutoffs and top state engineering college counseling.";
  } else {
    collegeTier = "Intensive Foundation & High-Yield Syllabus Focus";
    collegeTierDescription = "Target 30-40 more marks in high-yield chapters (Modern Physics, Organic Chemistry, Matrices) to jump into NIT eligibility.";
  }

  return {
    rawMarks: clampedMarks,
    maxMarks: MAX_PAPER1_MARKS,
    mode,
    percentileMin: pMin,
    percentileMax: pMax,
    percentileRangeFormatted,
    percentileMid: pMid,
    airMin,
    airMax,
    airRangeFormatted,
    confidence,
    confidenceReason,
    collegeTier,
    collegeTierDescription,
    advancedEligible,
    categoryCutoffs,
    shiftInfo: shift,
    isNegativeScore,
  };
}

/**
 * What-If Score Simulator:
 * Shows the exact rank leap and percentile jump when eliminating negative marks or gaining extra questions.
 */
export function simulateScoreImpact(
  currentScore: number,
  improvedScore: number,
  mode: "quick" | "advanced" = "quick",
  shiftId?: string
) {
  const current = analyzeJeeScore(currentScore, { mode, shiftId });
  const improved = analyzeJeeScore(improvedScore, { mode, shiftId });

  const ranksGained = Math.max(0, current.airMin - improved.airMin);
  const percentileGain = Math.max(0, Math.round((improved.percentileMid - current.percentileMid) * 100) / 100);

  return {
    current,
    improved,
    ranksGained,
    percentileGain,
    marksDiff: improvedScore - currentScore,
  };
}
