//src/seo/head.js
// Builds the <head> tags for a path. Shared by the browser (Seo.jsx) and the
// build step (scripts/postbuild-seo.mjs). Plain JavaScript, no JSX.
import { site } from "../data/site.js";
import { notFoundPage, pageFor } from "./pages.js";
import { abs, schemaFor } from "./schema.js";

const IMAGE_ALT =
  "Munnar Beyond Roads: jeep safari, photography and stay packages in Munnar, Kerala";

/** @returns {{title:string, tags:{tag:string, key:string, attrs:Object}[], jsonld:Object[]}} */
export function buildHead(pathname) {
  const found = pageFor(pathname);
  const page = found ? found.page : notFoundPage;
  const path = found ? found.path : null;
  const url = path ? abs(path) : null;
  const image = abs("/og-image.png");
  const meta = (name, content) => ({
    tag: "meta",
    key: `meta[name="${name}"]`,
    attrs: { name, content },
  });
  const prop = (property, content) => ({
    tag: "meta",
    key: `meta[property="${property}"]`,
    attrs: { property, content },
  });

  const tags = [
    meta("description", page.description),
    meta(
      "robots",
      page.noindex
        ? "noindex, follow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ),
    prop("og:type", "website"),
    prop("og:site_name", site.name),
    prop("og:locale", "en_IN"),
    prop("og:title", page.title),
    prop("og:description", page.description),
    prop("og:image", image),
    prop("og:image:width", "1200"),
    prop("og:image:height", "630"),
    prop("og:image:alt", IMAGE_ALT),
    meta("twitter:card", "summary_large_image"),
    meta("twitter:title", page.title),
    meta("twitter:description", page.description),
    meta("twitter:image", image),
    meta("twitter:image:alt", IMAGE_ALT),
    meta("geo.region", "IN-KL"),
    meta("geo.placename", "Munnar"),
    meta("geo.position", `${site.geo.lat};${site.geo.lng}`),
    meta("ICBM", `${site.geo.lat}, ${site.geo.lng}`),
  ];

  if (url) {
    tags.push({
      tag: "link",
      key: 'link[rel="canonical"]',
      attrs: { rel: "canonical", href: url },
    });
    tags.push(prop("og:url", url));
  }

  return {
    title: page.title,
    tags,
    jsonld: path ? schemaFor(path) : [],
  };
}

/* ───────── HTML string rendering (build step only) ───────── */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// "<" is escaped so a stray "</script>" in copy can never break out of the tag
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

export function renderHeadHtml(head) {
  const lines = [`<title>${esc(head.title)}</title>`];
  for (const t of head.tags) {
    const attrs = Object.entries(t.attrs)
      .map(([k, v]) => `${k}="${esc(v)}"`)
      .join(" ");
    lines.push(`<${t.tag} ${attrs} data-seo />`);
  }
  for (const ld of head.jsonld) {
    lines.push(`<script type="application/ld+json" data-seo-ld>${json(ld)}</script>`);
  }
  return lines.join("\n    ");
}
