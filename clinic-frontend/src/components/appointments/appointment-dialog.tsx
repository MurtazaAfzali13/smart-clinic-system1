"use client";

import { useActionState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { updateAppointmentAction } from "@/lib/appointments/actions";
import { STATUS_BADGE } from "@/lib/appointments/status-styles";
import type { DoctorActionState, DoctorAppointment } from "@/lib/appointments/types";
import { formatFee, formatNumber, intlLocaleOf } from "@/lib/doctors/types";
import { optionLabel } from "@/lib/patients/labels";

type Props = {
  appointment: DoctorAppointment | null;
  doctorSlug: string;
  timeZone: string;
  currency: string;
  onClose: () => void;
};

export function AppointmentDialog({ appointment, onClose, ...rest }: Props) {
  const { dir } = useI18n();
  return (
    <Dialog open={!!appointment} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent dir={dir} className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        {appointment && <AppointmentDetails key={appointment.id} appointment={appointment} {...rest} />}
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value, ltr }: { label: string; value?: string | null; ltr?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium" dir={ltr ? "ltr" : undefined}>
        {value || "—"}
      </dd>
    </div>
  );
}

function Chips({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm">—</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((i, idx) => (
            <span key={`${i}-${idx}`} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
              {i}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AppointmentDetails({
  appointment: a,
  doctorSlug,
  timeZone,
  currency,
}: Omit<Props, "appointment" | "onClose"> & { appointment: DoctorAppointment }) {
  const { locale, t } = useI18n();
  const intl = intlLocaleOf(locale);
  const [state, formAction, pending] = useActionState(updateAppointmentAction, {} as DoctorActionState);

  const dateTime = useMemo(
    () =>
      new Intl.DateTimeFormat(intl, {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone,
      }),
    [intl, timeZone],
  );

  const p = a.patient;
  const active = a.status === "pending" || a.status === "confirmed";
  const fee = formatFee(a.feeAmount, a.feeCurrency ?? currency, locale);
  const name = p?.fullName || t("doctorView.unknownPatient");
  const ask = (key: string) => (e: React.MouseEvent) => {
    if (!window.confirm(t(key))) e.preventDefault();
  };

  const btn = "rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50";

  return (
    <>
      <DialogHeader>
        <DialogTitle>{name}</DialogTitle>
        <DialogDescription>{dateTime.format(new Date(a.startAt))}</DialogDescription>
      </DialogHeader>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[a.status] ?? "bg-muted"}`}
      >
        {t(`dashboard.status.${a.status}`)}
      </span>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-primary">{t("doctorView.patientInfo")}</h3>
        <dl className="grid grid-cols-2 gap-3">
          <Info label={t("doctorView.phone")} value={p?.phone} ltr />
          <Info
            label={t("doctorView.age")}
            value={p?.age != null ? `${formatNumber(p.age, locale)} ${t("doctorView.years")}` : null}
          />
          <Info label={t("doctorView.gender")} value={optionLabel(t, "gender", p?.gender)} />
          <Info label={t("doctorView.bloodType")} value={optionLabel(t, "blood", p?.bloodType)} />
          <Info label={t("doctorView.city")} value={p?.city} />
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-primary">{t("doctorView.visitInfo")}</h3>
        <dl className="grid grid-cols-2 gap-3">
          <Info
            label={t("booking.visitType")}
            value={a.isFirstVisit ? t("booking.firstVisit") : t("booking.followUp")}
          />
          <Info label={t("booking.symptomDuration")} value={a.symptomDuration} />
        </dl>
        <Info label={t("booking.reason")} value={a.reason} />
        <Info label={t("booking.symptoms")} value={a.symptoms} />
        <Info label={t("booking.notes")} value={a.patientNotes} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-primary">{t("doctorView.medicalAlerts")}</h3>
        <Chips title={t("doctorView.allergies")} items={p?.allergies ?? []} />
        <Chips title={t("doctorView.conditions")} items={p?.conditions ?? []} />
        <Chips title={t("doctorView.medications")} items={p?.medications ?? []} />
      </section>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="doctorSlug" value={doctorSlug} />
        <input type="hidden" name="appointmentId" value={a.id} />

        <section className="space-y-3 rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{t("doctorView.feeTitle")}</p>
              <p className="text-lg font-extrabold">{fee ?? "—"}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                a.isFeePaid ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
              }`}
            >
              {a.isFeePaid ? t("doctorView.paid") : t("doctorView.unpaid")}
            </span>
          </div>
          {a.status !== "no_show" && (
            <button
              type="submit"
              name="intent"
              value={a.isFeePaid ? "unpaid" : "paid"}
              disabled={pending}
              className={`${btn} border border-border hover:bg-secondary`}
            >
              {a.isFeePaid ? t("doctorView.markUnpaid") : t("doctorView.markPaid")}
            </button>
          )}
        </section>

        {state.error && (
          <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
            {t(state.error)}
          </p>
        )}

        {active ? (
          <div className="flex flex-wrap gap-2">
            {a.status === "pending" && (
              <button
                type="submit"
                name="intent"
                value="confirm"
                disabled={pending}
                className={`${btn} bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25`}
              >
                {t("doctorView.confirm")}
              </button>
            )}
            <button
              type="submit"
              name="intent"
              value="complete"
              disabled={pending}
              onClick={a.isFeePaid ? undefined : ask("doctorView.completeUnpaidConfirm")}
              className={`${btn} gradient-surface text-primary-foreground`}
            >
              {t("doctorView.complete")}
            </button>
            <button
              type="submit"
              name="intent"
              value="no_show"
              disabled={pending}
              onClick={ask("doctorView.confirmNoShow")}
              className={`${btn} border border-red-500/40 text-red-500 hover:bg-red-500/10`}
            >
              {t("doctorView.noShow")}
            </button>
            <button
              type="submit"
              name="intent"
              value="cancel"
              disabled={pending}
              onClick={ask("doctorView.confirmCancel")}
              className={`${btn} border border-red-500/40 text-red-500 hover:bg-red-500/10`}
            >
              {t("doctorView.cancelAppt")}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("doctorView.closedNote")}</p>
        )}
      </form>
    </>
  );
}