import { redirect } from "next/navigation";
import { getCurrentUser, ROLE_HOME } from "@/lib/auth/dal";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const user = await getCurrentUser();
  if (user) redirect(`/${locale}${ROLE_HOME[user.role]}`);

  return <RegisterForm />;
}