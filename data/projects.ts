import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "chess-practice",
    name: "Chess Practice",
    shortDescription:
      "A browser-based chess game with a dedicated practice mode for working through positions and moves.",
    problemSolved:
      "Gives players a lightweight, no-install way to practice chess moves and rules directly in the browser.",
    technologies: ["JavaScript", "HTML5", "CSS3"],
    status: "Live",
    featured: false,
    image: "/projects/chess-practice.jpg",
    imageAlt:
      "Screenshot of the live Chess Practice demo: its home screen, with options to play online, play the bot, or start a local game.",
    links: {
      github: "https://github.com/GoldenKingOwen/simple-js-chess",
      live: "https://owen-chess.netlify.app/",
    },
    detail: {
      overview:
        "A chess application built with vanilla JavaScript, featuring a practice mode for working through the game one move at a time in the browser.",
      problemStatement:
        "Most chess practice tools require an account or a heavy client. This project focuses on a fast, dependency-light way to play and practice chess moves directly in a browser tab.",
      objectives: [
        "Implement standard chess rules and move validation in JavaScript",
        "Provide a practice mode separate from full-game play",
        "Keep the app fast and dependency-free enough to deploy as a static site",
      ],
      constraints: [
        "No chess-engine library: rules and move validation are implemented from scratch",
        "Client-side only, so the game works without an account or backend",
        "Deployable as a static site on Netlify",
      ],
      role:
        "Solo project. I built the chess rules and move validation, the practice mode, and the browser interface in vanilla JavaScript.",
      features: [
        "Interactive chessboard with move validation",
        "Dedicated practice mode",
        "Deployed as a static site on Netlify",
      ],
      architecture:
        "Client-side only: vanilla JavaScript game logic and DOM rendering, deployed as a static site.",
      decisions: [
        "Kept the game logic and DOM rendering in plain JavaScript with no framework",
        "Separated practice mode from full-game play",
      ],
      challenges: [
        "Implementing correct chess move and rule validation in plain JavaScript without a chess engine library",
      ],
      solutions: [
        "Built move-generation and validation logic from scratch, tested against standard chess rules",
      ],
      limitations:
        "Live and client-side only. There are no accounts or server-side persistence; the repository documents the available game modes.",
      lessons: [
        "Implementing chess rules from scratch made edge cases and state transitions explicit.",
        "A dependency-light client is fast to ship but leaves more validation work to the developer.",
      ],
    },
  },
  {
    slug: "cyber-awareness",
    name: "Cyber Awareness Platform",
    shortDescription:
      "A gamified cybersecurity awareness platform designed to teach learners security fundamentals through interactive challenges.",
    problemSolved:
      "Makes cybersecurity awareness training more engaging by adding gamification instead of static, one-off training materials.",
    technologies: ["ReactJs", "TailwindCSS", "TypeScript", "NodeJs", "ExpressJs", "PostgreSQL"],
    status: "In Development",
    featured: false,
    image: "",
    links: {
      github: "https://github.com/GoldenKingOwen/cyber_awareness",
    },
    detail: {
      overview:
        "A cybersecurity training platform that delivers structured learning content with gamification elements to keep learners engaged.",
      problemStatement:
        "Traditional cybersecurity awareness training tends to be passive and easy to disengage from, leading to poor retention of security practices.",
      objectives: [
        "Deliver structured cybersecurity learning content",
        "Track learner progress",
        "Use gamification to improve engagement and retention",
      ],
      constraints: [
        "Learning content must stay structured and progress-tracked",
        "Gamification must reinforce learning rather than distract from it",
      ],
      role:
        "In progress. I am building the platform and refining the learning and gamification model.",
      features: [
        "Structured learning modules",
        "Progress tracking",
        "Gamification elements to reward learning milestones",
      ],
      architecture:
        "The architecture is still being finalized. The repository currently lists React, Tailwind CSS, TypeScript, Node.js, Express, and PostgreSQL.",
      challenges: [
        "Designing gamification mechanics that reinforce learning rather than distract from it",
      ],
      solutions: [],
      limitations:
        "In development. The architecture, solution notes, and gamification mechanics are not final, and no live demo is available yet.",
    },
  },
  {
    slug: "tenant-feedback-portal",
    name: "Multi-Tenant Client Feedback & Support Portal",
    shortDescription:
      "A service-owned NestJS microservices platform with two Next.js frontends for multi-tenant customer feedback and support ticketing.",
    problemSolved:
      "Gives organizations an isolated, secure space to collect customer feedback and manage support tickets, with strict tenant data isolation at every layer.",
    technologies: [
      "NestJS",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Docker",
      "Prisma",
      "JWT",
    ],
    status: "In Development",
    featured: true,
    image: "",
    links: {
      github: "https://github.com/GoldenKingOwen/Tenant-Client-Feedback",
    },
    detail: {
      overview:
        "A service-owned microservices platform: an edge-only API gateway authenticates and rate-limits requests, derives tenant context from verified JWT claims, and forwards requests to the owning service. Five domain services — identity, tenant, ticket, feedback, and notification — each own their own data and Prisma schema.",
      problemStatement:
        "Organizations need a way to run isolated, secure feedback and support workflows for their own customers without data leaking across tenants, while still scaling each domain independently.",
      objectives: [
        "Enforce strict tenant isolation at the database and API layer",
        "Decompose the domain into independently deployable services",
        "Support real-time-ish, eventually-consistent projections between services",
      ],
      constraints: [
        "Tenant isolation must hold at both the database and API layer",
        "Each service owns its data and Prisma schema; no cross-service SQL joins",
        "Service-to-service updates must tolerate retries and duplicate deliveries",
        "JWT handling must not expose tokens in WebSocket URLs",
      ],
      role:
        "I designed and built the platform as my Infi-Tech internship assessment project: the five domain services, the edge-only API gateway, the two Next.js frontends (tenant workspace and platform admin console), and the RabbitMQ outbox/inbox event flows.",
      features: [
        "Two Next.js applications: a tenant workspace for portal, tickets, feedback, and billing, plus a platform-admin console for tenants, plans, users, and logs",
        "Subdomain-based tenant routing",
        "JWT-verified, tenant-scoped API gateway with rate limiting and correlation IDs",
        "Ticket lifecycle management with attachments and member projections",
        "Feedback forms with local analytics projections",
        "Event-driven notifications across services",
      ],
      architecture:
        "Two Next.js applications sit at the edge: the tenant workspace (portal, tickets, feedback, billing) and the platform-admin console (tenants, plans, users, logs). Behind them are six services: api-gateway (edge-only, no database), identity-service, tenant-service, ticket-service, feedback-service, and notification-service — each owning its own Prisma schema. Domain mutations write transactional outbox records; RabbitMQ relays publish with confirms; consumers use unique inbox event IDs before acknowledging. Cross-service reads are served from local, eventually-consistent projections rather than cross-service SQL joins. Refresh tokens are issued as secure HttpOnly cookies; browser auth state is memory-only.",
      decisions: [
        "Derive tenant context only from verified JWT claims and reject conflicting client-supplied tenant headers",
        "Keep the API gateway edge-only with no database of its own",
        "Use transactional outbox/inbox records with RabbitMQ confirms for reliable, idempotent delivery",
        "Serve cross-service reads from local, eventually-consistent projections instead of SQL joins",
        "Store refresh tokens in secure HttpOnly cookies and keep browser auth state in memory",
      ],
      challenges: [
        "Keeping tenant isolation airtight across five independently-owned services",
        "Coordinating eventually-consistent projections without introducing stale or conflicting state",
        "Securing WebSocket authentication without exposing JWTs in URL query parameters",
      ],
      solutions: [
        "Derived tenant IDs only from verified JWT claims and rejected conflicting client-supplied tenant headers",
        "Used a transactional outbox/inbox pattern with RabbitMQ for reliable, idempotent event delivery",
        "Required WebSocket auth via handshake cookies or short-lived handshake exchanges instead of query-param JWTs",
      ],
      limitations:
        "In development and not a production deployment. Cross-service views are eventually consistent by design. No user counts, performance benchmarks, or production SLAs are claimed.",
      lessons: [
        "Tenant identity is safest when derived once at the edge instead of trusted from request bodies.",
        "Idempotency belongs in the consumer, not only in the producer's retry logic.",
        "Explicit service boundaries make security and data ownership easier to reason about.",
      ],
    },
  },
  {
    slug: "world-scope",
    name: "WorldScope",
    shortDescription:
      "An ambitious development-data intelligence platform designed to make World Bank data easier to discover, understand, compare, and share — with Malawi, SADC, and Sub-Saharan Africa in focus.",
    problemSolved:
      "Official development data is authoritative but hard to approach: indicators are named in technical codes, context lives in separate metadata, and a number rarely travels with its source. WorldScope is being designed around that gap instead of around another API viewer.",
    // Verified in the deployed preview build only. Everything else the README
    // documents lives in plannedStack, clearly separated.
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "next-intl"],
    status: "Planning",
    statusNote: "Currently in the planning and foundation-design stage.",
    featured: false,
    image: "/projects/world-scope.png",
    imageAlt:
      "Screenshot of the WorldScope preview build: a dark indicator search screen with popular indicators and a browse-by-topic catalogue.",
    previewTitle: "Development-data intelligence",
    previewNote: "Preview build — early foundation",
    links: {
      github: "https://github.com/GoldenKingOwen/WorldScope",
      live: "https://world-scope-umber.vercel.app/",
    },
    detail: {
      overview:
        "WorldScope is a planned development-data intelligence platform built on World Bank open data, with a focus on Malawi, SADC, and Sub-Saharan Africa. Its intended purpose is to make development data easier to discover, understand, compare, and share. It is not intended to be merely an API viewer: the broader concept adds discovery, context, trust, and sharing capabilities on top of official development data.",
      problemStatement:
        "Development data is published, but it is not approachable. A World Bank indicator is found by its technical code, explanations sit apart from the numbers, and figures are shared without their source or data year. The project is being designed around discovery, context, trust, and sharing rather than around raw API access.",
      objectives: [
        "Discovery: be searchable by plain-language indicator name instead of technical indicator codes",
        "Context: explain indicators in plain language derived from official metadata, and benchmark peers between countries, regions, income groups, and SADC",
        "Trust: every number should carry its source, indicator code, data year, coverage, and retrieval time",
        "Sharing: make views shareable, charts embeddable, and data exportable with citation text",
        "Focus: curate indicator sets and peer groups for Malawi, SADC, and Sub-Saharan Africa",
      ],
      constraints: [
        "Planned capabilities must never be presented as shipped behaviour",
        "Every figure has to remain traceable to official metadata",
        "Malawi, SADC, and Sub-Saharan Africa are the starting scope, not an afterthought",
      ],
      role:
        "Solo project, currently in planning and foundation design. I am defining the product model — the indicator catalogue, the provenance record every number must carry, and the accessible chart layer later phases build on. No implementation phase has started.",
      features: [
        "Search 16,000+ indicators by plain-language name instead of technical indicator codes",
        "Plain-language explanations derived from official metadata",
        "Peer benchmarking between countries, regions, income groups, and SADC",
        "Every number carrying its source, indicator code, data year, coverage, and retrieval time",
        "Shareable views, embeddable charts, and exportable data with citation text",
        "Curated indicator sets and peer groups for Malawi, SADC, and Sub-Saharan Africa",
      ],
      architecture:
        "The platform is being designed around a cataloguing and query layer over World Bank open data, with provenance recorded alongside every figure and one accessible chart wrapper shared by later views. The deployed preview is an early application shell: the indicator catalogue, popular indicators, and topic browsing render, while data retrieval is not yet working.",
      decisions: [
        "Treat provenance as part of the data model rather than a footnote in the interface",
        "Keep chart rendering behind one accessible wrapper so every view shares keyboard and screen-reader behaviour",
        "Start from a curated indicator set and peer groups instead of exposing the full catalogue unfiltered",
      ],
      challenges: [
        "Making 16,000+ technical indicators navigable by plain language",
        "Keeping every figure traceable through ingestion, caching, and display",
        "Designing charts and maps that stay readable and accessible across very different data shapes",
      ],
      solutions: [],
      limitations:
        "Planning only: the README records Phase 0 as not started. The deployed preview is an early application shell — the catalogue and topic lists render, but indicator data retrieval is not working yet. Nothing described on this page should be read as a shipped feature.",
    },
    // Documented architecture. Not presented as a stack in use.
    plannedStack: [
      { layer: "Language", technology: "TypeScript (strict)" },
      { layer: "Web", technology: "Next.js App Router, Tailwind CSS, shadcn/ui" },
      { layer: "Charts", technology: "Apache ECharts" },
      { layer: "Maps", technology: "MapLibre GL" },
      { layer: "Internationalisation", technology: "next-intl" },
      { layer: "API", technology: "NestJS" },
      { layer: "Validation and API documentation", technology: "zod, OpenAPI via @nestjs/swagger" },
      { layer: "Jobs", technology: "pg-boss" },
      { layer: "Database", technology: "PostgreSQL 16" },
      { layer: "ORM", technology: "Prisma with hand-written SQL migrations" },
      { layer: "Tooling", technology: "pnpm workspaces, Turborepo, Vitest, Playwright, axe-core" },
    ],
    // Documented roadmap. Not a list of completed work.
    roadmap: [
      "Phase 0 — Foundation: catalog ingestion, provider client, query engine, cache, provenance, design system, and accessible chart wrapper",
      "Phase 1 — Students and researchers: search, country profiles, peer benchmarking, indicator pages, comparison studio, correlation explorer, and cited CSV export",
      "Phase 2 — Journalists: embeds, chart image export, notable changes, and world map",
      "Phase 3 — Developers: public API v1, keys, rate limits, documentation, and SDK",
      "Phase 4 — Everyone: accounts, watchlists, research workspaces, projects explorer, publications, Ask Data, and national data sources",
    ],
  }
];
export const featuredProjects = projects.filter((p) => p.featured);