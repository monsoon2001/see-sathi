import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ROOTS = ["science-questions", "english-questions"].map((d) => path.join(process.cwd(), d));
const MAX_DEPTH = 4;

const EXT_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

function safeJoin(base: string, ...parts: string[]): string | null {
  const resolved = path.resolve(base, ...parts);
  return resolved.startsWith(base + path.sep) ? resolved : null;
}

function findFile(dir: string, fileName: string, depth = 0): string | null {
  if (depth > MAX_DEPTH) return null;
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const nested = findFile(path.join(dir, entry.name), fileName, depth + 1);
      if (nested) return nested;
    } else if (entry.name.toLowerCase() === fileName.toLowerCase()) {
      const full = safeJoin(dir, entry.name);
      if (full) return full;
    }
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") ?? "";
  const file = searchParams.get("file") ?? "";
  if (!folder || !file) {
    return new NextResponse("Missing folder or file parameter", { status: 400 });
  }

  const folderPath = ROOTS.map((root) => safeJoin(root, decodeURIComponent(folder))).find(
    (p) => p && fs.existsSync(p),
  );
  if (!folderPath) {
    return new NextResponse("Folder not found", { status: 404 });
  }

  const found = findFile(folderPath, decodeURIComponent(file));
  if (!found) {
    return new NextResponse("Image not found", { status: 404 });
  }

  const ext = path.extname(found).toLowerCase();
  const body = fs.readFileSync(found);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": EXT_MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}