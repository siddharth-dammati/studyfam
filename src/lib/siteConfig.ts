export interface FAQItem {
  id: string;
  q: string;
  a: string;
}

export interface HeroConfig {
  headline: string;
  subheadline: string;
  examDateLabel: string;
  examTimeLabel: string;
  registrationFee: number;
  supportAmount: number;
  registrationOpen: boolean;
  targetDateIso: string;
}

export interface ScholarshipConfig {
  scenarioHeadline: string;
  scenarioMilestone: number;
  scenarioWinners: number;
  meritBoysSlots: number;
  meritGirlsSlots: number;
  needBoysSlots: number;
  needGirlsSlots: number;
  disbursementSpeedDays: number;
}

export interface RegistrationModuleConfig {
  bannerNotice: string;
  bannerNoticeEnabled: boolean;
  countdownMode: boolean;
  minIncomeExclusionRule: boolean; // Income > 8L forced merit
  enabledStreams: string[];
}

export interface AdmitCardConfig {
  examTitle: string;
  reportingTime: string;
  gateClosureTime: string;
  testTiming: string;
  examDate: string;
  advisoryText: string;
  instructions: string[];
}

export interface AnnouncementBannerConfig {
  enabled: boolean;
  badge: string;
  text: string;
  linkText?: string;
  linkUrl?: string;
}

export interface SiteConfig {
  hero: HeroConfig;
  scholarship: ScholarshipConfig;
  faqs: FAQItem[];
  registration: RegistrationModuleConfig;
  admitCard: AdmitCardConfig;
  announcement: AnnouncementBannerConfig;
  updatedAt?: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  hero: {
    headline: "India's First Transparent JEE Main CBT Mock Test",
    subheadline: "Compete in an authentic NTA-grade computer based test. ₹18 of every ₹27 registration fee funds real JEE application scholarships for top rankers and students in need.",
    examDateLabel: "27 December 2026",
    examTimeLabel: "9:00 AM – 12:00 PM IST",
    registrationFee: 27,
    supportAmount: 18,
    registrationOpen: true,
    targetDateIso: "2026-12-27T09:00:00+05:30",
  },
  scholarship: {
    scenarioHeadline: "Projected Scenario (If 50,000 Aspirants Register · 1,000 Winners)",
    scenarioMilestone: 50000,
    scenarioWinners: 1000,
    meritBoysSlots: 250,
    meritGirlsSlots: 250,
    needBoysSlots: 250,
    needGirlsSlots: 250,
    disbursementSpeedDays: 7,
  },
  faqs: [
    {
      id: "faq_1",
      q: "What is StudyFAM and who is it for?",
      a: "StudyFAM is a community-driven, proctored All-India JEE Main Aptitude Mock Examination platform designed for Class 11, Class 12, and Dropper aspirants seeking authentic CBT exam simulation, All-India benchmarking, and verified NTA exam fee scholarships.",
    },
    {
      id: "faq_2",
      q: "How does the scholarship funding model work?",
      a: "We allocate ₹18 of every ₹27 registration into the Scholarship Pool. Scholarships are awarded across two equal tracks: 50% Merit Scholarships (selected 100% on All-India mock test rank without financial screening) and 50% Need-Based Support (reserved for students from a separate eligible pool where financial need is considered to assist aspirants who genuinely need help).",
    },
    {
      id: "faq_3",
      q: "How many students receive the scholarship?",
      a: "Scholarship slots scale dynamically as participation grows — exactly 50% Merit, 50% Need-Based at every level. Examples:\n• At 1,000 registrations (₹18,000 pool): 20 students funded — 10 Merit (Top 5 boys + Top 5 girls) + 10 Need-Based.\n• At 10,000 registrations (₹1,80,000 pool): 200 students — 100 Merit (50 boys + 50 girls) + 100 Need-Based.\n• If 50,000 registrations are reached (₹9,00,000 pool): 1,000 students — 500 Merit (250 boys + 250 girls) + 500 Need-Based. These are milestone projections; actual numbers track real registrations.",
    },
    {
      id: "faq_4",
      q: "How is the ₹18 fee support allocated and disbursed?",
      a: "₹18 from each ₹27 registration deposits directly into the scholarship pool. Awards correspond to the official NTA examination fees: ₹1,000 for male candidates and ₹800 for female candidates. Direct Benefit Transfer (DBT) is disbursed to verified candidates within 7 business days of NTA confirmation.",
    },
    {
      id: "faq_5",
      q: "Can I take the test from home?",
      a: "Yes. The mock is computer-based and accessible from any device with a browser. You will interact with a simulation of the official NTA CBT interface with strict tab-locking and integrity checks.",
    },
    {
      id: "faq_6",
      q: "What is the refund and cancellation policy?",
      a: "Due to server compute reservations and immediate pool allocation, registrations are non-refundable once payment is completed. You can re-attempt slot allocation if an official rescheduling happens.",
    },
  ],
  registration: {
    bannerNotice: "🔥 All-India Registration Window is currently LIVE. Lock your ₹27 CBT seat now!",
    bannerNoticeEnabled: true,
    countdownMode: false,
    minIncomeExclusionRule: true,
    enabledStreams: ["class-11", "class-12", "dropper"],
  },
  admitCard: {
    examTitle: "JOINT ENTRANCE EXAMINATION (MAIN) 2027",
    examDate: "27 December 2026 (Sunday)",
    reportingTime: "07:30 AM IST",
    gateClosureTime: "08:30 AM IST",
    testTiming: "09:00 AM – 12:00 PM IST (Shift 1)",
    advisoryText: "This admit slip serves as official hall ticket and verification voucher for the StudyFAM All-India Mock & ₹18 Application Fee Support Program.",
    instructions: [
      "The examination will be conducted entirely in Computer Based Test (CBT) mode on the StudyFAM test portal.",
      "Candidates must log in with their Registered Mobile Number or Order Reference ID at least 30 minutes before commencement.",
      "The test interface utilizes browser tab-lock and window-blur tracking. Attempting to switch tabs, minimize windows, or use unauthorized AI toolbars will result in automatic score nullification.",
      "Scoring & Marking Scheme: 4 marks for each correct response, -1 penalty mark for incorrect answers. Unattempted questions receive 0 marks.",
      "50% Merit & 50% Need-Based Dual Track: Top-ranked boys & girls (slot count scales with total verified registrations) earn merit scholarships purely by test percentile. Need-based assistance will be verified independently post-exam.",
      "Rough Sheets & Calculations: Blank physical paper and ballpoint pens are permitted at your study desk. Electronic calculators or smartwatches are strictly forbidden.",
      "Results & Scholarship Disbursement: All-India Percentile & Merit Ranks will be declared within 48 hours. Direct bank/UPI fee reimbursements will commence following roll verification.",
    ],
  },
  announcement: {
    enabled: false,
    badge: "ANNOUNCEMENT",
    text: "JEE Main 2027 Mock Test registrations are filling fast. Register now to secure your All-India Percentile benchmarking!",
    linkText: "Register for ₹27 →",
    linkUrl: "#register",
  },
};

export function parseSiteConfig(raw: any): SiteConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_SITE_CONFIG;

  return {
    hero: {
      ...DEFAULT_SITE_CONFIG.hero,
      ...(raw.hero || {}),
    },
    scholarship: {
      ...DEFAULT_SITE_CONFIG.scholarship,
      ...(raw.scholarship || {}),
    },
    faqs: Array.isArray(raw.faqs) && raw.faqs.length > 0 ? raw.faqs : DEFAULT_SITE_CONFIG.faqs,
    registration: {
      ...DEFAULT_SITE_CONFIG.registration,
      ...(raw.registration || {}),
    },
    admitCard: {
      ...DEFAULT_SITE_CONFIG.admitCard,
      ...(raw.admitCard || {}),
      instructions:
        Array.isArray(raw.admitCard?.instructions) && raw.admitCard.instructions.length > 0
          ? raw.admitCard.instructions
          : DEFAULT_SITE_CONFIG.admitCard.instructions,
    },
    announcement: {
      ...DEFAULT_SITE_CONFIG.announcement,
      ...(raw.announcement || {}),
    },
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}
