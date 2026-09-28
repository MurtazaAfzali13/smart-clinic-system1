"use client";

import { Search } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useI18n } from "@/lib/i18n/i18n-provider";

export function Gallery() {
  const { t, dir } = useI18n();

  const shots = [
    { src: "/images/assert/gallery-mri.jpg", alt: t("gallery.items.mri"), h: "h-[26rem]" },
    { src: "/images/assert/gallery-room.jpg", alt: t("gallery.items.room"), h: "h-64" },
    { src: "/images/assert/gallery-exterior.jpg", alt: t("gallery.items.exterior"), h: "h-80" },
    { src: "/images/assert/gallery-emergency.jpg", alt: t("gallery.items.emergency"), h: "h-64" },
    { src: "/images/assert/facility-or.jpg", alt: t("gallery.items.or"), h: "h-[26rem]" },
    { src: "/images/assert/facility-lounge.jpg", alt: t("gallery.items.lounge"), h: "h-72" },
  ];

  return (
    <section id="gallery" dir={dir} className="section-pad">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t("gallery.eyebrow")}
          title={t("gallery.title_main")}
          highlight={t("gallery.title_highlight")}
          description={t("gallery.description")}
        />

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {shots.map((s, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
              <figure className="group relative overflow-hidden rounded-3xl">
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  className={`w-full ${s.h} object-cover transition-transform duration-700 group-hover:scale-110`}
                />
                <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                  <span className="gradient-surface flex size-12 items-center justify-center rounded-full text-primary-foreground">
                    <Search className="size-5" />
                  </span>
                  <span className="text-sm font-semibold">{s.alt}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
