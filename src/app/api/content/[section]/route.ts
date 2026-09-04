import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { isContentSection, CONTENT_REVALIDATE_PATHS } from "@/lib/content-sections";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isContentSection(section)) {
    return apiError("UNKNOWN_SECTION", `"${section}" is not a known content section.`, 404);
  }
  try {
    const items = await repo.listContent(section);
    return NextResponse.json(items);
  } catch (err) {
    return apiErrorFromException(err, `GET /api/content/${section}`);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  const { section } = await params;
  if (!isContentSection(section)) {
    return apiError("UNKNOWN_SECTION", `"${section}" is not a known content section.`, 404);
  }

  try {
    const body = await req.json();
    const item = await repo.createContentItem(section, body);

    if (section === "navLinks") {
      revalidatePath("/", "layout");
    } else {
      for (const path of CONTENT_REVALIDATE_PATHS[section]) revalidatePath(path);
    }

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return apiErrorFromException(err, `POST /api/content/${section}`);
  }
}
