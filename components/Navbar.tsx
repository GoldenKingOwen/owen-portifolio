"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { cn } from "@/lib/utils";
import { setNavActive, syncNavLink } from "@/lib/nav-active";
import { siteConfig } from "@/data/site-config";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavItem } from "@/types";

const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

// Matches --header-h (4rem) in globals.css, which is also the section[id] scroll-margin-top.
const HEADER_OFFSET = 64;

const controlClass =
  "flex h-11 w-11 items-center justify-center rounded-ui border border-border text-foreground transition-colors hover:bg-raised";

// The current section is marked with data-active (and aria-current) by the
// scroll-spy in MotionEffects; the look is pure CSS, so no React state is
// involved and no scroll listener runs here.
const linkClass =
  "inline-flex min-h-11 items-center px-3 text-sm text-muted underline-offset-8 transition-colors hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground data-[active=true]:underline data-[active=true]:decoration-accent data-[active=true]:decoration-2";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Escape closes the mobile menu, so keyboard users are never trapped in it.
  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Native smooth scrolling is kept: it costs no JavaScript, and GSAP's
  // ScrollToPlugin would add weight for the same result.
  function scrollToSection(href: string) {
    const el = document.querySelector(href);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function handleNavClick(href: string) {
    setNavActive(href.slice(1)); // highlight immediately; the scroll-spy confirms as the page settles

    if (pathname !== "/") {
      // On a project page the section doesn't exist: go home and let the hash scroll.
      setMobileOpen(false);
      router.push(`/${href}`);
      return;
    }

    if (mobileOpen) {
      setMobileOpen(false);
      // Let the menu collapse first; a smooth scroll started mid-layout can be cancelled on phones.
      setTimeout(() => scrollToSection(href), 100);
    } else {
      scrollToSection(href);
    }
  }

  return (
    <header
      data-site-header
      // data-scrolled is set by the header ScrollTrigger in MotionEffects.
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent bg-background data-[scrolled=true]:border-border",
        mobileOpen && "border-border"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--header-h)] max-w-5xl items-center justify-between px-4 sm:px-6"
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            if (pathname !== "/") router.push("/");
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex min-h-11 items-center text-base font-semibold tracking-tight text-foreground"
        >
          {siteConfig.name}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={`/${item.href}`}
                data-nav-link={item.href.slice(1)}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={linkClass}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile, opens in a new tab"
            className={cn(controlClass, "hidden md:flex")}
          >
            <GithubIcon size={16} aria-hidden="true" />
          </a>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={cn(controlClass, "md:hidden")}
          >
            {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <ul id="mobile-menu" className="border-b border-border bg-background px-4 pb-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="border-t border-border first:border-t-0">
              <a
                href={`/${item.href}`}
                data-nav-link={item.href.slice(1)}
                ref={syncNavLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="flex min-h-12 items-center text-base text-foreground data-[active=true]:font-medium data-[active=true]:underline data-[active=true]:decoration-accent data-[active=true]:decoration-2 data-[active=true]:underline-offset-8"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
