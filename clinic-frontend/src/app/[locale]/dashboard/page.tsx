"use client";
import { ArrowUp, ArrowDown, ArrowRight, ChevronsUp, FileText } from "lucide-react";
import { useT } from "@/lib/i18n/i18n-provider";
import { Topbar, DateFilter } from "@/components/dashboard/topbar";
import { Sparkline } from "@/components/dashboard/charts";
import { Card, Head } from "@/components/dashboard/primitives";
import { DashboardScope } from "@/components/dashboard/scope-bar";
import { AppointmentsTrendCard } from "@/components/dashboard/cards/appointments-trend-card";
import { AppointmentStatusCard } from "@/components/dashboard/cards/appointment-status-card";
import { QueryProvider } from "@/providers/query-provider";
import { DashboardFilterProvider } from "@/features/dashboard/filter";
import { kpis, transactions } from "@/components/dashboard/data";

import { WeekdayCard } from "@/components/dashboard/cards/weekday-card";
import { SpecialtyCard } from "@/components/dashboard/cards/specialty-card";

export default function DashboardPage() {
  return (
    <QueryProvider>
      <DashboardFilterProvider>
        <DashboardContent />
      </DashboardFilterProvider>
    </QueryProvider>
  );
}

function DashboardContent() {
  const t = useT();

  return (
    <div className="space-y-5">
      <Topbar />
      <DateFilter />
      <DashboardScope />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.key} data-t={k.t} className="fd-kpi relative h-[166px] overflow-hidden rounded-2xl p-4">
            <div className="flex items-center gap-3"><span className="fd-kpi-ico"><k.Icon className="h-5 w-5" /></span><span className="flex-1 text-[15px]">{t(`dashboard.kpi.${k.key}`)}</span><span className="fd-kpi-corner"><k.Corner className="h-4 w-4" /></span></div>
            <div className="mt-2 text-[31px] font-semibold tabular-nums [text-shadow:0_0_18px_rgba(255,255,255,.25)]">{k.value}</div>
            <div className="relative z-10 flex items-center gap-2 text-[15px]">
              {"noteCount" in k ? <span className="text-[#f3f6ff]">{k.noteCount} {t("dashboard.kpi.invoices")}</span> : <><b style={{ color: k.dc }}>{k.delta}</b>{k.up ? <ArrowUp className="h-4 w-4" style={{ color: k.dc }} /> : <ArrowDown className="h-4 w-4" style={{ color: k.dc }} />}<span className="text-[#c4d2f5]">{t("dashboard.kpi.vsLastMonth")}</span></>}
            </div>
            <div className="absolute inset-x-3 bottom-2 h-[50px]"><Sparkline id={`sp-${k.t}`} values={[...k.spark]} color={k.color} /></div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.52fr)_minmax(0,1fr)]">
        <AppointmentsTrendCard />
        <AppointmentStatusCard />
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[394fr_372fr_363fr]">
        <WeekdayCard />
        <SpecialtyCard />

        <Card className="h-[288px]">
          <Head Icon={FileText} title={t("dashboard.transactions.title")} right={<a href="./transactions" className="flex items-center gap-1 text-[12px] text-[#4d9bff]">{t("dashboard.transactions.viewAll")}<ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" /></a>} />
          <ul className="mt-3 divide-y divide-white/[.07]">
            {transactions.map((tr) => (
              <li key={tr.title} className="flex items-center gap-3 py-2">
                <span className={`grid h-9 w-9 place-items-center rounded-lg border ${tr.in ? "border-[#22e58a]/30 bg-[#22e58a]/10 text-[#22e58a]" : "border-[#ff4d6d]/30 bg-[#ff4d6d]/10 text-[#ff4d6d]"}`}>{tr.in ? <ChevronsUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}</span>
                <div className="min-w-0 flex-1 leading-tight"><div className="truncate text-[13px]">{tr.title}</div><div className="text-[11px] text-[#8fa0c8]">{tr.date}</div></div>
                <div className="text-end leading-tight"><div className={`text-[14px] font-semibold tabular-nums ${tr.in ? "text-[#22e58a]" : "text-[#ff4d6d]"}`}>{tr.amount}</div><div className={`text-[12px] ${tr.in ? "text-[#22e58a]" : "text-[#f5a524]"}`}>{t(`dashboard.transactions.${tr.status === "Paid" ? "paid" : "expected"}`)}</div></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}