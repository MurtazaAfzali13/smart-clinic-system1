"use client";

import { Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { useI18n } from "@/lib/i18n/i18n-provider";

export function About() {
  const { t, dir } = useI18n();

  const points = [
    t("about.point_1"),
    t("about.point_2"),
    t("about.point_3"),
    t("about.point_4"),
  ];

  return (
    <section id="about" dir={dir} className="section-pad">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal className="grid grid-cols-2 gap-4">
          <img
            src="/images/assert/facility-or.jpg"
            alt={t("about.alt_or")}
            loading="lazy"
            width={1024}
            height={1280}
            className="col-span-1 row-span-2 h-full w-full rounded-3xl object-cover shadow-[var(--shadow-elevated)]"
          />
          <img
            src="/images/assert/facility-lounge.jpg"
            alt={t("about.alt_lounge")}
            loading="lazy"
            width={1024}
            height={768}
            className="h-44 w-full rounded-3xl object-cover shadow-[var(--shadow-elevated)] lg:h-52"
          />
          <img
            src="/images/assert/facility-ai.jpg"
            alt={t("about.alt_ai")}
            loading="lazy"
            width={1024}
            height={768}
            className="h-44 w-full rounded-3xl object-cover shadow-[var(--shadow-elevated)] lg:h-52"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <span className="glass inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            {t("about.badge")}
          </span>
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            {t("about.title_main")}{" "}
            <span className="gradient-text">{t("about.title_highlight")}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground">
            {t("about.description")}
          </p>

          <ul className="mt-8 grid gap-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="gradient-surface mt-9 inline-flex rounded-full px-7 py-3.5 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-105"
          >
            {t("about.cta")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default About;