import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { isContentSection, CONTENT_REVALIDATE_PATHS } from "@/lib/content-sections";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isContentSection(section)) {
    return NextResponse.json({ error: "Unknown content section" }, { status: 404 });
  }
  const items = await repo.listContent(section);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { section } = await params;
  if (!isContentSection(section)) {
    return NextResponse.json({ error: "Unknown content section" }, { status: 404 });
  }
  const body = await req.json();
  const item = await repo.createContentItem(section, body);

  if (section === "navLinks") {
    revalidatePath("/", "layout");
  } else {
    for (const path of CONTENT_REVALIDATE_PATHS[section]) revalidatePath(path);
  }

  return NextResponse.json(item, { status: 201 });
}
