//src/pages/Services.jsx
import { Link } from "react-router-dom";
import { ArrowRight, Camera, MessageCircle, Truck } from "lucide-react";

import { moreServices, steps } from "@/data/content";
import { whatsappLink } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CTABanner from "@/components/CTABanner";
import FAQSection from "@/components/FAQSection";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="More Services"
        art="water"
        title="Stay packages and more for your Munnar trip"
        text="Beyond jeep safaris and photography, we can help arrange the rest of your trip, from where you stay to how you get there."
      >
        <Button asChild variant="accent" size="lg">
          <a
            href={whatsappLink("Hi! I'd like to know about stay packages and tour services in Munnar.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle /> Ask about stay packages
          </a>
        </Button>
        <Button asChild variant="glass" size="lg">
          <a href="#what-we-offer">See what we offer</a>
        </Button>
      </PageHero>

      <section id="what-we-offer" className="section-y scroll-mt-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we offer"
            title="Everything around your trip, in one place"
            text="Tell us what you need and we'll arrange it, or combine it with a jeep safari or photo session."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {moreServices.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 100}>
                <Card className="group h-full flex-row items-start gap-4 p-5 transition-all duration-500 hover:border-accent hover:shadow-xl sm:flex-col sm:p-7">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-forest sm:size-12">
                    <Icon name={s.icon} className="size-5 sm:size-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold sm:text-xl">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/55">
        <div className="container-page">
          <SectionHeading
            eyebrow="Add to your stay"
            title="Make it a complete Munnar trip"
            text="Pair your stay with our most-loved experiences."
          />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {[
              {
                to: "/safari",
                Icon: Truck,
                title: "Add a jeep safari",
                text: "Open 4x4 rides through the hills with a local driver-guide.",
              },
              {
                to: "/photography",
                Icon: Camera,
                title: "Add a photo session",
                text: "Couple, family and travel photography in Munnar's best light.",
              },
            ].map(({ to, Icon: I, title, text }) => (
              <Reveal key={to}>
                <Link to={to} className="group block h-full">
                  <Card className="h-full flex-row items-center gap-5 p-6 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent text-forest">
                      <I className="size-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xl font-semibold">{title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                    </div>
                    <ArrowRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="From idea to arranged in three steps" />
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

      <FAQSection limit={4} />
      <CTABanner
        title="Planning a stay in Munnar?"
        text="Tell us your dates and group size. We'll come back with a clear plan."
      />
    </>
  );
}
