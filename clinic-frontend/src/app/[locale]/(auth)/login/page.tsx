import { redirect } from "next/navigation";
import { getCurrentUser, ROLE_HOME } from "@/lib/auth/dal";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale } = await params;
  const { next } = await searchParams;

  const user = await getCurrentUser();
  if (user) redirect(`/${locale}${ROLE_HOME[user.role]}`);

  return <LoginForm next={next} />;
}