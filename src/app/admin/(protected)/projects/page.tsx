import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { repo } from "@/lib/repository";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export default async function AdminProjectsPage() {
  const projects = await repo.listProjects();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Projects</h1>
          <p className="mt-1 text-sm text-navy-900/60">{projects.length} developments listed.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <PlusCircle className="h-4 w-4" /> Add Project
        </Link>
      </div>
      <div className="mt-6">
        <ProjectsTable projects={projects} />
      </div>
    </div>
  );
}
