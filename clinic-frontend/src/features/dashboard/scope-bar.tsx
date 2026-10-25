"use client";
import { useQuery } from "@tanstack/react-query";
import { Stethoscope } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useI18n, useT } from "@/lib/i18n/i18n-provider";
import { isAdmin, isDoctor, useMyContext } from "@/features/auth/my-context";
import { useDashboardFilter, useDashboardFilterDispatch } from "@/features/dashboard/filter";

function useDoctorsList(enabled: boolean) {
  return useQuery({
    queryKey: ["doctors-list"],
    enabled,
    staleTime: 10 * 60_000,
    queryFn: async () => {
      const { data, error } = await createClient()
        .from("doctors")
        .select("id, first_name_fa, last_name_fa, first_name_en, last_name_en")
        .eq("is_active", true)
        .order("last_name_en");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function DashboardScope() {
  const t = useT();
  const { locale } = useI18n();
  const { data: me } = useMyContext();
  const { state } = useDashboardFilter();
  const dispatch = useDashboardFilterDispatch();
  const admin = isAdmin(me);
  const { data: doctors } = useDoctorsList(admin);

  if (isDoctor(me)) {
    return (
      <div className="fd-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] text-[#c4d2f5]">
        <Stethoscope className="h-4 w-4 text-[#4d9bff]" />{t("dashboard.scope.mineOnly")}
      </div>
    );
  }
  if (!admin) return null;

  const fa = locale.startsWith("fa");
  return (
    <div className="flex items-center gap-3">
      <span className="text-[14px] text-[#c4d2f5]">{t("dashboard.scope.doctorLabel")}</span>
      <select
        value={state.doctorId ?? ""}
        onChange={(e) => dispatch({ type: "doctor", doctorId: e.target.value || null })}
        className="fd-pill rounded-lg px-3 py-1.5 text-[13px] text-white outline-none"
      >
        <option value="" className="bg-[#0b1535]">{t("dashboard.scope.allDoctors")}</option>
        {doctors?.map((d) => (
          <option key={d.id} value={d.id} className="bg-[#0b1535]">
            {fa ? `${d.first_name_fa} ${d.last_name_fa}` : `${d.first_name_en} ${d.last_name_en}`}
          </option>
        ))}
      </select>
    </div>
  );
}