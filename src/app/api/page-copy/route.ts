import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";

export async function GET() {
  const copy = await repo.getPageCopy();
  return NextResponse.json(copy);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const updated = await repo.updatePageCopy(body);

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/contact");

  return NextResponse.json(updated);
}
