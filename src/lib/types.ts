export type PropertyType = "Residential" | "Commercial" | "Plot" | "Villa" | "Apartment";
export type PropertyStatus = "For Sale" | "For Rent" | "Sold";

export type Property = {
  id: string;
  title: string;
  slug: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  priceUnit: "total" | "month";
  city: string;
  locality: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  createdAt: string;
};

export type InquiryStatus = "new" | "contacted" | "closed";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  status: InquiryStatus;
  createdAt: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  officeHours: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroTagline: string;
  aboutText: string;
  happyClients: number;
  yearsExperience: number;
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
};

export type ProjectStatus = "Under Construction" | "Ready to Move" | "New Launch";

export type Project = {
  id: string;
  name: string;
  slug: string;
  location: string;
  detail: string;
  status: ProjectStatus;
  description: string;
  image: string;
  createdAt: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
};

export type Testimonial = { id: string; name: string; role: string; quote: string };

export type WhyChooseUsPoint = { id: string; icon: string; title: string; description: string };

export type PropertyTypeCard = { id: string; label: string; type: PropertyType; image: string };

export type ValueItem = { id: string; icon: string; title: string; description: string };

export type TeamMember = { id: string; name: string; role: string; photo: string };

export type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  points: string[];
};

export type NavLink = { id: string; href: string; label: string };

export type ReferralStatus = "pending" | "contacted" | "rewarded";

export type Referral = {
  id: string;
  code: string;
  referrerName: string;
  referrerPhone: string;
  referrerEmail?: string;
  referredName: string;
  referredPhone: string;
  referredEmail?: string;
  message?: string;
  status: ReferralStatus;
  createdAt: string;
};

export type ContentMap = {
  testimonials: Testimonial;
  whyChooseUs: WhyChooseUsPoint;
  propertyTypes: PropertyTypeCard;
  values: ValueItem;
  team: TeamMember;
  services: ServiceItem;
  navLinks: NavLink;
};

export type ContentSection = keyof ContentMap;

export type PageCopy = {
  ctaEyebrow: string;
  ctaTitle: string;
  ctaSubcopy: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  aboutHeroEyebrow: string;
  aboutHeroTitle: string;
  aboutHeroAccent: string;
  aboutHeroText: string;
  aboutMissionEyebrow: string;
  aboutMissionTitle: string;
  aboutMissionParagraph1: string;
  aboutMissionParagraph2: string;
  servicesHeroEyebrow: string;
  servicesHeroTitle: string;
  servicesHeroText: string;
  contactHeroEyebrow: string;
  contactHeroTitle: string;
  contactHeroText: string;
};
