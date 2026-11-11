import { CDP, sleep } from "./tmp-cdp.mjs";

const cdp = await CDP.create();
await cdp.setViewport(1280, 900, false);
await cdp.navigate("http://127.0.0.1:3100/", 4000);
await cdp.eval("localStorage.setItem('portfolioIntroPlayed','1'); localStorage.setItem('portfolio-theme','light'); 'ok'");
await cdp.navigate("http://127.0.0.1:3100/", 4000);
const y = await cdp.eval("document.querySelector('#projects').getBoundingClientRect().top + window.scrollY");
await cdp.eval(`window.scrollTo({top: ${y} - 64, behavior: 'instant'})`);
await sleep(2000);
await cdp.screenshot("tmp-shots/audit-projects.png");
await cdp.screenshot("tmp-shots/audit-hero-light.png");
console.log("projects shot at", y);
await cdp.close();
