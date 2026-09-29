import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "patient" | "doctor" | "admin";

export const ROLE_HOME: Record<UserRole, string> = {
  patient: "/dashboard",
  doctor: "/doctor",
  admin: "/admin",
};

/** کاربر فعلی + نقش از جدول profiles. cache یعنی در یک درخواست فقط یک‌بار اجرا می‌شود. */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();

  // getUser توکن را در سرور Supabase اعتبارسنجی می‌کند (امن‌تر از getSession)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, is_active, preferred_locale")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active) return null;

  return {
    id: user.id,
    email: profile.email ?? user.email ?? "",
    fullName: profile.full_name as string,
    role: profile.role as UserRole,
    locale: profile.preferred_locale as string,
  };
});

export async function requireUser(locale: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  return user;
}

/** در layout صفحات admin / doctor صدا بزن. نقش اشتباه = ریدایرکت به صفحه‌ی خودش. */
export async function requireRole(locale: string, allowed: UserRole[]) {
  const user = await requireUser(locale);
  if (!allowed.includes(user.role)) redirect(`/${locale}${ROLE_HOME[user.role]}`);
  return user;
}