import type { Metadata } from "next";
import { repo } from "@/lib/repository";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore ongoing and upcoming residential and commercial developments by Sai Space Realty's partner builders.",
};

export default async function ProjectsPage() {
  const projects = await repo.listProjects();

  return (
    <>
      <section className="bg-navy-950 py-16">
        <Reveal className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">Developments</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Ongoing &amp; Upcoming Projects
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/60">
            Handpicked residential and commercial developments from builders we trust.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </RevealGroup>
        {projects.length === 0 && (
          <p className="py-16 text-center text-sm text-navy-900/50">No projects listed yet. Check back soon.</p>
        )}
      </section>
    </>
  );
}
