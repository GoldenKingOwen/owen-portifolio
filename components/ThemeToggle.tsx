"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // The persisted theme is only known on the client (localStorage), so the
  // icon and label depend on it. useSyncExternalStore reports `false` during
  // SSR and the first client render and `true` after hydration, so server HTML
  // matches the first client render with no hydration mismatch.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"
      }
      className="flex h-11 w-11 items-center justify-center rounded-ui border border-border text-foreground transition-colors hover:bg-raised"
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
