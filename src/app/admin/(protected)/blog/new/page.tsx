import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Add Post</h1>
      <p className="mt-1 text-sm text-navy-900/60">Write a new article for your blog.</p>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
