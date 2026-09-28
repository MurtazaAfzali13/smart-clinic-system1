"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useI18n } from "@/lib/i18n/i18n-provider";

export function CtaBanner() {
  const { t, dir } = useI18n();

  return (
    <section dir={dir} className="px-5 pb-24 lg:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="gradient-surface relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center text-primary-foreground lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="animate-float absolute -top-20 -left-16 size-64 rounded-full bg-background/10 blur-3xl"
          />
          <div
            aria-hidden
            className="animate-float absolute -right-10 -bottom-24 size-72 rounded-full bg-background/10 blur-3xl"
            style={{ animationDelay: "2s" }}
          />
          <h2 className="relative mx-auto max-w-3xl text-4xl font-extrabold tracking-tighter text-balance sm:text-5xl">
            {t("cta_banner.title")}
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-sm opacity-80">
            {t("cta_banner.description")}
          </p>
          <a
            href="#contact"
            className="group relative mt-10 inline-flex items-center gap-2 rounded-full bg-background px-9 py-4 text-sm font-bold text-foreground transition-transform duration-300 hover:scale-105"
          >
            {t("cta_banner.button")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
