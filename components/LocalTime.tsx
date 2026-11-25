"use client";

import { useSyncExternalStore } from "react";

const TIME_ZONE = "Africa/Blantyre";
const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: TIME_ZONE,
});

// One shared one-second clock for every subscriber.
const listeners = new Set<() => void>();
let timer: number | undefined;

function schedule() {
  const untilNextMinute = 1000 - (Date.now() % 1000) + 10;
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
 * Local time in Malawi. The visual clock is decorative; a stable hidden label
 * gives assistive technology a static description without repeated updates.
 */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <span className="tabular whitespace-nowrap font-mono">
      <span className="sr-only">Local time in Lilongwe: </span>
      <span aria-hidden="true">{time || "--:--:--"} CAT</span>
    </span>
  );
}
