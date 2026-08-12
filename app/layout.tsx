import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/data/site-config";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | ICT Student & Software Developer`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.shortBio,
  keywords: [
    "Owen Matola",
    "Software Developer",
    "Full-Stack Developer",
    "Web Developer",
    "Network Engineer",
    "Cybersecurity Enthusiast",
    "Next.js Developer",
    "NestJS Developer",
    "Malawi Developer",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${siteConfig.name} | ICT Student & Software Developer`,
    description: siteConfig.shortBio,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ICT Student & Software Developer`,
    description: siteConfig.shortBio,
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
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
        </ThemeProvider>
      </body>
    </html>
  );
}