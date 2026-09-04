import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET() {
  try {
    const settings = await repo.getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    return apiErrorFromException(err, "GET /api/settings");
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  try {
    const body = await req.json();
    const updated = await repo.updateSettings(body);

    revalidatePath("/", "layout");

    return NextResponse.json(updated);
  } catch (err) {
    return apiErrorFromException(err, "PUT /api/settings");
  }
}
