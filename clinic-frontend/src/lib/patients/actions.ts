"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/dal";
import { resolveLocale } from "@/lib/auth/locale";
import { toFieldErrors } from "@/lib/auth/schemas";
import {
  DIGIT_FIELDS,
  PATIENT_FIELDS,
  patientSchema,
  toAsciiDigits,
  type PatientField,
} from "@/lib/patients/schemas";
import type { PatientFormState } from "@/lib/patients/types";

const nn = (v: string) => (v === "" ? null : v);
const tri = (v: string) => (v === "yes" ? true : v === "no" ? false : null);
const num = (v: string) => (v === "" ? null : Number(v));

function lines(text: string, maxItems = 20, maxLen = 120): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((l) => l.slice(0, maxLen));
}

/** تمام ردیف‌های قبلی بیمار را پاک می‌کند و ردیف‌های جدید را درج می‌کند */
async function replaceRows(
  supabase: SupabaseClient,
  table: string,
  patientId: string,
  rows: Record<string, string>[],
  onlyPrimary = false,
) {
  let del = supabase.from(table).delete().eq("patient_id", patientId);
  if (onlyPrimary) del = del.eq("is_primary", true);
  const d = await del;
  if (d.error) return d.error;
  if (rows.length > 0) {
    const i = await supabase.from(table).insert(rows.map((r) => ({ patient_id: patientId, ...r })));
    if (i.error) return i.error;
  }
  return null;
}

export async function savePatientProfileAction(
  _prev: PatientFormState,
  formData: FormData,
): Promise<PatientFormState> {
  const locale = resolveLocale(formData.get("locale"));
  const slug = String(formData.get("doctorSlug") ?? "");

  const raw = Object.fromEntries(
    PATIENT_FIELDS.map((n) => {
      const v = String(formData.get(n) ?? "");
      return [n, DIGIT_FIELDS.includes(n) ? toAsciiDigits(v) : v];
    }),
  ) as Record<PatientField, string>;

  const parsed = patientSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues), values: raw };
  }

  const user = await getCurrentUser();
  if (!user) return { formError: "patientForm.errors.loginRequired", values: raw };
  if (user.role !== "patient") return { formError: "patientForm.errors.patientsOnly", values: raw };

  const d = parsed.data;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("patients")
    .select("id, privacy_consent_at")
    .eq("profile_id", user.id)
    .maybeSingle();

  const fields = {
    first_name: d.firstName,
    last_name: d.lastName,
    father_name: nn(d.fatherName),
    national_id: nn(d.nationalId),
    date_of_birth: d.dateOfBirth,
    gender: d.gender,
    marital_status: nn(d.maritalStatus),
    nationality: nn(d.nationality),
    occupation: nn(d.occupation),
    phone: d.phone,
    alt_phone: nn(d.altPhone),
    country: nn(d.country),
    state_province: nn(d.stateProvince),
    city: d.city,
    address_line: d.addressLine,
    postal_code: nn(d.postalCode),
    blood_type: d.bloodType || "unknown",
    height_cm: num(d.heightCm),
    weight_kg: num(d.weightKg),
    smoking_status: nn(d.smokingStatus),
    uses_alcohol: tri(d.usesAlcohol),
    is_pregnant: d.gender === "female" ? tri(d.isPregnant) : null,
    family_history: nn(d.familyHistory),
    additional_notes: nn(d.additionalNotes),
    insurance_provider: nn(d.insuranceProvider),
    insurance_number: nn(d.insuranceNumber),
    insurance_expiry: nn(d.insuranceExpiry),
    // زمان رضایت‌نامه‌ی اولیه حفظ می‌شود
    privacy_consent_at: existing?.privacy_consent_at ?? new Date().toISOString(),
  };

  let patientId: string;
  if (existing) {
    const { error } = await supabase.from("patients").update(fields).eq("id", existing.id);
    if (error) return mapError(error, raw);
    patientId = existing.id;
  } else {
    const { data, error } = await supabase
      .from("patients")
      .insert({ profile_id: user.id, ...fields })
      .select("id")
      .single();
    if (error || !data) return mapError(error, raw);
    patientId = data.id;
  }

  // فهرست‌ها (دنباله‌ی چند درخواست؛ اگر یکی شکست بخورد پرونده‌ی اصلی ذخیره مانده است)
  const results = await Promise.all([
    replaceRows(
      supabase,
      "patient_emergency_contacts",
      patientId,
      d.ecName
        ? [{ full_name: d.ecName, relationship: d.ecRelationship, phone: d.ecPhone, is_primary: "true" }]
        : [],
      true,
    ),
    replaceRows(supabase, "patient_allergies", patientId, lines(d.allergies).map((a) => ({ allergen: a }))),
    replaceRows(supabase, "patient_chronic_conditions", patientId, lines(d.chronicConditions).map((c) => ({ condition_name: c }))),
    replaceRows(supabase, "patient_medications", patientId, lines(d.medications).map((m) => ({ medication_name: m }))),
    replaceRows(supabase, "patient_surgeries", patientId, lines(d.surgeries).map((s) => ({ procedure_name: s }))),
  ]);
  if (results.some(Boolean)) return { formError: "patientForm.errors.generic", values: raw };

  revalidatePath(`/${locale}/doctors/${slug}`);
  return { ok: true };
}

function mapError(
  error: { code?: string } | null,
  raw: Record<PatientField, string>,
): PatientFormState {
  // 23505 = شماره‌ی تذکره تکراری
  if (error?.code === "23505") {
    return { fieldErrors: { nationalId: "patientForm.errors.nationalIdTaken" }, values: raw };
  }
  return { formError: "patientForm.errors.generic", values: raw };
}