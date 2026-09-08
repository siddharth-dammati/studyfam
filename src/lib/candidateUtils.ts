import { CandidateRecord } from "@/components/dashboard/CandidateRegistrationCard";

export interface DossierData {
  gender?: "boy" | "girl" | "other" | string;
  family_income?: string;
  scholarship_track?: "merit" | "need_based" | "opt_out" | string;
  scholarship_slab?: string;
}

/**
 * Extracts dossier fields from payment_method fallback string if present
 */
export function extractDossier(paymentMethod?: string | null): DossierData {
  if (!paymentMethod || typeof paymentMethod !== "string") return {};
  if (!paymentMethod.startsWith("dossier:")) return {};
  try {
    return JSON.parse(paymentMethod.slice(8)) || {};
  } catch {
    return {};
  }
}

/**
 * Serializes dossier fields into fallback string format
 */
export function serializeDossier(data: DossierData): string {
  return "dossier:" + JSON.stringify({
    gender: data.gender || null,
    family_income: data.family_income || null,
    scholarship_track: data.scholarship_track || "merit",
    scholarship_slab: data.scholarship_slab || (data.scholarship_track === "opt_out" ? "opt_out" : "full_fee_100"),
  });
}

/**
 * Hydrates candidate record ensuring gender, family_income, scholarship_track, and scholarship_slab
 * are always populated whether stored in dedicated columns, payment_method fallback, or cached state.
 */
export function hydrateCandidateRecord(raw: any, cachedFallback?: any): CandidateRecord {
  if (!raw) return raw;

  const dossier = extractDossier(raw.payment_method);
  const cached = cachedFallback || {};

  return {
    ...raw,
    gender: raw.gender || dossier.gender || cached.gender || undefined,
    family_income: raw.family_income || dossier.family_income || cached.family_income || undefined,
    scholarship_track: raw.scholarship_track || dossier.scholarship_track || cached.scholarship_track || undefined,
    scholarship_slab: raw.scholarship_slab || dossier.scholarship_slab || cached.scholarship_slab || undefined,
  };
}
