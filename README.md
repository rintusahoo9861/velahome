# VelaHome — Next.js

Next.js (App Router, TypeScript) port of the single-file `../index.html` demo.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

| Path | What it is |
|---|---|
| `app/layout.tsx` | Fonts (`next/font`: Hanken Grotesk + the local VelaDisplay files), metadata, the `js` class that enables scroll reveals |
| `app/page.tsx` | Puts the sections together |
| `app/globals.css` | The original stylesheet, unchanged except font names → `var(--font-*)` and image URLs → `/…` |
| `app/fonts/` | VelaDisplay 300/400/600 (extracted from the base64 in the original) |
| `lib/homes.ts` | The six homes, contact numbers, budget/EMI helpers — edit listings here |
| `lib/hooks.ts` | `useInView`, `useFocusTrap`, reduced-motion check |
| `components/SiteProvider.tsx` | Enquiry pop-up + `EnquireButton`, menu state (React context) |
| `components/Hero.tsx` | Wordmark fit, day/dusk toggle, pointer depth |
| `components/Catalog.tsx` | 3D coverflow with type filter, dots, arrows, swipe, keys |
| `components/BudgetFinder.tsx` | Budget slider, bedroom chips, card stack, EMI line |
| `components/Consult.tsx` | Four-stage journey, scroll-drawn path, live open/closed status (IST) |
| `components/Faq.tsx` | Accordion with the gliding ring |
| `components/Footer.tsx` | Line art, magnetic button, nav dot, newsletter (demo) |
| `components/Menu.tsx` | Full-screen explore menu |
| `components/ScrollChrome.tsx` | Progress bar, floating quick nav, phone dock, hero parallax |
| `public/` | Images |

Images use plain `<img>` (not `next/image`) so the existing CSS, which targets the `img` elements directly, keeps working pixel for pixel.
