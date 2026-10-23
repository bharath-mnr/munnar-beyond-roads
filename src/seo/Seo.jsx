//src/seo/Seo.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { buildHead } from "./head";

/**
 * Keeps <title>, meta tags, canonical link and JSON-LD in sync with the current
 * route while visitors navigate. (The same tags are also written into each
 * page's HTML at build time, so crawlers and link previews see them without
 * running any JavaScript.)
 */
export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const head = buildHead(pathname);
    document.title = head.title;

    // canonical only exists for real pages; remove it on unknown routes
    const canonicalKey = 'link[rel="canonical"]';
    if (!head.tags.some((t) => t.key === canonicalKey)) {
      document.head.querySelector(canonicalKey)?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }

    for (const t of head.tags) {
      let el = document.head.querySelector(t.key);
      if (!el) {
        el = document.createElement(t.tag);
        el.setAttribute("data-seo", "");
        document.head.appendChild(el);
      }
      for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    }

    document.head.querySelectorAll("script[data-seo-ld]").forEach((n) => n.remove());
    for (const ld of head.jsonld) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-seo-ld", "");
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    }
  }, [pathname]);

  return null;
}
