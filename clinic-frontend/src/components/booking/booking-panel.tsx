"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { formatFee } from "@/lib/doctors/types";
import { AppointmentDialog } from "@/components/appointments/appointment-dialog";
import { PatientProfileDialog } from "@/components/patients/patient-profile-dialog";
import { BookingProvider, useBooking, type BookingProviderProps } from "./booking-context";
import { DateStrip } from "./date-strip";
import { SlotGrid } from "./slot-grid";
import { BookingForm } from "./booking-form";

function BookingCta() {
  const { locale, t } = useI18n();
  const b = useBooking();
  const [profileOpen, setProfileOpen] = useState(false);
  const next = encodeURIComponent(`/${locale}/doctors/${b.doctorSlug}`);
  const primary =
    "gradient-surface inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-primary-foreground";

  if (b.access === "not_patient") {
    return <p className="rounded-xl bg-secondary/50 p-4 text-sm">{t("booking.patientsOnly")}</p>;
  }

  if (b.access === "needs_profile") {
    return (
      <div className="space-y-3 rounded-2xl bg-secondary/50 p-4">
        <p className="text-sm">{t("booking.completeProfile")}</p>
        <div className="flex">
          <button type="button" onClick={() => setProfileOpen(true)} className={primary}>
            {t("booking.completeProfileCta")}
          </button>
        </div>
        {b.patientDraft && b.enumOptions && (
          <PatientProfileDialog
            open={profileOpen}
            onOpenChange={setProfileOpen}
            doctorSlug={b.doctorSlug}
            initial={b.patientDraft}
            options={b.enumOptions}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl bg-secondary/50 p-4">
      <p className="text-sm">{t("booking.loginToBook")}</p>
      <div className="flex gap-2">
        <Link href={`/${locale}/login?next=${next}`} className={primary}>
          {t("booking.loginCta")}
        </Link>
        <Link
          href={`/${locale}/register`}
          className="glass inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
        >
          {t("navbar.register")}
        </Link>
      </div>
    </div>
  );
}

function PanelBody() {
  const { locale, t } = useI18n();
  const b = useBooking();
  const feeText = formatFee(b.fee, b.currency, locale);

  return (
    <div className="glass space-y-6 rounded-3xl p-6">
      {feeText && (
        <p className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-primary">{feeText}</span>
          <span className="text-sm text-muted-foreground">{t("booking.perVisit")}</span>
        </p>
      )}

      {!b.hasAnySlot ? (
        <p className="rounded-xl bg-secondary/50 p-4 text-sm">
          {b.isOwner ? t("doctorView.noSchedule") : t("booking.noSlotsWeek")}
        </p>
      ) : (
        <>
          <DateStrip />
          <SlotGrid />
          {!b.isOwner && (b.access === "ready" ? <BookingForm /> : <BookingCta />)}
        </>
      )}

      {b.isOwner && (
        <AppointmentDialog
          appointment={b.openAppt}
          doctorSlug={b.doctorSlug}
          timeZone={b.timeZone}
          currency={b.currency}
          onClose={b.closeAppointment}
        />
      )}
    </div>
  );
}

export function BookingPanel(props: BookingProviderProps) {
  return (
    <BookingProvider {...props}>
      <PanelBody />
    </BookingProvider>
  );
}