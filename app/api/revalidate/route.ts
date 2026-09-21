import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path");

  // In development, you might not have REVALIDATION_TOKEN set, so we can check it
  const expectedSecret = process.env.REVALIDATION_TOKEN || "development_secret";

  if (secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ message: "Missing path param" }, { status: 400 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
