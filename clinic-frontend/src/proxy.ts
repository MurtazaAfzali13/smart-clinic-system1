import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

const locales = ["en", "fa"];
const defaultLocale = "en";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  // ۱) آدرس بدون زبان: به زبان پیش‌فرض ببر (رفتار قبلی خودت)
  if (!locale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // ۲) آدرس با زبان: session را تازه کن و مسیرهای محافظت‌شده را چک کن
  return updateSession(request, locale);
}

export const config = {
  // auth/callback برای بعد (تأیید ایمیل) کنار گذاشته شده است
  matcher: ["/((?!api|auth/callback|_next|images|favicon.ico|.*\\..*).*)"],
};