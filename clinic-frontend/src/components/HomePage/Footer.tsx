"use client";

import { Activity, Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n/i18n-provider";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 0.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const socials = [FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon];

export default function Footer() {
  const { t, dir } = useI18n();

  const quickLinks = [
    { label: t("navbar.home"), href: "#home" },
    { label: t("navbar.services"), href: "#services" },
    { label: t("navbar.doctors"), href: "#doctors" },
    { label: t("navbar.gallery"), href: "#gallery" },
    { label: t("footer.careers"), href: "#careers" },
  ];

  const departments = [
    t("services.items.cardiology.title"),
    t("services.items.neurology.title"),
    t("services.items.ai_diagnosis.title"),
    t("services.items.emergency.title"),
    t("services.items.pediatrics.title"),
  ];

  return (
    <footer id="contact" dir={dir} className="border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="gradient-surface flex size-10 items-center justify-center rounded-xl text-primary-foreground">
              <Activity className="size-5" strokeWidth={2.6} />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Nova<span className="gradient-text">Care</span>
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">
            {t("footer.quick_links_title")}
          </h3>
          <ul className="mt-5 grid gap-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">
            {t("footer.departments_title")}
          </h3>
          <ul className="mt-5 grid gap-3">
            {departments.map((d) => (
              <li key={d}>
                <a
                  href="#services"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {d}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">
            {t("footer.contact_title")}
          </h3>
          <ul className="mt-5 grid gap-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin className="size-4 shrink-0 text-primary" />
              {t("footer.address")}
            </li>
            <li className="flex gap-3">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href="tel:115" className="transition-colors hover:text-primary">
                {t("footer.emergency_phone")}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="size-4 shrink-0 text-primary" />
              <a
                href="mailto:care@novacare.health"
                className="transition-colors hover:text-primary"
              >
                care@novacare.health
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row lg:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex gap-2">
            {socials.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={t("footer.social_aria")}
                className="glass rounded-full p-2.5 transition-colors hover:bg-secondary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}