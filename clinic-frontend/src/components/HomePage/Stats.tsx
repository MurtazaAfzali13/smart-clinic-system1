"use client";

import { Award, BrainCircuit, HeartPulse, Stethoscope } from "lucide-react";
import { Reveal } from "./Reveal";
import { useI18n } from "@/lib/i18n/i18n-provider";

export function Stats() {
  const { t, dir } = useI18n();

  const stats = [
    { icon: Award, value: t("stats.years_value"), label: t("stats.years_label") },
    { icon: Stethoscope, value: t("stats.specialists_value"), label: t("stats.specialists_label") },
    { icon: HeartPulse, value: t("stats.patients_value"), label: t("stats.patients_label") },
    { icon: BrainCircuit, value: t("stats.support_value"), label: t("stats.support_label") },
  ];

  return (
    <div dir={dir} className="relative z-20 mx-auto -mt-28 max-w-6xl px-5 lg:px-8">
      <Reveal>
        <div className="glass glow-border grid grid-cols-2 gap-px overflow-hidden rounded-3xl shadow-[var(--shadow-elevated)] lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="group flex flex-col items-center gap-2 px-6 py-8 text-center transition-colors duration-300 hover:bg-secondary/40"
            >
              <s.icon className="size-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              <span className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                {s.value}
              </span>
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
