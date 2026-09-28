"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useI18n } from "@/lib/i18n/i18n-provider";

export function Doctors() {
  const { t, dir } = useI18n();
  const scroller = useRef<HTMLDivElement>(null);

  const doctors = [
    {
      img: "/images/assert/doctor-1.jpg",
      name: t("doctors.items.d1.name"),
      specialty: t("doctors.items.d1.specialty"),
    },
    {
      img: "/images/assert/doctor-2.jpg",
      name: t("doctors.items.d2.name"),
      specialty: t("doctors.items.d2.specialty"),
    },
    {
      img: "/images/assert/doctor-3.jpg",
      name: t("doctors.items.d3.name"),
      specialty: t("doctors.items.d3.specialty"),
    },
    {
      img: "/images/assert/doctor-4.jpg",
      name: t("doctors.items.d4.name"),
      specialty: t("doctors.items.d4.specialty"),
    },
  ];

  const scrollBy = (direction: number) => {
    scroller.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  return (
    <section id="doctors" dir={dir} className="section-pad bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t("doctors.eyebrow")}
          title={t("doctors.title_main")}
          highlight={t("doctors.title_highlight")}
          description={t("doctors.description")}
        />

        <div className="mt-10 flex justify-end gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label={t("doctors.prev_aria")}
            className="glass rounded-full p-3 transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label={t("doctors.next_aria")}
            className="glass rounded-full p-3 transition-colors hover:bg-secondary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <Reveal>
          <div
            ref={scroller}
            className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
          >
            {doctors.map((d, i) => (
              <article
                key={i}
                className="group w-[16rem] shrink-0 snap-start overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-elevated)] transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.03] sm:w-[19rem]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={d.img}
                    alt={d.name}
                    loading="lazy"
                    width={768}
                    height={960}
                    className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="p-6 pt-2">
                  <h3 className="text-lg font-bold tracking-tight">{d.name}</h3>
                  <p className="mt-1 text-sm text-primary">{d.specialty}</p>
                  <button className="glass mt-5 w-full rounded-full py-2.5 text-xs font-bold tracking-wide uppercase transition-colors hover:bg-secondary">
                    {t("doctors.view_profile")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
