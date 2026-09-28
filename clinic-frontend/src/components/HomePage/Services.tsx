"use client";

import {
  Activity,
  Ambulance,
  Baby,
  Brain,
  HeartPulse,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useI18n } from "@/lib/i18n/i18n-provider";

export function Services() {
  const { t, dir } = useI18n();

  const services = [
    {
      icon: HeartPulse,
      title: t("services.items.cardiology.title"),
      text: t("services.items.cardiology.text"),
      span: "lg:col-span-2 lg:row-span-2",
      big: true,
    },
    {
      icon: Brain,
      title: t("services.items.neurology.title"),
      text: t("services.items.neurology.text"),
      span: "lg:col-span-2",
    },
    {
      icon: Sparkles,
      title: t("services.items.ai_diagnosis.title"),
      text: t("services.items.ai_diagnosis.text"),
      span: "lg:col-span-2",
    },
    {
      icon: Ambulance,
      title: t("services.items.emergency.title"),
      text: t("services.items.emergency.text"),
      span: "lg:col-span-2",
    },
    {
      icon: ScanLine,
      title: t("services.items.imaging.title"),
      text: t("services.items.imaging.text"),
      span: "lg:col-span-1",
    },
    {
      icon: Baby,
      title: t("services.items.pediatrics.title"),
      text: t("services.items.pediatrics.text"),
      span: "lg:col-span-1",
    },
  ];

  return (
    <section id="services" dir={dir} className="section-pad relative">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t("services.eyebrow")}
          title={t("services.title_main")}
          highlight={t("services.title_highlight")}
          description={t("services.description")}
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={i} delay={i * 0.06} className={s.span}>
              <article
                className={`glass glow-border lift group flex h-full flex-col rounded-3xl p-7 ${
                  s.big ? "justify-end lg:min-h-[22rem]" : ""
                }`}
              >
                <span className="gradient-surface mb-5 flex size-12 items-center justify-center rounded-2xl text-primary-foreground">
                  <s.icon className="size-6" strokeWidth={2.2} />
                </span>
                <h3
                  className={`font-extrabold tracking-tight ${s.big ? "text-3xl" : "text-xl"}`}
                >
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-primary uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Activity className="size-3.5" /> {t("services.learn_more")}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Services;
