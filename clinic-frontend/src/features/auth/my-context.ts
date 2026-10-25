"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client"; // مسیر واقعی پروژه‌ی خودتان

export type MyContext = { userId: string; role: string; fullName: string; doctorId: string | null };

export function useMyContext() {
  return useQuery({
    queryKey: ["me"],
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<MyContext | null> => {
      const { data, error } = await createClient().rpc("get_my_context");
      if (error) throw error;
      const r = data?.[0];
      return r ? { userId: r.user_id, role: r.role, fullName: r.full_name, doctorId: r.doctor_id } : null;
    },
  });
}

export const isAdmin = (m?: MyContext | null) => m?.role === "admin";
export const isDoctor = (m?: MyContext | null) => m?.role === "doctor";