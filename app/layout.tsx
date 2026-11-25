import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MotionLoader } from "@/components/motion/MotionLoader";
import { siteConfig } from "@/data/site-config";
import { siteUrl } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { LenisProvider } from "@/components/LenisProvider";
import { GlobalAtmosphere } from "@/components/GlobalAtmosphere";

// next/font downloads and self-hosts the font files during the build.
const display = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display-face",
  display: "swap",
});
const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const labelFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

const homeTitle = `${siteConfig.name} | Full-Stack Software Developer in Malawi`;
const homeDescription =
  "Owen Matola is a full-stack software developer and cybersecurity enthusiast in Lilongwe, Malawi, building NestJS and Next.js apps. See projects, skills and CV.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: homeTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: homeDescription,
  applicationName: `${siteConfig.name} — Portfolio`,
  keywords: [
    "Owen Matola",
    "Owen Matola developer",
    "Full-Stack Developer Malawi",
    "Software Developer Lilongwe",
    "NestJS Developer Malawi",
    "Next.js Developer",
    "Cybersecurity",
  ],
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title: homeTitle,
    description: homeDescription,
    siteName: `${siteConfig.name} — Portfolio`,
    locale: "en_US",
    firstName: "Owen",
    lastName: "Matola",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Runs before hydration to set the persisted theme on <html>, so
// there's no flash of the wrong theme on load. Kept tiny and inline.
const themeInitScript = `
(function() {
  document.documentElement.classList.add('js');
  document.documentElement.setAttribute('data-sky', 'dawn');
  try {
    var stored = localStorage.getItem('portfolio-theme');
    var theme = stored === 'dark' || stored === 'light' ? stored : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  // Motion flag. Set only when the visitor allows motion and the device is not
  // low-end; the CSS that pre-positions content keys off it, so no-JS visitors,
  // reduced-motion visitors and low-end devices always see the final state.
  try {
    var n = navigator;
    var connection = n.connection || n.mozConnection || n.webkitConnection;
    var slow = connection && (connection.saveData || /^(slow-2g|2g)$/.test(connection.effectiveType || ''));
    var low = (n.deviceMemory && n.deviceMemory <= 2) || (n.hardwareConcurrency && n.hardwareConcurrency <= 2);
    if (slow) document.documentElement.setAttribute('data-save-data', 'true');
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && !low && !slow) {
      document.documentElement.setAttribute('data-motion', 'pending');
      // The opening sequence plays once per session. Its markup is already in the
      // server HTML; this attribute is what makes it visible before first paint,
      // so the homepage never flashes behind it.
      var played = false;
      try { played = sessionStorage.getItem('portfolioIntroPlayed') === '1'; } catch (e) {}
      if (!played) document.documentElement.setAttribute('data-intro', 'pending');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // suppressHydrationWarning: the inline script below sets data-theme on
  // <html> from localStorage before hydration, so the server-rendered value
  // ("light") legitimately differs from the client's saved theme.
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* A real inline script: the browser runs it while parsing, before anything paints, so
            the theme and the motion flag are set on first paint. (next/script's
            beforeInteractive queue runs only after the framework chunk loads.) */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${display.variable} ${bodyFont.variable} ${labelFont.variable} font-sans antialiased`}>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: siteConfig.name,
          jobTitle: "Full-Stack Software Developer",
          address: { "@type": "PostalAddress", addressLocality: "Lilongwe", addressCountry: "MW" },
          url: siteUrl,
          sameAs: [siteConfig.githubUrl],
        }} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-ui focus:border focus:border-field focus:bg-background focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-foreground"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <LenisProvider>
            <Navbar />
            <GlobalAtmosphere />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <MotionLoader />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
