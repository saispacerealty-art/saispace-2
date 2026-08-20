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
