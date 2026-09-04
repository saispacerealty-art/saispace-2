import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const post = await repo.getPost(id);
    if (!post) return apiError("NOT_FOUND", "Blog post not found.", 404);
    return NextResponse.json(post);
  } catch (err) {
    return apiErrorFromException(err, `GET /api/posts/${id}`);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await repo.updatePost(id, body);
    if (!updated) return apiError("NOT_FOUND", "Blog post not found.", 404);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");

    return NextResponse.json(updated);
  } catch (err) {
    return apiErrorFromException(err, `PUT /api/posts/${id}`);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }
  const { id } = await params;
  try {
    const ok = await repo.deletePost(id);
    if (!ok) return apiError("NOT_FOUND", "Blog post not found.", 404);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorFromException(err, `DELETE /api/posts/${id}`);
  }
}
