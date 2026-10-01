import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { PatientDraft, PatientEnumOptions } from "./types";

const s = (v: unknown) => (v == null ? "" : String(v));
const yn = (v: unknown) => (v === true ? "yes" : v === false ? "no" : "");
const joinLines = (rows: unknown, key: string) =>
  ((rows as Record<string, string>[] | null) ?? []).map((r) => r[key]).filter(Boolean).join("\n");

/** مقدار پیش‌فرض فرم: پرونده‌ی نیمه‌کاره‌ی قبلی، یا نام ثبت‌نام به‌عنوان نام و نام خانوادگی */
export async function getPatientDraft(userId: string, fullName: string): Promise<PatientDraft> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("patients")
    .select(
      "*, patient_emergency_contacts(full_name, relationship, phone, is_primary), patient_allergies(allergen), patient_chronic_conditions(condition_name), patient_medications(medication_name), patient_surgeries(procedure_name)",
    )
    .eq("profile_id", userId)
    .maybeSingle();

  const [first = "", ...rest] = fullName.trim().split(/\s+/);
  if (!data) return { firstName: first, lastName: rest.join(" ") };

  const row = data as Record<string, unknown>;
  const contacts = (row.patient_emergency_contacts as
    | { full_name: string; relationship: string; phone: string; is_primary: boolean }[]
    | null) ?? [];
  const ec = contacts.find((c) => c.is_primary) ?? contacts[0];

  return {
    firstName: s(row.first_name), lastName: s(row.last_name), fatherName: s(row.father_name),
    nationalId: s(row.national_id), dateOfBirth: s(row.date_of_birth), gender: s(row.gender),
    maritalStatus: s(row.marital_status), nationality: s(row.nationality), occupation: s(row.occupation),
    phone: s(row.phone), altPhone: s(row.alt_phone), country: s(row.country),
    stateProvince: s(row.state_province), city: s(row.city), addressLine: s(row.address_line),
    postalCode: s(row.postal_code),
    bloodType: row.blood_type === "unknown" ? "" : s(row.blood_type),
    heightCm: s(row.height_cm), weightKg: s(row.weight_kg), smokingStatus: s(row.smoking_status),
    usesAlcohol: yn(row.uses_alcohol), isPregnant: yn(row.is_pregnant),
    familyHistory: s(row.family_history), additionalNotes: s(row.additional_notes),
    allergies: joinLines(row.patient_allergies, "allergen"),
    chronicConditions: joinLines(row.patient_chronic_conditions, "condition_name"),
    medications: joinLines(row.patient_medications, "medication_name"),
    surgeries: joinLines(row.patient_surgeries, "procedure_name"),
    ecName: s(ec?.full_name), ecRelationship: s(ec?.relationship), ecPhone: s(ec?.phone),
    insuranceProvider: s(row.insurance_provider), insuranceNumber: s(row.insurance_number),
    insuranceExpiry: s(row.insurance_expiry),
    consent: row.privacy_consent_at ? "on" : "",
  };
}

const ENUM_TYPES = {
  gender: "gender_type",
  blood_type: "blood_type",
  marital_status: "marital_status_type",
  smoking_status: "smoking_status_type",
} as const;

/** مقدارهای مجاز enum را از خود دیتابیس می‌خوانیم تا حدس نزنیم */
export async function getPatientEnumOptions(): Promise<PatientEnumOptions> {
  const supabase = await createClient();
  const entries = await Promise.all(
    Object.entries(ENUM_TYPES).map(async ([key, type]) => {
      const { data } = await supabase.rpc("get_enum_values", { p_type: type });
      return [key, (data ?? []) as string[]] as const;
    }),
  );
  const out = Object.fromEntries(entries) as PatientEnumOptions;
  if (out.gender.length === 0) out.gender = ["male", "female"]; // اگر SQL 09 اجرا نشده
  return out;
}