import { CDP, sleep } from "./tmp-cdp.mjs";

const cdp = await CDP.create();
const errors = cdp.collectErrors();
await cdp.setViewport(1440, 900, false);
await cdp.send("Emulation.setHardwareConcurrencyOverride", { hardwareConcurrency: 8 });
await cdp.send("Page.navigate", { url: "http://127.0.0.1:3100/" });
for (let i = 0; i < 60; i++) {
  const href = await cdp.eval("location.href").catch(() => "");
  if (href.includes("3100")) break;
  await sleep(150);
}
await sleep(3000);
console.log("has overlay:", await cdp.eval("!!document.querySelector('[data-intro-root]')"));
console.log(JSON.stringify(errors, null, 2).slice(0, 3000));
await cdp.close();
