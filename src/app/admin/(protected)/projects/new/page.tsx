import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Add Project</h1>
      <p className="mt-1 text-sm text-navy-900/60">Add a new development to showcase on your site.</p>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
