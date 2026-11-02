"use client";

import { useSyncExternalStore } from "react";

const TIME_ZONE = "Africa/Blantyre";
const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TIME_ZONE,
});

// One shared timer for every subscriber, aligned to the minute boundary so it
// ticks once a minute (never per second).
const listeners = new Set<() => void>();
let timer: number | undefined;

function schedule() {
  const untilNextMinute = 60000 - (Date.now() % 60000) + 50;
  timer = window.setTimeout(() => {
    listeners.forEach((l) => l());
    schedule();
  }, untilNextMinute);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) schedule();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) window.clearTimeout(timer);
  };
}

const getSnapshot = () => formatter.format(new Date());
const getServerSnapshot = () => "";

/**
 * Local time in Malawi, to the minute. The server renders no time (it would be
 * stale in cached HTML), the client fills it in right after hydration, and it
 * then updates once a minute.
 */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <span className="tabular whitespace-nowrap font-mono" suppressHydrationWarning>
      {time ? ` · ${time} local time` : ""}
    </span>
  );
}
