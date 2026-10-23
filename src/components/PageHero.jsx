//src/components/PageHero.jsx
import ScenicArt from "@/components/ScenicArt";
import { Badge } from "@/components/ui/badge";

export default function PageHero({ eyebrow, title, text, art = "dawn", children }) {
  return (
    <section className="grain relative isolate overflow-hidden bg-forest pt-32 pb-20 text-white sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 -z-10 opacity-60">
        <ScenicArt scene={art} />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/70 via-forest/55 to-forest" />

      <div className="container-page">
        <div className="max-w-3xl">
          {eyebrow && (
            <Badge variant="glass" className="mb-6 uppercase">
              {eyebrow}
            </Badge>
          )}
          <h1 className="text-balance text-4xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {text && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              {text}
            </p>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
