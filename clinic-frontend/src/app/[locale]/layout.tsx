import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, localeDirection, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { createTranslator } from "@/lib/i18n/translate";
import { SiteNavbar } from "@/components/HomePage/site-navbar";
import "../globals.css";


type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = createTranslator(await getDictionary(locale));
  return { title: t("meta.title"), description: t("meta.description") };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);

  const fontFamily = locale === "fa" ? "Vazirmatn, sans-serif" : "Inter, sans-serif";

  
  return (
    <html lang={locale} dir={localeDirection[locale]}>
      <body 
        className="antialiased bg-background text-foreground"
        style={{ fontFamily }}
      >
        <I18nProvider locale={locale} dictionary={dictionary}>
          <SiteNavbar />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}