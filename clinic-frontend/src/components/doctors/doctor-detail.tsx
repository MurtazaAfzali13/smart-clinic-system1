"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n-provider";
import {
  doctorBio,
  doctorName,
  doctorQualifications,
  formatNumber,
  intlLocaleOf,
  specialtyName,
  type BookingAccess,
  type DaySlots,
  type Doctor,
} from "@/lib/doctors/types";
import { BookingPanel } from "@/components/booking/booking-panel";
import { DoctorPhoto } from "./doctor-photo";

export function DoctorDetail({
  doctor,
  days,
  timeZone,
  access,
}: {
  doctor: Doctor;
  days: DaySlots[];
  timeZone: string;
  access: BookingAccess;
}) {
  const { locale, t } = useI18n();
  const name = doctorName(doctor, locale);
  const bio = doctorBio(doctor, locale);
  const qualifications = doctorQualifications(doctor, locale);

  const languages = useMemo(() => {
    const names = new Intl.DisplayNames(intlLocaleOf(locale), { type: "language" });
    return doctor.languages.map((code) => {
      try {
        return names.of(code) ?? code;
      } catch {
        return code;
      }
    });
  }, [doctor.languages, locale]);

  const chip = "glass rounded-full px-3 py-1.5 text-sm";

  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 lg:px-8">
      <Link
        href={`/${locale}/doctors`}
        className="mb-6 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("doctors.back")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-6">
          <DoctorPhoto
            src={doctor.photo_url}
            alt={name}
            initial={name.charAt(0)}
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="aspect-[4/3] rounded-3xl"
          />

          <div className="space-y-3">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {specialtyName(doctor, locale)}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{name}</h1>
            <div className="flex flex-wrap gap-2">
              {doctor.years_of_experience != null && (
                <span className={chip}>
                  {formatNumber(doctor.years_of_experience, locale)} {t("doctors.yearsExperience")}
                </span>
              )}
              {languages.length > 0 && (
                <span className={chip}>
                  {t("doctors.languages")}: {languages.join("، ")}
                </span>
              )}
              <span className={chip}>
                {t("doctors.visitLength")}: {formatNumber(doctor.slot_duration_minutes, locale)}{" "}
                {t("doctors.minutes")}
              </span>
            </div>
          </div>

          {bio && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold">{t("doctors.about")}</h2>
              <p className="leading-8 text-muted-foreground">{bio}</p>
            </div>
          )}

          {qualifications && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold">{t("doctors.qualifications")}</h2>
              <p className="leading-8 text-muted-foreground">{qualifications}</p>
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          {doctor.is_accepting_appointments ? (
            <BookingPanel
              doctorId={doctor.id}
              doctorSlug={doctor.slug}
              days={days}
              timeZone={timeZone}
              slotMinutes={doctor.slot_duration_minutes}
              fee={doctor.consultation_fee}
              currency={doctor.currency}
              access={access}
            />
          ) : (
            <p className="glass rounded-3xl p-6 text-sm">{t("doctors.notAccepting")}</p>
          )}
        </aside>
      </div>
    </main>
  );
}