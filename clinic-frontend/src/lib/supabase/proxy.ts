import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// مسیرهایی که ورود لازم دارند (بدون پیشوند زبان)
const PROTECTED_PREFIXES = ["/dashboard", "/doctor", "/admin", "/profile", "/appointments"];

export async function updateSession(request: NextRequest, locale: string) {
  const { pathname } = request.nextUrl;
  const rest = pathname.slice(locale.length + 1) || "/";

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // بین createServerClient و این خط هیچ کد دیگری نگذار
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;

  const needsLogin = PROTECTED_PREFIXES.some(
    (p) => rest === p || rest.startsWith(`${p}/`),
  );

  if (!isLoggedIn && needsLogin) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.search = "";
    url.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(url);
    // کوکی‌های تازه‌شده را به پاسخ ریدایرکت هم منتقل کن
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return response;
}