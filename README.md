# Owen Matola — Portfolio

A personal portfolio and résumé site for **Owen Matola**, an ICT student at Mzuzu University and software developer building full-stack web applications. Built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS v4.

**[GitHub](https://github.com/GoldenKingOwen)**

---

## ✨ Features

- **Landing sections** — Hero, About, Skills, Projects, Services, Experience, Education, Testimonials, and Contact, all on a single scrollable page with a fixed navbar.
- **Active-section navigation** — the current section is highlighted in the navbar as you scroll, using a scroll-spy rather than a scroll listener.
- **Dark / light theme** — persisted preference with a no-flash inline init script; accessible via the toggle in the navbar.
- **Project detail pages** — each project has its own route (`/projects/[slug]`) with a case-study structure: overview, problem statement, goals, role, technical approach, architecture, decisions, challenges, status, and related work.
- **Contact form** — validated in the browser and submitted straight to [Formspree](https://formspree.io) (AJAX), so no email credentials are needed on the server.
- **Polished UI** — GSAP entrance and scroll reveals (opacity and transform only), a view-transition theme fade, hover states, and a design that skips motion entirely for reduced-motion and low-end visitors. Content is server-rendered and remains accessible without JavaScript.

## 🛠 Tech Stack

| Layer      | Technologies                                                            |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript    |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config via `@theme inline`) |
| Animation  | [GSAP](https://gsap.com) with ScrollTrigger                              |
| Icons      | [Lucide React](https://lucide.dev)                                       |
| Fonts      | Self-hosted Geist and Geist Mono via `next/font/local`                   |
| Email      | [Formspree](https://formspree.io) (contact form)                                                      |

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
```

> The contact form needs **no** API keys — it submits directly to Formspree from the browser (see `components/Contact.tsx`). To change the delivery inbox, update the form ID in that file or the destination in your Formspree dashboard.

## 📁 Project Structure

```
app/
  page.tsx                 # Home page (composes all sections)
  layout.tsx               # Root layout: fonts, metadata, theme, navbar, footer
  globals.css              # Tailwind v4 import + theme tokens + base styles
  fonts/                   # Self-hosted Geist files and OFL license
  projects/[slug]/page.tsx # Individual project detail pages

components/
  Navbar.tsx               # Fixed nav with active-section scroll spy
  Hero.tsx · About.tsx · Skills.tsx · Projects.tsx · Services.tsx
  Experience.tsx · Education.tsx · Certifications.tsx · Testimonials.tsx
  Contact.tsx · Footer.tsx
  ui/                      # Card, Section, ExternalLink
  motion/                  # Lazy GSAP loader, reveals, magnetic wrapper
data/                      # Content: projects, experience, education, skills, site config
types/                     # Shared TypeScript interfaces
lib/utils.ts               # cn(), getWhatsAppLink(), formatDateRange()
```

All content lives in `data/` — edit those files to update the site without touching component code.

## 📜 Scripts

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `npm run dev`      | Start the dev server            |
| `npm run build`    | Create an optimized production build |
| `npm start`        | Run the production build        |
| `npm run lint`     | Run ESLint                      |

