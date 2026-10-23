//src/pages/Home.jsx
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, ChevronDown, MessageCircle } from "lucide-react";

import { services, steps, whyUs } from "@/data/content";
import { whatsappLink } from "@/data/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CTABanner from "@/components/CTABanner";
import FAQSection from "@/components/FAQSection";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));
const ServiceModel = lazy(() => import("@/components/three/ServiceModel"));
const PhotoDiorama = lazy(() => import("@/components/three/PhotoDiorama"));

const heroFallback = (
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(to bottom, #16324a 0%, #5f8497 14%, #f0cfa0 34%, #3f8a3f 62%, #1a4d2e 100%)",
    }}
  />
);

const ticker = [
  "Jeep Safari",
  "Photography",
  "Stay Packages",
  "Tour Packages",
  "Honeymoon Trips",
  "Family Trips",
  "Pickup & Transfers",
  "Trekking & Camping",
];

export default function Home() {
  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-forest text-white">
        <div className="absolute inset-0 -z-10">
          <Suspense fallback={heroFallback}>
            <HeroScene className="absolute inset-0" />
          </Suspense>
        </div>
        {/* legibility overlays */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest/90 via-forest/15 to-forest/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/70 via-forest/25 to-transparent" />

        <div className="container-page pt-32 pb-24 sm:pb-28">
          <div className="max-w-3xl">
            <Badge variant="glass" className="mb-6 uppercase">
              Munnar · Kerala · India
            </Badge>
            <h1 className="text-balance text-5xl leading-[1.02] font-semibold sm:text-7xl lg:text-[5.5rem]">
              Travel <em className="font-medium text-accent not-italic">beyond</em> the roads of Munnar.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
              Jeep safaris, photography and stay packages in Munnar, Kerala. Open 4x4 rides,
              local guides and photo-first stops across the tea hills.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent" size="xl">
                <Link to="/safari">
                  Explore jeep safaris <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/photography">
                  <Camera /> Book a photo shoot
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-14 hidden max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl glass sm:grid">
            {[
              ["Sunrise to sunset", "Rides at every hour of light"],
              ["Local drivers", "Born and raised in the hills"],
              ["Photo-first stops", "Planned around the light"],
            ].map(([t, s]) => (
              <div key={t} className="px-6 py-5">
                <p className="font-display text-lg font-semibold">{t}</p>
                <p className="mt-0.5 text-xs text-white/65">{s}</p>
              </div>
            ))}
          </div>
        </div>

        <a
          href="#services"
          aria-label="Scroll to services"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/70 transition hover:text-white sm:block"
        >
          <ChevronDown className="size-7 animate-bounce motion-reduce:animate-none" />
        </a>
      </section>

      {/* ───────────── TICKER ───────────── */}
      <div className="overflow-hidden bg-accent py-4 text-forest" aria-hidden="true">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center pr-10 font-display text-xl font-semibold">
              {t}
              <span className="pl-10 text-base">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───────────── SERVICES ───────────── */}
      <section id="services" className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we do"
            title="Three ways to experience Munnar"
            text="Ride it, frame it, or plan it — pick one or combine them into a single unforgettable day."
          />
          <Reveal className="snap-row md:grid-cols-3 md:gap-6">
            {services.map((s) => (
              <div key={s.id}>
                <Link to={s.to} className="group block h-full">
                  <Card className="h-full gap-0 overflow-hidden py-0 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-primary/10">
                    <div
                      className="relative aspect-[4/3] overflow-hidden sm:aspect-[5/4]"
                      style={{ background: s.bg }}
                    >
                      <Suspense fallback={null}>
                        <ServiceModel model={s.model} fallbackScene={s.art} />
                      </Suspense>
                      <span className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-2xl bg-accent text-forest shadow-lg sm:bottom-5 sm:left-5">
                        <Icon name={s.icon} className="size-6" />
                      </span>
                    </div>
                    <CardHeader className="pt-6">
                      <CardTitle className="text-2xl">{s.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-5 pb-7">
                      <CardDescription className="text-[0.95rem]">{s.text}</CardDescription>
                      <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-primary">
                        Learn more
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ───────────── PHOTOGRAPHY SPLIT ───────────── */}
      <section className="grain relative overflow-hidden bg-forest text-white">
        <div className="container-page section-y grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-md lg:mx-0">
            <div className="absolute top-0 left-0 w-[62%] rotate-[-5deg] overflow-hidden rounded-3xl border-[7px] border-white shadow-2xl">
              <div className="relative aspect-[3/4]">
                <Suspense fallback={null}>
                  <PhotoDiorama scene="couple" fallbackScene="dusk" />
                </Suspense>
              </div>
            </div>
            <div className="absolute top-[22%] right-0 w-[58%] rotate-[4deg] animate-float overflow-hidden rounded-3xl border-[7px] border-white shadow-2xl">
              <div className="relative aspect-[3/4]">
                <Suspense fallback={null}>
                  <PhotoDiorama scene="hills" fallbackScene="tea" />
                </Suspense>
              </div>
            </div>
            <div className="absolute bottom-0 left-[16%] w-[52%] rotate-[-2deg] overflow-hidden rounded-3xl border-[7px] border-white shadow-2xl">
              <div className="relative aspect-square">
                <Suspense fallback={null}>
                  <PhotoDiorama scene="road" fallbackScene="mist" />
                </Suspense>
              </div>
            </div>
            <span className="absolute right-[6%] bottom-[10%] grid size-16 place-items-center rounded-full bg-accent text-forest shadow-xl">
              <Camera className="size-7" />
            </span>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              light
              eyebrow="Photography"
              title="Your Munnar story, beautifully framed"
              text="From misty sunrise portraits to full safari coverage, our photographers know exactly where the light lands and when."
              className="mb-8 sm:mb-8"
            />
            <Reveal className="space-y-4">
              {[
                ["Heart", "Couple & honeymoon shoots"],
                ["Users", "Family & group portraits"],
                ["Truck", "Photographer on your safari"],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl glass px-5 py-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent/90 text-forest">
                    <Icon name={icon} className="size-5" />
                  </span>
                  <span className="font-semibold">{label}</span>
                </div>
              ))}
            </Reveal>
            <Reveal className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg">
                <Link to="/photography">
                  See photography services <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <a
                  href={whatsappLink("Hi! I'd like to book a photo shoot in Munnar.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle /> Ask about a shoot
                </a>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── WHY US ───────────── */}
      <section className="section-y bg-secondary/55">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why Munnar Beyond Roads"
            title="Local roots, unhurried days"
            text="We design every ride and every shoot around you — not a bus schedule."
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <Card className="h-full flex-row items-start gap-4 border-transparent p-5 shadow-sm transition-shadow hover:shadow-xl sm:flex-col sm:p-7">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground sm:size-12">
                    <Icon name={w.icon} className="size-5 sm:size-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold sm:text-xl">{w.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="From idea to ride in three steps"
          />
          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="absolute top-8 right-[16%] left-[16%] hidden border-t-2 border-dashed border-primary/25 md:block" />
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 140} className="relative text-center">
                <span className="relative mx-auto mb-6 grid size-16 place-items-center rounded-full bg-accent font-display text-2xl font-bold text-forest shadow-lg shadow-accent/30">
                  {s.n}
                </span>
                <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-muted-foreground">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FAQSection limit={5} />
      <CTABanner />
    </>
  );
}
