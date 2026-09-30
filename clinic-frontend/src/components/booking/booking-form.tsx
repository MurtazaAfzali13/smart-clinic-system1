"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/auth/field-error";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { bookAppointmentAction } from "@/lib/appointments/actions";
import type { BookingState } from "@/lib/appointments/types";
import { formatFee, formatNumber } from "@/lib/doctors/types";
import { useBooking } from "./booking-context";

const initialState: BookingState = {};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function BookingForm() {
  const { locale, t } = useI18n();
  const b = useBooking();
  const [state, formAction, pending] = useActionState(bookAppointmentAction, initialState);
  const fe = state.fieldErrors;
  const v = state.values;

  if (state.success) {
    return (
      <div className="space-y-3 rounded-2xl bg-secondary/50 p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h3 className="text-lg font-bold">{t("booking.successTitle")}</h3>
        <p className="font-semibold">{b.fmt.dateTime.format(new Date(state.success.startAt))}</p>
        <p className="text-sm text-muted-foreground">{t("booking.successText")}</p>
      </div>
    );
  }

  const feeText = formatFee(b.fee, b.currency, locale);
  const timeText = b.slot
    ? `${b.fmt.dayLabel.format(b.fmt.toDate(b.date))} · ${b.fmt.time.format(new Date(b.slot))}`
    : "—";

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="doctorId" value={b.doctorId} />
      <input type="hidden" name="doctorSlug" value={b.doctorSlug} />
      <input type="hidden" name="startAt" value={b.slot} />

      {state.formError && (
        <div role="alert" className="space-y-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
          <p>{t(state.formError)}</p>
          {state.needsProfile && (
            <Link
              href={`/${locale}/profile?next=${encodeURIComponent(`/${locale}/doctors/${b.doctorSlug}`)}`}
              className="font-semibold underline"
            >
              {t("booking.completeProfileCta")}
            </Link>
          )}
        </div>
      )}
      <FieldError id="startAt-error" message={fe?.startAt && t(fe.startAt)} />

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">{t("booking.visitType")}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["true", "false"] as const).map((val) => (
            <label key={val} className="cursor-pointer">
              <input
                type="radio"
                name="isFirstVisit"
                value={val}
                defaultChecked={(v?.isFirstVisit ?? "true") === val}
                className="peer sr-only"
              />
              <span className="block rounded-xl border border-border px-3 py-2.5 text-center text-sm transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:font-semibold peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                {val === "true" ? t("booking.firstVisit") : t("booking.followUp")}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="reason">{t("booking.reason")}</Label>
        <Textarea
          id="reason"
          name="reason"
          rows={3}
          placeholder={t("booking.reasonPlaceholder")}
          defaultValue={v?.reason}
          aria-invalid={!!fe?.reason}
          aria-describedby="reason-error"
        />
        <FieldError id="reason-error" message={fe?.reason && t(fe.reason)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptoms">{t("booking.symptoms")}</Label>
        <Textarea id="symptoms" name="symptoms" rows={2} defaultValue={v?.symptoms} />
        <FieldError id="symptoms-error" message={fe?.symptoms && t(fe.symptoms)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptomDuration">{t("booking.symptomDuration")}</Label>
        <Input
          id="symptomDuration"
          name="symptomDuration"
          placeholder={t("booking.durationPlaceholder")}
          defaultValue={v?.symptomDuration}
        />
        <FieldError id="duration-error" message={fe?.symptomDuration && t(fe.symptomDuration)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="patientNotes">{t("booking.notes")}</Label>
        <Textarea id="patientNotes" name="patientNotes" rows={2} defaultValue={v?.patientNotes} />
        <FieldError id="notes-error" message={fe?.patientNotes && t(fe.patientNotes)} />
      </div>

      <div className="space-y-2.5 rounded-2xl bg-secondary/50 p-4">
        <Row label={t("booking.summaryTime")} value={timeText} />
        <Row
          label={t("booking.summaryDuration")}
          value={`${formatNumber(b.slotMinutes, locale)} ${t("doctors.minutes")}`}
        />
        {feeText && <Row label={t("booking.summaryFee")} value={feeText} />}
      </div>

      <button
        type="submit"
        disabled={pending || !b.slot}
        className="gradient-surface w-full rounded-full py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {pending ? t("booking.confirming") : t("booking.confirm")}
      </button>
    </form>
  );
}