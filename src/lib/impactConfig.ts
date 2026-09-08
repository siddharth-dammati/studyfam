export interface MilestoneTier {
  students: number;
  pool: number;
  topN: number;
  boysCount: number;
  boysAmount: number;
  girlsCount: number;
  girlsAmount: number;
  title: string;
  tagline: string;
  benefits: string[];
}

export const MILESTONE_TIERS: MilestoneTier[] = [
  {
    students: 1000,
    pool: 18000,
    topN: 20,
    boysCount: 10,
    boysAmount: 10000,
    girlsCount: 10,
    girlsAmount: 8000,
    title: "1,000 Aspirants Target",
    tagline: "Kickoff Milestone: Top 20 National Rankers Funded",
    benefits: [
      "₹18,000 Escrowed Merit Scholarship Pool (1,000 × ₹18)",
      "Top 10 Boys win 100% official NTA JEE Main exam fees (₹1,000 each)",
      "Top 10 Girls win 100% official NTA JEE Main exam fees (₹800 each)",
      "20 Total Aspirants get full examination fees completely refunded",
      "Full All-India Percentile & Projected Rank analytics unlocked",
    ],
  },
  {
    students: 5000,
    pool: 90000,
    topN: 100,
    boysCount: 50,
    boysAmount: 50000,
    girlsCount: 50,
    girlsAmount: 40000,
    title: "5,000 Aspirants Target",
    tagline: "5x Expansion: Top 100 National Rankers Funded",
    benefits: [
      "₹90,000 Escrowed Merit Scholarship Pool (5x increase!)",
      "Top 50 Boys win 100% official NTA JEE Main exam fees (₹1,000 each)",
      "Top 50 Girls win 100% official NTA JEE Main exam fees (₹800 each)",
      "100 Total Aspirants get full examination fees completely refunded",
      "Chapter-wise accuracy benchmarks & speed-penalty heatmaps",
    ],
  },
  {
    students: 10000,
    pool: 180000,
    topN: 200,
    boysCount: 100,
    boysAmount: 100000,
    girlsCount: 100,
    girlsAmount: 80000,
    title: "10,000 Aspirants Target",
    tagline: "Mega Benchmark: Top 200 National Rankers Funded",
    benefits: [
      "₹1,80,000 Escrowed Merit Scholarship Pool",
      "Top 100 Boys win 100% official NTA JEE Main exam fees (₹1,000 each)",
      "Top 100 Girls win 100% official NTA JEE Main exam fees (₹800 each)",
      "200 Total Aspirants get full examination fees completely refunded",
      "State-level and Category-level percentile cuts computed",
    ],
  },
  {
    students: 25000,
    pool: 450000,
    topN: 500,
    boysCount: 250,
    boysAmount: 250000,
    girlsCount: 250,
    girlsAmount: 200000,
    title: "25,000 Aspirants Target",
    tagline: "State-Level Power: Top 500 National Rankers Funded",
    benefits: [
      "₹4,50,000 Escrowed Merit Scholarship Pool",
      "Top 250 Boys win 100% official NTA JEE Main exam fees (₹1,000 each)",
      "Top 250 Girls win 100% official NTA JEE Main exam fees (₹800 each)",
      "500 Total Aspirants get full examination fees completely refunded",
      "City and coaching cohort national benchmarking comparisons",
    ],
  },
  {
    students: 50000,
    pool: 900000,
    topN: 1000,
    boysCount: 500,
    boysAmount: 500000,
    girlsCount: 500,
    girlsAmount: 400000,
    title: "50,000 Aspirants Target",
    tagline: "1,000 Rankers Funded: Massive National Impact",
    benefits: [
      "₹9,00,000 Escrowed Merit Scholarship Pool",
      "Top 500 Boys win 100% official NTA JEE Main exam fees (₹1,000 each)",
      "Top 500 Girls win 100% official NTA JEE Main exam fees (₹800 each)",
      "1,000 Deserving Rankers win 100% JEE Main fees completely funded",
      "NIT / IIT cutoff simulation accuracy matching official NTA standards",
    ],
  },
  {
    students: 100000,
    pool: 1800000,
    topN: 2000,
    boysCount: 1000,
    boysAmount: 1000000,
    girlsCount: 1000,
    girlsAmount: 800000,
    title: "1,00,000 Aspirants Target",
    tagline: "Historic Movement: Top 2,000 Rankers Funded",
    benefits: [
      "₹18,00,000 Escrowed Mega Scholarship Pool",
      "Top 1,000 Boys + Top 1,000 Girls get full examination fees refunded",
      "2,000 Total Aspirants funded nationwide",
      "India's largest independent student-powered academic scholarship in history",
    ],
  },
];

/**
 * Returns the currently active milestone tier.
 * Starts at 1,000; when registrations reaches 1,000, advances to 5,000; then 10,000, etc.
 */
export function getActiveMilestone(registrations: number): MilestoneTier {
  const count = Math.max(0, registrations);
  const found = MILESTONE_TIERS.find((t) => count < t.students);
  return found || MILESTONE_TIERS[MILESTONE_TIERS.length - 1];
}

/**
 * Computes progress toward the active milestone tier.
 */
export function getMilestoneProgress(registrations: number) {
  const current = getActiveMilestone(registrations);
  const currentIndex = MILESTONE_TIERS.findIndex((t) => t.students === current.students);
  const prevStudents = currentIndex > 0 ? MILESTONE_TIERS[currentIndex - 1].students : 0;

  const count = Math.max(0, registrations);
  const remaining = Math.max(0, current.students - count);
  const tierRange = current.students - prevStudents;
  const progressInTier = Math.min(100, Math.max(0, ((count - prevStudents) / tierRange) * 100));
  const overallProgress = Math.min(100, (count / current.students) * 100);

  return {
    current,
    currentIndex,
    prevStudents,
    remaining,
    progressInTier,
    overallProgress,
    isCompleted: count >= current.students,
  };
}

export const impactConfig = {
  // Live Configured Data
  registrations: 0,
  supportPerRegistration: 18,
  operationsPerRegistration: 9,

  // Official NTA JEE Main Fee Structure
  supportAmountBoys: 1000,
  supportAmountGirls: 800,

  // Dynamic Milestone Resolver (Starts at 1,000, advances to 5,000, etc.)
  get milestone() {
    return getActiveMilestone(this.registrations).students;
  },

  get supportPool() {
    return this.registrations * this.supportPerRegistration;
  },
  get averageCostPerStudent() {
    return (this.supportAmountBoys + this.supportAmountGirls) / 2;
  },
  get topNScholarsCount() {
    return Math.floor(this.supportPool / this.averageCostPerStudent);
  },
  get studentsSupported() {
    return this.topNScholarsCount;
  },
  get remainingToMilestone() {
    return Math.max(0, this.milestone - this.registrations);
  },
  get progressPercentage() {
    return Math.min((this.registrations / this.milestone) * 100, 100);
  },
  calculateTopN(totalRegistrations: number) {
    const pool = totalRegistrations * this.supportPerRegistration;
    return Math.floor(pool / this.averageCostPerStudent);
  },
};

export function formatIndianNumber(num: number) {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatIndianCurrency(num: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}
