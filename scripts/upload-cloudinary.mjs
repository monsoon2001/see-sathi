/**
 * Uploads all study-note + past-paper diagram PNGs to Cloudinary.
 *
 * Source image locations:
 *   - Computer Science chapters: /Users/monsoonparajuli/Downloads/all_chapters_computer_science/
 *   - Science past papers:       science-questions/2082-science/science-diagrams/
 *   - Maths past papers:         science-questions/see-2081-compulsory-maths-koshi/maths-diagrams/
 *   - Quadratic notes:           science-questions/quadratic-equations/math-diagrams/
 *
 * Public_id layout: see-cs-ch{N}/<file> and see-papers/<folder>/<file>.
 * Uses the account's SHA-256 signature algorithm (matches this account's
 * "Signature algorithm" setting). Prints a JSON manifest at the end.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const CLOUD_NAME = "q5f7r5xt";
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error("Missing Cloudinary credentials. Set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (never commit them).");
  process.exit(1);
}

const CS_SRC = "/Users/monsoonparajuli/Downloads/all_chapters_computer_science";
const REPO = path.resolve(new URL("..", import.meta.url).pathname);

async function upload(file) {
  const ts = Math.floor(Date.now() / 1000);
  const params = { ...(file.signParams ?? {}), public_id: file.public_id, timestamp: ts };
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = crypto.createHash("sha256").update(`${sorted}${API_SECRET}`).digest("hex");

  const form = new FormData();
  form.append("file", new Blob([fs.readFileSync(file.file)]), path.basename(file.file));
  form.append("public_id", file.public_id);
  form.append("api_key", API_KEY);
  form.append("timestamp", String(ts));
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${file.resourceType ?? "image"}/upload`, {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Upload failed for ${file.public_id}: ${json?.error?.message ?? res.statusText}`);
  }
  return json;
}

/** Strip the trailing image extension: public_id must NOT carry it, otherwise
 *  Cloudinary stores it inside the id and standard delivery URLs 404. */
const bareId = (name) => name.replace(/\.[a-z0-9]+$/i, "");

function collect() {
  const jobs = [];

  const csChapters = fs
    .readdirSync(CS_SRC, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .sort();
  for (const chap of csChapters) {
    const chapNum = chap.name.replace("chapter_", "");
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (/\.png$/i.test(e.name)) {
          jobs.push({
            key: `see-cs-ch${chapNum}/${e.name}`,
            file: full,
            public_id: `see-cs-ch${chapNum}/${bareId(e.name)}`,
          });
        }
      }
    };
    walk(path.join(CS_SRC, chap.name));
  }

  const paperFolders = [
    { cloud: "see2081-sci-bagmati", dir: path.join(REPO, "science-questions/see-2081-science-bagmati/science-diagrams") },
    { cloud: "see2081-sci-gandaki", dir: path.join(REPO, "science-questions/see-2081-science-gandaki/gandaki-science-diagrams") },
    { cloud: "see2081-sci-koshi", dir: path.join(REPO, "science-questions/see-2081-science-koshi/koshi-science-diagrams") },
    { cloud: "see2081-sci-lumbini", dir: path.join(REPO, "science-questions/see-2081-science-lumbini/lumbini-science-diagrams") },
    { cloud: "see2081-sci-madhesh", dir: path.join(REPO, "science-questions/see-2081-science-madhesh/textbook-diagrams") },
    { cloud: "see2081-sci-sudurpaschim", dir: path.join(REPO, "science-questions/see-2081-science-sudurpaschim/sudurpaschim-diagrams") },
    { cloud: "see2081-sci-karnali", dir: path.join(REPO, "science-questions/see-2081-science-karnali/karnali-diagrams") },
    { cloud: "see2081-compulsory-maths-koshi", dir: path.join(REPO, "science-questions/see-2081-compulsory-maths-koshi/maths-diagrams") },
    { cloud: "quadratic-equations", dir: path.join(REPO, "science-questions/quadratic-equations/math-diagrams") },
    { cloud: "see-math-ch1", dir: path.join(REPO, "maths_chapter_1/lesson1-venn-diagrams") },
    { cloud: "see-math-ch2", dir: path.join(REPO, "science-questions/see-math-ch2/math-diagrams") },
  ];
  for (const { cloud, dir } of paperFolders) {
    for (const e of fs.readdirSync(dir)) {
      if (/\.png$/i.test(e)) {
        jobs.push({
          key: `see-papers/${cloud}/${e}`,
          file: path.join(dir, e),
          public_id: `see-papers/${cloud}/${bareId(e)}`,
        });
      }
    }
  }

  return jobs;
}

const jobs = collect();
console.log(`Uploading ${jobs.length} images to Cloudinary (${CLOUD_NAME})…`);

const manifest = {};
let ok = 0;
for (const job of jobs) {
  try {
    await upload(job);
    manifest[job.key] = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${job.public_id}`;
    ok += 1;
    console.log(`  ✓ ${job.public_id}`);
  } catch (err) {
    console.error(`  ✗ ${job.public_id}: ${err.message}`);
  }
}

const out = path.join(REPO, "scripts/cloudinary-manifest.json");
fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
console.log(`\nDone: ${ok}/${jobs.length} uploaded. Manifest written to ${out}`);