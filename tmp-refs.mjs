import { CDP, sleep } from "./tmp-cdp.mjs";

const cdp = await CDP.create();
await cdp.setViewport(1280, 1000, false);
await cdp.navigate("https://basketball.gxmepulse.com/", 7000);

console.log(await cdp.eval(`(() => {
  const b = [...document.querySelectorAll('button')].find(x => /accept/i.test(x.textContent||''));
  if (b) { b.click(); return 'accepted'; }
  return 'none';
})()`));
await sleep(5000);

for (const [y, name] of [[0, "hero"], [900, "stories"], [2100, "more"]]) {
  await cdp.eval(`window.scrollTo(0, ${y})`);
  await sleep(2500);
  await cdp.screenshot(`tmp-refs/gp-${name}.png`);
}
console.log(await cdp.eval("getComputedStyle(document.body).backgroundColor + ' | ' + getComputedStyle(document.body).color"));
await cdp.close();
