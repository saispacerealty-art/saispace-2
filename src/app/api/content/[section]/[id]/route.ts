import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { isContentSection, CONTENT_REVALIDATE_PATHS } from "@/lib/content-sections";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  const { section, id } = await params;
  if (!isContentSection(section)) {
    return apiError("UNKNOWN_SECTION", `"${section}" is not a known content section.`, 404);
  }

  try {
    const body = await req.json();
    const updated = await repo.updateContentItem(section, id, body);
    if (!updated) return apiError("NOT_FOUND", "This item no longer exists.", 404);

    if (section === "navLinks") {
      revalidatePath("/", "layout");
    } else {
      for (const path of CONTENT_REVALIDATE_PATHS[section]) revalidatePath(path);
    }

    return NextResponse.json(updated);
  } catch (err) {
    return apiErrorFromException(err, `PUT /api/content/${section}/${id}`);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ section: string; id: string }> }
) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  const { section, id } = await params;
  if (!isContentSection(section)) {
    return apiError("UNKNOWN_SECTION", `"${section}" is not a known content section.`, 404);
  }

  try {
    const ok = await repo.deleteContentItem(section, id);
    if (!ok) return apiError("NOT_FOUND", "This item no longer exists.", 404);

    if (section === "navLinks") {
      revalidatePath("/", "layout");
    } else {
      for (const path of CONTENT_REVALIDATE_PATHS[section]) revalidatePath(path);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorFromException(err, `DELETE /api/content/${section}/${id}`);
  }
}
