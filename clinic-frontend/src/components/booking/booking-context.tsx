"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { intlLocaleOf, type BookingAccess, type DaySlots } from "@/lib/doctors/types";

/* ---------- reducer ---------- */
type State = { date: string; slot: string };
type Action = { type: "selectDate"; date: string } | { type: "selectSlot"; slot: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "selectDate":
      // با عوض شدن روز، ساعت قبلی پاک می‌شود
      return state.date === action.date ? state : { date: action.date, slot: "" };
    case "selectSlot":
      return { ...state, slot: action.slot };
  }
}

const initState = (days: DaySlots[]): State => ({
  date: days.find((d) => d.slots.length > 0)?.date ?? days[0]?.date ?? "",
  slot: "",
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
};

type Formatters = {
  weekday: Intl.DateTimeFormat;
  day: Intl.DateTimeFormat;
  monthYear: Intl.DateTimeFormat;
  dayLabel: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
  dateTime: Intl.DateTimeFormat;
  /** "2026-10-03" -> Date (نیمه‌شب UTC؛ فرمت‌کننده‌های روز با timeZone=UTC استفاده می‌شوند) */
  toDate: (date: string) => Date;
};

type BookingContextValue = BookingProviderProps & {
  date: string;
  /** فقط اگر واقعاً در لیست روز انتخابی باشد؛ وگرنه "" */
  slot: string;
  daySlots: string[];
  hasAnySlot: boolean;
  selectDate: (date: string) => void;
  selectSlot: (slot: string) => void;
  fmt: Formatters;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({
  children,
  doctorId,
  doctorSlug,
  days,
  timeZone,
  slotMinutes,
  fee,
  currency,
  access,
}: BookingProviderProps & { children: ReactNode }) {
  const { locale } = useI18n();
  const intl = intlLocaleOf(locale);
  const [state, dispatch] = useReducer(reducer, days, initState);

  const fmt = useMemo<Formatters>(() => {
    const utc = { timeZone: "UTC" } as const;
    return {
      weekday: new Intl.DateTimeFormat(intl, { weekday: "short", ...utc }),
      day: new Intl.DateTimeFormat(intl, { day: "numeric", ...utc }),
      monthYear: new Intl.DateTimeFormat(intl, { month: "long", year: "numeric", ...utc }),
      dayLabel: new Intl.DateTimeFormat(intl, {
        weekday: "short",
        month: "short",
        day: "numeric",
        ...utc,
      }),
      time: new Intl.DateTimeFormat(intl, {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone,
      }),
      dateTime: new Intl.DateTimeFormat(intl, {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone,
      }),
      toDate: (date) => new Date(`${date}T00:00:00Z`),
    };
  }, [intl, timeZone]);

  const value = useMemo<BookingContextValue>(() => {
    const daySlots = days.find((d) => d.date === state.date)?.slots ?? [];
    return {
      doctorId,
      doctorSlug,
      days,
      timeZone,
      slotMinutes,
      fee,
      currency,
      access,
      date: state.date,
      slot: daySlots.includes(state.slot) ? state.slot : "",
      daySlots,
      hasAnySlot: days.some((d) => d.slots.length > 0),
      selectDate: (date) => dispatch({ type: "selectDate", date }),
      selectSlot: (slot) => dispatch({ type: "selectSlot", slot }),
      fmt,
    };
  }, [doctorId, doctorSlug, days, timeZone, slotMinutes, fee, currency, access, state, fmt]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}