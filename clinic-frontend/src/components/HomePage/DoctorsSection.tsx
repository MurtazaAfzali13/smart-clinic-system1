import { getDoctors } from "@/lib/doctors/queries";
import type { Doctor } from "@/lib/doctors/types";
import { Doctors } from "./Doctors";

export async function DoctorsSection() {
  let doctors: Doctor[] = [];
  try {
    doctors = await getDoctors();
  } catch (error) {
    // خطای دیتابیس نباید کل صفحه‌ی اصلی را خراب کند
    console.error("Failed to load doctors", error);
  }
  return <Doctors doctors={doctors} />;
}