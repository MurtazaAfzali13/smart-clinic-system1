import type { DoctorAppointment } from "./types"; 

import { createClient } from "@/lib/supabase/server";

type RawDoctorAppt = {
  id: string;
  start_at: string;
  end_at: string;
  status: string;
  is_first_visit: boolean;
  reason: string;
  symptoms: string | null;
  symptom_duration: string | null;
  patient_notes: string | null;
  fee_amount: number | null;
  fee_currency: string | null;
  is_fee_paid: boolean;
  fee_paid_at: string | null;
  patient: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    date_of_birth: string | null;
    gender: string | null;
    blood_type: string | null;
    city: string | null;
    patient_allergies: { allergen: string }[] | null;
    patient_chronic_conditions: { condition_name: string; is_active: boolean }[] | null;
    patient_medications: { medication_name: string; is_active: boolean }[] | null;
  } | null;
};

const DOCTOR_APPT_COLUMNS = [
  "id", "start_at", "end_at", "status", "is_first_visit", "reason",
  "symptoms", "symptom_duration", "patient_notes",
  "fee_amount", "fee_currency", "is_fee_paid", "fee_paid_at",
  "patient:patients(first_name, last_name, phone, date_of_birth, gender, blood_type, city, patient_allergies(allergen), patient_chronic_conditions(condition_name, is_active), patient_medications(medication_name, is_active))",
].join(", ");

function ageOf(dob: string | null): number | null {
  if (!dob) return null;
  const b = new Date(dob);
  const n = new Date();
  let age = n.getFullYear() - b.getFullYear();
  const m = n.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && n.getDate() < b.getDate())) age--;
  return age >= 0 ? age : null;
}


export async function getDoctorAppointments(doctorId: string): Promise<DoctorAppointment[]> {
  const supabase = await createClient();
  const from = new Date(Date.now() - 36 * 3_600_000).toISOString();
  const to = new Date(Date.now() + 9 * 86_400_000).toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .select(DOCTOR_APPT_COLUMNS)
    .eq("doctor_id", doctorId)
    .neq("status", "cancelled")
    .gte("start_at", from)
    .lt("start_at", to)
    .order("start_at");
  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as RawDoctorAppt[]).map((r) => {
    const p = r.patient;
    return {
      id: r.id,
      startAt: r.start_at,
      endAt: r.end_at,
      status: r.status,
      isFirstVisit: r.is_first_visit,
      reason: r.reason,
      symptoms: r.symptoms,
      symptomDuration: r.symptom_duration,
      patientNotes: r.patient_notes,
      feeAmount: r.fee_amount,
      feeCurrency: r.fee_currency,
      isFeePaid: r.is_fee_paid,
      feePaidAt: r.fee_paid_at,
      patient: p
        ? {
            fullName: [p.first_name, p.last_name].filter(Boolean).join(" "),
            phone: p.phone,
            age: ageOf(p.date_of_birth),
            gender: p.gender,
            bloodType: p.blood_type === "unknown" ? null : p.blood_type,
            city: p.city,
            allergies: (p.patient_allergies ?? []).map((a) => a.allergen),
            conditions: (p.patient_chronic_conditions ?? [])
              .filter((c) => c.is_active !== false)
              .map((c) => c.condition_name),
            medications: (p.patient_medications ?? [])
              .filter((m) => m.is_active !== false)
              .map((m) => m.medication_name),
          }
        : null,
    };
  });
}