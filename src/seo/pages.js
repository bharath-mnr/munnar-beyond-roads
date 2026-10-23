//src/seo/pages.js
// Per-page SEO copy. Used by BOTH the running site (src/seo/Seo.jsx) and the
// build step (scripts/postbuild-seo.mjs), so plain JavaScript only.
//
// Keep titles under ~60 characters and descriptions under ~160.
// `faq` = how many FAQ items that page shows (must match the `limit` passed to <FAQSection /> on that page).

export const pages = {
  "/": {
    label: "Home",
    title: "Munnar Jeep Safari & Photography | Munnar Beyond Roads",
    description:
      "Munnar jeep safari, photography and stay packages with local guides. Open 4x4 rides, tea-estate trails and photo-first stops in Munnar, Kerala.",
    h1: "Travel beyond the roads of Munnar",
    intro:
      "Jeep safaris, photography and stay packages in Munnar, Kerala. Open 4x4 rides, local guides and photo-first stops across the tea hills.",
    faq: 5,
    changefreq: "weekly",
    priority: "1.0",
  },
  "/safari": {
    label: "Jeep Safari",
    title: "Munnar Jeep Safari – Open 4x4 Rides | Munnar Beyond Roads",
    description:
      "Book a Munnar jeep safari with local driver-guides. Open 4x4 rides through tea estates and hill roads for couples, families and groups.",
    h1: "Munnar jeep safari: ride the hills only a jeep can reach",
    intro:
      "Open 4x4 rides through Munnar's tea estates and hill tracks, with a local driver-guide at the wheel.",
    faq: 4,
    changefreq: "monthly",
    priority: "0.9",
    service: {
      name: "Munnar Jeep Safari",
      type: "Jeep safari",
      description:
        "Open 4x4 jeep safaris in Munnar, Kerala with local driver-guides, through tea estates and hill roads.",
    },
  },
  "/photography": {
    label: "Photography",
    title: "Munnar Photographer for Couples & Weddings | Beyond Roads",
    description:
      "Couple, honeymoon, family and pre-wedding photography in Munnar's tea gardens and hills. Add a photographer to your jeep safari.",
    h1: "Moments worth framing, in light worth waiting for",
    intro:
      "Portrait, travel and wedding photography across Munnar's tea gardens, misty ridges and waterfalls.",
    faq: 6,
    changefreq: "monthly",
    priority: "0.9",
    service: {
      name: "Munnar Photography",
      type: "Photography",
      description:
        "Couple, honeymoon, family, pre-wedding and travel photography in Munnar, Kerala.",
    },
  },
  "/services": {
    label: "More Services",
    title: "Munnar Stay Packages & Tours | Munnar Beyond Roads",
    description:
      "Stay packages, tour packages, honeymoon and family trips, pickups and transfers in Munnar, Kerala. Tell us your plan and we'll arrange it.",
    h1: "Stay packages and more for your Munnar trip",
    intro:
      "Beyond jeep safaris and photography, we can help arrange the rest of your trip, from where you stay to how you get there.",
    faq: 4,
    changefreq: "monthly",
    priority: "0.8",
  },
  "/contact": {
    label: "Contact",
    title: "Contact Munnar Beyond Roads | Jeep Safari & Photography",
    description:
      "Call, WhatsApp or email Munnar Beyond Roads to book a jeep safari, photography session or stay package in Munnar, Kerala.",
    h1: "Let's plan your ride",
    intro:
      "Call, WhatsApp or send an enquiry. Tell us your dates and group size and we'll reply with a clear plan and timings.",
    faq: 0,
    changefreq: "yearly",
    priority: "0.7",
    contactPage: true,
  },
};

export const notFoundPage = {
  title: "Page not found | Munnar Beyond Roads",
  description: "This page could not be found. Head back to Munnar Beyond Roads.",
  noindex: true,
};

/** Normalise "/safari/" → "/safari" and find the page, or null for unknown paths. */
export function pageFor(pathname) {
  const clean = (pathname || "/").replace(/\/+$/, "") || "/";
  return pages[clean] ? { path: clean, page: pages[clean] } : null;
}
