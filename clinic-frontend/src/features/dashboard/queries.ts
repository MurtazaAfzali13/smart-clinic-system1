"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useDashboardFilter } from "./filter";
import { isAdmin, useMyContext } from "@/features/auth/my-context";

export type TrendRow = { bucket: string; total: number; completed: number; cancelled: number };
export type StatusRow = { status: string; total: number };

function useScope() {
  const { data: me } = useMyContext();
  const { range, state } = useDashboardFilter();
  const doctorId = isAdmin(me) ? state.doctorId : null; // سرور برای داکتر در هر حال نادیده می‌گیرد
  return { me, range, doctorId };
}

export function useAppointmentsTrend() {
  const { me, range, doctorId } = useScope();
  return useQuery({
    queryKey: ["dashboard", "appointments-trend", me?.userId, doctorId, range],
    enabled: !!me,
    queryFn: async () => {
      const { data, error } = await createClient().rpc("dashboard_appointments_trend", {
        p_from: range.from, p_to: range.to, p_bucket: range.bucket, p_doctor_id: doctorId,
      });
      if (error) throw error;
      return (data ?? []) as TrendRow[];
    },
    placeholderData: keepPreviousData,
  });
}

export function useStatusBreakdown() {
  const { me, range, doctorId } = useScope();
  return useQuery({
    queryKey: ["dashboard", "status-breakdown", me?.userId, doctorId, range.from, range.to],
    enabled: !!me,
    queryFn: async () => {
      const { data, error } = await createClient().rpc("dashboard_status_breakdown", {
        p_from: range.from, p_to: range.to, p_doctor_id: doctorId,
      });
      if (error) throw error;
      return (data ?? []) as StatusRow[];
    },
    placeholderData: keepPreviousData,
  });
}