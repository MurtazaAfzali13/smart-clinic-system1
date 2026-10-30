"use client";
import { CalendarDays } from "lucide-react";
import { useI18n, useT } from "@/lib/i18n/i18n-provider";
import { BarChart } from "@/components/dashboard/charts";
import { Card, Head } from "@/components/dashboard/primitives";
import { useDashboardFilter } from "@/features/dashboard/filter";
import { useAppointmentsByWeekday } from "@/features/dashboard/queries";

export function WeekdayCard() {
  const t = useT();
  const { locale } = useI18n();
  const { state } = useDashboardFilter();
  const { data, isLoading, isError, refetch } = useAppointmentsByWeekday();
  const nf = new Intl.NumberFormat(locale);
  const box = "mt-4 grid h-[150px] place-items-center text-[14px] text-[#8fa0c8]";

  const order = locale.startsWith("fa") ? [6, 0, 1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 0];
  const wd = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const label = (d: number) => wd.format(new Date(Date.UTC(2024, 0, 7 + d))); // 2024-01-07 یکشنبه است

  const values = data ?? [0, 0, 0, 0, 0, 0, 0];
  const max = Math.max(...values);
  const top = values.indexOf(max);
  const bars = order.map((d) => ({ key: String(d), label: label(d), value: values[d], highlight: max > 0 && d === top }));

  return (
    <Card className="h-[288px]">
      <Head
        Icon={CalendarDays}
        title={t("dashboard.charts.byWeekday")}
        right={<span className="fd-pill rounded-lg px-3 py-1.5 text-[12px]">{t(`dashboard.dateFilter.${state.preset}`)}</span>}
      />
      {isLoading ? (
        <div className="mt-4 h-[150px] animate-pulse rounded-xl bg-white/5" />
      ) : isError ? (
        <div className={box}>
          <div className="text-center">{t("dashboard.common.error")}
            <button onClick={() => refetch()} className="fd-pill ms-3 rounded-lg px-3 py-1 text-[12px] text-white">{t("dashboard.common.retry")}</button>
          </div>
        </div>
      ) : max === 0 ? (
        <div className={box}>{t("dashboard.common.empty")}</div>
      ) : (
        <BarChart bars={bars} ariaLabel={t("dashboard.charts.byWeekday")} formatValue={(n) => nf.format(n)} />
      )}
    </Card>
  );
}