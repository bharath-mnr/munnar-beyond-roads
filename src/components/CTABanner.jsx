//src/components/CTABanner.jsx
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

import { whatsappLink } from "@/data/site";
import { Button } from "@/components/ui/button";
import ScenicArt from "@/components/ScenicArt";
import Reveal from "@/components/Reveal";

export default function CTABanner({
  title = "Ready to ride beyond the roads?",
  text = "Tell us your dates and group size — we'll reply on WhatsApp with a clear plan and quote.",
}) {
  return (
    <section className="section-y pt-0">
      <div className="container-page">
        <Reveal className="grain relative isolate overflow-hidden rounded-[2rem] bg-forest px-6 py-16 text-center text-white sm:px-14 sm:py-24">
          <div className="absolute inset-0 -z-10">
            <ScenicArt scene="dusk" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/35 via-forest/45 to-forest/85" />
          <h2 className="mx-auto max-w-2xl text-balance text-3xl leading-tight font-semibold sm:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/80 sm:text-lg">{text}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg">
              <a href={whatsappLink()} target="_blank" rel="noreferrer">
                <MessageCircle /> Chat on WhatsApp
              </a>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/contact">
                Send an enquiry <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
