"use client";

import { useI18n } from "@/lib/i18n/i18n-provider";
import { useBooking } from "./booking-context";

export function SlotGrid() {
  const { t } = useI18n();
  const { daySlots, slot, selectSlot, fmt } = useBooking();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{t("booking.selectTime")}</h3>
      {daySlots.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("booking.noSlots")}</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {daySlots.map((s) => {
            const selected = s === slot;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={selected}
                onClick={() => selectSlot(s)}
                dir="ltr"
                className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors ${
                  selected
                    ? "gradient-surface text-primary-foreground"
                    : "glass hover:bg-secondary"
                }`}
              >
                {fmt.time.format(new Date(s))}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}