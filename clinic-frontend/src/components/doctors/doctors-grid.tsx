"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { formatNumber, type Doctor } from "@/lib/doctors/types";
import { DoctorCard } from "./doctor-card";

/** شماره‌ی صفحه‌ها با «…» وقتی تعداد زیاد است، مثل: 1 … 4 5 6 … 12 */
function pageItems(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("gap");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("gap");
  items.push(total);
  return items;
}

const btnBase =
  "flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export function DoctorsGrid({
  doctors,
  pageSize = 4,
}: {
  doctors: Doctor[];
  pageSize?: number;
}) {
  const { locale, t } = useI18n();
  const topRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const size = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(doctors.length / size));
  const current = Math.min(page, totalPages); // اگر لیست کوتاه شد، صفحه از دامنه بیرون نزند
  const visible = doctors.slice((current - 1) * size, current * size);

  const goTo = (p: number) => {
    setPage(p);
    // اگر ابتدای لیست بالاتر از صفحه‌ی دیده‌شده است (مثلاً موبایل)، به ابتدای لیست برگرد
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (doctors.length === 0) {
    return <p className="rounded-2xl bg-secondary/50 p-6 text-sm">{t("doctors.empty")}</p>;
  }

  return (
    <div>
      <div
        ref={topRef}
        className="grid scroll-mt-28 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {visible.map((d) => (
          <DoctorCard key={d.id} doctor={d} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label={t("doctors.pagination.label")}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            disabled={current === 1}
            aria-label={t("doctors.pagination.prev")}
            className={`${btnBase} glass hover:bg-secondary`}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </button>

          {pageItems(current, totalPages).map((item, i) =>
            item === "gap" ? (
              <span key={`gap-${i}`} aria-hidden className="px-1 text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => goTo(item)}
                aria-label={`${t("doctors.pagination.page")} ${formatNumber(item, locale)}`}
                aria-current={item === current ? "page" : undefined}
                className={`${btnBase} ${
                  item === current
                    ? "gradient-surface text-primary-foreground"
                    : "glass hover:bg-secondary"
                }`}
              >
                {formatNumber(item, locale)}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current === totalPages}
            aria-label={t("doctors.pagination.next")}
            className={`${btnBase} glass hover:bg-secondary`}
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </nav>
      )}
    </div>
  );
}