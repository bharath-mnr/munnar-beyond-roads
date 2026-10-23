# Munnar Beyond Roads

Frontend-only website: jeep safari, photography and stay packages in Munnar, Kerala.
Vite 7 · React 18 · react-router-dom 7 · Tailwind 4 · shadcn/ui-style components (radix-ui) · three.js hero.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build + SEO pages (dist/)
npm run preview    # serve dist/ at http://localhost:4173
```

## Before you go live (important)

1. **Set your real domain.** `src/data/site.js` has a placeholder `url`
   (`https://www.munnarbeyondroads.com`). Change it, or build with
   `SITE_URL=https://yourdomain.com npm run build`. Canonical links, sitemap,
   social previews and structured data all use it.
2. **Add your jeep video and photo** in `public/media/`:
   - `jeep-safari.mp4` (the video)
   - `jeep-safari-poster.jpg` (still shown before the video plays)
   - `jeep-safari.jpg` (the photo)

   Until they exist, the Jeep Safari page shows illustrated placeholders.
   Names and paths are set in `site.media` in `src/data/site.js`.
3. Contact details (2 phones, email, Instagram) are in `src/data/site.js`.
   WhatsApp buttons use the first phone number.

## Where to edit

| What | File |
| --- | --- |
| Phones, email, Instagram, domain, media paths | `src/data/site.js` |
| Services, FAQs, packages, page copy | `src/data/content.js` |
| Page titles, descriptions (SEO) | `src/seo/pages.js` |
| Structured data (JSON-LD) | `src/seo/schema.js` |
| Colours / theme | `src/index.css` |

If you change how many FAQs a page shows (`<FAQSection limit={n} />`), update
that page's `faq` number in `src/seo/pages.js` so the FAQ structured data matches.

## SEO included

- Unique title, description, canonical, Open Graph and Twitter tags per page,
  written into each page's HTML at build time (`dist/<route>/index.html`) and
  kept in sync while browsing.
- JSON-LD: TravelAgency/LocalBusiness, WebSite, BreadcrumbList, Service,
  ContactPage and FAQPage (matches the visible FAQs).
- `sitemap.xml`, `robots.txt`, social image (`og-image.png`), icons, web manifest.
- Unknown URLs are `noindex`; the old `/explore` URL redirects to `/services`.
- Fast-loading, mobile-first pages (Core Web Vitals help ranking).

After deploying: add the site to Google Search Console, submit
`/sitemap.xml`, and create a Google Business Profile for Munnar Beyond Roads
(biggest win for local "jeep safari Munnar" searches).

## Deploy

Works on Vercel as-is (`vercel.json` included). For other hosts, serve `dist/`
and make sure each route's folder `index.html` is served, with `/index.html`
as the fallback for unknown paths.

## Performance notes

The 3D hero picks a quality tier from the device, lowers it automatically if
frames run slow, pauses when off-screen, and shows a still frame when the
visitor prefers reduced motion. No backdrop blur or heavy effects on phones.
