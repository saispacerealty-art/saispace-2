import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { repo } from "@/lib/repository";
import { BlogTable } from "@/components/admin/BlogTable";

export default async function AdminBlogPage() {
  const posts = await repo.listPosts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-navy-900/60">{posts.length} articles published.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <PlusCircle className="h-4 w-4" /> Add Post
        </Link>
      </div>
      <div className="mt-6">
        <BlogTable posts={posts} />
      </div>
    </div>
  );
}
