"use client";

import { useI18n } from "@/lib/i18n/i18n-provider";
import type { Doctor } from "@/lib/doctors/types";
import { DoctorsGrid } from "./doctors-grid";

export function DoctorsList({ doctors }: { doctors: Doctor[] }) {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-8">
      <header className="mb-10 max-w-2xl space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("doctors.title")}</h1>
        <p className="text-muted-foreground">{t("doctors.subtitle")}</p>
      </header>

      <DoctorsGrid doctors={doctors} pageSize={8} />
    </main>
  );
}