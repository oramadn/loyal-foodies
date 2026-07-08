import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 5 MB" }, { status: 400 });
  }

  const blob = await put(`menus/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
