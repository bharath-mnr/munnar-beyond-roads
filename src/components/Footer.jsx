//src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";

import { navLinks, site, whatsappLink } from "@/data/site";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/Logo";

const headingClass =
  "mb-5 font-sans text-xs font-bold tracking-[0.22em] text-accent uppercase";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-forest text-white/80">
      <div className="container-page grid grid-cols-1 gap-12 py-16 sm:py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
            Jeep safaris, photography, stay packages and tour services across the
            hills, tea estates and forests of Munnar. {site.tagline}
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={`Munnar Beyond Roads on Instagram (${site.instagramHandle})`}
              className="grid size-11 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-accent hover:bg-accent hover:text-forest"
            >
              <Instagram className="size-5" />
            </a>
          </div>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <p className={headingClass}>Explore</p>
          <ul className="space-y-0.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="inline-block py-2.5 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className={headingClass}>Get in touch</p>
          <address className="space-y-4 text-sm not-italic">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              {site.location}
            </p>
            <p className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
              <span className="flex flex-col">
                {site.phones.map((p, i) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    className="py-1.5 transition hover:text-white"
                  >
                    {p.display}
                    {i === 0 && <span className="text-white/50"> · WhatsApp</span>}
                  </a>
                ))}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
              <a href={`mailto:${site.email}`} className="py-1.5 break-all transition hover:text-white">
                {site.email}
              </a>
            </p>
          </address>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block py-2 text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            Message us on WhatsApp
          </a>
        </div>
      </div>

      <div className="container-page">
        <Separator className="bg-white/10" />
        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Made with love for the hills of Munnar.</p>
        </div>
      </div>
    </footer>
  );
}
