---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/projects/[slug]/page.tsx"]
---

# Surface brief: portfolio home and project pages

Mode: Experience (the work leads, interface recedes). Audience and constraints: see PRODUCT.md.

## Direction contract

THESIS: The portfolio is set as a ruled engineering record, not a template. Facts, architecture and the repo links are the visual content. Cards are allowed on the redesign/cards branch as one flat component (see DESIGN.md). Refuses: glow orbs, glass and blurred surfaces, nested cards, icon tiles, eyebrow labels, pill badges, decorative status dots, custom cursor.

OWN-WORLD: Cool-neutral paper ground (oklch 0.985, hue 250) with near-black ink; dark theme is a deep blue-black, not a navy gradient. Hairline rules are the only container. One accent, a signal teal (oklch 0.46 light, 0.80 dark), used for links, focus and the primary action only. Geist for everything, Geist Mono only for measurements and data (dates, skill levels, versions). One radius (3px), no shadows, no gradients.

STORY: In under 60 seconds a recruiter learns who Owen is, what he ships (a multi-tenant NestJS and Next.js system, secured with JWT, evented with RabbitMQ), and where to go: CV, GitHub, project write-ups, contact.

FIRST VIEWPORT: Left, 2/3 width: name in display size with the role phrase beneath, one honest sentence, then CV as the solid primary action with GitHub and Contact as text links, then a five-row facts list (now, studying, based, working with, availability). Right, 1/3: a single rectangular portrait. No scroll cue, no badge.

FORM: Asymmetric editorial layout, section title in a left margin column and content in the right column, from the form list of dossier / engineering record. Seed key: brief-pinned (no roll; the user's brief pinned editorial/technical).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Card system (redesign/cards branch)

Confirmed by the user's brief; no separate confirmation round was held, and the interpretation calls below are marked.

- **Job:** group related facts so a recruiter scanning for under a minute can take one group at a time. Success is unchanged: CV, repo, project write-up, or contact.
- **One component, `components/ui/Card.tsx`.** Flat surface one step off the page (the `raised` token, both themes), 1px `border` token, the single 3px radius, no shadow, no gradient, no backdrop blur. Padding `p-5 sm:p-6`; featured `p-6 sm:p-8`.
- **Anatomy:** `<article>` (or `div` for the form) with Header (title as a real heading, plus one mono meta line), Body, and Footer (links). Heading level is h3 under the section h2.
- **Variants:** `default` (static, no hover); `interactive` (the title holds one real `<a>`, stretched over the card with `::after`, so there are no nested links; hover shifts border and surface only, under 150ms, no transform; the focus ring appears on the card when the title link has keyboard focus); `featured` (a combinable modifier: wider, more padding, a 2px teal top border, used for the one lead card in a section).
- **Rules:** never a Card inside a Card. The architecture diagram is outlined rules, not Cards. Skills levels are typography (a mono level label, tool names as text), never chips. No icons in tiles.
- **Per section:** Skills = one static card per group, laid out as columns (1/2/3) so short cards do not leave empty space. Projects = a featured, interactive portal card (with the diagram) and two default interactive cards side by side. Experience = featured current role, two quieter default cards. Education = one default card per qualification. Contact = the form in one card (`div`). About, hero and footer stay uncarded.
- **Interpretation calls (revisit if wrong):** (1) Project cards are `interactive`: the title is the write-up link and replaces the separate "Read the X write-up" text link, because two links to one URL in a card would break "one tab stop per card". "One tab stop per card" is read as: the card's own target adds exactly one stop; the GitHub and live links in the footer are separate, labelled stops. (2) `featured` is a modifier, not an exclusive variant, so the portal card can be both featured and interactive. (3) Hooks: every card carries `data-reveal` and `data-card`; Experience and Education cards also carry `data-entry`; the section body hook is renamed `data-section-body`.
- **Open, not assumed:** a short Services row (2 to 3 text-only cards) is proposed in the PR, not built.

## Inspired polish and motion (feat/inspired-polish-motion)

Confirmed by the user's brief (patterns taken from references, never their layouts, copy or imagery); no separate confirmation round was held. Interpretation calls are marked and can be reversed.

- **Section forms, varied on purpose:** hero (statement), About (prose with a scrubbed lead), Skills (static cards under a one-line summary), Projects (featured card with the diagram, two default cards, real imagery only), Services (ruled list), Experience and Education (cards on a vertical timeline rail), Testimonials (hidden slot, never built from invented quotes), Contact (closing headline, big email link, plain channel list, form in one card), footer (one row plus the repo link).
- **Hero:** name stays the largest type; a one-line "Now" block derived from `data/` (internship at Infi-Tech; BSc ICT at Mzuzu University). It does not say the portal is the internship work. A "Malawi" line shows local time (Africa/Blantyre), refreshed once a minute.
- **Interpretation calls:** (1) Services rows link to `#contact` (internal), so a short rule slides in on hover instead of an arrow, because an arrow in this system means "leaves the site". (2) The architecture diagram's boxes are HTML, so DrawSVG draws the SVG connectors and the box outlines wipe in with a `clip-path`. (3) Hover scale on the project image and the link-underline slide are CSS transforms (lighter than JS and identical in effect); the card itself stays transform-free. (4) The enter-only route fade stays in the already-shipped MotionEffects instead of `template.tsx`; same behaviour, no extra wrapper. (5) The Skills summary line is derived from the levels in `data/skills.ts`. (6) The Contact headline reuses the existing sentence "Have a project in mind or want to collaborate?". (7) Services copy is the original five one-line items, now in `data/services.ts`. (8) Only Chess Practice has real imagery (a screenshot of its live demo); Cyber Awareness has no live UI and the portal has none, so they show no image. (9) The timeline is a single left rail, not alternating sides. A unified timeline (jobs, education, CTF milestones) is proposed, not built.
- **Cursor and magnetic:** fine-pointer, hover-capable, motion-allowed devices only; native cursor kept; documented exception in DESIGN.md.
- **Budget:** no LCP or CLS regression, TBT delta under 50ms, added JS under about 35 KB gzipped, no long task over 50ms from animation init.

