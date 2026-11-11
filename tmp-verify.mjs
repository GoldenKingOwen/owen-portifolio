import { CDP, sleep } from "./tmp-cdp.mjs";
import fs from "node:fs";

const URL = "http://127.0.0.1:3100/";
fs.mkdirSync("tmp-shots", { recursive: true });

const cdp = await CDP.create();
await cdp.setViewport(1440, 900, false);
// Headless reports 2 cores, which the site treats as a low-end device and
// disables motion for. Override so the animations can be inspected.
await cdp.send("Emulation.setHardwareConcurrencyOverride", { hardwareConcurrency: 8 });

await cdp.navigate(URL, 900);
console.log("intro:", await cdp.eval("document.documentElement.getAttribute('data-intro')"));
await cdp.screenshot("tmp-shots/v-intro.png");
await sleep(3000);
await cdp.screenshot("tmp-shots/v-hero-1440.png");

// Freeze the glitch burst at 150ms so it is inspectable.
await cdp.eval(`(() => {
  const el = document.querySelector('[data-glitch]');
  el.setAttribute('data-glitch','burst');
  el.getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = 150; });
})()`);
await sleep(300);
await cdp.screenshot("tmp-shots/v-glitch.png");
await cdp.eval(`(() => {
  document.querySelectorAll('[data-glitch]').forEach(el => el.setAttribute('data-glitch','idle'));
  document.getAnimations().forEach(a => a.play());
})()`);

const y = await cdp.eval("document.querySelector('#projects').getBoundingClientRect().top + window.scrollY");
await cdp.eval(`window.scrollTo({top: ${y} - 64, behavior:'instant'})`);
await sleep(1600);
await cdp.screenshot("tmp-shots/v-projects.png");

const box = await cdp.eval(`(() => {
  const r = document.querySelector('[data-project="tenant-feedback-portal"]').getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height * 0.35 };
})()`);
await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: box.x, y: box.y });
await sleep(700);
await cdp.screenshot("tmp-shots/v-card-hover.png");

await cdp.eval(`document.querySelector('[data-project="world-scope"]').scrollIntoView({ block: 'center', behavior: 'instant' })`);
await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 5 });
await sleep(1400);
await cdp.screenshot("tmp-shots/v-worldscope.png");

await cdp.setViewport(390, 844, true);
await cdp.navigate(URL, 3600);
await sleep(1200);
await cdp.screenshot("tmp-shots/v-mobile-hero.png");
const my = await cdp.eval("document.querySelector('#projects').getBoundingClientRect().top + window.scrollY");
await cdp.eval(`window.scrollTo({top: ${my} - 56, behavior:'instant'})`);
await sleep(1600);
await cdp.screenshot("tmp-shots/v-mobile-projects.png");

await cdp.close();
console.log("done");
