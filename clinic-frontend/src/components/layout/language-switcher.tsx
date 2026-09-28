"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE, locales, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/i18n-provider";

const labels: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
};

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;

    // "/fa/doctors" -> ["", "fa", "doctors"] -> "/en/doctors"
    const segments = pathname.split("/");
    segments[1] = next;

    // Remember the choice for the next visit
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;

    router.push(segments.join("/") + window.location.search);
  }

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-black/10 text-sm dark:border-white/20">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-pressed={l === locale}
          className={
            "px-3 py-1.5 transition-colors " +
            (l === locale
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "hover:bg-black/5 dark:hover:bg-white/10")
          }
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
