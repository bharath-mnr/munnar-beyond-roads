import { useState } from "react";
import { ImageIcon, Play } from "lucide-react";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import ScenicArt from "@/components/ScenicArt";

/* How tall a media card may get. Phones: at most ~3/4 of the screen height.
   Desktops: 34rem. The card keeps your file's own shape (portrait, landscape or
   square) so nothing is cropped or stretched. */
const MAX_H = "min(75svh, 34rem)";

/** Card that matches the media's own aspect ratio and never exceeds MAX_H. */
function Frame({ ratio, className, children }) {
  return (
    <div
      className={cn("max-w-full overflow-hidden rounded-3xl bg-forest shadow-xl", className)}
      style={{ aspectRatio: ratio, width: `min(100%, calc(${MAX_H} * ${ratio}))` }}
    >
      {children}
    </div>
  );
}

/** Tidy stand-in shown until you add your own file (see /public/media/README.txt). */
function Placeholder({ scene, icon: Glyph, label, hint }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <ScenicArt scene={scene} />
      <div className="absolute inset-0 bg-forest/35" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
        <span className="grid size-16 place-items-center rounded-full bg-accent text-forest shadow-xl">
          <Glyph className="size-7" />
        </span>
        <p className="font-display text-xl font-semibold">{label}</p>
        {import.meta.env.DEV && (
          <p className="max-w-xs rounded-lg bg-black/45 px-3 py-2 text-xs leading-relaxed">{hint}</p>
        )}
      </div>
    </div>
  );
}

export function JeepVideo({ className }) {
  const [failed, setFailed] = useState(false);
  const [ratio, setRatio] = useState(16 / 9); // replaced by the real shape once the video loads
  return (
    <Frame ratio={ratio} className={className}>
      {failed ? (
        <Placeholder
          scene="dawn"
          icon={Play}
          label="Jeep safari video"
          hint="Add your video at public/media/jeep-safari.mp4"
        />
      ) : (
        <video
          className="block h-full w-full bg-black object-contain"
          controls
          playsInline
          preload="metadata"
          poster={site.media.jeepVideoPoster}
          aria-label="Munnar jeep safari video"
          onLoadedMetadata={(e) => {
            const { videoWidth: w, videoHeight: h } = e.currentTarget;
            if (w && h) setRatio(w / h);
          }}
          onError={() => setFailed(true)}
        >
          {/* #t=0.1 makes the browser show a real frame instead of a black box before play */}
          <source src={`${site.media.jeepVideo}#t=0.1`} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}
    </Frame>
  );
}

export function JeepPhoto({ className }) {
  const [failed, setFailed] = useState(false);
  const [ratio, setRatio] = useState(4 / 5); // replaced by the real shape once the photo loads
  return (
    <Frame ratio={ratio} className={className}>
      {failed ? (
        <Placeholder
          scene="tea"
          icon={ImageIcon}
          label="Jeep safari photo"
          hint="Add your photo at public/media/jeep-safari.jpg"
        />
      ) : (
        <img
          src={site.media.jeepPhoto}
          alt="Open 4x4 jeep on a Munnar hill road during a jeep safari"
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-contain"
          onLoad={(e) => {
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
            if (w && h) setRatio(w / h);
          }}
          onError={() => setFailed(true)}
        />
      )}
    </Frame>
  );
}
