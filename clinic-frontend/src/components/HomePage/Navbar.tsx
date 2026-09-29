"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Globe, LogOut, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { logoutAction } from "@/lib/auth/actions";

export type NavbarUser = {
  displayName: string;
  /** بدون پیشوند زبان، مثل "/dashboard" */
  dashboardPath: string;
};

export function Navbar({ user = null }: { user?: NavbarUser | null }) {
  const { t, dir, locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const dashboardHref = user ? `/${locale}${user.dashboardPath}` : null;
  const initial = user?.displayName.trim().charAt(0) ?? "";

  const links = [
    { label: t("navbar.home"), href: `/${locale}` },
    ...(dashboardHref ? [{ label: t("navbar.dashboard"), href: dashboardHref }] : []),
    { label: t("navbar.doctors"), href: `/${locale}#doctors` },
    { label: t("navbar.gallery"), href: `/${locale}#gallery` },
    { label: t("navbar.contact"), href: `/${locale}#contact` },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // تغییر زبان: فقط بخش زبان آدرس عوض می‌شود، query و hash حفظ می‌شود
  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "fa" : "en";
    const newPath = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${nextLocale}`);
    router.push(newPath + window.location.search + window.location.hash);
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
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <span className="gradient-surface flex size-10 items-center justify-center rounded-xl text-primary-foreground">
            <Activity className="size-5" strokeWidth={2.6} />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Nova<span className="gradient-text">Care</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
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
            {locale === "en" ? "FA" : "EN"}
          </button>

          {/* بخش احراز هویت (دسکتاپ). در موبایل داخل منو است */}
          {user && dashboardHref ? (
            <>
              <Link
                href={dashboardHref}
                className="glass hidden items-center gap-2 rounded-full py-1.5 ps-1.5 pe-4 text-sm font-semibold transition-colors hover:bg-secondary md:flex"
              >
                <span className="gradient-surface flex size-7 items-center justify-center rounded-full text-xs font-bold uppercase text-primary-foreground">
                  {initial}
                </span>
                <span className="max-w-[9rem] truncate">{user.displayName}</span>
              </Link>
              <form action={logoutAction} className="hidden md:block">
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  aria-label={t("auth.logout")}
                  title={t("auth.logout")}
                  className="glass flex items-center justify-center rounded-full p-2.5 transition-colors hover:bg-secondary"
                >
                  <LogOut className="size-4 text-primary rtl:rotate-180" />
                </button>
              </form>
            </>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="glass hidden rounded-full px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary md:inline-flex"
            >
              {t("navbar.login")}
            </Link>
          )}

          <Link
            href={`/${locale}#contact`}
            className="gradient-surface hidden rounded-full px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-105 sm:inline-flex"
          >
            {t("navbar.book_appointment")}
          </Link>
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
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}

            <li className="mt-1 grid gap-1 border-t border-border pt-2">
              {user ? (
                <>
                  <span className="truncate px-4 py-2 text-sm font-semibold">
                    {user.displayName}
                  </span>
                  <form action={logoutAction}>
                    <input type="hidden" name="locale" value={locale} />
                    <button
                      type="submit"
                      className="block w-full rounded-xl px-4 py-3 text-start text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      {t("auth.logout")}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {t("navbar.register")}
                  </Link>
                </>
              )}
            </li>

            <li>
              <Link
                href={`/${locale}#contact`}
                onClick={() => setOpen(false)}
                className="gradient-surface mt-2 block rounded-xl px-4 py-3 text-center text-sm font-bold text-primary-foreground"
              >
                {t("navbar.book_appointment")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </motion.header>
  );
}