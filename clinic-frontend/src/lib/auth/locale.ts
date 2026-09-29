export const locales = ["en", "fa"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "en";

export function resolveLocale(value: FormDataEntryValue | null): AppLocale {
  const v = String(value ?? "");
  return (locales as readonly string[]).includes(v) ? (v as AppLocale) : defaultLocale;
}