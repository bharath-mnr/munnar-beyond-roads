import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog } from "radix-ui";

import ScenicArt from "@/components/ScenicArt";

/**
 * Full-screen photo viewer. Shows the whole photo (never cropped), with
 * next / previous buttons, arrow-key support and Esc / tap-outside to close.
 * `index` is the open photo's position, or null when closed.
 */
export default function PhotoLightbox({ items, index, onIndex }) {
  const open = index !== null;
  const item = open ? items[index] : null;
  const [broken, setBroken] = useState(false);

  const go = useCallback(
    (step) => onIndex((index + step + items.length) % items.length),
    [index, items.length, onIndex],
  );

  useEffect(() => setBroken(false), [index]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const btn =
    "grid size-11 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onIndex(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/90" />
        <Dialog.Content
          aria-describedby={undefined}
          onClick={(e) => e.target === e.currentTarget && onIndex(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-4 outline-none sm:p-8"
        >
          {item && (
            <>
              <Dialog.Title className="sr-only">{item.title}</Dialog.Title>

              {broken || !item.image ? (
                <div className="aspect-[4/3] w-[min(92vw,40rem)] overflow-hidden rounded-2xl">
                  <ScenicArt scene={item.art} alt={item.title} />
                </div>
              ) : (
                <img
                  src={item.image}
                  alt={item.title}
                  decoding="async"
                  onError={() => setBroken(true)}
                  className="max-h-[78svh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
                />
              )}

              <p className="px-12 text-center text-sm font-semibold text-white">
                {item.title}
                <span className="ml-2 font-normal text-white/60">
                  {index + 1} / {items.length}
                </span>
              </p>

              <Dialog.Close className={`${btn} absolute top-3 right-3`} aria-label="Close photo">
                <X className="size-5" />
              </Dialog.Close>
              {items.length > 1 && (
                <>
                  <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={`${btn} absolute top-1/2 left-2 -translate-y-1/2 sm:left-4`}>
                    <ChevronLeft className="size-6" />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Next photo" className={`${btn} absolute top-1/2 right-2 -translate-y-1/2 sm:right-4`}>
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
