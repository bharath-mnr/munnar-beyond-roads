//src/pages/Explore.jsx
import { useState } from "react";
import { Lightbulb, Plane } from "lucide-react";

import { placeCategories, places, seasons } from "@/data/content";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CTABanner from "@/components/CTABanner";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ScenicArt from "@/components/ScenicArt";
import SectionHeading from "@/components/SectionHeading";

const itinerary = [
  {
    day: "Day 1",
    title: "Tea, lakes & easy viewpoints",
    items: ["Tea gardens & estate walk", "Tea Museum", "Mattupetty Dam", "Echo Point & Kundala"],
  },
  {
    day: "Day 2",
    title: "Sunrise jeep & high viewpoints",
    items: ["Kolukkumalai sunrise safari", "Breakfast at the estate", "Top Station panoramas", "Evening photo session"],
  },
  {
    day: "Day 3",
    title: "Wildlife & the wild side",
    items: ["Eravikulam National Park", "Attukad Waterfalls", "Or: Marayoor & Chinnar day trip"],
  },
];

export default function Explore() {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? places : places.filter((p) => p.category === tab);

  return (
    <>
      <PageHero
        eyebrow="Explore Munnar"
        art="mist"
        title="A hill station with more than one face"
        text="Cloud-level viewpoints, roaring waterfalls, shy wildlife and the quiet rhythm of tea estates."
      />

      {/* places */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Places"
            title="What to see in and around Munnar"
            text="Filter by what you love — then let us stitch your favourites into a smooth day."
          />
          <Tabs value={tab} onValueChange={setTab} className="items-center">
            <TabsList
              aria-label="Filter places"
              className="w-full flex-wrap justify-center overflow-visible rounded-3xl sm:w-fit"
            >
              {placeCategories.map((c) => (
                <TabsTrigger key={c.value} value={c.value}>
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* one panel rendered for the active tab */}
            <TabsContent value={tab} className="w-full">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <Card
                    key={p.id}
                    className="group h-full gap-0 overflow-hidden py-0 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[16/10]">
                      <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
                        <ScenicArt scene={p.art} src={p.image} alt={p.name} />
                      </div>
                      <span className="absolute top-4 left-4 rounded-full bg-forest/70 px-3 py-1 text-[0.7rem] font-bold tracking-wider text-white uppercase backdrop-blur">
                        {placeCategories.find((c) => c.value === p.category)?.label}
                      </span>
                    </div>
                    <div className="space-y-3 p-6">
                      <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                      <p className="flex items-start gap-2 border-t pt-3 text-xs font-semibold text-primary/80">
                        <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-accent" />
                        {p.tip}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* seasons */}
      <section className="section-y bg-secondary/55">
        <div className="container-page">
          <SectionHeading
            eyebrow="Best time to visit"
            title="Munnar changes with every season"
            text="Rough guidance — conditions vary year to year, so ask us before you lock your dates."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {seasons.map((s, i) => (
              <Reveal key={s.name} delay={i * 110}>
                <Card className="h-full items-start gap-4 border-transparent p-8 shadow-sm">
                  <span className="grid size-14 place-items-center rounded-2xl bg-accent text-forest">
                    <Icon name={s.icon} className="size-7" />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-primary/70 uppercase">
                      {s.label}
                    </p>
                    <h3 className="mt-1 font-display text-3xl font-semibold">{s.name}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* itinerary */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Sample plan"
            title="A relaxed 3-day Munnar itinerary"
            text="A starting point only — we reshape it around your dates, energy and interests."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {itinerary.map((d, i) => (
              <Reveal key={d.day} delay={i * 110}>
                <Card className="h-full gap-5 p-8">
                  <span className="inline-flex w-fit rounded-full bg-primary px-4 py-1.5 text-xs font-bold tracking-widest text-primary-foreground uppercase">
                    {d.day}
                  </span>
                  <h3 className="font-display text-2xl leading-snug font-semibold">{d.title}</h3>
                  <ul className="space-y-3 text-sm">
                    {d.items.map((it) => (
                      <li key={it} className="flex items-start gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex items-start gap-4 rounded-2xl border bg-card p-6 sm:items-center sm:p-7">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
              <Plane className="size-6" />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Getting here:</strong> Cochin International
              Airport and Aluva railway station are the usual gateways, roughly 3.5–5 hours by road
              depending on traffic. Ask us about pickup and stay recommendations.
            </p>
          </Reveal>
        </div>
      </section>

      <CTABanner
        title="Let's plan your Munnar days"
        text="Tell us how many days you have and what you love — we'll build the route."
      />
    </>
  );
}
