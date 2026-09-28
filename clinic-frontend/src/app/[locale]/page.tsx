import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

import { Navbar } from "@/components/HomePage/Navbar";
import HeroSection from "@/components/HomePage/Hero";
import Services from "@/components/HomePage/Services"; 
import About from "@/components/HomePage/About";

import { Stats } from "@/components/HomePage/Stats";
import { Doctors } from "@/components/HomePage/Doctors";
import { Gallery } from "@/components/HomePage/Gallery";
import { Testimonials } from "@/components/HomePage/Testimonials";
import { CtaBanner } from "@/components/HomePage/CtaBanner";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="w-full min-h-screen p-0 m-0 overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <Services />
      <About />
      <Doctors />
      <Gallery />
      <Testimonials />
      <CtaBanner />
     
    </main>
  );
}