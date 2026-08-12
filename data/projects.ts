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
    image: "/projects/chess-practice.png",
    links: {
      github: "https://github.com/GoldenKingOwen/simple-js-chess",
      live: "https://owen-chess.netlify.app/practice",
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
      features: [
        "Interactive chessboard with move validation",
        "Dedicated practice mode",
        "Deployed as a static site on Netlify",
      ],
      architecture:
        "Client-side only: vanilla JavaScript game logic and DOM rendering, deployed as a static site.",
      challenges: [
        "Implementing correct chess move and rule validation in plain JavaScript without a chess engine library",
      ],
      solutions: [
        "Built move-generation and validation logic from scratch, tested against standard chess rules",
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
    image: "/projects/cyber-awareness.png",
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
      features: [
        "Structured learning modules",
        "Progress tracking",
        "Gamification elements to reward learning milestones",
      ],
      architecture: "TODO: describe actual architecture once finalized.",
      challenges: [
        "Designing gamification mechanics that reinforce learning rather than distract from it",
      ],
      solutions: [
        "TODO: add once the approach is finalized.",
      ],
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
    image: "/projects/tenant-feedback-portal.png",
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
      features: [
        "Subdomain-based tenant routing",
        "JWT-verified, tenant-scoped API gateway with rate limiting and correlation IDs",
        "Ticket lifecycle management with attachments and member projections",
        "Feedback forms with local analytics projections",
        "Event-driven notifications across services",
      ],
      architecture:
        "Six services: api-gateway (edge-only, no database), identity-service, tenant-service, ticket-service, feedback-service, and notification-service — each owning its own Prisma schema. Domain mutations write transactional outbox records; RabbitMQ relays publish with confirms; consumers use unique inbox event IDs before acknowledging. Cross-service reads are served from local, eventually-consistent projections rather than cross-service SQL joins. Refresh tokens are issued as secure HttpOnly cookies; browser auth state is memory-only.",
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
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);