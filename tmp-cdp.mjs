// Minimal Chrome DevTools Protocol client using Node's built-in WebSocket.
export class CDP {
  static async create(url = "about:blank") {
    const r = await fetch(`http://127.0.0.1:9223/json/new?url=${encodeURIComponent(url)}`, {
      method: "PUT",
    });
    if (!r.ok) throw new Error(`json/new failed: ${r.status}`);
    const target = await r.json();
    const cdp = new CDP(target.webSocketDebuggerUrl, target.id);
    await cdp.open;
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Log.enable");
    await cdp.send("Network.enable");
    return cdp;
  }

  constructor(wsUrl, targetId) {
    this.targetId = targetId;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.ws = new WebSocket(wsUrl);
    this.open = new Promise((res, rej) => {
      this.ws.onopen = () => res();
      this.ws.onerror = (e) => rej(new Error("ws error"));
    });
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const cb of this.listeners.get(msg.method) ?? []) cb(msg.params);
      }
    };
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  on(method, cb) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(cb);
  }

  // Collect console errors / page errors / failed requests until stopped.
  collectErrors() {
    const errors = { console: [], exceptions: [], failedRequests: [], log: [] };
    this.on("Runtime.consoleAPICalled", (p) => {
      if (p.type === "error")
        errors.console.push(p.args.map((a) => a.value ?? a.description ?? "").join(" "));
    });
    this.on("Runtime.exceptionThrown", (p) =>
      errors.exceptions.push(p.exceptionDetails?.exception?.description ?? p.exceptionDetails?.text)
    );
    this.on("Log.entryAdded", (p) => {
      if (p.entry.level === "error") errors.log.push(`${p.entry.url ?? ""} ${p.entry.text}`);
    });
    this.on("Network.loadingFailed", (p) =>
      errors.failedRequests.push(`${p.type} ${p.errorText} ${p.blockedReason ?? ""}`)
    );
    return errors;
  }

  async eval(expression, { awaitPromise = false } = {}) {
    const r = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text ?? "eval failed");
    return r.result.value;
  }

  async navigate(url, waitMs = 2500) {
    await this.send("Page.navigate", { url });
    await new Promise((r) => setTimeout(r, waitMs));
  }

  async setViewport(width, height = 900, mobile = false) {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
    });
  }

  async screenshot(path) {
    const { data } = await this.send("Page.captureScreenshot", { format: "png" });
    const fs = await import("node:fs");
    const pathMod = await import("node:path");
    fs.mkdirSync(pathMod.dirname(path), { recursive: true });
    fs.writeFileSync(path, Buffer.from(data, "base64"));
  }

  async emulateMedia(features) {
    await this.send("Emulation.setEmulatedMedia", { features });
  }

  async close() {
    try {
      this.ws.close();
      await fetch(`http://127.0.0.1:9223/json/close/${this.targetId}`);
    } catch {}
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
