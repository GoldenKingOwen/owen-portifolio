import { CDP, sleep } from "./tmp-cdp.mjs";

const BASE = "http://localhost:3000";
const widths = [320, 360, 390, 768, 1024, 1280, 1440];
const results = [];

for (const width of widths) {
  const page = await CDP.create();
  const errors = page.collectErrors();
  await page.setViewport(width, 900);
  await page.navigate(BASE + "/", 3500); // motion init + 2.5s failsafe window

  const report = await page.eval(`(() => {
    const doc = document.documentElement;
    const vw = window.innerWidth;
    const out = { vw, scrollWidth: doc.scrollWidth, overflowPx: doc.scrollWidth - vw, offenders: [] };
    const seen = new Set();
    document.querySelectorAll("body *").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.display === "none" || cs.visibility === "hidden") return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > vw + 1.5 || r.left < -1.5) {
        const key = el.tagName + "|" + String(el.className).slice(0, 40);
        if (seen.has(key)) return;
        seen.add(key);
        out.offenders.push({ tag: el.tagName, cls: String(el.className).slice(0, 90), left: Math.round(r.left), right: Math.round(r.right) });
      }
    });
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    };
    const nameSpan = document.querySelector('[data-hero-split="chars"]');
    out.hero = {
      h1: box("h1"),
      nameFontSize: nameSpan ? getComputedStyle(nameSpan).fontSize : null,
      nameOpacity: nameSpan ? getComputedStyle(nameSpan).opacity : null,
      nameLines: nameSpan ? Math.round(nameSpan.getBoundingClientRect().height / parseFloat(getComputedStyle(nameSpan).lineHeight)) : null,
      portrait: box('[data-hero="clip"]'),
      taglineOpacity: (() => { const p = document.querySelector('[data-hero]:not([data-hero="clip"])'); return p ? getComputedStyle(p).opacity : null; })(),
    };
    const desktopNav = document.querySelector("nav ul");
    const burger = document.querySelector('button[aria-controls="mobile-menu"]');
    out.nav = {
      desktopLinksVisible: desktopNav ? getComputedStyle(desktopNav).display !== "none" : false,
      burgerVisible: burger ? getComputedStyle(burger).display !== "none" : false,
      headerH: Math.round(document.querySelector("header")?.getBoundingClientRect().height || 0),
    };
    out.about = [...document.querySelectorAll("#about p")].map((p) => getComputedStyle(p).opacity);
    const fig = document.querySelector("[data-diagram]");
    if (fig) { const fr = fig.getBoundingClientRect(); out.diagram = { w: Math.round(fr.width), scrollW: fig.scrollWidth, over: fig.scrollWidth - Math.round(fr.width) }; }
    else out.diagram = null;
    const grid = document.querySelector("#projects .grid");
    out.projectGridCols = grid ? getComputedStyle(grid).gridTemplateColumns : null;
    out.leadCard = box("#projects article");
    const rail = document.querySelector("[data-timeline-rail]");
    out.timelineRailW = rail ? Math.round(rail.getBoundingClientRect().width) : null;
    out.contactMsg = box("#message");
    out.footer = box("footer");
    out.sectionHeading = (() => { const h = document.querySelector("#about h2"); if (!h) return null; const r = h.getBoundingClientRect(); return { w: Math.round(r.width), top: Math.round(r.top + window.scrollY) }; })();
    const small = [];
    document.querySelectorAll("a, button, input, textarea, select").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.height < 24 || r.width < 24) small.push({ tag: el.tagName, text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40), h: Math.round(r.height), w: Math.round(r.width) });
    });
    out.smallTargets = small;
    const faded = [];
    document.querySelectorAll("p, h1, h2, h3, li, dt, dd, a, span, button, figcaption").forEach((el) => {
      if (!el.textContent || !el.textContent.trim()) return;
      const op = parseFloat(getComputedStyle(el).opacity);
      const r = el.getBoundingClientRect();
      if (op < 0.99 && r.width > 0 && r.height > 0) faded.push({ tag: el.tagName, cls: String(el.className).slice(0, 50), op, text: (el.textContent || "").trim().slice(0, 45) });
    });
    out.fadedText = faded.slice(0, 10);
    return out;
  })()`);

  report.errors = errors;
  results.push({ width, ...report });
  await page.screenshot(`tmp-shots/home-${width}.png`);

  await page.navigate(BASE + "/projects/tenant-feedback-portal", 1500);
  report.projectPage = await page.eval(`(() => {
    const doc = document.documentElement;
    const fig = document.querySelector("[data-diagram]");
    const fr = fig ? fig.getBoundingClientRect() : null;
    const overflowing = [];
    if (fr) {
      fig.querySelectorAll("*").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > window.innerWidth + 1.5) overflowing.push(String(el.className).slice(0, 60));
      });
    }
    return {
      overflowPx: doc.scrollWidth - window.innerWidth,
      diagramW: fr ? Math.round(fr.width) : null,
      diagramScrollW: fig ? fig.scrollWidth : null,
      diagramOverflowingChildren: overflowing.slice(0, 5),
    };
  })()`);
  await page.screenshot(`tmp-shots/project-${width}.png`);
  await page.close();
}

console.log(JSON.stringify(results, null, 1));
