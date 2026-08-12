"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // The persisted theme is only known on the client (localStorage), so the
  // icon/label are theme-dependent. useSyncExternalStore reports `false`
  // during SSR and the first client render (server snapshot) and `true`
  // after hydration — so server HTML matches the first client render (no
  // hydration mismatch) and the real icon appears right after, with no
  // setState-in-effect.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:text-foreground"
    >
      {mounted ? (
        isDark ? (
          <Sun size={16} aria-hidden="true" />
        ) : (
          <Moon size={16} aria-hidden="true" />
        )
      ) : (
        <span className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}