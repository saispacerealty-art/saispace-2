import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { repo } from "@/lib/repository";
import { InquiryForm } from "@/components/InquiryForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await repo.getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.description.slice(0, 155) };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await repo.getProject(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link href="/projects" className="flex items-center gap-1.5 text-sm font-medium text-navy-900/60 hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-navy-100 sm:h-[420px]">
            <Image src={project.image} alt={project.name} fill priority sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
          </div>

          <div className="mt-8">
            <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-white">{project.status}</span>
            <h1 className="mt-3 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{project.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-navy-900/60">
              <MapPin className="h-4 w-4 text-gold-600" /> {project.location}
            </p>
            <p className="mt-2 text-sm font-medium text-gold-700">{project.detail}</p>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-xl font-semibold text-navy-900">About this project</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-navy-900/70">{project.description}</p>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-navy-900">Interested in {project.name}?</h3>
            <p className="mt-1 text-sm text-navy-900/60">Leave your details and our team will share brochures and pricing.</p>
            <div className="mt-5">
              <InquiryForm propertyTitle={project.name} compact />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
