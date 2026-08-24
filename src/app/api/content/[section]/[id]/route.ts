import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { isContentSection, CONTENT_REVALIDATE_PATHS } from "@/lib/content-sections";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { section, id } = await params;
  if (!isContentSection(section)) {
    return NextResponse.json({ error: "Unknown content section" }, { status: 404 });
  }
  const body = await req.json();
  const updated = await repo.updateContentItem(section, id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (section === "navLinks") {
    revalidatePath("/", "layout");
  } else {
    for (const path of CONTENT_REVALIDATE_PATHS[section]) revalidatePath(path);
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { section, id } = await params;
  if (!isContentSection(section)) {
    return NextResponse.json({ error: "Unknown content section" }, { status: 404 });
  }
  const ok = await repo.deleteContentItem(section, id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (section === "navLinks") {
    revalidatePath("/", "layout");
  } else {
    for (const path of CONTENT_REVALIDATE_PATHS[section]) revalidatePath(path);
  }

  return NextResponse.json({ ok: true });
}
