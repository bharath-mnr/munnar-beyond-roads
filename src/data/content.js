// All page copy lives here so it is easy to edit without touching components.
// `art` picks a built-in illustrated scene (see components/ScenicArt.jsx).
// To use a real photo instead, drop it in /public/images and add
//   image: "/images/your-photo.jpg"
// to any item below — it will replace the illustration automatically.

export const services = [
  {
    id: "safari",
    to: "/safari",
    icon: "Truck",
    title: "Jeep Safari",
    text: "Open 4x4 rides up misty ridgelines, through tea estates and onto trails no bus can reach.",
    art: "dawn",
    model: "jeep",
    bg: "linear-gradient(180deg,#16324a 0%,#4a6a6a 55%,#f2b777 100%)",
  },
  {
    id: "photography",
    to: "/photography",
    icon: "Camera",
    title: "Photography",
    text: "Couples, families, weddings and travel stories — shot by a photographer who knows the light here.",
    art: "tea",
    model: "camera",
    bg: "linear-gradient(180deg,#7fb4c8 0%,#bfd9cf 55%,#f6e3bd 100%)",
  },
  {
    id: "services",
    to: "/services",
    icon: "BedDouble",
    title: "Stay Packages & More",
    text: "Stay packages, tour planning, pickups and more — your whole Munnar trip arranged in one place.",
    art: "water",
    model: "stay",
    bg: "linear-gradient(180deg,#3b2a4f 0%,#8a5a5a 55%,#f08a4b 100%)",
  },
];

// Shown on the "More Services" page. No prices on purpose; edit freely.
export const moreServices = [
  {
    icon: "BedDouble",
    title: "Stay Packages",
    text: "Resorts, homestays and tea-estate stays in and around Munnar, matched to your group and budget.",
  },
  {
    icon: "Compass",
    title: "Tour Packages",
    text: "Multi-day Munnar sightseeing plans put together around your dates and interests.",
  },
  {
    icon: "Heart",
    title: "Honeymoon & Couple Trips",
    text: "Quiet stays, private moments and photo-friendly plans for couples.",
  },
  {
    icon: "Users",
    title: "Family & Group Trips",
    text: "Relaxed, well-paced plans for families, friends and larger groups.",
  },
  {
    icon: "Car",
    title: "Pickup & Transfers",
    text: "Pickup and drop from your stay, the railway station or the airport.",
  },
  {
    icon: "Tent",
    title: "Trekking & Camping",
    text: "Guided hill walks and camping experiences in the Munnar hills.",
  },
];

export const photoServices = [
  {
    icon: "Heart",
    title: "Couple & Honeymoon Shoots",
    text: "Soft light, tea rows and misty roads — natural, unposed portraits of the two of you.",
  },
  {
    icon: "Users",
    title: "Family & Group Portraits",
    text: "Relaxed sessions that keep kids, parents and grandparents all comfortable and smiling.",
  },
  {
    icon: "Sparkles",
    title: "Pre-wedding & Wedding",
    text: "Cinematic pre-wedding stories and ceremony coverage set against the Munnar hills.",
  },
  {
    icon: "Truck",
    title: "Safari Photo Add-on",
    text: "A photographer rides along on your jeep safari so every viewpoint becomes a keepsake.",
  },
  {
    icon: "Plane",
    title: "Aerial / Drone Shots",
    text: "Sweeping views of estates and valleys, flown only where local rules and permits allow.",
  },
  {
    icon: "Video",
    title: "Reels & Travel Content",
    text: "Short vertical videos and stills for creators, brands and your own trip memories.",
  },
];

export const photoPackages = [
  {
    id: "moment",
    name: "Moment",
    tag: "Quick & easy",
    duration: "≈ 1 hour",
    features: ["One location", "Guided posing & candid shots", "Edited gallery delivered online"],
  },
  {
    id: "story",
    name: "Story",
    tag: "Most popular",
    duration: "≈ 3–4 hours",
    popular: true,
    features: [
      "2–3 locations incl. sunrise or sunset",
      "Outfit-change friendly",
      "Edited gallery + highlight reel",
    ],
  },
  {
    id: "journey",
    name: "Journey",
    tag: "Full experience",
    duration: "Full day",
    features: [
      "Photographer rides along on the safari",
      "Multiple locations",
      "Full gallery + short film",
    ],
  },
];

// ── Photography gallery ──────────────────────────────────────────────
// To use your client's photos:
//   1. Copy the files into  public/images/   (img1.jpg, img2.jpg, ... img8.jpg)
//   2. Change `title` to describe the photo (it is the caption and the alt text).
//   3. Optional `focus` keeps the important part visible when the photo is
//      cropped to fit its tile, e.g. "center top", "center 30%", "left center".
//   4. `span` sets the tile shape: "" (square), "tall" or "wide".
// If a file is missing, the illustration for `art` is shown instead.
export const photoGallery = [
  { title: "", image: "/images/img1.jpg", focus: "center", art: "tea", span: "tall" },
  { title: "", image: "/images/img2.jpg", focus: "center", art: "mist", span: "wide" },
  { title: "", image: "/images/img3.jpg", focus: "center", art: "dusk", span: "" },
  { title: "Waterfall stop", image: "/images/img4.jpg", focus: "center", art: "water", span: "" },
  { title: "Jeep in the clouds", image: "/images/img5.jpg", focus: "center", art: "dawn", span: "tall" },
  { title: "Forest trail", image: "/images/img6.jpg", focus: "center", art: "forest", span: "wide" },
  { title: "Misty morning walk", image: "/images/img7.jpg", focus: "center", art: "mist", span: "" },
  { title: "Chai break on the slopes", image: "/images/img8.jpg", focus: "center", art: "tea", span: "" },
];

export const steps = [
  {
    n: "01",
    title: "Tell us your plan",
    text: "Pick a safari, a photo session or just share your dates and group size.",
  },
  {
    n: "02",
    title: "Get a tailored quote",
    text: "We reply on WhatsApp with timings, stops and a clear price — no surprises.",
  },
  {
    n: "03",
    title: "Ride beyond the roads",
    text: "Your local driver-guide meets you at your stay. You just enjoy the view.",
  },
];

export const whyUs = [
  {
    icon: "MapPin",
    title: "Local drivers & guides",
    text: "People who grew up on these hills and know which track, which hour, which view.",
  },
  {
    icon: "ShieldCheck",
    title: "Safety first",
    text: "Maintained 4x4 jeeps, experienced drivers and honest advice when weather says no.",
  },
  {
    icon: "Camera",
    title: "Photo-first stops",
    text: "We plan around light, not just landmarks, so you get the shot and not just the selfie queue.",
  },
  {
    icon: "Clock",
    title: "Flexible itineraries",
    text: "Early sunrise, slow lunch or last-minute change — your day, your pace.",
  },
];

export const faqs = [
  {
    q: "What is the best time for a jeep safari in Munnar?",
    a: "Early mornings are best for clear views and soft light, especially for sunrise rides like Kolukkumalai. Post-monsoon months (roughly October to February) usually give the clearest skies.",
  },
  {
    q: "Are the jeep rides safe for children and older family members?",
    a: "Yes for most routes. Easy options like the Tea Estates trail or Full-Day Highlights suit families. Rough tracks such as Kolukkumalai are bumpy, so let us know your group so we can recommend the right ride.",
  },
  {
    q: "How many people fit in one jeep?",
    a: "A standard jeep typically seats around 5–6 guests comfortably, including bags. Larger groups can be split across multiple jeeps.",
  },
  {
    q: "Can I add a photographer to my safari?",
    a: "Absolutely. The Safari Photo Add-on puts a photographer in the jeep with you so the best moments are captured as they happen.",
  },
  {
    q: "Do you offer drone photography?",
    a: "Where it is allowed. Drone use depends on local rules, locations and permits, so we confirm feasibility before your booking.",
  },
  {
    q: "How do I book and pay?",
    a: "Send us a message on WhatsApp or use the contact form. We confirm availability, share a clear quote and agree payment details with you directly.",
  },
  {
    q: "What happens if it rains?",
    a: "Light rain can make for moody, beautiful rides. In heavy rain or unsafe conditions we will suggest a safer route or reschedule with you.",
  },
];
