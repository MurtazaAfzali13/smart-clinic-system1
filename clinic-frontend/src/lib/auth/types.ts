export type AuthField = "fullName" | "email" | "password";

export type AuthState = {
  /** کلید ترجمه، مثل "auth.errors.invalidCredentials" */
  formError?: string;
  fieldErrors?: Partial<Record<AuthField, string>>;
  /** مقادیر غیرمحرمانه برای پر کردن دوباره‌ی فرم */
  values?: { fullName?: string; email?: string };
};