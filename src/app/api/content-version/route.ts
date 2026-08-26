import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "src", "lib", "data");
const WATCHED_FILES = [
  "properties.json",
  "settings.json",
  "projects.json",
  "posts.json",
  "content.json",
  "page-copy.json",
];

export async function GET() {
  const stats = await Promise.all(
    WATCHED_FILES.map((file) => fs.stat(path.join(DATA_DIR, file)))
  );
  const version = Math.max(...stats.map((s) => s.mtimeMs)).toString();

  return NextResponse.json(
    { version },
    { headers: { "Cache-Control": "no-store" } }
  );
}
