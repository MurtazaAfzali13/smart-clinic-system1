import type { Locale } from "./config";
import type { Dictionary } from "./translate";

// Each language file is loaded only when needed.
const loaders: Record<Locale, () => Promise<Dictionary>> = {
  fa: () => import("@/dictionaries/fa.json").then((m) => m.default as Dictionary),
  en: () => import("@/dictionaries/en.json").then((m) => m.default as Dictionary),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}
