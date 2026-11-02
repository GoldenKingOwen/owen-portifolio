"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "portfolio-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The inline script in layout.tsx sets data-theme on <html> before
  // hydration, so initialize straight from the DOM instead of syncing
  // in an effect (avoids a cascading-render setState in an effect).
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (document.documentElement.getAttribute("data-theme") as Theme) ?? "light";
  });

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const apply = () => {
      // flushSync so the toggle icon updates inside the same view-transition frame.
      flushSync(() => setTheme(next));
      document.documentElement.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {}
    };

    // A cross-fade between two page snapshots (View Transitions API): the browser
    // fades the old and new frames on the compositor, so no element is individually
    // transitioned. Unsupported browsers and reduced-motion visitors switch instantly.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && typeof document.startViewTransition === "function") {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
