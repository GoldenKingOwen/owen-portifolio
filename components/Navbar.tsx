"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site-config";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavItem } from "@/types";

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Glass effect only kicks in once the user has actually scrolled —
  // stays fully transparent over the hero.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlights the current section in the nav as the user scrolls.
  // Deterministic probe: the active section is the last one whose top
  // edge has passed a line ~35% down the viewport (below the fixed
  // header). Falls back to the last nav item when scrolled to the bottom,
  // in case the final section never reaches the probe line.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);

      const probe = window.innerHeight * 0.35;
      let current = NAV_ITEMS[0].href;

      for (const item of NAV_ITEMS) {
        const el = document.querySelector(item.href);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) {
          current = item.href;
        } else {
          break;
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        current = NAV_ITEMS[NAV_ITEMS.length - 1].href;
      }

      setActiveSection(current);
    }

    onScroll(); // initialize (covers refresh with restored scroll position)
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Matches the scroll-margin-top set on section[id] in globals.css, so
  // the section heading lands just below the fixed header.
  const HEADER_OFFSET = 72;

  // window.scrollTo with a computed position is more reliable on mobile
  // browsers than scrollIntoView (which some phones cancel when a menu
  // animation is running).
  function scrollToSection(href: string) {
    const el = document.querySelector(href);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function handleNavClick(href: string) {
    setActiveSection(href); // highlight immediately, scroll confirms below

    if (pathname !== "/") {
      // On a subpage (e.g. a project detail page) the section doesn't
      // exist here — navigate home and let the hash scroll to it.
      setMobileOpen(false);
      router.push(href); // e.g. "/#home"
      return;
    }

    if (mobileOpen) {
      setMobileOpen(false);
      // Let the drawer finish collapsing before scrolling — starting a
      // smooth scroll while the height animation runs can cancel it on
      // mobile devices.
      setTimeout(() => scrollToSection(href), 200);
    } else {
      scrollToSection(href);
    }
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#home");
          }}
          className="font-display text-lg font-semibold tracking-tight text-foreground"
        >
          {siteConfig.name}
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  activeSection === item.href
                    ? "bg-accent-violet/10 text-foreground"
                    : "text-muted hover:bg-surface hover:text-foreground"
                )}
                aria-current={activeSection === item.href ? "true" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:text-foreground"
          >
            <GithubIcon size={16} aria-hidden="true" />
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground"
          >
            {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-md md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                    activeSection === item.href
                      ? "bg-accent-violet/10 text-foreground"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  )}
                  aria-current={activeSection === item.href ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full bg-accent-violet transition-opacity",
                      activeSection === item.href ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}