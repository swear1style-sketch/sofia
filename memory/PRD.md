# sofiapulse — Premium Marketing Site

## Problem
Deliver a $50k-quality marketing site for sofiapulse — premium, minimal, cinematic, matching the studio quality of terminal-industries.com. Flat lavender theme (`oklch(0.895 0.055 297)` ≈ `#E5DDFE`).

## Architecture
Vite + TanStack Start + React 19 + Tailwind v4 + Framer Motion + Lenis (smooth scroll). No backend used for the landing.

## Implemented (2026-01)
- Intro/welcome loader: curtain-split reveal, logo mark, magazine-footer meta, loading counter (sessionStorage-gated).
- Hero: flat lavender bg (single premium color, no gradients/blobs), word-by-word masked reveals, studio meta strip, scroll indicator.
- Hero card stack: 3D fanned deck with mouse-parallax tilt + spring-based fly-out-to-back auto-cycle.
- Cinematic parallax section: original untinted video, canvas-scrubbed by scroll, matches hero color at seam.
- LiquidNav: glass pill, auto-hide on scroll-down / spring-back on scroll-up.
- Global Lenis smooth scroll (respects prefers-reduced-motion).
- Fine grain texture (2.5% opacity) over hero for premium matte feel.
- Scroll-linked hero opacity/scale dissolve into the cinematic scene.

## Next / Backlog
- Add sections below the parallax (case studies, features grid, testimonials, footer).
- Custom cursor.
- Route-transition animation between pages.
- Add analytics.
