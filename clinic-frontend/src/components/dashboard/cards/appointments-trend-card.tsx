"use client";
import { CalendarCheck } from "lucide-react";
import { useI18n, useT } from "@/lib/i18n/i18n-provider";
import { AreaChart } from "@/components/dashboard/charts";
import { Card, Head } from "@/components/dashboard/primitives";
import { useDashboardFilter } from "@/features/dashboard/filter";
import { useAppointmentsTrend } from "@/features/dashboard/queries";
import { pickLabels } from "@/features/dashboard/format";

const TOTAL = "#2f7bff", COMPLETED = "#22e58a", CANCELLED = "#b44cff";

export function AppointmentsTrendCard() {
  const t = useT();
  const { locale } = useI18n();
  const { range } = useDashboardFilter();
  const { data, isLoading, isError, refetch } = useAppointmentsTrend();
  const nf = new Intl.NumberFormat(locale);
  const sum = (k: "total" | "completed" | "cancelled") => (data ?? []).reduce((a, r) => a + r[k], 0);
  const hasData = sum("total") > 0;
  const box = "mt-4 grid h-[190px] place-items-center text-[14px] text-[#8fa0c8]";

  const items = [
    { key: "total", color: TOTAL },
    { key: "completed", color: COMPLETED },
    { key: "cancelled", color: CANCELLED },
  ] as const;

  const legend = (
    <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
      {items.map((i) => (
        <span key={i.key} className="flex items-center gap-2">
          <i className="h-3 w-3 rounded-full" style={{ background: i.color, boxShadow: `0 0 8px ${i.color}` }} />
          {t(`dashboard.charts.${i.key}`)}
          <b className="font-semibold tabular-nums">{nf.format(sum(i.key))}</b>
        </span>
      ))}
    </div>
  );

  return (
    <Card className="h-[285px] !rounded-3xl">
      <Head Icon={CalendarCheck} title={t("dashboard.charts.appointmentsTrend")} right={legend} />
      {isLoading ? (
        <div className="mt-4 h-[190px] animate-pulse rounded-xl bg-white/5" />
      ) : isError ? (
        <div className={box}>
          <div className="text-center">{t("dashboard.common.error")}
            <button onClick={() => refetch()} className="fd-pill ms-3 rounded-lg px-3 py-1 text-[12px] text-white">{t("dashboard.common.retry")}</button>
          </div>
        </div>
      ) : !hasData ? (
        <div className={box}>{t("dashboard.common.empty")}</div>
      ) : (
        <div dir="ltr">
          <AreaChart
            ariaLabel={t("dashboard.charts.appointmentsTrend")}
            formatTick={(n) => nf.format(n)}
            labels={pickLabels(data!.map((r) => r.bucket), locale, range.bucket)}
            series={[
              { values: data!.map((r) => r.total), color: TOTAL, id: "ar-total", opacity: 0.35 },
              { values: data!.map((r) => r.completed), color: COMPLETED, id: "ar-ok", opacity: 0.3 },
              { values: data!.map((r) => r.cancelled), color: CANCELLED, id: "ar-c", opacity: 0.3 },
            ]}
          />
        </div>
      )}
    </Card>
  );
}