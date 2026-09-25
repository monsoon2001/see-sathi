import puppeteer from "puppeteer-core";

const url = process.argv[2] || "http://localhost:3210/login";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  defaultViewport: { width: 1280, height: 900 },
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 300)));
page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 300)); });

let popupPage = null;
const opened = new Promise((r) => {
  page.on("popup", (p) => { popupPage = p; r(p); });
});

await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
const clicked = await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Google"));
  if (!btn) return false;
  btn.click();
  return true;
});
console.log("google clicked:", clicked);

const p = await Promise.race([opened, new Promise((r) => setTimeout(() => r(null), 8000))]);
if (p) {
  let popupUrl = "";
  try { await new Promise((res) => setTimeout(res, 5000)); popupUrl = p.url(); } catch {}
  console.log("POPUP OPENED:", popupUrl.slice(0, 160));
} else {
  console.log("NO POPUP within 8s");
}
// how did the main page respond?
const mainUrl = page.url();
console.log("main page url:", mainUrl.slice(0, 120));
console.log("--- page errors (main) ---");
errors.slice(0, 8).forEach((e) => console.log("  ", e));
await browser.close();
