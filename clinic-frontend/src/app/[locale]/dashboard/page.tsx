"use client";
import type { ReactNode, ComponentType } from "react";
import { ArrowUp, ArrowDown, ArrowRight, ChevronDown, ChevronsUp, Users, Activity, Coins, Layers, FileText } from "lucide-react";
import { useT } from "@/lib/i18n/i18n-provider";
import { Topbar, DateFilter } from "@/components/dashboard/topbar";
import { Sparkline, AreaChart, Donut } from "@/components/dashboard/charts";
import { kpis, xLabels, revenue, expenses, cashFlow, expenseBreakdown, projects, transactions } from "@/components/dashboard/data";

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => <section className={`fd-glass rounded-[20px] p-5 ${className}`}>{children}</section>;
const Head = ({ Icon, title, right }: { Icon: ComponentType<{ className?: string }>; title: string; right?: ReactNode }) => (
  <div className="flex items-center gap-3"><span className="fd-badge"><Icon className="h-[18px] w-[18px]" /></span><h2 className="flex-1 text-[17px] font-semibold">{title}</h2>{right}</div>
);
const Legend = ({ items }: { items: { label: string; amount: string; pct: number; dot: string }[] }) => (
  <ul className="flex-1 space-y-3">
    {items.map((i) => (
      <li key={i.label} className="flex items-start gap-3">
        <i className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: i.dot, boxShadow: `0 0 10px ${i.dot}` }} />
        <div className="leading-tight"><div className="text-[14px] text-[#e6ecff]">{i.label}</div><div className="mt-0.5 text-[15px] font-semibold tabular-nums">{i.amount} <span className="ml-1 text-[13px] font-normal text-[#8fa0c8]">{i.pct}%</span></div></div>
      </li>
    ))}
  </ul>
);

export default function DashboardPage() {
  const t = useT();
  const cf = cashFlow.map((s, i) => ({ ...s, label: t(`dashboard.charts.${["operating", "investing", "financing"][i]}`) }));
  const eb = expenseBreakdown.map((s) => ({ ...s })); // labels come from data.ts (Materials/Labor/...) — add dashboard.expenseCategories.* keys if these need translating too

  return (
    <div className="space-y-5">
      <Topbar />
      <DateFilter />

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
        <Card className="h-[285px] !rounded-3xl">
          <Head Icon={Users} title={t("dashboard.charts.revenueVsExpenses")} right={<div className="flex gap-6 text-[14px]"><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#22e58a] shadow-[0_0_8px_#22e58a]" />{t("dashboard.charts.revenue")}</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#b44cff] shadow-[0_0_8px_#b44cff]" />{t("dashboard.charts.expenses")}</span></div>} />
          <AreaChart labels={xLabels} series={[{ values: expenses, color: "#c04dff", id: "ar-e" }, { values: revenue, color: "#22e58a", id: "ar-r" }]} />
        </Card>
        <Card className="h-[285px] !rounded-3xl">
          <Head Icon={Activity} title={t("dashboard.charts.cashFlow")} />
          <div className="mt-3 flex items-center gap-5">
            <Donut id="cf" segs={cf.map((s) => ({ value: s.pct, from: s.from, to: s.to }))}>
              <div><div className="text-[24px] font-bold tabular-nums">$56,130</div><div className="mt-1 flex items-center justify-center gap-1 text-[12px]">{t("dashboard.charts.netCashFlow")}<ChevronsUp className="h-3 w-3 text-[#22e58a]" /></div></div>
            </Donut>
            <Legend items={cf} />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[394fr_372fr_363fr]">
        <Card className="h-[288px]">
          <Head Icon={Coins} title={t("dashboard.charts.incomeByProject")} right={<button className="fd-pill flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px]">{t("dashboard.dateFilter.thisMonth")}<ChevronDown className="h-3.5 w-3.5" /></button>} />
          <div className="relative ms-11 mt-4 h-[150px]">
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="absolute inset-x-0 border-t border-dashed border-white/[.07]" style={{ top: `${i * 20}%` }}><span className="absolute -start-11 w-9 -translate-y-1/2 text-end text-[12px] text-[#8fa0c8]">{i === 5 ? "0" : `${50 - i * 10}K`}</span></div>)}
            <div className="absolute inset-0 flex items-end">
              {projects.map((p) => <div key={p.name} className="flex w-1/5 justify-center"><div className="w-[38px] rounded-t-md" style={{ height: `${(p.v / 50) * 150}px`, background: "purple" in p ? "linear-gradient(180deg,#c26bff,#8a3cff)" : "linear-gradient(180deg,#1aa6ff,#1f5bff)", boxShadow: "purple" in p ? "0 0 16px rgba(180,76,255,.5)" : "0 0 16px rgba(47,123,255,.5)" }} /></div>)}
            </div>
          </div>
          <div className="ms-11 mt-2 flex">{projects.map((p) => <span key={p.name} className="w-1/5 text-center text-[11px] leading-[14px] text-[#c4d2f5]">{p.name}</span>)}</div>
        </Card>

        <Card className="h-[288px]">
          <Head Icon={Layers} title={t("dashboard.charts.expenseBreakdown")} />
          <div className="mt-4 flex items-center gap-4">
            <Donut id="eb" size={170} stroke={22} gap={5} segs={eb.map((s) => ({ value: s.pct, from: s.from, to: s.to }))}>
              <div><div className="text-[20px] font-bold tabular-nums">$68,430</div><div className="text-[11px]">{t("dashboard.charts.totalExpenses")}</div></div>
            </Donut>
            <ul className="flex-1 space-y-2.5">
              {eb.map((i) => (
                <li key={i.label} className="flex items-start gap-2.5"><i className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: i.dot, boxShadow: `0 0 8px ${i.dot}` }} />
                  <div className="leading-tight"><div className="text-[13px]">{i.label}</div><div className="text-[13px] font-semibold tabular-nums">{i.amount} <span className="font-normal text-[#8fa0c8]">({i.pct}%)</span></div></div></li>
              ))}
            </ul>
          </div>
        </Card>

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
