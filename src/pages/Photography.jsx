import { Check, MessageCircle } from "lucide-react";

import { photoPackages, photoServices } from "@/data/content";
import { whatsappLink } from "@/data/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CTABanner from "@/components/CTABanner";
import FAQSection from "@/components/FAQSection";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Photography() {
  return (
    <>
      <PageHero
        eyebrow="Photography"
        art="tea"
        title="Moments worth framing, in light worth waiting for"
        text="Portrait, travel and wedding photography across Munnar's tea gardens, misty ridges and waterfalls."
      >
        <Button asChild variant="accent" size="lg">
          <a
            href={whatsappLink("Hi! I'd like to book a photography session in Munnar.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> Book a session
          </a>
        </Button>
      </PageHero>

      {/* services */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we shoot"
            title="Photography for every kind of trip"
            text="Relaxed, guided sessions — no stiff poses, no rushing."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photoServices.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 110}>
                <Card className="group h-full gap-4 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl">
                  <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-forest">
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* packages */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Packages"
            title="Pick the session that fits your day"
            text="Every package is customised. Message us for a clear quote based on your date, group and locations."
          />
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
            {photoPackages.map((p, i) => (
              <Reveal key={p.id} delay={i * 120}>
                <Card
                  className={cn(
                    "relative h-full gap-0 py-0",
                    p.popular && "border-accent shadow-2xl shadow-accent/15 lg:-translate-y-3",
                  )}
                >
                  {p.popular && (
                    <Badge variant="accent" className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most popular
                    </Badge>
                  )}
                  <CardHeader className="pt-9">
                    <p className="text-xs font-bold tracking-[0.2em] text-primary/70 uppercase">
                      {p.tag}
                    </p>
                    <CardTitle className="text-4xl">{p.name}</CardTitle>
                    <CardDescription className="text-base font-semibold text-foreground/70">
                      {p.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-6 flex-1">
                    <ul className="space-y-3.5">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-8">
                    <Button
                      asChild
                      className="w-full"
                      variant={p.popular ? "accent" : "default"}
                      size="lg"
                    >
                      <a
                        href={whatsappLink(`Hi! I'd like a quote for the "${p.name}" photography package.`)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get a quote
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Drone shots are offered only where local regulations and permits allow.
          </p>
        </div>
      </section>

      <FAQSection limit={6} />
      <CTABanner
        title="Let's frame your Munnar story"
        text="Share your dates and what you have in mind — we'll suggest the best locations and light."
      />
    </>
  );
}