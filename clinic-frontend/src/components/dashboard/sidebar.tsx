"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, UserRound, ConciergeBell, FileText, Receipt, Boxes, FolderKanban, Landmark, ArrowLeftRight, Settings, Moon, ChevronLeft } from "lucide-react";
import { useI18n, useT } from "@/lib/i18n/i18n-provider";

const NAV = [
  ["dashboard", LayoutGrid, ""],
  ["clients", UserRound, "/clients"],
  ["services", ConciergeBell, "/services"],
  ["invoices", FileText, "/invoices"],
  ["expenses", Receipt, "/expenses"],
  ["inventory", Boxes, "/inventory"],
  ["projects", FolderKanban, "/projects"],
  ["accounts", Landmark, "/accounts"],
  ["transactions", ArrowLeftRight, "/transactions"],
] as const;

export function Sidebar() {
  const { locale, dir } = useI18n();
  const t = useT();
  const path = usePathname();
  const [cur, setCur] = useState("USD");
  const base = `/${locale}/dashboard`;

  return (
    <aside className="fd-sidebar" dir={dir}>
      <div className="flex items-center gap-3 px-1">
        <svg width="46" height="46" viewBox="0 0 48 48" aria-hidden>
          <defs><linearGradient id="fd-logo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b9bff" /><stop offset="1" stopColor="#a855f7" /></linearGradient></defs>
          <path d="M6 42C4 22 14 6 42 5c2 24-12 39-36 37z" fill="url(#fd-logo)" />
          <path d="M6 42C13 30 22 21 34 14" stroke="#fff" strokeOpacity=".55" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <div className="flex-1 leading-tight">
          <div className="text-[19px] font-semibold">{t("dashboard.sidebar.brand.name")}</div>
          <div className="text-[14px] text-[#8fa0c8]">{t("dashboard.sidebar.brand.caption")}</div>
        </div>
        <button aria-label={t("dashboard.sidebar.collapseAria")} className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(96,140,255,.3)] bg-[rgba(12,26,80,.6)] text-[#9db0e0]">
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>

      <div className="fd-seg mt-5" role="group" aria-label={t("dashboard.sidebar.currencyAria")}>
        {["USD", "AFN"].map((c) => <button key={c} data-on={cur === c} onClick={() => setCur(c)}>{c}</button>)}
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2.5 overflow-y-auto">
        {NAV.map(([key, Icon, suffix]) => {
          const href = `${base}${suffix}`;
          const on = suffix === "" ? path === href : path.startsWith(href);
          return (
            <Link key={key} href={href} className={`fd-item ${on ? "fd-item-on" : ""}`}>
              <span className={`grid h-10 w-10 place-items-center ${on ? "rounded-xl bg-white/15" : ""}`}>
                <Icon className="h-6 w-6" strokeWidth={1.7} />
              </span>
              <span>
                <span className="text-[16px] font-medium">{t(`dashboard.sidebar.nav.${key}.title`)}</span>
                <small>{t(`dashboard.sidebar.nav.${key}.subtitle`)}</small>
              </span>
            </Link>
          );
        })}
      </nav>

      <svg className="pointer-events-none absolute inset-x-0 bottom-16 opacity-70" viewBox="0 0 275 150" fill="none" aria-hidden>
        <defs><linearGradient id="fd-wave" x1="0" x2="1"><stop offset="0" stopColor="#2f7bff" /><stop offset="1" stopColor="#b44cff" /></linearGradient></defs>
        {[0, 12, 24, 36].map((o) => <path key={o} d={`M0 ${110 - o}C50 ${40 - o} 90 ${130 - o} 140 ${80 - o}S230 ${20 - o} 275 ${60 - o}`} stroke="url(#fd-wave)" strokeOpacity={0.55 - o / 100} strokeWidth="1.2" />)}
      </svg>

      <div className="relative flex items-center justify-between px-1 pt-3">
        <span className="flex items-center gap-3 text-[15px] text-[#dfe6ff]">
          <Settings className="h-6 w-6 text-[#9db0e0]" strokeWidth={1.7} />{t("dashboard.sidebar.settings")}
        </span>
        <button aria-label={t("dashboard.sidebar.themeAria")} className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(96,140,255,.3)] bg-[rgba(12,26,80,.7)] text-white">
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
