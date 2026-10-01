import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { DaySlots, Doctor } from "./types";

const DOCTOR_COLUMNS = [
  "id", "slug",
  "first_name_fa", "last_name_fa", "first_name_en", "last_name_en",
  "title_fa", "title_en", "bio_fa", "bio_en",
  "qualifications_fa", "qualifications_en",
  "photo_url", "years_of_experience", "languages",
  "consultation_fee", "currency", "slot_duration_minutes",
  "is_accepting_appointments",
  "specialty:specialties(slug, name_fa, name_en)",
].join(", ");

export async function getDoctors(): Promise<Doctor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select(DOCTOR_COLUMNS)
    .eq("is_active", true)
    .order("last_name_en");
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Doctor[];
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select(DOCTOR_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as Doctor) ?? null;
}

export async function getClinicTimezone(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.from("clinic_settings").select("timezone").eq("id", 1).single();
  return data?.timezone ?? "UTC";
}

/** امروز و n-1 روز بعد، به‌صورت YYYY-MM-DD در منطقه‌ی زمانی کلینیک */
function clinicDates(timeZone: string, count: number): string[] {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [y, m, d] = today.split("-").map(Number);
  return Array.from({ length: count }, (_, i) =>
    new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10),
  );
}
export async function isPatientProfileCompleted(profileId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("patients")
    .select("profile_completed")
    .eq("profile_id", profileId)
    .maybeSingle();
  return !!data?.profile_completed;
}

export async function getClinicSchedule(): Promise<{ timeZone: string; closedWeekdays: number[] }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clinic_settings")
    .select("timezone, closed_weekdays")
    .eq("id", 1)
    .single();
  return {
    timeZone: data?.timezone ?? "UTC",
    closedWeekdays: (data?.closed_weekdays as number[] | null) ?? [5],
  };
}

export async function getWeekSlots(
  doctorId: string,
  timeZone: string,
  closedWeekdays: number[],
  count = 7,
): Promise<DaySlots[]> {
  const supabase = await createClient();
  return Promise.all(
    clinicDates(timeZone, count).map(async (date): Promise<DaySlots> => {
      const dow = new Date(`${date}T00:00:00Z`).getUTCDay(); // 0 = یکشنبه، مثل Postgres
      if (closedWeekdays.includes(dow)) return { date, closed: true, slots: [] };

      const { data, error } = await supabase.rpc("get_day_slots", {
        p_doctor_id: doctorId,
        p_date: date,
      });
      if (error) throw new Error(error.message);
      const rows = (data ?? []) as { starts_at: string; is_booked: boolean }[];
      return {
        date,
        closed: false,
        slots: rows.map((r) => ({ startsAt: r.starts_at, booked: r.is_booked })),
      };
    }),
  );
}

export async function isDoctorOwner(doctorId: string, profileId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("doctors")
    .select("id")
    .eq("id", doctorId)
    .eq("profile_id", profileId)
    .maybeSingle();
  return !!data;
}