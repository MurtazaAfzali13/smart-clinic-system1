"use client";

import { useEffect, useState } from "react";
import { Activity, Globe, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/i18n-provider";

export function Navbar() {
  const { t, dir } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  // استخراج زبان فعلی از آدرس (URL)
  const currentLocale = pathname.split('/')[1] || 'en';

  const links = [
    { label: t("navbar.home"), href: "#home" },
    { label: t("navbar.services"), href: "#services" },
    { label: t("navbar.doctors"), href: "#doctors" },
    { label: t("navbar.gallery"), href: "#gallery" },
    { label: t("navbar.contact"), href: "#contact" },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // تابع اصلی برای تغییر زبان در Next.js
  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'en' ? 'fa' : 'en';
    // جایگزینی زبان فعلی با زبان جدید در آدرس سایت
    const newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <motion.header
      dir={dir}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-500 lg:px-8 ${
          scrolled
            ? "glass mx-3 rounded-2xl py-3 shadow-[var(--shadow-elevated)] lg:mx-auto"
            : "py-3"
        }`}
      >
        <a href="#home" className="flex items-center gap-3">
          <span className="gradient-surface flex size-10 items-center justify-center rounded-xl text-primary-foreground">
            <Activity className="size-5" strokeWidth={2.6} />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Nova<span className="gradient-text">Care</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            aria-label="Switch language"
            className="glass flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition-colors hover:bg-secondary uppercase"
          >
            <Globe className="size-4 text-primary" />
            {currentLocale === 'en' ? 'FA' : 'EN'}
          </button>
          <a
            href="#contact"
            className="gradient-surface hidden rounded-full px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-105 sm:inline-flex"
          >
            {t("navbar.book_appointment")}
          </a>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="glass rounded-full p-2.5 lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-4 mt-2 rounded-2xl p-4 lg:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="gradient-surface mt-2 block rounded-xl px-4 py-3 text-center text-sm font-bold text-primary-foreground"
              >
                {t("navbar.book_appointment")}
              </a>
            </li>
          </ul>
        </div>
      )}
    </motion.header>
  );
}