import { CDP, sleep } from "./tmp-cdp.mjs";
import fs from "node:fs";

const cdp = await CDP.create();
await cdp.setViewport(1280, 800, false);
await cdp.navigate("https://world-scope-umber.vercel.app/en", 12000);
await sleep(2500);
const { data } = await cdp.send("Page.captureScreenshot", {
  format: "png",
  clip: { x: 0, y: 0, width: 1280, height: 800, scale: 1 },
});
fs.mkdirSync("public/projects", { recursive: true });
fs.writeFileSync("public/projects/world-scope.png", Buffer.from(data, "base64"));
console.log("saved", fs.statSync("public/projects/world-scope.png").size);
await cdp.close();
