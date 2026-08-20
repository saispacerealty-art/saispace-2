import { Hero } from "@/components/home/Hero";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { PropertyTypes } from "@/components/home/PropertyTypes";
import { ProjectsPreview } from "@/components/home/ProjectsPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogPreview } from "@/components/home/BlogPreview";
import { CTASection } from "@/components/home/CTASection";
import { repo } from "@/lib/repository";

export default async function Home() {
  const [properties, projects, posts, settings] = await Promise.all([
    repo.listProperties(),
    repo.listProjects(),
    repo.listPosts(),
    repo.getSettings(),
  ]);

  const featured = properties.filter((p) => p.featured).slice(0, 6);
  const cities = new Set(properties.map((p) => p.city)).size;

  return (
    <>
      <Hero
        stats={{
          properties: properties.length,
          cities,
          years: settings.yearsExperience,
          happyClients: settings.happyClients,
        }}
      />
      <FeaturedProperties properties={featured.length ? featured : properties.slice(0, 6)} />
      <WhyChooseUs />
      <PropertyTypes />
      <ProjectsPreview projects={projects.slice(0, 3)} />
      <Testimonials />
      <BlogPreview posts={posts.slice(0, 3)} />
      <CTASection />
    </>
  );
}
