import { notFound } from "next/navigation";
import { repo } from "@/lib/repository";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await repo.getPost(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Edit Post</h1>
      <p className="mt-1 text-sm text-navy-900/60">{post.title}</p>
      <div className="mt-6">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
