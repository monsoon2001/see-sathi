import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATION_TOKEN;
  if (!expectedSecret) {
    return NextResponse.json({ message: "Misconfigured" }, { status: 503 });
  }

  const secret = request.nextUrl.searchParams.get("secret") ?? "";
  if (!safeEqual(secret, expectedSecret)) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get("path");
  if (!path || path.length > 2048) {
    return NextResponse.json({ message: "Missing path param" }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
