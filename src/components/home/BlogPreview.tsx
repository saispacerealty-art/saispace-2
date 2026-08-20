import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-ivory-100 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Insights</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
              From the Blog
            </h2>
          </div>
          <Link href="/blog" className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600">
            Read all articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10"
            >
              <div className="relative h-40 w-full overflow-hidden bg-navy-100">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 300px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">{post.category}</p>
                <h3 className="font-display text-base font-semibold leading-snug text-navy-900">{post.title}</h3>
                <p className="mt-auto pt-2 text-xs text-navy-900/40">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
