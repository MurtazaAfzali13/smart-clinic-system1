"use client";
import { useState } from "react";
import { Bell, Calendar, ChevronDown, Search, Sun, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n, useT } from "@/lib/i18n/i18n-provider";

const today = new Date(2026, 6, 28);
const dtFmt = (locale: string) => new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

export function Topbar() {
  const t = useT();
  const { locale } = useI18n();
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(59,130,246,.6)] bg-[rgba(30,80,200,.2)] px-3 py-1 text-[13px] text-[#5aa0ff]"><Sun className="h-4 w-4 text-[#ffc94d]" />{t("dashboard.topbar.greeting")}</span>
        <h1 className="mt-1 text-[42px] font-bold leading-tight tracking-tight">{t("dashboard.topbar.title")}</h1>
        <p className="text-[16px] text-[#c4d2f5]">{t("dashboard.topbar.subtitle")}</p>
      </div>
      <div className="flex flex-col items-end gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-[270px]">
            <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8fa0c8]" />
            <input placeholder={t("dashboard.topbar.searchPlaceholder")} aria-label={t("dashboard.topbar.searchPlaceholder")} className="fd-pill h-10 w-full rounded-full ps-10 pe-16 text-sm text-white outline-none placeholder:text-[#8fa0c8] focus:border-[#2f7bff]" />
            <kbd className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-[#8fa0c8]">⌘ K</kbd>
          </div>
          <button aria-label={t("dashboard.topbar.notificationsAria")} className="fd-pill relative grid h-10 w-10 place-items-center rounded-full"><Bell className="h-5 w-5" /><i className="absolute end-1 top-0 h-3 w-3 rounded-full bg-[#ff3ea5] shadow-[0_0_10px_#ff3ea5]" /></button>
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 ring-2 ring-[#2f7bff]/60 shadow-[0_0_18px_rgba(47,123,255,.7)]"><AvatarFallback className="bg-gradient-to-br from-[#2f7bff] to-[#1440c8] font-semibold text-white">MA</AvatarFallback></Avatar>
            <div className="leading-tight"><div className="text-sm font-semibold">Murtaza Afzali</div><div className="text-xs text-[#8fa0c8]">Administrator</div></div>
            <ChevronDown className="h-4 w-4 text-[#8fa0c8]" />
          </div>
        </div>
        <div className="fd-pill flex items-center gap-3 rounded-xl px-5 py-2.5 text-[17px]"><Calendar className="h-5 w-5 text-[#7fb0ff]" />{dtFmt(locale).format(today)}</div>
      </div>
    </header>
  );
}

export function DateFilter() {
  const t = useT();
  const { locale } = useI18n();
  const options = ["last7", "thisMonth", "thisYear", "custom"] as const;
  const [on, setOn] = useState<(typeof options)[number]>("thisMonth");
  return (
    <div className="fd-filter flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4d9bff" strokeWidth="1.8" strokeLinejoin="round" aria-hidden><path d="M3 4h18l-7 8.5V20l-4-2v-5.5z" /></svg>
      <span className="me-2 text-[15px] font-medium">{t("dashboard.dateFilter.label")}</span>
      {options.map((o) => <button key={o} className="fd-chip" data-on={on === o} onClick={() => setOn(o)}>{t(`dashboard.dateFilter.${o}`)}</button>)}
      <div className="fd-pill ms-auto flex items-center gap-3 rounded-full px-5 py-2 text-[15px]"><Clock className="h-5 w-5 text-[#9db0e0]" />{new Intl.DateTimeFormat(locale, { month: "2-digit", day: "2-digit" }).format(new Date(2026, 5, 30))} – {new Intl.DateTimeFormat(locale, { month: "2-digit", day: "2-digit", year: "numeric" }).format(today)}</div>
    </div>
  );
}
