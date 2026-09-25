import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => consoleErrors.push("PAGEERROR: " + e.message));
page.on("requestfailed", (r) => consoleErrors.push("REQFAIL: " + r.url() + " :: " + (r.failure()?.errorText ?? "")));

await page.goto("http://localhost:3210/login", { waitUntil: "networkidle2", timeout: 60000 });
console.log("page title:", await page.title());

const click = await page.evaluate(() => {
  const btns = [...document.querySelectorAll("button")];
  const g = btns.find((b) => b.textContent?.includes("Google"));
  if (!g) return false;
  g.click();
  return true;
});
console.log("google button clicked:", click);
await new Promise((r) => setTimeout(r, 3500));

const url = page.url();
console.log("URL after click:", url.slice(0, 200));
console.log("--- console/page errors ---");
consoleErrors.forEach((e) => console.log(e.slice(0, 300)));
console.log("--- done ---");
await browser.close();
