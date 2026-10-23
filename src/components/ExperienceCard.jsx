//src/components/ExperienceCard.jsx
import { ArrowUpRight, Clock, Gauge, Check } from "lucide-react";

import { whatsappLink } from "@/data/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ScenicArt from "@/components/ScenicArt";

export default function ExperienceCard({ item, compact = false }) {
  const message = `Hi! I'd like to know more about "${item.title}" with Munnar Beyond Roads.`;

  return (
    <Card className="group h-full gap-0 overflow-hidden py-0 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10">
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3]">
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
          <ScenicArt scene={item.art} src={item.image} alt={item.title} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          {item.featured && <Badge variant="accent">Most loved</Badge>}
        </div>
        <Badge variant="glass" className="absolute bottom-4 left-4">
          <Clock /> {item.duration}
        </Badge>
      </div>

      <CardHeader className="pt-6">
        <CardTitle className="text-2xl">{item.title}</CardTitle>
        <p className="text-sm font-semibold text-primary/70">{item.tagline}</p>
      </CardHeader>

      <CardContent className="mt-3 flex-1 space-y-4 pb-2">
        <CardDescription>{item.description}</CardDescription>
        {!compact && (
          <>
            <ul className="space-y-2 text-sm">
              {item.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary">
                <Gauge /> {item.level}
              </Badge>
              <Badge variant="outline">{item.start}</Badge>
            </div>
            {item.note && <p className="text-xs text-muted-foreground italic">{item.note}</p>}
          </>
        )}
      </CardContent>

      <CardFooter className="pt-5">
        <Button asChild variant="default" className="w-full">
          <a href={whatsappLink(message)} target="_blank" rel="noreferrer">
            Enquire on WhatsApp <ArrowUpRight />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
