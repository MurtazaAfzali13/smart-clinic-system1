"use client";
import { useCallback } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useDashboardFilter } from "./filter";
import { isAdmin, useMyContext } from "@/features/auth/my-context";
import { selectStatus, selectTrend, selectWeekdays } from "./selectors";

export type DailyRow = { day: string; status: string; total: number };
export type TrendRow = { bucket: string; total: number; completed: number; cancelled: number };
export type StatusRow = { status: string; total: number };
export type BreakdownRow = {
  specialty_id: string | null; name_fa: string | null; name_en: string | null;
  is_first_visit: boolean; total: number;
};

/** ریشه‌ی همه‌ی کلیدهای داشبورد؛ بعد از تغییر نوبت این را invalidate کنید */
export const DASHBOARD_KEY = ["dashboard"] as const;

function useScope() {
  const { data: me } = useMyContext();
  const { range, state } = useDashboardFilter();
  const doctorId = isAdmin(me) ? state.doctorId : null; // سرور برای داکتر نادیده می‌گیرد
  return { me, range, doctorId };
}

/** query پایه‌ی روزانه: trend، status و weekday همه از همین cache می‌خوانند */
export function useAppointmentDaily<T>(select: (rows: DailyRow[]) => T) {
  const { me, range, doctorId } = useScope();
  return useQuery({
    queryKey: [...DASHBOARD_KEY, "appointment-daily", me?.userId, doctorId, range.from, range.to],
    enabled: !!me,
    queryFn: async () => {
      const { data, error } = await createClient().rpc("dashboard_appointment_daily", {
        p_from: range.from, p_to: range.to, p_doctor_id: doctorId,
      });
      if (error) throw error;
      return (data ?? []) as DailyRow[];
    },
    select,
    placeholderData: keepPreviousData,
  });
}

/** query تجمیعی روی کل بازه: تخصص و نوع مراجعه */
export function useAppointmentBreakdown<T>(select: (rows: BreakdownRow[]) => T) {
  const { me, range, doctorId } = useScope();
  return useQuery({
    queryKey: [...DASHBOARD_KEY, "appointment-breakdown", me?.userId, doctorId, range.from, range.to],
    enabled: !!me,
    queryFn: async () => {
      const { data, error } = await createClient().rpc("dashboard_appointment_breakdown", {
        p_from: range.from, p_to: range.to, p_doctor_id: doctorId,
      });
      if (error) throw error;
      return (data ?? []) as BreakdownRow[];
    },
    select,
    placeholderData: keepPreviousData,
  });
}

export function useAppointmentsTrend() {
  const { range } = useDashboardFilter();
  const select = useCallback((rows: DailyRow[]) => selectTrend(rows, range), [range]);
  return useAppointmentDaily(select);
}

export function useStatusBreakdown() {
  return useAppointmentDaily(selectStatus);
}

export function useAppointmentsByWeekday() {
  return useAppointmentDaily(selectWeekdays);
}