import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CursorDot } from "@/components/CursorDot";
import { siteConfig } from "@/data/site-config";
import { siteUrl } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const homeTitle = `${siteConfig.name} | Full-Stack Software Developer in Malawi`;
const homeDescription =
  "Owen Matola is a full-stack software developer and cybersecurity enthusiast in Mzuzu, Malawi, building NestJS and Next.js apps. See projects, skills and CV.";

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
    "Software Developer Mzuzu",
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
    var theme = stored === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // suppressHydrationWarning: the inline script below sets data-theme on
  // <html> from localStorage before hydration, so the server-rendered value
  // ("dark") legitimately differs from the client's saved theme.
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {/* Runs before hydration to set the persisted theme on <html> (no
            flash of the wrong theme). Rendered via next/script so React
            doesn't warn about raw <script> tags in components. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
         <ThemeProvider>
           <Navbar />
           <main>{children}</main>
           <Footer />
           <CursorDot />
         </ThemeProvider>
      </body>
    </html>
  );
}