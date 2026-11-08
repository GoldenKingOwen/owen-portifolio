"use client";

import { useEffect, useRef, useState } from "react";
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
// Matches --header-h (4rem) in globals.css, which is also the section[id] scroll-margin-top.
const HEADER_OFFSET = 64;

const controlClass =
  "flex h-11 w-11 items-center justify-center rounded-ui border border-border text-foreground transition-[color,background-color,transform] duration-200 hover:bg-raised active:scale-[0.98] active:bg-raised-hover";

// The current section is marked with data-active (and aria-current) by the
// scroll-spy in MotionEffects; the look is pure CSS, so no React state is
// involved and no scroll listener runs here.
const linkClass =
  "relative inline-flex min-h-11 items-center px-3 text-sm text-muted transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 after:content-[''] hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground data-[active=true]:after:scale-x-100";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Escape closes the mobile menu and returns focus to its trigger, so keyboard
  // users are never left with focus on an element that has just unmounted.
  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // A pointer outside the header dismisses the panel; clicks on its links are
  // handled by handleNavClick, which closes it after the navigation starts.
  useEffect(() => {
    if (!mobileOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (!headerRef.current?.contains(e.target as Node)) setMobileOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

  // Browser back/forward should not leave the panel open. In-app navigation
  // closes it in handleNavClick, so no pathname effect is needed.
  useEffect(() => {
    function onPopState() {
      setMobileOpen(false);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
    const wasMobileOpen = mobileOpen;
    setMobileOpen(false);

    // The clicked link unmounts with the panel, so keep keyboard focus on the trigger.
    if (wasMobileOpen) window.requestAnimationFrame(() => toggleRef.current?.focus());

    if (pathname !== "/") {
      // On a project page the section doesn't exist: go home and let the hash scroll.
      router.push(`/${href}`);
      return;
    }

    if (wasMobileOpen) {
      // Let the menu collapse first; a smooth scroll started mid-layout can be cancelled on phones.
      setTimeout(() => scrollToSection(href), 320);
    } else {
      scrollToSection(href);
    }
  }

  return (
    <header
      ref={headerRef}
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
            setMobileOpen(false);
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
            className={`${controlClass} max-md:hidden`}
          >
            <GithubIcon size={16} aria-hidden="true" />
          </a>
          <ThemeToggle />
          <button
            ref={toggleRef}
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

      {/* Always mounted so the panel can animate open and closed. The collapsed
          panel is inert, so its links leave the tab order. */}
      <div
        id="mobile-menu"
        className={cn(
          "grid bg-background transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden",
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
        inert={!mobileOpen}
        aria-hidden={!mobileOpen}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="px-4 pb-3">
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
                  className="relative flex min-h-12 items-center text-base text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 after:content-[''] data-[active=true]:font-medium data-[active=true]:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
