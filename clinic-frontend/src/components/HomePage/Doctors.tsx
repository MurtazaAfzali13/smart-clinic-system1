"use client";

import { Reveal, SectionHeading } from "./Reveal";
import { useI18n } from "@/lib/i18n/i18n-provider";
import type { Doctor } from "@/lib/doctors/types";
import { DoctorsGrid } from "@/components/doctors/doctors-grid";

export function Doctors({ doctors }: { doctors: Doctor[] }) {
  const { t, dir } = useI18n();

  return (
    <section id="doctors" dir={dir} className="section-pad bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t("doctors.eyebrow")}
          title={t("doctors.title_main")}
          highlight={t("doctors.title_highlight")}
          description={t("doctors.description")}
        />

        <Reveal>
          <div className="mt-12">
            <DoctorsGrid doctors={doctors} pageSize={4} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}