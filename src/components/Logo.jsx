//src/components/Logo.jsx
import { cn } from "@/lib/utils";

export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-9", className)} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#0f2a1d" />
      <circle cx="44" cy="21" r="7" fill="#f4a63a" />
      <path d="M0 46 L16 30 L26 40 L40 24 L64 46 V64 H0Z" fill="#2f7a4f" />
      <path d="M0 54 Q20 40 38 50 T64 46 V64 H0Z" fill="#1d5a3a" />
      <path
        d="M10 64 Q30 48 54 52"
        stroke="#f1e7d0"
        strokeWidth="2"
        fill="none"
        strokeDasharray="3 3"
      />
    </svg>
  );
}

export default function Logo({ className, light = false }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            light ? "text-white" : "text-foreground",
          )}
        >
          Munnar
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.62rem] font-bold tracking-[0.26em] uppercase",
            light ? "text-accent" : "text-primary/70",
          )}
        >
          Beyond Roads
        </span>
      </span>
    </span>
  );
}
