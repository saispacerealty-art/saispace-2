import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { repo } from "@/lib/repository";
import { formatDate } from "@/lib/format";
import { PLACEHOLDER_LISTING_IMAGE } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides, market insights, and legal explainers from the Sai Space Realty team.",
};

export default async function BlogPage() {
  const posts = await repo.listPosts();

  return (
    <>
      <section className="bg-navy-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">Insights</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            The Sai Space Realty Blog
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/60">
            Practical guides and market insights to help you make confident real estate decisions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10"
            >
              <div className="relative h-48 w-full overflow-hidden bg-navy-100">
                <Image
                  src={post.coverImage || PLACEHOLDER_LISTING_IMAGE}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 380px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">{post.category}</p>
                <h3 className="font-display text-lg font-semibold leading-snug text-navy-900 group-hover:text-navy-700">
                  {post.title}
                </h3>
                <p className="line-clamp-2 text-sm text-navy-900/60">{post.excerpt}</p>
                <p className="mt-auto pt-3 text-xs text-navy-900/40">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="py-16 text-center text-sm text-navy-900/50">No articles published yet. Check back soon.</p>
        )}
      </section>
    </>
  );
}
