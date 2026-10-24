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
