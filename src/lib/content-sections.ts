export const CONTENT_SECTIONS = [
  "testimonials",
  "whyChooseUs",
  "propertyTypes",
  "values",
  "team",
  "services",
  "navLinks",
] as const;

export type ContentSectionParam = (typeof CONTENT_SECTIONS)[number];

export function isContentSection(value: string): value is ContentSectionParam {
  return (CONTENT_SECTIONS as readonly string[]).includes(value);
}

export const CONTENT_REVALIDATE_PATHS: Record<ContentSectionParam, string[]> = {
  testimonials: ["/"],
  whyChooseUs: ["/"],
  propertyTypes: ["/"],
  values: ["/about"],
  team: ["/about"],
  services: ["/services"],
  navLinks: ["/"],
};
