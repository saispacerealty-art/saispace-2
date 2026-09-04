import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET() {
  try {
    const copy = await repo.getPageCopy();
    return NextResponse.json(copy);
  } catch (err) {
    return apiErrorFromException(err, "GET /api/page-copy");
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  try {
    const body = await req.json();
    const updated = await repo.updatePageCopy(body);

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/contact");

    return NextResponse.json(updated);
  } catch (err) {
    return apiErrorFromException(err, "PUT /api/page-copy");
  }
}
