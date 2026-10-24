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

