// Runs after `vite build`. A React SPA normally sends the SAME <head> for every
// URL, which is bad for SEO and for link previews (WhatsApp, Facebook, X...).
// This script writes one HTML file per route with its own title, description,
// canonical URL, Open Graph tags and JSON-LD, plus sitemap.xml and robots.txt.
//
// Set the real domain at build time:   SITE_URL=https://yourdomain.com npm run build
// (or edit `url` in src/data/site.js)

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { site } from "../src/data/site.js";

// let SITE_URL override the placeholder BEFORE the seo modules read site.url
if (process.env.SITE_URL) site.url = process.env.SITE_URL.replace(/\/+$/, "");

const { pages } = await import("../src/seo/pages.js");
const { buildHead, renderHeadHtml } = await import("../src/seo/head.js");
const { abs } = await import("../src/seo/schema.js");
const { navLinks } = await import("../src/data/site.js");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const template = await readFile(join(dist, "index.html"), "utf8");

if (!template.includes("<!--seo:start-->") || !template.includes("<!--seo:end-->")) {
  throw new Error("dist/index.html is missing the <!--seo:start--> / <!--seo:end--> markers");
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Text shown to crawlers / visitors that don't run JavaScript
function noscriptHtml(path) {
  const p = pages[path];
  const links = navLinks.map((l) => `<a href="${l.to}">${esc(l.label)}</a>`).join(" · ");
  return `<noscript>
      <main style="font-family:system-ui,sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem;line-height:1.6">
        <h1>${esc(p.h1)}</h1>
        <p>${esc(p.intro)}</p>
        <nav aria-label="Main">${links}</nav>
        <p>Call <a href="tel:${site.phones[0].tel}">${esc(site.phones[0].display)}</a> or
        <a href="tel:${site.phones[1].tel}">${esc(site.phones[1].display)}</a> ·
        <a href="mailto:${site.email}">${esc(site.email)}</a> ·
        <a href="${site.instagram}">Instagram</a></p>
        <p>${esc(site.name)}, ${esc(site.location)}.</p>
      </main>
    </noscript>`;
}

const startTag = "<!--seo:start-->";
const endTag = "<!--seo:end-->";

for (const path of Object.keys(pages)) {
  const head = renderHeadHtml(buildHead(path));
  let html = template.replace(
    new RegExp(`${startTag}[\\s\\S]*?${endTag}`),
    () => `${startTag}\n    ${head}\n    ${endTag}`,
  );
  html = html.replace("<!--seo:noscript-->", () => noscriptHtml(path));

  const out = path === "/" ? join(dist, "index.html") : join(dist, path, "index.html");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
}

// ── sitemap.xml ──
const today = new Date().toISOString().slice(0, 10);
const urls = Object.entries(pages)
  .map(
    ([path, p]) => `  <url>
    <loc>${abs(path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n");
await writeFile(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
);

// ── robots.txt ──
await writeFile(
  join(dist, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`,
);

console.log(
  `SEO: wrote ${Object.keys(pages).length} pages, sitemap.xml and robots.txt for ${site.url}`,
);
if (/munnarbeyondroads\.com/.test(site.url) && !process.env.SITE_URL) {
  console.log(
    "SEO: using the placeholder domain from src/data/site.js. Set SITE_URL=https://your-real-domain before the final build.",
  );
}
