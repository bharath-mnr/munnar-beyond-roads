//src/components/SectionHeading.jsx
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  light = false,
  className,
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 flex max-w-2xl flex-col gap-4 sm:mb-16",
        align === "center" && "mx-auto items-center text-center",
        align === "left" && "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase",
            light ? "text-accent" : "text-primary/80",
          )}
        >
          <span className={cn("h-px w-8", light ? "bg-accent" : "bg-primary/50")} />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-balance text-3xl leading-[1.1] font-semibold sm:text-4xl lg:text-5xl",
          light ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {text && (
        <p
          className={cn(
            "text-balance text-base leading-relaxed sm:text-lg",
            light ? "text-white/75" : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      )}
    </Reveal>
  );
}
