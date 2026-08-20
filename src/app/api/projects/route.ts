import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";

export async function GET() {
  const projects = await repo.listProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
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

  return NextResponse.json(project, { status: 201 });
}
