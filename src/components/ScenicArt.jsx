import { useId, useState } from "react";

/**
 * Original illustrated Munnar scenes (SVG). Used as image placeholders so the
 * site looks finished before real photos are added. Pass `src` to show a real
 * photo instead.
 */
const SCENES = {
  dawn: {
    sky: ["#16324a", "#f2b777"],
    sun: { x: 290, y: 128, r: 34, c: "#ffe3a8" },
    hills: ["#2c5a63", "#2f6f4e", "#1d4a33"],
    road: "#d9a566",
  },
  tea: {
    sky: ["#9ec9d9", "#f6e3bd"],
    sun: { x: 80, y: 80, r: 26, c: "#fff2c9" },
    hills: ["#86b872", "#4d9a4a", "#2d6b3a"],
    rows: true,
  },
  mist: {
    sky: ["#a9bfc6", "#ece6d6"],
    sun: null,
    hills: ["#a6bdb7", "#74a090", "#3f7a62"],
    fog: true,
  },
  water: {
    sky: ["#bcd9e2", "#f4ecd4"],
    sun: { x: 320, y: 70, r: 22, c: "#fff7da" },
    hills: ["#78ab92", "#3f7d5f", "#25573f"],
    fall: true,
  },
  forest: {
    sky: ["#cbd9b8", "#f2e6b8"],
    sun: { x: 300, y: 90, r: 24, c: "#fff3c4" },
    hills: ["#6a9a62", "#2f6a42", "#173f2a"],
    trees: true,
  },
  dusk: {
    sky: ["#3b2a4f", "#f08a4b"],
    sun: { x: 200, y: 168, r: 36, c: "#ffd08a" },
    hills: ["#5a4a6a", "#2b4a3f", "#14301f"],
    road: "#c98a55",
  },
};

export default function ScenicArt({ scene = "dawn", src, alt = "", className = "", focus }) {
  const uid = useId().replace(/:/g, "");
  const [broken, setBroken] = useState(false); // photo file missing → show the illustration
  const s = SCENES[scene] || SCENES.dawn;

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={focus ? { objectPosition: focus } : undefined}
        onError={() => setBroken(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const trees = [30, 62, 96, 150, 188, 232, 276, 318, 356];

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={`h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.sky[0]} />
          <stop offset="1" stopColor={s.sky[1]} />
        </linearGradient>
        <radialGradient id={`sun-${uid}`}>
          <stop offset="0" stopColor={s.sun?.c || "#fff"} stopOpacity="0.95" />
          <stop offset="1" stopColor={s.sun?.c || "#fff"} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`fog-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#sky-${uid})`} />

      {s.sun && (
        <>
          <circle cx={s.sun.x} cy={s.sun.y} r={s.sun.r * 3} fill={`url(#sun-${uid})`} />
          <circle cx={s.sun.x} cy={s.sun.y} r={s.sun.r} fill={s.sun.c} />
        </>
      )}

      {/* far ridge */}
      <path
        d="M0 175 Q50 120 115 152 T235 128 T330 150 T400 138 V300 H0Z"
        fill={s.hills[0]}
      />
      {s.fog && <rect y="130" width="400" height="90" fill={`url(#fog-${uid})`} />}

      {/* mid hill */}
      <path
        d="M0 215 Q70 160 150 192 T290 176 T400 198 V300 H0Z"
        fill={s.hills[1]}
      />

      {s.fall && (
        <g>
          <path d="M262 182 L268 182 L272 240 L258 240Z" fill="#fff" opacity="0.8" />
          <ellipse cx="265" cy="242" rx="18" ry="5" fill="#fff" opacity="0.55" />
        </g>
      )}

      {/* front hill */}
      <path
        d="M0 252 Q90 205 190 236 T400 224 V300 H0Z"
        fill={s.hills[2]}
      />

      {s.rows && (
        <g stroke="#9bd37a" strokeOpacity="0.45" strokeWidth="1.4" fill="none">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M0 ${262 + i * 7} Q100 ${218 + i * 9} 200 ${244 + i * 7} T400 ${236 + i * 8}`} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <path key={`m${i}`} d={`M0 ${222 + i * 6} Q90 ${178 + i * 7} 170 ${204 + i * 6} T400 ${190 + i * 6}`} />
          ))}
        </g>
      )}

      {s.trees && (
        <g fill="#0f3322">
          {trees.map((x, i) => {
            const y = 232 + (i % 3) * 8;
            const h = 34 + (i % 4) * 8;
            return <path key={x} d={`M${x} ${y} L${x - 11} ${y + h} L${x + 11} ${y + h}Z`} />;
          })}
        </g>
      )}

      {s.road && (
        <path
          d="M150 300 Q190 262 215 244 T262 205"
          stroke={s.road}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
      )}
    </svg>
  );
}
