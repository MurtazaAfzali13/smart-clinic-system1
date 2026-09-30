import { SiteNavbar } from "@/components/HomePage/site-navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNavbar />
      {children}
    </>
  );
}