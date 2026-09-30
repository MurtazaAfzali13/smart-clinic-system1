import { getDoctors } from "@/lib/doctors/queries";
import { DoctorsList } from "@/components/doctors/doctors-list";

export default async function DoctorsPage() {
  const doctors = await getDoctors();
  return <DoctorsList doctors={doctors} />;
}