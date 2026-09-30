"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/dal";
import { resolveLocale } from "@/lib/auth/locale";
import { toFieldErrors } from "@/lib/auth/schemas";
import { bookingSchema } from "@/lib/appointments/schemas";
import type { BookingState } from "@/lib/appointments/types";

export async function bookAppointmentAction(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const locale = resolveLocale(formData.get("locale"));
  const slug = String(formData.get("doctorSlug") ?? "");
  const text = (k: string) => String(formData.get(k) ?? "");

  const raw = {
    doctorId: text("doctorId"),
    startAt: text("startAt"),
    isFirstVisit: text("isFirstVisit"),
    reason: text("reason"),
    symptoms: text("symptoms"),
    symptomDuration: text("symptomDuration"),
    patientNotes: text("patientNotes"),
  };
  const values = {
    isFirstVisit: raw.isFirstVisit,
    reason: raw.reason,
    symptoms: raw.symptoms,
    symptomDuration: raw.symptomDuration,
    patientNotes: raw.patientNotes,
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues), values };
  }

  // هویت و نقش همیشه از سرور خوانده می‌شود، نه از فرم
  const user = await getCurrentUser();
  if (!user) return { formError: "booking.errors.loginRequired", values };
  if (user.role !== "patient") return { formError: "booking.errors.patientsOnly", values };

  const supabase = await createClient();
  const { data: patient } = await supabase
    .from("patients")
    .select("id, profile_completed")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!patient?.profile_completed) {
    return { formError: "booking.errors.profileIncomplete", needsProfile: true, values };
  }

  const d = parsed.data;
  // end_at را نمی‌فرستیم: تریگر validate_new_appointment آن را از طول ویزیت پزشک پر می‌کند
  // و بررسی می‌کند ساعت واقعاً خالی باشد.
  const { error } = await supabase.from("appointments").insert({
    patient_id: patient.id,
    doctor_id: d.doctorId,
    start_at: new Date(d.startAt).toISOString(),
    is_first_visit: d.isFirstVisit,
    reason: d.reason,
    symptoms: d.symptoms || null,
    symptom_duration: d.symptomDuration || null,
    patient_notes: d.patientNotes || null,
  });

  if (error) {
    const msg = error.message ?? "";
    // 23P01 = تداخل زمانی (محدودیت exclusion دیتابیس، امن در برابر دو کلیک هم‌زمان)
    if (error.code === "23P01" && msg.includes("patient_no_overlap")) {
      return { formError: "booking.errors.patientOverlap", values };
    }
    if (error.code === "23P01" || msg.includes("not available")) {
      revalidatePath(`/${locale}/doctors/${slug}`); // لیست ساعت‌ها تازه شود
      return { formError: "booking.errors.slotTaken", values };
    }
    return { formError: "booking.errors.generic", values };
  }

  revalidatePath(`/${locale}/doctors/${slug}`);
  return { success: { startAt: d.startAt } };
}