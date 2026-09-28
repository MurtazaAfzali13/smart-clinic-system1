export type Dictionary = { [key: string]: string | Dictionary };

export type TranslateFn = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

/** Finds "navbar.home" inside { navbar: { home: "..." } } */
function lookup(dict: Dictionary, key: string): string | undefined {
  let current: string | Dictionary | undefined = dict;

  for (const part of key.split(".")) {
    if (current === undefined || typeof current === "string") return undefined;
    current = current[part];
  }

  return typeof current === "string" ? current : undefined;
}

/**
 * Creates a t() function for one dictionary.
 *  - t("navbar.home")                      -> translated text
 *  - t("doctors.years", { years: 12 })     -> replaces {years} in the text
 *  - missing key                           -> returns the KEY itself
 */
export function createTranslator(dict: Dictionary): TranslateFn {
  return (key, vars) => {
    const value = lookup(dict, key);

    if (value === undefined) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[i18n] Missing translation key: "${key}"`);
      }
      return key;
    }

    if (!vars) return value;

    return value.replace(/\{(\w+)\}/g, (_, name: string) =>
      name in vars ? String(vars[name]) : `{${name}}`,
    );
  };
}
