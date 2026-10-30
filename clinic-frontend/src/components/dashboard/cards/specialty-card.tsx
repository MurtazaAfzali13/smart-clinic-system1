"use client";
import { useCallback } from "react";
import { Layers } from "lucide-react";
import { useI18n, useT } from "@/lib/i18n/i18n-provider";
import { Donut } from "@/components/dashboard/charts";
import { Card, Head } from "@/components/dashboard/primitives";
import { useAppointmentBreakdown, type BreakdownRow } from "@/features/dashboard/queries";
import { selectBreakdown } from "@/features/dashboard/selectors";

const PALETTE = [
  { dot: "#22e58a", from: "#3dffa0", to: "#12c98a" },
  { dot: "#2f7bff", from: "#4d9bff", to: "#1f6bff" },
  { dot: "#f5a524", from: "#ffb648", to: "#ff7a1a" },
  { dot: "#b44cff", from: "#c96bff", to: "#9a3cff" },
  { dot: "#8a9bd0", from: "#a3b2e0", to: "#6f80b8" },
];

export function SpecialtyCard() {
  const t = useT();
  const { locale } = useI18n();
  const fa = locale.startsWith("fa");
  const select = useCallback((rows: BreakdownRow[]) => selectBreakdown(rows, fa), [fa]);
  const { data, isLoading, isError, refetch } = useAppointmentBreakdown(select);
  const nf = new Intl.NumberFormat(locale);
  const pf = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 });
  const box = "mt-4 grid h-[170px] place-items-center text-[14px] text-[#8fa0c8]";

  // بیش از یک تخصص: تفکیک تخصص. در غیر این صورت: نوع مراجعه
  const bySpecialty = (data?.specialties.length ?? 0) > 1;
  let items: { key: string; label: string; count: number }[] = [];
  if (data) {
    if (bySpecialty) {
      items = data.specialties.slice(0, 4).map((s) => ({ key: s.key, label: s.name || t("dashboard.common.unspecified"), count: s.total }));
      const rest = data.specialties.slice(4).reduce((a, s) => a + s.total, 0);
      if (rest > 0) items.push({ key: "other", label: t("dashboard.charts.other"), count: rest });
    } else {
      items = [
        { key: "first", label: t("dashboard.charts.firstVisit"), count: data.first },
        { key: "follow", label: t("dashboard.charts.followUp"), count: data.followUp },
      ];
    }
  }
  const total = data?.total ?? 0;
  const colored = items.map((i, idx) => ({ ...i, ...PALETTE[idx % PALETTE.length] }));

  return (
    <Card className="h-[288px]">
      <Head Icon={Layers} title={t(bySpecialty ? "dashboard.charts.bySpecialty" : "dashboard.charts.byVisitType")} />
      {isLoading ? (
        <div className="mt-4 h-[170px] animate-pulse rounded-xl bg-white/5" />
      ) : isError ? (
        <div className={box}>
          <div className="text-center">{t("dashboard.common.error")}
            <button onClick={() => refetch()} className="fd-pill ms-3 rounded-lg px-3 py-1 text-[12px] text-white">{t("dashboard.common.retry")}</button>
          </div>
        </div>
      ) : total === 0 ? (
        <div className={box}>{t("dashboard.common.empty")}</div>
      ) : (
        <div className="mt-4 flex items-center gap-4">
          <Donut id="sp" size={170} stroke={22} gap={5} segs={colored.filter((i) => i.count > 0).map((i) => ({ value: i.count, from: i.from, to: i.to }))}>
            <div>
              <div className="text-[20px] font-bold tabular-nums">{nf.format(total)}</div>
              <div className="text-[11px]">{t("dashboard.charts.totalAppointments")}</div>
            </div>
          </Donut>
          <ul className="min-w-0 flex-1 space-y-2.5">
            {colored.map((i) => (
              <li key={i.key} className="flex items-center gap-2.5 text-[13px]">
                <i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: i.dot, boxShadow: `0 0 8px ${i.dot}` }} />
                <span className="min-w-0 flex-1 truncate">{i.label}</span>
                <b className="font-semibold tabular-nums">{nf.format(i.count)}</b>
                <span className="w-10 text-end tabular-nums text-[#8fa0c8]">{pf.format(i.count / total)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}