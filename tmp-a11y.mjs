import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const out = {};

// ---------- 1. Keyboard navigation + focus visibility ----------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle2" });
  await sleep(3000);

  const tabs = [];
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        text: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 45),
        outlineStyle: cs.outlineStyle,
        outlineWidth: cs.outlineWidth,
        outlineColor: cs.outlineColor,
        boxShadow: cs.boxShadow.slice(0, 60),
        visible: r.width > 0 && r.height > 0,
        inViewport: r.top >= 0 && r.bottom <= window.innerHeight,
      };
    });
    tabs.push(info);
  }
  out.tabOrder = tabs;

  // Mobile menu: open with keyboard, check focus + escape
  await page.setViewport({ width: 390, height: 800 });
  await page.goto(BASE + "/", { waitUntil: "networkidle2" });
  await sleep(1500);
  const burger = await page.$('button[aria-controls="mobile-menu"]');
  await burger.focus();
  await page.keyboard.press("Enter");
  await sleep(300);
  out.mobileMenu = await page.evaluate(() => {
    const menu = document.getElementById("mobile-menu");
    return {
      open: !!menu,
      expanded: document.querySelector('button[aria-controls="mobile-menu"]')?.getAttribute("aria-expanded"),
      menuVisible: menu ? getComputedStyle(menu).display !== "none" : false,
    };
  });
  await page.keyboard.press("Escape");
  await sleep(200);
  out.mobileMenu.afterEscape = await page.evaluate(() => ({
    open: !!document.getElementById("mobile-menu"),
    focusOnTrigger:
      document.activeElement === document.querySelector('button[aria-controls="mobile-menu"]'),
  }));

  // Certificate modal: open via keyboard, check focus trap + escape
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(500);
  const expanded = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => /Certifications \(/.test(b.textContent));
    if (!btn) return false;
    btn.click();
    return true;
  });
  await sleep(1500);
  out.certDisclosure = { opened: expanded };
  if (expanded) {
    const openedModal = await page.evaluate(() => {
      const view = [...document.querySelectorAll("button")].find((b) => /View|Preview|Open/i.test(b.textContent));
      if (view) { view.click(); return true; }
      return false;
    });
    await sleep(1500);
    out.certModal = await page.evaluate(() => {
      const dlg = document.querySelector('[role="dialog"]');
      if (!dlg) return { present: false };
      return {
        present: true,
        ariaModal: dlg.getAttribute("aria-modal"),
        labelled: !!dlg.getAttribute("aria-labelledby"),
        focusOnClose: document.activeElement?.getAttribute("aria-label") || document.activeElement?.tagName,
      };
    });
    if (openedModal) {
      await page.keyboard.press("Escape");
      await sleep(600);
      out.certModal.afterEscape = await page.evaluate(() => ({
        closed: !document.querySelector('[role="dialog"]'),
        focusRestored: document.activeElement?.tagName,
      }));
    }
  }

  await page.close();
}

// ---------- 2. Reduced motion ----------
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle2" });
  await sleep(2500);
  out.reducedMotion = await page.evaluate(() => {
    const root = document.documentElement;
    const faded = [];
    document.querySelectorAll("p, h1, h2, h3, li, dd, dt").forEach((el) => {
      const op = parseFloat(getComputedStyle(el).opacity);
      if (op < 0.99 && el.getBoundingClientRect().height > 0) faded.push({ t: el.tagName, op });
    });
    const hero = document.querySelector('[data-hero-split="chars"]');
    const transform = hero ? getComputedStyle(hero).transform : null;
    return {
      dataMotion: root.getAttribute("data-motion"),
      fadedCount: faded.length,
      fadedSample: faded.slice(0, 5),
      heroNameTransform: transform,
      scrollBehavior: getComputedStyle(root).scrollBehavior,
    };
  });
  await page.close();
}

// ---------- 3. JavaScript disabled ----------
{
  const ctx = browser.defaultBrowserContext();
  await ctx.overridePermissions("http://localhost:3000", []);
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle2" });
  await sleep(1500);
  out.noJs = await page.evaluate(() => {
    // evaluate still works with JS disabled? (puppeteer uses CDP Runtime.evaluate — yes)
    const about = document.querySelector("#about");
    const ps = about ? [...about.querySelectorAll("p")] : [];
    const faded = ps.filter((p) => parseFloat(getComputedStyle(p).opacity) < 0.99).length;
    const hidden = [];
    document.querySelectorAll("p, h1, h2, h3, li, dd").forEach((el) => {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.99 || cs.visibility === "hidden" || cs.display === "none") {
        if (el.getBoundingClientRect().height > 0 || cs.display !== "none")
          hidden.push({ t: el.tagName, op: cs.opacity, disp: cs.display });
      }
    });
    return {
      aboutParagraphs: ps.length,
      aboutFaded: faded,
      aboutTextSample: ps[0]?.textContent?.slice(0, 60),
      hiddenCount: hidden.length,
      hiddenSample: hidden.slice(0, 8),
      heroVisible: !!document.querySelector("h1")?.textContent,
      navLinks: document.querySelectorAll("nav a").length,
    };
  });
  await page.close();
}

// ---------- 4. Contrast in both themes ----------
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  async function sample(theme) {
    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    await page.evaluate((t) => {
      document.documentElement.setAttribute("data-theme", t);
      localStorage.setItem("portfolio-theme", t);
    }, theme);
    await page.reload({ waitUntil: "networkidle2" });
    await sleep(2500);
    return page.evaluate(() => {
      const parse = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const [r, g, b, a] = m[1].split(",").map(Number);
        return { r, g, b, a: a ?? 1 };
      };
      const lum = ({ r, g, b }) => {
        const f = (v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const ratio = (fg, bg) => {
        const l1 = lum(fg), l2 = lum(bg);
        const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
        return (hi + 0.05) / (lo + 0.05);
      };
      const bgOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c && c.a > 0.5) return c;
          n = n.parentElement;
        }
        return parse(getComputedStyle(document.body).backgroundColor);
      };

      const samples = [];
      const targets = [
        ["h1 span", "h1 span"],
        ["hero tagline (muted)", '[data-hero]:not([data-hero="clip"])'],
        ["body paragraph", "#about p"],
        ["muted dt", "#about dt"],
        ["section h2", "#about h2"],
        ["nav link", "nav ul a"],
        ["card meta", "[data-card] p.font-mono, [data-card] header p"],
        ["muted text (skills)", "#skills p.text-sm"],
        ["footer link", "footer a"],
        ["accent button", 'a[href="#projects"]'],
        ["card body muted", "#projects [data-card] p"],
        ["timeline meta", "#experience [data-card] header p.tabular"],
        ["form label", 'label[for="name"]'],
        ["form input text", 'input#name'],
        ["status text", "#projects [data-card] p.font-mono"],
      ];
      for (const [name, sel] of targets) {
        const el = document.querySelector(sel);
        if (!el) { samples.push({ name, missing: true }); continue; }
        const cs = getComputedStyle(el);
        const fg = parse(cs.color);
        const bg = bgOf(el);
        if (!fg || !bg) { samples.push({ name, parseFail: true }); continue; }
        samples.push({
          name,
          ratio: Math.round(ratio(fg, bg) * 100) / 100,
          fontSize: cs.fontSize,
          weight: cs.fontWeight,
          fg: cs.color,
          bg: `rgb(${bg.r}, ${bg.g}, ${bg.b})`,
        });
      }
      return samples;
    });
  }

  out.contrastLight = await sample("light");
  out.contrastDark = await sample("dark");
  await page.close();
}

console.log(JSON.stringify(out, null, 1));
await browser.close();
