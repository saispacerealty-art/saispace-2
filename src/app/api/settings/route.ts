import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";

export async function GET() {
  const settings = await repo.getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const updated = await repo.updateSettings(body);
  return NextResponse.json(updated);
}
