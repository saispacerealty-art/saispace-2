import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";
import { apiError, apiErrorFromException } from "@/lib/api-errors";

export async function GET() {
  try {
    const posts = await repo.listPosts();
    return NextResponse.json(posts);
  } catch (err) {
    return apiErrorFromException(err, "GET /api/posts");
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return apiError("UNAUTHORIZED", "You must be signed in as an admin.", 401);
  }

  try {
    const body = await req.json();
    if (!body?.title || typeof body.title !== "string") {
      return apiError("VALIDATION_ERROR", "Title is required.", 400);
    }

    const post = await repo.createPost({
      title: body.title,
      slug: body.slug ?? "",
      category: body.category ?? "General",
      excerpt: body.excerpt ?? "",
      content: body.content ?? "",
      coverImage: body.coverImage ?? "",
    });

    revalidatePath("/");
    revalidatePath("/blog");

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return apiErrorFromException(err, "POST /api/posts");
  }
}
