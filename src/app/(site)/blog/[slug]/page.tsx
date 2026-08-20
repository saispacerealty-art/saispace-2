import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { repo } from "@/lib/repository";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await repo.getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await repo.getPost(slug);
  if (!post) notFound();

  const all = await repo.listPosts();
  const more = all.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/blog" className="flex items-center gap-1.5 text-sm font-medium text-navy-900/60 hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-gold-600">{post.category}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-navy-900/50">{formatDate(post.publishedAt)}</p>

      <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl bg-navy-100 sm:h-96">
        <Image src={post.coverImage} alt={post.title} fill priority sizes="768px" className="object-cover" />
      </div>

      <div className="mt-8 max-w-none whitespace-pre-line text-sm leading-relaxed text-navy-900/75 sm:text-base">
        {post.content}
      </div>

      {more.length > 0 && (
        <div className="mt-16 border-t border-navy-900/8 pt-8">
          <h2 className="font-display text-lg font-semibold text-navy-900">More from the blog</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {more.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="rounded-xl border border-navy-900/8 p-4 text-sm font-medium text-navy-900 hover:bg-ivory-50"
              >
                <p className="text-xs uppercase tracking-widest text-gold-600">{p.category}</p>
                <p className="mt-1">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
