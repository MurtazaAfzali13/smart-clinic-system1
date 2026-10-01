"use client";

import { Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { STATUS_BORDER, STATUS_DOT } from "@/lib/appointments/status-styles";
import type { SlotInfo } from "@/lib/doctors/types";
import { useBooking } from "./booking-context";

/** نمای پزشک: ساعت رزروشده با نام بیمار، وضعیت و وضعیت پرداخت */
function OwnerSlot({ slot }: { slot: SlotInfo }) {
  const { t } = useI18n();
  const b = useBooking();
  const time = b.fmt.time.format(new Date(slot.startsAt));
  const appt = b.appointmentAt(slot.startsAt);

  if (!appt) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground/70"
      >
        <span dir="ltr">{time}</span>
        <span className="text-[11px]">{t("doctorView.freeSlot")}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => b.openAppointment(appt.id)}
      className={`rounded-xl border px-3 py-2 text-start transition-colors hover:bg-secondary ${
        STATUS_BORDER[appt.status] ?? "border-border"
      }`}
    >
      <span dir="ltr" className="block text-sm font-bold">{time}</span>
      <span className="block truncate text-xs">
        {appt.patient?.fullName || t("doctorView.unknownPatient")}
      </span>
      <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className={`size-2 rounded-full ${STATUS_DOT[appt.status] ?? "bg-muted"}`} />
        {t(`dashboard.status.${appt.status}`)}
        <span className={appt.isFeePaid ? "text-emerald-500" : "text-amber-500"}>
          · {appt.isFeePaid ? t("doctorView.paid") : t("doctorView.unpaid")}
        </span>
      </span>
    </button>
  );
}

export function SlotGrid() {
  const { t } = useI18n();
  const b = useBooking();
  const { daySlots, slot, selectSlot, fmt, isOwner } = b;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">
        {isOwner ? t("doctorView.scheduleTitle") : t("booking.selectTime")}
      </h3>

      {daySlots.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("booking.noSlots")}</p>
      ) : (
        <div className={`grid gap-2 ${isOwner ? "grid-cols-2" : "grid-cols-3 sm:grid-cols-4"}`}>
          {daySlots.map((s) => {
            if (isOwner) return <OwnerSlot key={s.startsAt} slot={s} />;

            const time = fmt.time.format(new Date(s.startsAt));

            // ساعت رزروشده: قفل، بدون هیچ اطلاعاتی از بیمار
            if (s.booked) {
              return (
                <button
                  key={s.startsAt}
                  type="button"
                  disabled
                  aria-disabled="true"
                  title={t("booking.slotBooked")}
                  dir="ltr"
                  className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-dashed border-border px-2 py-2.5 text-sm font-semibold text-muted-foreground/60"
                >
                  <Lock className="size-3.5" aria-hidden />
                  {time}
                  <span className="sr-only">{t("booking.slotBooked")}</span>
                </button>
              );
            }

            const selected = s.startsAt === slot;
            return (
              <button
                key={s.startsAt}
                type="button"
                aria-pressed={selected}
                onClick={() => selectSlot(s.startsAt)}
                dir="ltr"
                className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition-colors ${
                  selected ? "gradient-surface text-primary-foreground" : "glass hover:bg-secondary"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}