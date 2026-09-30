import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import HeroSection from "@/components/HomePage/Hero";
import Services from "@/components/HomePage/Services"; 
import About from "@/components/HomePage/About";

import { Stats } from "@/components/HomePage/Stats";
import { DoctorsSection } from "@/components/HomePage/DoctorsSection";
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
    
      <HeroSection />
      <Services />
      <About />
      <DoctorsSection />
      <Gallery />
      <Testimonials />
      <CtaBanner />
     
    </main>
  );
}