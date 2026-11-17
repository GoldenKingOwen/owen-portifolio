# Owen Matola — Portfolio

[Live portfolio](https://owen-portifolio.vercel.app)

<!-- TODO(owen): add a current hero screenshot at docs/images/portfolio-hero.png -->

## About

A personal portfolio and résumé site built with Next.js App Router, React 19, TypeScript, and Tailwind CSS v4. The site includes project case studies, experience, education, certifications, and a Formspree contact form.

## Design decisions

- **Formspree:** handles contact submissions directly from the browser, avoiding a server-side email service and stored email credentials.
- **Content in `/data`:** keeps project and profile details separate from presentation components and easier to maintain.
- **Next.js App Router:** provides server-rendered pages, file-based project routes, metadata, sitemap, and robots support in one framework.

## Getting started

Requires Node.js 20+ and npm.

```bash
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:3000. `NEXT_PUBLIC_SITE_URL` sets the canonical origin and sitemap URL. The contact form uses the Formspree endpoint configured in `components/Contact.tsx`.

## Project structure

```
app/                 App Router pages, metadata, sitemap, robots, styles
components/          Page sections, UI, diagrams, and motion components
data/                Site, project, experience, education, and skill content
lib/                 Shared utilities and canonical site URL
public/              Public images, certificates, and CV download
types/               Shared TypeScript types
cv-src/              Source for the downloadable CV
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
