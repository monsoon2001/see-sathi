import puppeteer from "puppeteer-core";

const url = process.argv[2] || "http://localhost:3210/login";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
const logs = [];
page.on("console", (m) => {
  if (["error", "warning", "info"].includes(m.type())) {
    logs.push(`[${m.type()}] ` + m.text().slice(0, 500));
  }
});
page.on("pageerror", (e) => logs.push("[pageerror] " + e.message.slice(0, 500)));
page.on("requestfailed", (r) => logs.push("[reqfail] " + r.url().slice(0, 200) + " :: " + (r.failure()?.errorText ?? "")));

await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 4000));

console.log("=== LOGIN PAGE LOAD (" + url + ") ===");
logs.forEach((l) => console.log(l));
console.log("=== total log lines: " + logs.length + " ===");
await browser.close();
