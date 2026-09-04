import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET() {
  try {
    const projects = await repo.listProjects();
    return NextResponse.json(projects);
  } catch (err) {
    return apiErrorFromException(err, "GET /api/projects");
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }

  try {
    const body = await req.json();
    if (!body?.name || typeof body.name !== "string") {
      return apiError("VALIDATION_ERROR", "Name is required.", 400);
    }

    const project = await repo.createProject({
      name: body.name,
      slug: body.slug ?? "",
      location: body.location ?? "",
      detail: body.detail ?? "",
      status: body.status ?? "Under Construction",
      description: body.description ?? "",
      image: body.image ?? "",
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    return apiErrorFromException(err, "POST /api/projects");
  }
}
