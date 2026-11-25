# Owen Matola — Portfolio

[Live portfolio](https://owen-portifolio.vercel.app)

<!-- TODO(owen): add the approved hero screenshot at docs/images/portfolio-hero.png, then embed it here. -->

## Signal from Lilongwe

A personal portfolio and résumé site built with Next.js App Router, React 19, TypeScript, Tailwind CSS v4, and GSAP. Its visual language pairs a field instrument panel with a notebook, using a rising-sun palette, editorial type, and lightweight motion.

## Design decisions

- **Formspree:** contact submissions go directly from the browser to Formspree, so the site does not need a server-side email service or stored email credentials.
- **Content in `/data`:** project, experience, education, skills, services, and site copy stay separate from presentation components and are rendered into the initial HTML.
- **Next.js App Router:** file-based project case studies, metadata, sitemap, robots rules, and server rendering live in the same routing system.
- **Progressive motion:** GSAP and ScrollTrigger enhance the page after render. Reduced-motion visitors and users on small or data-constrained devices retain the static layout and readable content.

## Getting started

Requires Node.js 20+ and npm.

```bash
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. Set `NEXT_PUBLIC_SITE_URL` to the canonical origin. The contact form uses the Formspree endpoint in `components/Contact.tsx`.

## Motion and interaction

GSAP, `@gsap/react`, ScrollTrigger, and SplitText power scroll reveals and section motion. Lenis provides smooth scrolling when motion is allowed. `cmdk` powers the keyboard command palette, and `d3-force` lays out the optional skills constellation. The skills list and all section copy remain available in server-rendered HTML. Reduced motion, Save-Data, and mobile breakpoints turn off decorative motion or use static layouts.

## Adding a project

1. Add its verified copy, status, links, image path, and technology array in `data/projects.ts`.
2. Keep planned technologies and features in the explicitly planned fields; do not describe them as shipped.
3. Add a representative screenshot under `public/projects/` only when one is available. Without one, `ProjectPreview` renders a labelled blueprint plate instead of pretending to show the live interface.
4. Confirm the slug is included in the project display order in `components/Projects.tsx`. Its technology array also feeds the skills graph links.

## Accessibility and performance

- Page content and project write-ups render without client JavaScript.
- Motion respects `prefers-reduced-motion`; Lenis and decorative motion are disabled for reduced motion, touch, and Save-Data/slow connections.
- Skills use a keyboard-operable graph on suitable desktop settings and a readable list by default on mobile or reduced motion.
- Images declare responsive `sizes`; focus rings, live regions, labelled controls, and visible text provide non-visual paths through interactive sections.
- Lighthouse and screen-reader scores are not asserted here; re-run the manual QA workflow before release.

## Project structure

```
app/                 App Router pages, metadata, sitemap, robots, styles
components/          Page sections, UI, diagrams, command palette, motion
data/                Site, project, experience, education, and skill content
lib/                 GSAP setup, scrolling, metadata, and shared utilities
public/              Images, certificates, and CV download
types/               Shared TypeScript types
cv-src/              Source for the downloadable CV
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with Webpack |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a Webpack production build |
| `npm start` | Serve the production build |
