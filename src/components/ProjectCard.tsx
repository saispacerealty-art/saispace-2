import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Project } from "@/lib/types";

const STATUS_STYLES: Record<Project["status"], string> = {
  "Under Construction": "bg-gold-500/10 text-gold-700",
  "Ready to Move": "bg-emerald-50 text-emerald-600",
  "New Launch": "bg-navy-900/5 text-navy-900",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10"
    >
      <div className="relative h-56 w-full overflow-hidden bg-navy-100">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(min-width: 1024px) 380px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[project.status]}`}>
          {project.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-semibold text-navy-900 group-hover:text-navy-700">
          {project.name}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-navy-900/60">
          <MapPin className="h-4 w-4 shrink-0 text-gold-600" /> {project.location}
        </p>
        <p className="mt-auto border-t border-navy-900/8 pt-3 text-sm text-navy-900/70">{project.detail}</p>
      </div>
    </Link>
  );
}
