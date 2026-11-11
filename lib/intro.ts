/**
 * One contract for the opening sequence.
 *
 * The overlay markup is server-rendered and an inline script in layout.tsx sets
 * `html[data-intro]` before paint, so the name is the first thing on screen and
 * never flashes the homepage. The client Intro animates it and then calls
 * markIntroDone(); the hero timeline (MotionEffects) and the portrait's first
 * glitch wait on that signal, so the two sequences read as one.
 *
 * Everything here is page-side only and safe to call from a client component.
 */

export const INTRO_EVENT = "portfolio:intro-done";
export const INTRO_KEY = "portfolioIntroPlayed";
/** If the intro overlay is still around after this, stop waiting for it. */
export const INTRO_WAIT_MS = 2800;

/** True while the overlay is still covering the page. */
export function isIntroPending() {
  if (typeof document === "undefined") return false;
  return document.documentElement.hasAttribute("data-intro");
}

/** Reveal the page: hide the overlay and tell everyone the sequence is over. */
export function markIntroDone() {
  const root = document.documentElement;
  root.removeAttribute("data-intro");
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* private mode: the intro simply plays again next load */
  }
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/**
 * Run `fn` once the intro is out of the way. Fires immediately when it has
 * already finished (or when it never played), and after INTRO_WAIT_MS as a
 * fail-safe so a broken intro can never hold the page back.
 * Returns a cleanup function.
 */
export function whenIntroDone(fn: () => void) {
  if (!isIntroPending()) {
    fn();
    return () => {};
  }

  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    window.removeEventListener(INTRO_EVENT, run);
    window.clearTimeout(timer);
    fn();
  };
  const timer = window.setTimeout(run, INTRO_WAIT_MS);
  window.addEventListener(INTRO_EVENT, run);

  return () => {
    done = true;
    window.removeEventListener(INTRO_EVENT, run);
    window.clearTimeout(timer);
  };
}
