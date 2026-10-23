import { Check, MessageCircle } from "lucide-react";

import { whyUs } from "@/data/content";
import { whatsappLink } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CTABanner from "@/components/CTABanner";
import FAQSection from "@/components/FAQSection";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const inclusions = [
  ["Truck", "Open 4x4 jeep", "Sturdy, well-maintained jeeps built for steep hill tracks."],
  ["MapPin", "Local driver-guide", "Stories, spotting tips and the best photo stops along the way."],
  ["Clock", "Flexible timing", "Sunrise, sunset or a slow full day. Choose your pace."],
];

const greatFor = [
  "Couples and honeymooners",
  "Families with children and grandparents",
  "Friends and larger groups",
  "Photographers and content creators",
];

const droneVideos = [
  { src: "/videos/vid_1.mp4", title: "Drone view 1" },
  { src: "/videos/vid_2.mp4", title: "Drone view 2" },
  { src: "/videos/vid_3.mp4", title: "Drone view 3" },
];

export default function Safari() {
  return (
    <>
      {/* NOTE: eyebrow / art / title / text below are placeholders: keep your originals */}
      <PageHero
        eyebrow="Jeep safari"
        art="tea"
        title="Munnar's hills, from an open jeep"
        text="Private 4x4 safaris through tea estates, viewpoints and misty ridges."
      >
        <Button asChild variant="accent" size="lg">
          <a
            href={whatsappLink("Hi! I'd like to book a jeep safari in Munnar.")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> Book a safari
          </a>
        </Button>
        <Button asChild variant="glass" size="lg">
          <a href="#ride">See the ride</a>
        </Button>
      </PageHero>

      {/* inclusions */}
      <section className="section-y">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {inclusions.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 110}>
                <Card className="h-full gap-4 p-7">
                  <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                    <Icon name={icon} className="size-6" />
                  </span>
                  <h3 className="font-display text-xl font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* about (good keyword-rich copy for search engines, and useful to visitors) */}
      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-semibold">
              Jeep safari in Munnar with Munnar Beyond Roads
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Munnar is best seen from an open jeep. A 4x4 takes you up steep hill roads and
              through tea estates that buses and cars can't handle, with misty views opening up
              around every bend.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Our local driver-guides know the hills, the weather and the best light of the day.
              Tell us your dates, group size and how adventurous you feel, and we'll plan a ride
              that fits you.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">Great for</h3>
            <ul className="mt-4 space-y-3">
              {greatFor.map((g) => (
                <li key={g} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* drone videos + photo */}
      <section id="ride" className="section-y scroll-mt-20">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {droneVideos.map((v, i) => (
              <Reveal key={v.src} delay={i * 110}>
                <div className="overflow-hidden rounded-2xl bg-forest shadow-lg">
                  <video
                    className="aspect-video w-full object-cover"
                    src={v.src}
                    title={v.title}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* why us */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="Why us" title="Why ride with us" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <Reveal key={w.title} delay={i * 110}>
                <Card className="h-full gap-3 p-7">
                  <h3 className="font-display text-xl font-semibold">{w.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FAQSection limit={6} />
      <CTABanner
        title="Ready for your Munnar jeep ride?"
        text="Share your dates and group size and we'll plan the route."
      />
    </>
  );
}