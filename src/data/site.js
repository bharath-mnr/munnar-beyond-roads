//src/data/site.js
// ─────────────────────────────────────────────────────────────
//  Central place for brand, contact and SEO details.
//  This file is also read by the build-time SEO script, so keep it
//  plain JavaScript (no JSX, no "@/" imports).
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Munnar Beyond Roads",
  short: "Beyond Roads",
  tagline: "Travel where the tarmac ends.",
  location: "Munnar, Idukki, Kerala, India",

  // IMPORTANT: change this to your real website address before deploying.
  // It is used for canonical links, the sitemap and Google's structured data.
  // (You can also set it at build time:  SITE_URL=https://yourdomain.com npm run build)
  url: "https://www.munnarbeyondroads.com",

  // Both numbers are shown on the site. WhatsApp buttons use the first one.
  phones: [
    { display: "+91 94469 32045", tel: "+919446932045", wa: "919446932045" },
    { display: "+91 80863 06050", tel: "+918086306050", wa: "918086306050" },
  ],

  email: "aniammu143143@gmail.com",

  instagram: "https://www.instagram.com/munnarbeyondroads/",
  instagramHandle: "@munnarbeyondroads",

  // Approximate centre of Munnar town (used for Google structured data)
  geo: { lat: 10.0889, lng: 77.0595 },

  // Your own media. Put the files in /public/media/ with exactly these names.
  // Until a file exists, the page shows a tidy illustrated placeholder.
  media: {
    jeepVideo: "/media/jeep-safari.mp4",
    jeepVideoPoster: "/media/jeep-safari-poster.jpg",
    jeepPhoto: "/media/jeep-safari.jpg",
  },
};

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/safari", label: "Jeep Safari" },
  { to: "/photography", label: "Photography" },
  { to: "/services", label: "More Services" },
  { to: "/contact", label: "Contact" },
];

/** Build a WhatsApp deep link with a pre-filled message (uses the first number). */
export function whatsappLink(message = "Hi! I'd like to plan a trip with Munnar Beyond Roads.") {
  return `https://wa.me/${site.phones[0].wa}?text=${encodeURIComponent(message)}`;
}
