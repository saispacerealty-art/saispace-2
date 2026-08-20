import { PropertyForm } from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy-900">Add Property</h1>
      <p className="mt-1 text-sm text-navy-900/60">Fill in the details below to publish a new listing.</p>
      <div className="mt-6">
        <PropertyForm />
      </div>
    </div>
  );
}
