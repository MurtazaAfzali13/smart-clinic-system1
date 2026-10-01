"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { intlLocaleOf, type BookingAccess, type DaySlots } from "@/lib/doctors/types";
import type { DoctorAppointment } from "@/lib/appointments/types";
import type { PatientDraft, PatientEnumOptions } from "@/lib/patients/types";

/* ---------- reducer: فقط انتخاب‌ها؛ داده‌ی اصلی از سرور می‌آید ---------- */
type State = { date: string; slot: string; openApptId: string | null };
type Action =
  | { type: "selectDate"; date: string }
  | { type: "selectSlot"; slot: string }
  | { type: "openAppointment"; id: string }
  | { type: "closeAppointment" };

/** روز تعطیل / بدون برنامه؛ برای غیرپزشک روزی که همه‌ی ساعت‌هایش پر است هم غیرفعال است */
const dayDisabled = (day: DaySlots, isOwner: boolean) =>
  day.closed || day.slots.length === 0 || (!isOwner && day.slots.every((s) => s.booked));

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "selectDate":
      return state.date === action.date ? state : { ...state, date: action.date, slot: "" };
    case "selectSlot":
      return { ...state, slot: action.slot };
    case "openAppointment":
      return { ...state, openApptId: action.id };
    case "closeAppointment":
      return { ...state, openApptId: null };
  }
}

const initState = ({ days, isOwner }: { days: DaySlots[]; isOwner: boolean }): State => ({
  date: days.find((d) => !dayDisabled(d, isOwner))?.date ?? days[0]?.date ?? "",
  slot: "",
  openApptId: null,
});

/* ---------- context ---------- */
export type BookingProviderProps = {
  doctorId: string;
  doctorSlug: string;
  days: DaySlots[];
  timeZone: string;
  slotMinutes: number;
  fee: number | null;
  currency: string;
  access: BookingAccess;
  /** فقط برای پزشکِ صاحب صفحه پر است */
  appointments: DoctorAppointment[];
  /** فقط وقتی پرونده‌ی بیمار ناقص است */
  patientDraft: PatientDraft | null;
  enumOptions: PatientEnumOptions | null;
};

type Formatters = {
  weekday: Intl.DateTimeFormat;
  day: Intl.DateTimeFormat;
  monthYear: Intl.DateTimeFormat;
  dayLabel: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
  dateTime: Intl.DateTimeFormat;
  toDate: (date: string) => Date;
};

type BookingContextValue = BookingProviderProps & {
  isOwner: boolean;
  date: string;
  /** فقط اگر ساعتِ آزادِ روز انتخابی باشد؛ وگرنه "" */
  slot: string;
  daySlots: DaySlots["slots"];
  hasAnySlot: boolean;
  isDayDisabled: (day: DaySlots) => boolean;
  appointmentAt: (startsAt: string) => DoctorAppointment | undefined;
  openAppt: DoctorAppointment | null;
  selectDate: (date: string) => void;
  selectSlot: (slot: string) => void;
  openAppointment: (id: string) => void;
  closeAppointment: () => void;
  fmt: Formatters;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({
  children,
  ...props
}: BookingProviderProps & { children: ReactNode }) {
  const { locale } = useI18n();
  const intl = intlLocaleOf(locale);
  const isOwner = props.access === "doctor_owner";
  const [state, dispatch] = useReducer(reducer, { days: props.days, isOwner }, initState);

  const fmt = useMemo<Formatters>(() => {
    const utc = { timeZone: "UTC" } as const;
    return {
      weekday: new Intl.DateTimeFormat(intl, { weekday: "short", ...utc }),
      day: new Intl.DateTimeFormat(intl, { day: "numeric", ...utc }),
      monthYear: new Intl.DateTimeFormat(intl, { month: "long", year: "numeric", ...utc }),
      dayLabel: new Intl.DateTimeFormat(intl, { weekday: "short", month: "short", day: "numeric", ...utc }),
      time: new Intl.DateTimeFormat(intl, {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: props.timeZone,
      }),
      dateTime: new Intl.DateTimeFormat(intl, {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: props.timeZone,
      }),
      toDate: (date) => new Date(`${date}T00:00:00Z`),
    };
  }, [intl, props.timeZone]);

  const { days, appointments } = props;

  const value = useMemo<BookingContextValue>(() => {
    const daySlots = days.find((d) => d.date === state.date)?.slots ?? [];
    const byStart = new Map(appointments.map((a) => [new Date(a.startAt).getTime(), a]));
    const selectable = daySlots.some((s) => s.startsAt === state.slot && !s.booked);

    return {
      ...props,
      isOwner,
      date: state.date,
      slot: selectable ? state.slot : "",
      daySlots,
      hasAnySlot: days.some((d) => !dayDisabled(d, isOwner)),
      isDayDisabled: (d) => dayDisabled(d, isOwner),
      appointmentAt: (startsAt) => byStart.get(new Date(startsAt).getTime()),
      // نوبت از props خوانده می‌شود، پس بعد از هر عمل خودکار تازه می‌شود
      openAppt: appointments.find((a) => a.id === state.openApptId) ?? null,
      selectDate: (date) => dispatch({ type: "selectDate", date }),
      selectSlot: (slot) => dispatch({ type: "selectSlot", slot }),
      openAppointment: (id) => dispatch({ type: "openAppointment", id }),
      closeAppointment: () => dispatch({ type: "closeAppointment" }),
      fmt,
    };
    // props یک آبجکت جدید در هر رندر است؛ وابستگی‌های واقعی را جدا آورده‌ایم
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, appointments, state, isOwner, fmt, props.doctorId, props.doctorSlug, props.timeZone, props.slotMinutes, props.fee, props.currency, props.access, props.patientDraft, props.enumOptions]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}