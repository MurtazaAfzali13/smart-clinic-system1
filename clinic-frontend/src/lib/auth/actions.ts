"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME, type UserRole } from "@/lib/auth/dal";
import { resolveLocale, type AppLocale } from "@/lib/auth/locale";
import { loginSchema, registerSchema, toFieldErrors } from "@/lib/auth/schemas";
import type { AuthState } from "@/lib/auth/types";

/** فقط آدرس داخلی همان زبان را قبول می‌کنیم (جلوگیری از open redirect) */
function safeNext(next: FormDataEntryValue | null, locale: AppLocale): string | null {
  const v = String(next ?? "");
  return v.startsWith(`/${locale}/`) ? v : null;
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues), values: { email: raw.email } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { formError: "auth.errors.invalidCredentials", values: { email: raw.email } };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .single();

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut();
    return { formError: "auth.errors.accountDisabled", values: { email: raw.email } };
  }

  // redirect باید بیرون از try/catch باشد
  redirect(
    safeNext(formData.get("next"), locale) ??
      `/${locale}${ROLE_HOME[profile.role as UserRole]}`,
  );
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const raw = {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const values = { fullName: raw.fullName, email: raw.email };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues), values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      // تریگر handle_new_user این دو مقدار را می‌خواند. نقش همیشه patient می‌ماند.
      data: { full_name: parsed.data.fullName, locale },
    },
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return { fieldErrors: { email: "auth.errors.emailTaken" }, values };
    }
    if (error.code === "weak_password") {
      return { fieldErrors: { password: "auth.errors.passwordWeak" }, values };
    }
    return { formError: "auth.errors.generic", values };
  }

  // وقتی تأیید ایمیل روشن باشد، برای ایمیل تکراری خطا نمی‌دهد و identities خالی است
  if (data.user && data.user.identities?.length === 0) {
    return { fieldErrors: { email: "auth.errors.emailTaken" }, values };
  }

  // اگر تأیید ایمیل روشن باشد session نداریم (بعداً صفحه‌ی «ایمیلت را چک کن» می‌سازیم)
  if (!data.session) {
    return { formError: "auth.errors.generic", values };
  }

  redirect(`/${locale}${ROLE_HOME.patient}`);
}

export async function logoutAction(formData: FormData) {
  const locale = resolveLocale(formData.get("locale"));
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/login`);
}