import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import "./dashboard.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // dir/lang/font are already applied by the [locale] layout above this one —
  // no <html>/<body> or I18nProvider here, this only adds the shell.
  return (
    <div className="fd-root">
      <div className="fd-bg" aria-hidden />
      <Sidebar />
      <main className="fd-main">{children}</main>
    </div>
  );
}
