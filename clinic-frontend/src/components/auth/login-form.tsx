"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { loginAction } from "@/lib/auth/actions";
import type { AuthState } from "@/lib/auth/types";
import { FieldError } from "./field-error";

const initialState: AuthState = {};

export function LoginForm({ next }: { next?: string }) {
  const { locale, t } = useI18n();
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const fe = state.fieldErrors;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("login.title")}</CardTitle>
        <CardDescription>{t("login.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4" noValidate>
          <input type="hidden" name="locale" value={locale} />
          {next && <input type="hidden" name="next" value={next} />}

          {state.formError && (
            <p role="alert" className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
              {t(state.formError)}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t("login.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              defaultValue={state.values?.email}
              aria-invalid={!!fe?.email}
              aria-describedby="email-error"
            />
            <FieldError id="email-error" message={fe?.email && t(fe.email)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("login.password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              aria-invalid={!!fe?.password}
              aria-describedby="password-error"
            />
            <FieldError id="password-error" message={fe?.password && t(fe.password)} />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? t("login.submitting") : t("login.submit")}
          </Button>

          <p className="text-center text-sm">
            {t("login.noAccount")}{" "}
            <Link href={`/${locale}/register`} className="underline">
              {t("login.register")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}