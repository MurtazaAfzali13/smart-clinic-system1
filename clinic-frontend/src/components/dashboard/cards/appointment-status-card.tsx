"use client";
import { Activity } from "lucide-react";
import { useI18n, useT } from "@/lib/i18n/i18n-provider";
import { Donut } from "@/components/dashboard/charts";
import { Card, Head } from "@/components/dashboard/primitives";
import { useStatusBreakdown } from "@/features/dashboard/queries";

const STATUS = [
  { key: "completed", dot: "#22e58a", from: "#3dffa0", to: "#12c98a" },
  { key: "confirmed", dot: "#2f7bff", from: "#4d9bff", to: "#1f6bff" },
  { key: "pending",   dot: "#f5a524", from: "#ffb648", to: "#ff7a1a" },
  { key: "cancelled", dot: "#b44cff", from: "#c96bff", to: "#9a3cff" },
  { key: "no_show",   dot: "#8a9bd0", from: "#a3b2e0", to: "#6f80b8" },
] as const;

export function AppointmentStatusCard() {
  const t = useT();
  const { locale } = useI18n();
  const { data, isLoading, isError, refetch } = useStatusBreakdown();
  const nf = new Intl.NumberFormat(locale);

  const counts = new Map((data ?? []).map((r) => [r.status, r.total]));
  const items = STATUS.map((s) => ({ ...s, count: counts.get(s.key) ?? 0 }));
  const total = items.reduce((a, i) => a + i.count, 0);
  const box = "mt-3 grid h-[190px] place-items-center text-[14px] text-[#8fa0c8]";

  return (
    <Card className="h-[285px] !rounded-3xl">
      <Head Icon={Activity} title={t("dashboard.charts.appointmentStatus")} />
      {isLoading ? (
        <div className="mt-3 h-[190px] animate-pulse rounded-xl bg-white/5" />
      ) : isError ? (
        <div className={box}>
          <div className="text-center">{t("dashboard.common.error")}
            <button onClick={() => refetch()} className="fd-pill ms-3 rounded-lg px-3 py-1 text-[12px] text-white">{t("dashboard.common.retry")}</button>
          </div>
        </div>
      ) : total === 0 ? (
        <div className={box}>{t("dashboard.common.empty")}</div>
      ) : (
        <div className="mt-3 flex items-center gap-5">
          <Donut id="st" size={170} stroke={22} gap={5} segs={items.filter((i) => i.count > 0).map((i) => ({ value: i.count, from: i.from, to: i.to }))}>
            <div>
              <div className="text-[24px] font-bold tabular-nums">{nf.format(total)}</div>
              <div className="mt-1 text-[12px]">{t("dashboard.charts.totalAppointments")}</div>
            </div>
          </Donut>
          <ul className="flex-1 space-y-2.5">
            {items.map((i) => (
              <li key={i.key} className="flex items-center gap-2.5 text-[13px]">
                <i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: i.dot, boxShadow: `0 0 8px ${i.dot}` }} />
                <span className="flex-1">{t(`dashboard.status.${i.key}`)}</span>
                <b className="font-semibold tabular-nums">{nf.format(i.count)}</b>
                <span className="w-10 text-end tabular-nums text-[#8fa0c8]">{Math.round((i.count / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}