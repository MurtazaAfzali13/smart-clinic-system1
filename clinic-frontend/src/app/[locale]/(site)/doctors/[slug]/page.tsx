import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/dal";
import {
  getClinicSchedule,
  getDoctorBySlug,
  getWeekSlots,
  isDoctorOwner,
  isPatientProfileCompleted,
} from "@/lib/doctors/queries";
import { getDoctorAppointments } from "@/lib/appointments/queries";
import { getPatientDraft, getPatientEnumOptions } from "@/lib/patients/queries";
import type { DoctorAppointment } from "@/lib/appointments/types";
import type { BookingAccess } from "@/lib/doctors/types";
import type { PatientDraft, PatientEnumOptions } from "@/lib/patients/types";
import { DoctorDetail } from "@/components/doctors/doctor-detail";

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const { timeZone, closedWeekdays } = await getClinicSchedule();
  const [days, user] = await Promise.all([
    doctor.is_accepting_appointments
      ? getWeekSlots(doctor.id, timeZone, closedWeekdays)
      : Promise.resolve([]),
    getCurrentUser(),
  ]);

  let access: BookingAccess = "guest";
  let appointments: DoctorAppointment[] = [];
  let patientDraft: PatientDraft | null = null;
  let enumOptions: PatientEnumOptions | null = null;

  if (user) {
    if (user.role === "doctor" && (await isDoctorOwner(doctor.id, user.id))) {
      access = "doctor_owner";
      appointments = await getDoctorAppointments(doctor.id);
    } else if (user.role !== "patient") {
      access = "not_patient";
    } else if (await isPatientProfileCompleted(user.id)) {
      access = "ready";
    } else {
      access = "needs_profile";
      [patientDraft, enumOptions] = await Promise.all([
        getPatientDraft(user.id, user.fullName),
        getPatientEnumOptions(),
      ]);
    }
  }

  return (
    <DoctorDetail
      doctor={doctor}
      days={days}
      timeZone={timeZone}
      access={access}
      appointments={appointments}
      patientDraft={patientDraft}
      enumOptions={enumOptions}
    />
  );
}