// Central source of truth for the site's canonical URL.
//
// Set NEXT_PUBLIC_SITE_URL in .env.local to your deployed domain
// (e.g. https://owenmatola.dev) — canonical links, Open Graph URLs,
// the sitemap, and robots.txt all derive from this value. It falls
// back to localhost for local development.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"
).replace(/\/+$/, "");
