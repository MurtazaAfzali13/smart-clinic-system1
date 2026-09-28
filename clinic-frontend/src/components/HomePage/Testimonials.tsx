"use client";

import { Quote, Star } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useI18n } from "@/lib/i18n/i18n-provider";

export function Testimonials() {
  const { t, dir } = useI18n();

  const reviews = [
    {
      name: t("testimonials.items.r1.name"),
      role: t("testimonials.items.r1.role"),
      text: t("testimonials.items.r1.text"),
    },
    {
      name: t("testimonials.items.r2.name"),
      role: t("testimonials.items.r2.role"),
      text: t("testimonials.items.r2.text"),
    },
    {
      name: t("testimonials.items.r3.name"),
      role: t("testimonials.items.r3.role"),
      text: t("testimonials.items.r3.text"),
    },
  ];

  return (
    <section dir={dir} className="section-pad bg-surface/40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t("testimonials.eyebrow")}
          title={t("testimonials.title_main")}
          highlight={t("testimonials.title_highlight")}
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <article className="glass glow-border lift relative h-full overflow-hidden rounded-3xl p-8">
                <Quote
                  className="absolute -top-2 -right-2 size-28 text-primary/10"
                  strokeWidth={1.2}
                  aria-hidden
                />
                <div className="relative flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="relative mt-5 text-sm leading-relaxed text-pretty text-muted-foreground">
                  “{r.text}”
                </p>
                <div className="relative mt-7">
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="text-xs text-primary">{r.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
