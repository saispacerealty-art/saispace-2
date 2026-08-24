import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { repo } from "@/lib/repository";
import { isAdminRequest } from "@/lib/require-admin";

export async function GET() {
  const posts = await repo.listPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body?.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
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
}
