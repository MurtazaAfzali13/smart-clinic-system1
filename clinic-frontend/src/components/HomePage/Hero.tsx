"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, PhoneCall, Sparkles } from "lucide-react";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";

const particles = [
  { left: "8%", top: "22%", size: 6, delay: 0 },
  { left: "22%", top: "68%", size: 4, delay: 2 },
  { left: "40%", top: "18%", size: 5, delay: 4 },
  { left: "58%", top: "74%", size: 3, delay: 1 },
  { left: "72%", top: "32%", size: 7, delay: 3 },
  { left: "86%", top: "58%", size: 4, delay: 5 },
  { left: "94%", top: "20%", size: 5, delay: 2.5 },
];

export function Hero() {
  const { t, dir } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      dir={dir}
      className="relative min-h-screen overflow-hidden"
    >
      <motion.img
        src="/images/hero/hero1.jpg"
        alt={t("hero.image_alt")}
        width={1920}
        height={1088}
        style={{ y: imageY }}
        className="absolute inset-0 size-full scale-110 object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "var(--gradient-hero)" }}
        aria-hidden
      />

      {particles.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className="animate-drift absolute rounded-full bg-primary blur-[1px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 pt-32 pb-44 text-center lg:px-8"
      >
        <motion.a
          href="tel:115"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="animate-pulse-ring glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
        >
          <PhoneCall className="size-4 text-primary" />
          {t("hero.emergency_call")} <span className="gradient-text font-extrabold">115</span>
        </motion.a>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-primary uppercase"
        >
          <Sparkles className="size-4" /> {t("hero.badge")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl text-5xl leading-[1.03] font-extrabold tracking-tighter text-balance sm:text-6xl lg:text-7xl"
        >
          {t("hero.title_main")}{" "}
          <span className="gradient-text">{t("hero.title_highlight")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground"
        >
          {t("hero.description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <a
            href="#contact"
            className="gradient-surface group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-105"
          >
            {t("hero.cta_primary")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#services"
            className="glass inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold transition-colors duration-300 hover:bg-secondary"
          >
            {t("hero.cta_secondary")}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
