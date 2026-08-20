import { notFound } from "next/navigation";
import { repo } from "@/lib/repository";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await repo.getProject(id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Edit Project</h1>
      <p className="mt-1 text-sm text-navy-900/60">{project.name}</p>
      <div className="mt-6">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
