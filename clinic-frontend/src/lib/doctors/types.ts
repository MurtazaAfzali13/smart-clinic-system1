export type Doctor = {
  id: string;
  slug: string;
  first_name_fa: string;
  last_name_fa: string;
  first_name_en: string;
  last_name_en: string;
  title_fa: string | null;
  title_en: string | null;
  bio_fa: string | null;
  bio_en: string | null;
  qualifications_fa: string | null;
  qualifications_en: string | null;
  photo_url: string | null;
  years_of_experience: number | null;
  languages: string[];
  consultation_fee: number | null;
  currency: string;
  slot_duration_minutes: number;
  is_accepting_appointments: boolean;
  specialty: { slug: string; name_fa: string; name_en: string } | null;
};

/** date = روز تقویمی در منطقه‌ی زمانی کلینیک (YYYY-MM-DD)، slots = ISO شروع نوبت‌ها */
export type DaySlots = { date: string; slots: string[] };

export type BookingAccess = "guest" | "needs_profile" | "not_patient" | "ready";

/**
 * برای فارسی از fa-AF استفاده می‌کنیم؛ تقویم پیش‌فرض آن معمولاً شمسی است.
 * اگر تقویم میلادی می‌خواهی بنویس: "fa-AF-u-ca-gregory"
 */
export const intlLocaleOf = (locale: string) => (locale === "fa" ? "fa-AF" : "en-US");

export const formatNumber = (n: number, locale: string) =>
  new Intl.NumberFormat(intlLocaleOf(locale)).format(n);

export function formatFee(fee: number | null, currency: string, locale: string) {
  if (fee == null) return null;
  return new Intl.NumberFormat(intlLocaleOf(locale), {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(fee);
}

const pick = (locale: string, fa: string | null, en: string | null) =>
  (locale === "fa" ? fa : en) ?? "";

export function doctorName(d: Doctor, locale: string) {
  const parts =
    locale === "fa"
      ? [d.title_fa, d.first_name_fa, d.last_name_fa]
      : [d.title_en, d.first_name_en, d.last_name_en];
  return parts.filter(Boolean).join(" ");
}

export const specialtyName = (d: Doctor, locale: string) =>
  d.specialty ? pick(locale, d.specialty.name_fa, d.specialty.name_en) : "";
export const doctorBio = (d: Doctor, locale: string) => pick(locale, d.bio_fa, d.bio_en);
export const doctorQualifications = (d: Doctor, locale: string) =>
  pick(locale, d.qualifications_fa, d.qualifications_en);