//src/seo/schema.js
// schema.org JSON-LD (Google "structured data"). Plain JavaScript, no JSX.
import { site } from "../data/site.js";
import { faqs, moreServices } from "../data/content.js";
import { pages } from "./pages.js";

export const abs = (path = "/") => `${site.url.replace(/\/+$/, "")}${path === "/" ? "/" : path}`;
const ogImage = () => abs("/og-image.png");

const businessId = () => `${abs("/")}#business`;

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": businessId(),
    name: site.name,
    alternateName: site.short,
    url: abs("/"),
    description:
      "Jeep safaris, photography and stay packages in Munnar, Kerala, with local driver-guides and photographers.",
    slogan: site.tagline,
    image: ogImage(),
    logo: abs("/icon-512.png"),
    telephone: site.phones[0].tel,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Munnar",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: [
      { "@type": "City", name: "Munnar" },
      { "@type": "AdministrativeArea", name: "Idukki, Kerala" },
    ],
    contactPoint: site.phones.map((p) => ({
      "@type": "ContactPoint",
      telephone: p.tel,
      contactType: "customer service",
      areaServed: "IN",
    })),
    sameAs: [site.instagram],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Munnar Beyond Roads services",
      itemListElement: [
        "Jeep Safari",
        "Photography",
        ...moreServices.map((s) => s.title),
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${abs("/")}#website`,
    url: abs("/"),
    name: site.name,
    inLanguage: "en-IN",
    publisher: { "@id": businessId() },
  };
}

export function breadcrumbSchema(path) {
  const items = [{ name: "Home", path: "/" }];
  if (path !== "/") items.push({ name: pages[path].label, path });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqSchema(count) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.slice(0, count).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(path) {
  const s = pages[path].service;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.type,
    description: s.description,
    url: abs(path),
    provider: { "@id": businessId() },
    areaServed: { "@type": "City", name: "Munnar" },
  };
}

/** Every JSON-LD block for a page path. */
export function schemaFor(path) {
  const page = pages[path];
  if (!page) return [];
  const out = [];
  if (path === "/") {
    out.push(businessSchema(), websiteSchema());
  }
  out.push(breadcrumbSchema(path));
  if (page.service) out.push(serviceSchema(path));
  if (page.contactPage) {
    out.push({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      url: abs(path),
      name: page.title,
      about: { "@id": businessId() },
    });
  }
  if (page.faq > 0) out.push(faqSchema(page.faq));
  return out;
}
