import { notFound } from "next/navigation";
import { repo } from "@/lib/repository";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await repo.getProperty(id);
  if (!property) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Edit Property</h1>
      <p className="mt-1 text-sm text-navy-900/60">{property.title}</p>
      <div className="mt-6">
        <PropertyForm property={property} />
      </div>
    </div>
  );
}
