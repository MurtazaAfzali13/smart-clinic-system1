"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/dal";
import { resolveLocale } from "@/lib/auth/locale";
import { toFieldErrors } from "@/lib/auth/schemas";
import { bookingSchema } from "@/lib/appointments/schemas";
import type { BookingState } from "@/lib/appointments/types";
import { DoctorActionState } from "@/lib/appointments/types"

import { z } from "zod";

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
    console.error("[bookAppointment] insert failed", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    const msg = error.message ?? "";
    if (error.code === "23P01" && msg.includes("patient_no_overlap")) {
      return { formError: "booking.errors.patientOverlap", values };
    }
    if (error.code === "23P01" || msg.includes("not available")) {
      revalidatePath(`/${locale}/doctors/${slug}`);
      return { formError: "booking.errors.slotTaken", values };
    }
    return { formError: "booking.errors.generic", values };
  }

  revalidatePath(`/${locale}/doctors/${slug}`);
  return { success: { startAt: d.startAt } };
}

const INTENT_PATCH = {
  confirm: { status: "confirmed" },
  complete: { status: "completed" },
  no_show: { status: "no_show" },
  cancel: { status: "cancelled" },
  paid: { is_fee_paid: true },
  unpaid: { is_fee_paid: false },
} as const;

export async function updateAppointmentAction(
  _prev: DoctorActionState,
  formData: FormData,
): Promise<DoctorActionState> {
  const locale = resolveLocale(formData.get("locale"));
  const slug = String(formData.get("doctorSlug") ?? "");
  const id = z.string().uuid().safeParse(String(formData.get("appointmentId") ?? ""));
  const intent = String(formData.get("intent") ?? "");

  if (!id.success || !Object.prototype.hasOwnProperty.call(INTENT_PATCH, intent)) {
    return { error: "booking.errors.generic" };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "booking.errors.loginRequired" };
  if (user.role !== "doctor") return { error: "doctorView.errors.notAllowed" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .update(INTENT_PATCH[intent as keyof typeof INTENT_PATCH])
    .eq("id", id.data)
    .select("id");

  if (error) {
    return {
      error: error.message.includes("already closed")
        ? "doctorView.errors.closed"
        : "booking.errors.generic",
    };
  }
  if (!data?.length) return { error: "doctorView.errors.notAllowed" };

  revalidatePath(`/${locale}/doctors/${slug}`);
  return { ok: true };
}