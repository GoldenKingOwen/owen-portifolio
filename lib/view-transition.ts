/**
 * Tiny hand-off between a View Transition and Next.js's client navigation.
 *
 * While a View Transition is capturing the new state the browser pauses
 * rendering, so a requestAnimationFrame loop never fires. Instead, a persistent
 * client component (MotionLoader) signals the route commit from its pathname
 * effect, which lets the transition capture the page that has actually
 * committed. A timeout keeps a failed navigation from holding the old frame.
 */
let waiters: Array<() => void> = [];

export function signalRouteCommit() {
  const pending = waiters;
  waiters = [];
  pending.forEach((resolve) => resolve());
}

export function waitForRouteCommit(timeout = 1600) {
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      waiters = waiters.filter((waiter) => waiter !== finish);
      resolve();
    };
    waiters.push(finish);
    window.setTimeout(finish, timeout);
  });
}
