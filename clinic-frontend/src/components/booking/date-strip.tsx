"use client";

import { useI18n } from "@/lib/i18n/i18n-provider";
import { useBooking } from "./booking-context";

export function DateStrip() {
  const { t } = useI18n();
  const { days, date, selectDate, fmt, isDayDisabled } = useBooking();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("booking.selectDate")}</h3>
        <span className="text-xs text-muted-foreground">
          {fmt.monthYear.format(fmt.toDate(date))}
        </span>
      </div>
      <div role="radiogroup" className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const disabled = isDayDisabled(d);
          const selected = d.date === date;
          const dt = fmt.toDate(d.date);
          return (
            <button
              key={d.date}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              title={d.closed ? t("booking.closedDay") : undefined}
              onClick={() => selectDate(d.date)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 transition-colors ${
                selected ? "gradient-surface text-primary-foreground" : "glass hover:bg-secondary"
              } ${disabled ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""}`}
            >
              <span className="text-[11px] opacity-80">{fmt.weekday.format(dt)}</span>
              <span className="text-base font-bold">{fmt.day.format(dt)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}