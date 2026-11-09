import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MotionLoader } from "@/components/motion/MotionLoader";
import { siteConfig } from "@/data/site-config";
import { siteUrl } from "@/lib/site";

// Self-hosted so production builds never depend on reaching Google Fonts.
// Geist is licensed under the SIL Open Font License; see app/fonts/LICENSE.txt.
const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  weight: "100 900",
  variable: "--font-mono",
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
    var low = (n.deviceMemory && n.deviceMemory <= 2) || (n.hardwareConcurrency && n.hardwareConcurrency <= 2);
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches && !low) {
      document.documentElement.setAttribute('data-motion', 'pending');
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

  {/* Intro animation: plays once on initial page load, then transitions to main content */}
  <script
    dangerouslySetInnerHTML={{
      __html: `
(function() {
  // Only run intro on initial page load, not on navigations
  var alreadyPlayed = localStorage.getItem('portfolioIntroPlayed');
  if (alreadyPlayed === '1') return;
  
  // Check for reduced motion
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    localStorage.setItem('portfolioIntroPlayed', '1');
    return;
  }
  
  // Find the name element and trigger the split text animation
  var nameEl = document.querySelector('[data-hero-split="words"]');
  if (!nameEl) return;
  
  // Split and animate the name
  var nameSplit = SplitText.create(nameEl, { type: 'words,lines', mask: 'lines' });
  
  var tl = gsap.timeline({
    onComplete: function() {
      localStorage.setItem('portfolioIntroPlayed', '1');
    }
  });
  
  tl.from(nameSplit.words, {
    yPercent: 110,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.07
  });
  
  var subEl = document.querySelector('[data-hero-split="lines"]');
  if (subEl) {
    var subSplit = SplitText.create(subEl, { type: 'lines', mask: 'lines' });
    tl.from(subSplit.lines, {
      yPercent: 110,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08
    }, 0.16);
  }
})();
`
    }}
  />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-ui focus:border focus:border-field focus:bg-background focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-foreground"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <MotionLoader />
        </ThemeProvider>
      </body>
    </html>
  );
}