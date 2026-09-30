"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n-provider";
import {
  doctorName,
  formatFee,
  formatNumber,
  specialtyName,
  type Doctor,
} from "@/lib/doctors/types";
import { DoctorPhoto } from "./doctor-photo";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { locale, t } = useI18n();
  const name = doctorName(doctor, locale);
  const fee = formatFee(doctor.consultation_fee, doctor.currency, locale);

  return (
    <Link
      href={`/${locale}/doctors/${doctor.slug}`}
      className="glass group flex h-full flex-col overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1"
    >
      <DoctorPhoto
        src={doctor.photo_url}
        alt={name}
        initial={name.charAt(0)}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/5]"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {specialtyName(doctor, locale)}
        </span>
        <h3 className="text-lg font-bold">{name}</h3>
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          {doctor.years_of_experience != null && (
            <span>
              {formatNumber(doctor.years_of_experience, locale)} {t("doctors.yearsExperience")}
            </span>
          )}
          {fee && <span className="font-semibold text-foreground">{fee}</span>}
        </div>
        <span className="gradient-surface mt-auto block rounded-full py-2.5 text-center text-sm font-bold text-primary-foreground">
          {t("doctors.viewProfile")}
        </span>
      </div>
    </Link>
  );
}