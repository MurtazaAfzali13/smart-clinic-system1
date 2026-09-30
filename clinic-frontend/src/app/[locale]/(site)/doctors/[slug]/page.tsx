import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/dal";
import {
  getClinicTimezone,
  getDoctorBySlug,
  getWeekSlots,
  isPatientProfileCompleted,
} from "@/lib/doctors/queries";
import type { BookingAccess } from "@/lib/doctors/types";
import { DoctorDetail } from "@/components/doctors/doctor-detail";

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const timeZone = await getClinicTimezone();
  const [days, user] = await Promise.all([
    doctor.is_accepting_appointments ? getWeekSlots(doctor.id, timeZone) : Promise.resolve([]),
    getCurrentUser(),
  ]);

  let access: BookingAccess = "guest";
  if (user) {
    if (user.role !== "patient") access = "not_patient";
    else access = (await isPatientProfileCompleted(user.id)) ? "ready" : "needs_profile";
  }

  return <DoctorDetail doctor={doctor} days={days} timeZone={timeZone} access={access} />;
}