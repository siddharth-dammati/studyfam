export interface MilestoneTier {
  students: number;
  pool: number;
  topN: number;
  meritCount: number;
  needCount: number;
  boysCount: number;
  boysAmount: number;
  girlsCount: number;
  girlsAmount: number;
  meritBoys: number;
  meritGirls: number;
  needBoys: number;
  needGirls: number;
  title: string;
  tagline: string;
  benefits: string[];
}

export const MILESTONE_TIERS: MilestoneTier[] = [
  {
    students: 1000,
    pool: 18000,
    topN: 20,
    meritCount: 10,
    needCount: 10,
    meritBoys: 5,
    meritGirls: 5,
    needBoys: 5,
    needGirls: 5,
    boysCount: 10,
    boysAmount: 10000,
    girlsCount: 10,
    girlsAmount: 8000,
    title: "1,000 Aspirants Target",
    tagline: "Top 20 Funded: 10 Merit (100% Rank) + 10 Need-Based",
    benefits: [
      "₹18,000 Escrowed Scholarship Pool (1,000 × ₹18)",
      "🏆 10 Merit Scholarships: Top 5 Boys & Top 5 Girls (100% based on mock performance)",
      "❤️ 10 Need-Based Scholarships: Next 5 Boys & Next 5 Girls with verified financial need",
      "50% of all scholarship slots strictly reserved for students needing assistance",
      "Full All-India Percentile & Projected Rank analytics unlocked",
    ],
  },
  {
    students: 5000,
    pool: 90000,
    topN: 100,
    meritCount: 50,
    needCount: 50,
    meritBoys: 25,
    meritGirls: 25,
    needBoys: 25,
    needGirls: 25,
    boysCount: 50,
    boysAmount: 50000,
    girlsCount: 50,
    girlsAmount: 40000,
    title: "5,000 Aspirants Target",
    tagline: "Top 100 Funded: 50 Merit + 50 Need-Based",
    benefits: [
      "₹90,000 Escrowed Scholarship Pool (5x increase!)",
      "🏆 50 Merit Scholarships: Top 25 Boys & Top 25 Girls (100% mock rank)",
      "❤️ 50 Need-Based Scholarships: Next 25 Boys & Next 25 Girls from separate eligible pool",
      "50% reserved for genuine financial assistance candidates",
      "Chapter-wise accuracy benchmarks & speed-penalty heatmaps",
    ],
  },
  {
    students: 10000,
    pool: 180000,
    topN: 200,
    meritCount: 100,
    needCount: 100,
    meritBoys: 50,
    meritGirls: 50,
    needBoys: 50,
    needGirls: 50,
    boysCount: 100,
    boysAmount: 100000,
    girlsCount: 100,
    girlsAmount: 80000,
    title: "10,000 Aspirants Target",
    tagline: "Top 200 Funded: 100 Merit + 100 Need-Based",
    benefits: [
      "₹1,80,000 Escrowed Scholarship Pool",
      "🏆 100 Merit Scholarships: Top 50 Boys & Top 50 Girls (100% based on performance)",
      "❤️ 100 Need-Based Scholarships: Next 50 Boys & Next 50 Girls with financial need",
      "Equal 50/50 division between pure performance and economic support",
      "State-level and Category-level percentile cuts computed",
    ],
  },
  {
    students: 25000,
    pool: 450000,
    topN: 500,
    meritCount: 250,
    needCount: 250,
    meritBoys: 125,
    meritGirls: 125,
    needBoys: 125,
    needGirls: 125,
    boysCount: 250,
    boysAmount: 250000,
    girlsCount: 250,
    girlsAmount: 200000,
    title: "25,000 Aspirants Target",
    tagline: "Top 500 Funded: 250 Merit + 250 Need-Based",
    benefits: [
      "₹4,50,000 Escrowed Scholarship Pool",
      "🏆 250 Merit Scholarships: Top 125 Boys & Top 125 Girls (No financial need check)",
      "❤️ 250 Need-Based Scholarships: Next 125 Boys & Next 125 Girls needing financial support",
      "50% guaranteed quota for economically disadvantaged aspirants",
      "City and coaching cohort national benchmarking comparisons",
    ],
  },
  {
    students: 50000,
    pool: 900000,
    topN: 1000,
    meritCount: 500,
    needCount: 500,
    meritBoys: 250,
    meritGirls: 250,
    needBoys: 250,
    needGirls: 250,
    boysCount: 500,
    boysAmount: 500000,
    girlsCount: 500,
    girlsAmount: 400000,
    title: "50,000 Aspirants Target",
    tagline: "1,000 Students Funded: 500 Merit + 500 Need-Based",
    benefits: [
      "₹9,00,000 Escrowed Scholarship Pool",
      "🏆 500 Merit Scholarships: Top 250 Boys & Top 250 Girls (100% Mock Performance, No financial need considered)",
      "❤️ 500 Need-Based Scholarships: Next 250 Boys & Next 250 Girls from separate eligible pool (Financial need considered)",
      "50% of all slots strictly reserved to help students who genuinely need assistance",
      "NIT / IIT cutoff simulation accuracy matching official NTA standards",
    ],
  },
  {
    students: 100000,
    pool: 1800000,
    topN: 2000,
    meritCount: 1000,
    needCount: 1000,
    meritBoys: 500,
    meritGirls: 500,
    needBoys: 500,
    needGirls: 500,
    boysCount: 1000,
    boysAmount: 1000000,
    girlsCount: 1000,
    girlsAmount: 800000,
    title: "1,00,000 Aspirants Target",
    tagline: "Historic 2,000 Students Funded: 1,000 Merit + 1,000 Need-Based",
    benefits: [
      "₹18,00,000 Escrowed Mega Scholarship Pool",
      "🏆 1,000 Merit Scholarships: Top 500 Boys & Top 500 Girls (Pure Performance)",
      "❤️ 1,000 Need-Based Scholarships: Next 500 Boys & Next 500 Girls (Economic Assistance)",
      "2,000 Total Aspirants funded nationwide with equal gender & need representation",
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
