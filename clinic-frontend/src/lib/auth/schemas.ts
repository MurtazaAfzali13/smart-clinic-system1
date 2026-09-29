import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "auth.errors.emailRequired")
  .email("auth.errors.emailInvalid");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "auth.errors.passwordRequired"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "auth.errors.fullNameShort")
    .max(100, "auth.errors.fullNameLong"),
  email,
  password: z
    .string()
    .min(8, "auth.errors.passwordShort")
    .max(72, "auth.errors.passwordLong"),
});

/** اولین خطای هر فیلد */
export function toFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}