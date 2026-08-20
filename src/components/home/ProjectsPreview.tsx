import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

export function ProjectsPreview({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">Developments</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
            Ongoing &amp; Upcoming Projects
          </h2>
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600"
        >
          View all projects <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
