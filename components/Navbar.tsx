"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command as CommandIcon, Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { setNavActive } from "@/lib/nav-active";
import { siteConfig } from "@/data/site-config";
import { ThemeToggle } from "@/components/ThemeToggle";
import { scrollToSection } from "@/lib/scroll";
import type { NavItem } from "@/types";

const CommandPalette = dynamic(() => import("@/components/CommandPalette").then((module) => module.CommandPalette), { ssr: false });

const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const linkClass = "relative inline-flex min-h-10 items-center px-3 text-sm text-muted transition-colors hover:text-foreground data-[active=true]:font-medium data-[active=true]:text-foreground";
const controlClass = "flex h-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-raised focus-visible:outline-offset-2";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mobileOpen && !dialog.open) dialog.showModal();
    if (!mobileOpen && dialog.open) dialog.close();
  }, [mobileOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let previous = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = window.scrollY;
        if (current < 80 || previous - current > 8) setHidden(false);
        else if (current - previous > 8) setHidden(true);
        previous = current;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function navigate(href: string) {
    setNavActive(href.slice(1));
    const wasMobileOpen = mobileOpen;
    setMobileOpen(false);
    if (wasMobileOpen) window.requestAnimationFrame(() => toggleRef.current?.focus());
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    if (href === "#home") scrollToSection("#home", 0);
    else scrollToSection(href);
  }

  function closeDialog() {
    setMobileOpen(false);
    window.requestAnimationFrame(() => toggleRef.current?.focus());
  }

  return (
    <>
      <header data-site-header data-hidden={hidden} className="site-nav fixed inset-x-3 top-3 z-50 mx-auto max-w-[min(96vw,1024px)] rounded-full border border-border bg-surface/85 shadow-lg shadow-black/5 backdrop-blur-xl">
        <nav aria-label="Primary" className="flex h-12 items-center justify-between gap-2 px-3 sm:px-4">
          <Link href="/#home" onClick={(event) => { event.preventDefault(); navigate("#home"); }} className="shrink-0 text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {siteConfig.name}
          </Link>

          <ul className="hidden min-w-0 items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={`/${item.href}`} data-nav-link={item.href.slice(1)} onClick={(event) => { event.preventDefault(); navigate(item.href); }} className={linkClass}>
                  <span className="nav-knight" aria-hidden="true">♞</span>{item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => setPaletteOpen(true)} className={`${controlClass} gap-2 px-3 text-xs`} aria-label="Open command palette">
              <CommandIcon size={14} aria-hidden="true" /><span className="hidden sm:inline">Commands</span><kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[.625rem] sm:inline">Ctrl K / ⌘K</kbd>
            </button>
            <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile, opens in a new tab" className={`${controlClass} hidden w-10 md:flex`}>
              <GithubIcon size={16} aria-hidden="true" />
            </a>
            <ThemeToggle />
            <button ref={toggleRef} type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen} aria-controls="mobile-menu-dialog" className={`${controlClass} w-10 md:hidden`}>
              <Menu size={18} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <dialog ref={dialogRef} id="mobile-menu-dialog" className="mobile-nav-dialog" aria-label="Navigation menu" onClose={() => { setMobileOpen(false); toggleRef.current?.focus(); }} onClick={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <div className="mobile-nav-top">
          <span className="font-display text-xl text-foreground">{siteConfig.name}</span>
          <button type="button" className={`${controlClass} w-11`} onClick={closeDialog} aria-label="Close menu"><X size={19} aria-hidden="true" /></button>
        </div>
        <nav aria-label="Mobile primary">
          <ul>
            {NAV_ITEMS.map((item, index) => (
              <li key={item.href} style={{ "--nav-index": index } as React.CSSProperties}>
                <Link href={`/${item.href}`} data-nav-link={item.href.slice(1)} onClick={(event) => { event.preventDefault(); navigate(item.href); }}>
                  <span className="nav-knight" aria-hidden="true">♞</span>{item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" className="mobile-command-link" onClick={() => { closeDialog(); setPaletteOpen(true); }}>Open command palette <kbd>Ctrl K / ⌘K</kbd></button>
      </dialog>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onToast={setToast} />}
      <div className="copy-toast" role="status" aria-live="polite" data-visible={Boolean(toast)}>{toast}</div>
    </>
  );
}
