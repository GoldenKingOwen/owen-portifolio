# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters, hiring managers and engineering leads scanning the site in under 60 seconds. Often on mobile, often on slow connections (Malawi / Africa). They are deciding whether to open the CV, a repo, or send a message.

## Product Purpose

A personal portfolio for Owen Matola, a final-year BSc ICT student at Mzuzu University and software development intern at Infi-Tech. It shows that he ships real full-stack systems (NestJS microservices, multi-tenant architecture, RabbitMQ, JWT auth, Next.js) and cares about security (CTF work, cybersecurity coursework and certifications). Success: a visitor leaves convinced of the engineering depth and either downloads the CV, opens a repo, or makes contact. Register: brand / portfolio.

## Positioning

A junior engineer whose evidence is real: working repos, a live internship system, and honest self-rated skill levels (Comfortable / Intermediate / Familiar / Learning), not adjectives.

## Operating Context

Static Next.js site on Vercel. Content lives in `data/` (projects, skills, experience, education, certifications, site config). Contact form posts to Formspree. A theme toggle (dark / light) exists. Certificates are PDFs under `public/certifications`; CV at `public/cv/OwenCV.pdf`.

## Capabilities and Constraints

- Routes: `/` (single-page sections) and `/projects/[slug]` (three projects: chess-practice, cyber-awareness, tenant-feedback-portal).
- Do not change copy meaning, routes, or the `data/` structure.
- No new heavy dependencies; no stock photography or placeholder imagery; no lorem ipsum.
- Motion is GSAP only (core and ScrollTrigger). Opacity and transform only; nothing loops; reduced-motion and low-end visitors get final states and never download GSAP. Hooks: `data-hero`, `data-reveal`, `data-revealed`, `data-section`. Hover states are CSS, and the theme switch is a View Transition.
- Performance matters: slow mobile connections are the norm for the audience.
- SEO work is already done (metadata, JSON-LD, sitemap, OG images); the redesign must not regress it (single h1, landmarks, canonical, alt text).

## Brand Commitments

Stated by the user when opening the `redesign/cards` branch: Cards are allowed, as ONE component (`components/ui/Card.tsx`) with a defined anatomy: a flat tinted surface, a 1px border, the single 3px radius, no shadow, no gradient. Still refused: nested cards (never a Card inside a Card), identical-card grids with no hierarchy, glow orbs, gradients, glassmorphism and backdrop blur, shadows as decoration, icon-in-rounded-tile stacks, pill-badge clouds, and eyebrow chips.

## Motion Commitments

Motion principles, stated by the user for the `feat/inspired-polish-motion` branch: motion is purposeful (it shows order, arrival or state, never decoration); it animates transform and opacity only (clip-path insets and stroke drawing are paint-only and allowed); it uses one easing family (`power3.out` for entrances, `none` for scrubbed rules) and durations between 0.4s and 0.9s (hover and page-enter may be shorter); nothing loops; reduced-motion and low-end visitors get final states; content is always in the server HTML and must stay visible without JavaScript. The cursor follower and magnetic elements are a deliberate, documented exception to the quiet principle, limited to fine-pointer devices (see DESIGN.md). Section forms vary on purpose: cards, ruled lists, prose and a timeline, never one repeated component. Patterns are taken from references, never their layouts, copy or imagery.

## Evidence on Hand

Real content in `data/`: three projects with repos and (for two) live demos, an internship description with concrete architecture details, education history, skills with honest levels, certificate PDFs, a GitHub profile (GoldenKingOwen). Absent and not to be fabricated: testimonials (a hidden-when-empty slot exists in `data/testimonials.ts`), client names, metrics, LinkedIn URL. Real imagery exists only for the Chess project (a screenshot of the live demo); the other projects show no image, and no placeholder or mock-up is ever drawn. The internship is a software development internship; the multi-tenant portal was its assessment project, not its only work.

## Product Principles

1. Honest: no inflated claims; self-rated skill levels stay visible.
2. Precise: specific technologies and architecture decisions over adjectives.
3. Quietly confident: no hype, no decoration that doesn't carry information.
4. Evidence over adjectives: real projects, repos, and certificates are the visual content.
5. Fast to scan: the first screen answers who, what, and where to go next.

## Accessibility & Inclusion

WCAG AA contrast in both themes, visible keyboard focus, reduced-motion respected, touch targets of at least 44px, usable at 360px width and on slow connections.
