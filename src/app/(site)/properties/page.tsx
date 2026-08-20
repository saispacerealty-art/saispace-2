import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertiesFilterBar } from "@/components/PropertiesFilterBar";
import { repo } from "@/lib/repository";
import { SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse verified residential, commercial and rental properties from Sai Space Realty.",
};

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : "").toLowerCase().trim();
  const type = typeof params.type === "string" ? params.type : "";
  const status = typeof params.status === "string" ? params.status : "";
  const sort = typeof params.sort === "string" ? params.sort : "newest";

  let properties = await repo.listProperties();

  if (q) {
    properties = properties.filter((p) =>
      [p.title, p.city, p.locality, p.address].some((f) => f.toLowerCase().includes(q))
    );
  }
  if (type) properties = properties.filter((p) => p.type === type);
  if (status) properties = properties.filter((p) => p.status === status);

  if (sort === "price-asc") properties = [...properties].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") properties = [...properties].sort((a, b) => b.price - a.price);

  return (
    <>
      <section className="bg-navy-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">Listings</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Find Your Next Property
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/60">
            {properties.length} propert{properties.length === 1 ? "y" : "ies"} matching your search.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={null}>
          <PropertiesFilterBar />
        </Suspense>

        {properties.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-navy-900/15 py-20 text-center">
            <SearchX className="h-10 w-10 text-navy-900/30" />
            <p className="font-display text-lg font-semibold text-navy-900">No properties found</p>
            <p className="max-w-sm text-sm text-navy-900/60">
              Try adjusting your filters or search a different city or locality.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
