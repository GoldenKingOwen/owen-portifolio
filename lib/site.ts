// Single source of truth for the site's public origin.
//
// NEXT_PUBLIC_SITE_URL overrides it (e.g. once a custom domain is attached).
// In production builds a missing or localhost value can never be used, so
// canonical / og:url / sitemap URLs can't leak http://localhost:3000.
export const PRODUCTION_URL = "https://owen-portifolio.vercel.app";

const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production";

const isLocalhost = (value: string) => /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(value);

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const withScheme = raw && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;

  if (withScheme && !(isProduction && isLocalhost(withScheme))) {
    return withScheme.replace(/\/+$/, "");
  }
  return isProduction ? PRODUCTION_URL : "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
