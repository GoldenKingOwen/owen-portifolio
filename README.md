# Owen Matola — Portfolio

A personal portfolio and résumé site for **Owen Matola**, an ICT student at Mzuzu University and software developer building full-stack web applications. Built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS v4.

**[GitHub](https://github.com/GoldenKingOwen)**

---

## ✨ Features

- **Landing sections** — Hero, About, Skills, Projects, Services, GitHub activity, Experience, Education, and Contact, all on a single scrollable page with a sticky navbar.
- **Active-section navigation** — the current section is highlighted in the navbar as you scroll, with smooth-scroll on link click.
- **Dark / light theme** — persisted preference with a no-flash inline init script; accessible via the toggle in the navbar.
- **Project detail pages** — each project has its own route (`/projects/[slug]`) with overview, problem statement, objectives, features, architecture, challenges, and solutions.
- **Contact form** — submits messages via the built-in API route (`app/api/contact/route.ts`) using [Resend](https://resend.com) for email delivery.
- **Polished UI** — Framer Motion animations, custom glow orbs, hover states, and a reduced-motion–friendly design.

## 🛠 Tech Stack

| Layer      | Technologies                                                            |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript    |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config via `@theme inline`) |
| Animation  | [Framer Motion](https://www.framer.com/motion/)                          |
| Icons      | [Lucide React](https://lucide.dev)                                       |
| Fonts      | `next/font` (Space Grotesk, Inter, JetBrains Mono)                       |
| Email      | [Resend](https://resend.com) (contact form)                              |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm (or your preferred package manager)

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. The page hot-reloads as you edit.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
# Used for SEO metadata (Open Graph, canonical links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Required for the contact form to send emails (Resend API key)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Where contact-form messages are delivered
CONTACT_EMAIL=you@example.com
```

> Without `RESEND_API_KEY` / `CONTACT_EMAIL` the contact form returns an honest error — the site works fine, but emails won't be sent.

## 📁 Project Structure

```
app/
  page.tsx                 # Home page (composes all sections)
  layout.tsx               # Root layout: fonts, metadata, theme, navbar, footer
  globals.css              # Tailwind v4 import + theme tokens + base styles
  projects/[slug]/page.tsx # Individual project detail pages
  api/contact/route.ts     # Contact form → Resend API route
components/
  Navbar.tsx               # Sticky nav with active-section scroll spy
  Hero.tsx · About.tsx · Skills.tsx · Projects.tsx · Services.tsx
  Experience.tsx · Education.tsx · GitHubActivity.tsx · Contact.tsx · Footer.tsx
  ui/                      # Reusable bits: Card, Badge, GlowOrb, SectionHeading, …
data/                      # Content: projects, experience, education, skills, site config
types/                     # Shared TypeScript interfaces
lib/utils.ts               # cn(), getWhatsAppLink(), and other helpers
```

All content lives in `data/` — edit those files to update the site without touching component code.

## 📜 Scripts

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `npm run dev`      | Start the dev server            |
| `npm run build`    | Create an optimized production build |
| `npm start`        | Run the production build        |
| `npm run lint`     | Run ESLint                      |

