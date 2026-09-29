"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { logoutAction } from "@/lib/auth/actions";

export function LogoutButton() {
  const { locale, t } = useI18n();
  return (
    <form action={logoutAction}>
      <input type="hidden" name="locale" value={locale} />
      <Button type="submit" variant="outline">
        {t("auth.logout")}
      </Button>
    </form>
  );
}