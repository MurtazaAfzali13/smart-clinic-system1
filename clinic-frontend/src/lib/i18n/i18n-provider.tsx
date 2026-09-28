"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { localeDirection, type Locale } from "./config";
import { createTranslator, type Dictionary, type TranslateFn } from "./translate";

type I18nContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: TranslateFn;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: localeDirection[locale],
      t: createTranslator(dictionary),
    }),
    [locale, dictionary],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

/** Shortcut: const t = useT(); t("navbar.home") */
export function useT(): TranslateFn {
  return useI18n().t;
}
