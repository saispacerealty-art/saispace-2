import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type {
  BlogPost,
  ContentMap,
  ContentSection,
  Inquiry,
  PageCopy,
  Project,
  Property,
  Referral,
  SiteSettings,
} from "./types";
import { getSupabase } from "./supabase";

/**
 * Data access is isolated behind this interface so the JSON-file store used
 * today can be swapped for a real database (Supabase, Firebase, etc.) later
 * without touching any API route or page — only `repo` below needs to change.
 */
export interface DataRepository {
  listProperties(): Promise<Property[]>;
  getProperty(idOrSlug: string): Promise<Property | null>;
  createProperty(input: Omit<Property, "id" | "createdAt">): Promise<Property>;
  updateProperty(id: string, input: Partial<Property>): Promise<Property | null>;
  deleteProperty(id: string): Promise<boolean>;

  listInquiries(): Promise<Inquiry[]>;
  createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry>;
  updateInquiry(id: string, input: Partial<Inquiry>): Promise<Inquiry | null>;
  deleteInquiry(id: string): Promise<boolean>;

  listReferrals(): Promise<Referral[]>;
  createReferral(
    input: Omit<Referral, "id" | "code" | "status" | "createdAt">
  ): Promise<Referral>;
  updateReferral(id: string, input: Partial<Referral>): Promise<Referral | null>;
  deleteReferral(id: string): Promise<boolean>;

  getSettings(): Promise<SiteSettings>;
  updateSettings(input: Partial<SiteSettings>): Promise<SiteSettings>;

  listProjects(): Promise<Project[]>;
  getProject(idOrSlug: string): Promise<Project | null>;
  createProject(input: Omit<Project, "id" | "createdAt">): Promise<Project>;
  updateProject(id: string, input: Partial<Project>): Promise<Project | null>;
  deleteProject(id: string): Promise<boolean>;

  listPosts(): Promise<BlogPost[]>;
  getPost(idOrSlug: string): Promise<BlogPost | null>;
  createPost(input: Omit<BlogPost, "id" | "publishedAt">): Promise<BlogPost>;
  updatePost(id: string, input: Partial<BlogPost>): Promise<BlogPost | null>;
  deletePost(id: string): Promise<boolean>;

  listContent<K extends ContentSection>(section: K): Promise<ContentMap[K][]>;
  createContentItem<K extends ContentSection>(
    section: K,
    input: Omit<ContentMap[K], "id">
  ): Promise<ContentMap[K]>;
  updateContentItem<K extends ContentSection>(
    section: K,
    id: string,
    input: Partial<ContentMap[K]>
  ): Promise<ContentMap[K] | null>;
  deleteContentItem(section: ContentSection, id: string): Promise<boolean>;

  getPageCopy(): Promise<PageCopy>;
  updatePageCopy(input: Partial<PageCopy>): Promise<PageCopy>;
}

const DATA_DIR = path.join(process.cwd(), "src", "lib", "data");
const PROPERTIES_FILE = path.join(DATA_DIR, "properties.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const PAGE_COPY_FILE = path.join(DATA_DIR, "page-copy.json");
const REFERRALS_FILE = path.join(DATA_DIR, "referrals.json");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `SSR-${code}`;
}

class JsonFileRepository implements DataRepository {
  async listProperties(): Promise<Property[]> {
    const items = await readJson<Property[]>(PROPERTIES_FILE);
    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async getProperty(idOrSlug: string): Promise<Property | null> {
    const items = await readJson<Property[]>(PROPERTIES_FILE);
    return items.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
  }

  async createProperty(input: Omit<Property, "id" | "createdAt">): Promise<Property> {
    const items = await readJson<Property[]>(PROPERTIES_FILE);
    const baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
    let slug = baseSlug;
    let suffix = 1;
    while (items.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }
    const property: Property = {
      ...input,
      slug,
      id: makeId(),
      createdAt: new Date().toISOString(),
    };
    items.push(property);
    await writeJson(PROPERTIES_FILE, items);
    return property;
  }

  async updateProperty(id: string, input: Partial<Property>): Promise<Property | null> {
    const items = await readJson<Property[]>(PROPERTIES_FILE);
    const idx = items.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...input, id: items[idx].id };
    items[idx] = updated;
    await writeJson(PROPERTIES_FILE, items);
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const items = await readJson<Property[]>(PROPERTIES_FILE);
    const next = items.filter((p) => p.id !== id);
    if (next.length === items.length) return false;
    await writeJson(PROPERTIES_FILE, next);
    return true;
  }

  async listInquiries(): Promise<Inquiry[]> {
    const items = await readJson<Inquiry[]>(INQUIRIES_FILE);
    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry> {
    const items = await readJson<Inquiry[]>(INQUIRIES_FILE);
    const inquiry: Inquiry = {
      ...input,
      id: makeId(),
      status: "new",
      createdAt: new Date().toISOString(),
    };
    items.push(inquiry);
    await writeJson(INQUIRIES_FILE, items);
    return inquiry;
  }

  async updateInquiry(id: string, input: Partial<Inquiry>): Promise<Inquiry | null> {
    const items = await readJson<Inquiry[]>(INQUIRIES_FILE);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...input, id: items[idx].id };
    items[idx] = updated;
    await writeJson(INQUIRIES_FILE, items);
    return updated;
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const items = await readJson<Inquiry[]>(INQUIRIES_FILE);
    const next = items.filter((i) => i.id !== id);
    if (next.length === items.length) return false;
    await writeJson(INQUIRIES_FILE, next);
    return true;
  }

  async listReferrals(): Promise<Referral[]> {
    const items = await readJson<Referral[]>(REFERRALS_FILE);
    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async createReferral(
    input: Omit<Referral, "id" | "code" | "status" | "createdAt">
  ): Promise<Referral> {
    const items = await readJson<Referral[]>(REFERRALS_FILE);
    let code = generateReferralCode();
    while (items.some((r) => r.code === code)) code = generateReferralCode();
    const referral: Referral = {
      ...input,
      id: makeId(),
      code,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    items.push(referral);
    await writeJson(REFERRALS_FILE, items);
    return referral;
  }

  async updateReferral(id: string, input: Partial<Referral>): Promise<Referral | null> {
    const items = await readJson<Referral[]>(REFERRALS_FILE);
    const idx = items.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...input, id: items[idx].id, code: items[idx].code };
    items[idx] = updated;
    await writeJson(REFERRALS_FILE, items);
    return updated;
  }

  async deleteReferral(id: string): Promise<boolean> {
    const items = await readJson<Referral[]>(REFERRALS_FILE);
    const next = items.filter((r) => r.id !== id);
    if (next.length === items.length) return false;
    await writeJson(REFERRALS_FILE, next);
    return true;
  }

  async getSettings(): Promise<SiteSettings> {
    return readJson<SiteSettings>(SETTINGS_FILE);
  }

  async updateSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await readJson<SiteSettings>(SETTINGS_FILE);
    const updated = { ...current, ...input };
    await writeJson(SETTINGS_FILE, updated);
    return updated;
  }

  async listProjects(): Promise<Project[]> {
    const items = await readJson<Project[]>(PROJECTS_FILE);
    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async getProject(idOrSlug: string): Promise<Project | null> {
    const items = await readJson<Project[]>(PROJECTS_FILE);
    return items.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
  }

  async createProject(input: Omit<Project, "id" | "createdAt">): Promise<Project> {
    const items = await readJson<Project[]>(PROJECTS_FILE);
    const baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name);
    let slug = baseSlug;
    let suffix = 1;
    while (items.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }
    const project: Project = { ...input, slug, id: makeId(), createdAt: new Date().toISOString() };
    items.push(project);
    await writeJson(PROJECTS_FILE, items);
    return project;
  }

  async updateProject(id: string, input: Partial<Project>): Promise<Project | null> {
    const items = await readJson<Project[]>(PROJECTS_FILE);
    const idx = items.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...input, id: items[idx].id };
    items[idx] = updated;
    await writeJson(PROJECTS_FILE, items);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const items = await readJson<Project[]>(PROJECTS_FILE);
    const next = items.filter((p) => p.id !== id);
    if (next.length === items.length) return false;
    await writeJson(PROJECTS_FILE, next);
    return true;
  }

  async listPosts(): Promise<BlogPost[]> {
    const items = await readJson<BlogPost[]>(POSTS_FILE);
    return items.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }

  async getPost(idOrSlug: string): Promise<BlogPost | null> {
    const items = await readJson<BlogPost[]>(POSTS_FILE);
    return items.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
  }

  async createPost(input: Omit<BlogPost, "id" | "publishedAt">): Promise<BlogPost> {
    const items = await readJson<BlogPost[]>(POSTS_FILE);
    const baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
    let slug = baseSlug;
    let suffix = 1;
    while (items.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }
    const post: BlogPost = { ...input, slug, id: makeId(), publishedAt: new Date().toISOString() };
    items.push(post);
    await writeJson(POSTS_FILE, items);
    return post;
  }

  async updatePost(id: string, input: Partial<BlogPost>): Promise<BlogPost | null> {
    const items = await readJson<BlogPost[]>(POSTS_FILE);
    const idx = items.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...input, id: items[idx].id };
    items[idx] = updated;
    await writeJson(POSTS_FILE, items);
    return updated;
  }

  async deletePost(id: string): Promise<boolean> {
    const items = await readJson<BlogPost[]>(POSTS_FILE);
    const next = items.filter((p) => p.id !== id);
    if (next.length === items.length) return false;
    await writeJson(POSTS_FILE, next);
    return true;
  }

  async listContent<K extends ContentSection>(section: K): Promise<ContentMap[K][]> {
    const all = await readJson<Record<ContentSection, { id: string }[]>>(CONTENT_FILE);
    return all[section] as ContentMap[K][];
  }

  async createContentItem<K extends ContentSection>(
    section: K,
    input: Omit<ContentMap[K], "id">
  ): Promise<ContentMap[K]> {
    const all = await readJson<Record<ContentSection, { id: string }[]>>(CONTENT_FILE);
    const item = { ...input, id: makeId() } as ContentMap[K] & { id: string };
    all[section] = [...all[section], item];
    await writeJson(CONTENT_FILE, all);
    return item;
  }

  async updateContentItem<K extends ContentSection>(
    section: K,
    id: string,
    input: Partial<ContentMap[K]>
  ): Promise<ContentMap[K] | null> {
    const all = await readJson<Record<ContentSection, { id: string }[]>>(CONTENT_FILE);
    const items = all[section];
    const idx = items.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...input, id: items[idx].id };
    items[idx] = updated;
    await writeJson(CONTENT_FILE, all);
    return updated as ContentMap[K];
  }

  async deleteContentItem(section: ContentSection, id: string): Promise<boolean> {
    const all = await readJson<Record<ContentSection, { id: string }[]>>(CONTENT_FILE);
    const items = all[section];
    const next = items.filter((item) => item.id !== id);
    if (next.length === items.length) return false;
    all[section] = next;
    await writeJson(CONTENT_FILE, all);
    return true;
  }

  async getPageCopy(): Promise<PageCopy> {
    return readJson<PageCopy>(PAGE_COPY_FILE);
  }

  async updatePageCopy(input: Partial<PageCopy>): Promise<PageCopy> {
    const current = await readJson<PageCopy>(PAGE_COPY_FILE);
    const updated = { ...current, ...input };
    await writeJson(PAGE_COPY_FILE, updated);
    return updated;
  }
}

function rowToProperty(row: Record<string, unknown>): Property {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    type: row.type as Property["type"],
    status: row.status as Property["status"],
    price: Number(row.price),
    priceUnit: row.price_unit as Property["priceUnit"],
    city: row.city as string,
    locality: row.locality as string,
    address: row.address as string,
    bedrooms: Number(row.bedrooms),
    bathrooms: Number(row.bathrooms),
    areaSqft: Number(row.area_sqft),
    description: row.description as string,
    features: (row.features as string[]) ?? [],
    images: (row.images as string[]) ?? [],
    featured: Boolean(row.featured),
    createdAt: row.created_at as string,
  };
}

function propertyToRow(input: Partial<Property>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.type !== undefined) row.type = input.type;
  if (input.status !== undefined) row.status = input.status;
  if (input.price !== undefined) row.price = input.price;
  if (input.priceUnit !== undefined) row.price_unit = input.priceUnit;
  if (input.city !== undefined) row.city = input.city;
  if (input.locality !== undefined) row.locality = input.locality;
  if (input.address !== undefined) row.address = input.address;
  if (input.bedrooms !== undefined) row.bedrooms = input.bedrooms;
  if (input.bathrooms !== undefined) row.bathrooms = input.bathrooms;
  if (input.areaSqft !== undefined) row.area_sqft = input.areaSqft;
  if (input.description !== undefined) row.description = input.description;
  if (input.features !== undefined) row.features = input.features;
  if (input.images !== undefined) row.images = input.images;
  if (input.featured !== undefined) row.featured = input.featured;
  return row;
}

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    location: row.location as string,
    detail: row.detail as string,
    status: row.status as Project["status"],
    description: row.description as string,
    image: row.image as string,
    createdAt: row.created_at as string,
  };
}

function projectToRow(input: Partial<Project>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.name !== undefined) row.name = input.name;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.location !== undefined) row.location = input.location;
  if (input.detail !== undefined) row.detail = input.detail;
  if (input.status !== undefined) row.status = input.status;
  if (input.description !== undefined) row.description = input.description;
  if (input.image !== undefined) row.image = input.image;
  return row;
}

function rowToPost(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    category: row.category as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    coverImage: row.cover_image as string,
    publishedAt: row.published_at as string,
  };
}

function postToRow(input: Partial<BlogPost>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.category !== undefined) row.category = input.category;
  if (input.excerpt !== undefined) row.excerpt = input.excerpt;
  if (input.content !== undefined) row.content = input.content;
  if (input.coverImage !== undefined) row.cover_image = input.coverImage;
  return row;
}

function rowToInquiry(row: Record<string, unknown>): Inquiry {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    message: row.message as string,
    propertyId: (row.property_id as string) ?? undefined,
    propertyTitle: (row.property_title as string) ?? undefined,
    status: row.status as Inquiry["status"],
    createdAt: row.created_at as string,
  };
}

function rowToReferral(row: Record<string, unknown>): Referral {
  return {
    id: row.id as string,
    code: row.code as string,
    referrerName: row.referrer_name as string,
    referrerPhone: row.referrer_phone as string,
    referrerEmail: (row.referrer_email as string) ?? undefined,
    referredName: row.referred_name as string,
    referredPhone: row.referred_phone as string,
    referredEmail: (row.referred_email as string) ?? undefined,
    message: (row.message as string) ?? undefined,
    status: row.status as Referral["status"],
    createdAt: row.created_at as string,
  };
}

function rowToSettings(row: Record<string, unknown>): SiteSettings {
  return {
    siteName: row.site_name as string,
    tagline: row.tagline as string,
    phone: row.phone as string,
    whatsapp: row.whatsapp as string,
    email: row.email as string,
    address: row.address as string,
    officeHours: row.office_hours as string,
    heroEyebrow: row.hero_eyebrow as string,
    heroTitle: row.hero_title as string,
    heroAccent: row.hero_accent as string,
    heroTagline: row.hero_tagline as string,
    aboutText: row.about_text as string,
    happyClients: Number(row.happy_clients),
    yearsExperience: Number(row.years_experience),
    socials: (row.socials as SiteSettings["socials"]) ?? {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
  };
}

function settingsToRow(input: Partial<SiteSettings>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.siteName !== undefined) row.site_name = input.siteName;
  if (input.tagline !== undefined) row.tagline = input.tagline;
  if (input.phone !== undefined) row.phone = input.phone;
  if (input.whatsapp !== undefined) row.whatsapp = input.whatsapp;
  if (input.email !== undefined) row.email = input.email;
  if (input.address !== undefined) row.address = input.address;
  if (input.officeHours !== undefined) row.office_hours = input.officeHours;
  if (input.heroEyebrow !== undefined) row.hero_eyebrow = input.heroEyebrow;
  if (input.heroTitle !== undefined) row.hero_title = input.heroTitle;
  if (input.heroAccent !== undefined) row.hero_accent = input.heroAccent;
  if (input.heroTagline !== undefined) row.hero_tagline = input.heroTagline;
  if (input.aboutText !== undefined) row.about_text = input.aboutText;
  if (input.happyClients !== undefined) row.happy_clients = input.happyClients;
  if (input.yearsExperience !== undefined) row.years_experience = input.yearsExperience;
  if (input.socials !== undefined) row.socials = input.socials;
  return row;
}

class SupabaseRepository implements DataRepository {
  private get db() {
    return getSupabase();
  }

  async listProperties(): Promise<Property[]> {
    const { data, error } = await this.db.from("properties").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToProperty);
  }

  async getProperty(idOrSlug: string): Promise<Property | null> {
    const { data, error } = await this.db
      .from("properties")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToProperty(data) : null;
  }

  async createProperty(input: Omit<Property, "id" | "createdAt">): Promise<Property> {
    const baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
    let slug = baseSlug;
    let suffix = 1;
    while ((await this.getProperty(slug)) !== null) {
      slug = `${baseSlug}-${suffix++}`;
    }
    const row = { ...propertyToRow(input), id: makeId(), slug };
    const { data, error } = await this.db.from("properties").insert(row).select().single();
    if (error) throw new Error(error.message);
    return rowToProperty(data);
  }

  async updateProperty(id: string, input: Partial<Property>): Promise<Property | null> {
    const { data, error } = await this.db
      .from("properties")
      .update(propertyToRow(input))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToProperty(data) : null;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const { data, error } = await this.db.from("properties").delete().eq("id", id).select();
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  }

  async listInquiries(): Promise<Inquiry[]> {
    const { data, error } = await this.db.from("inquiries").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToInquiry);
  }

  async createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry> {
    const row = {
      id: makeId(),
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      property_id: input.propertyId ?? null,
      property_title: input.propertyTitle ?? null,
      status: "new",
    };
    const { data, error } = await this.db.from("inquiries").insert(row).select().single();
    if (error) throw new Error(error.message);
    return rowToInquiry(data);
  }

  async updateInquiry(id: string, input: Partial<Inquiry>): Promise<Inquiry | null> {
    const row: Record<string, unknown> = {};
    if (input.status !== undefined) row.status = input.status;
    if (input.name !== undefined) row.name = input.name;
    if (input.email !== undefined) row.email = input.email;
    if (input.phone !== undefined) row.phone = input.phone;
    if (input.message !== undefined) row.message = input.message;
    const { data, error } = await this.db.from("inquiries").update(row).eq("id", id).select().maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToInquiry(data) : null;
  }

  async deleteInquiry(id: string): Promise<boolean> {
    const { data, error } = await this.db.from("inquiries").delete().eq("id", id).select();
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  }

  async listReferrals(): Promise<Referral[]> {
    const { data, error } = await this.db.from("referrals").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToReferral);
  }

  async createReferral(
    input: Omit<Referral, "id" | "code" | "status" | "createdAt">
  ): Promise<Referral> {
    let code = generateReferralCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const row = {
        id: makeId(),
        code,
        referrer_name: input.referrerName,
        referrer_phone: input.referrerPhone,
        referrer_email: input.referrerEmail ?? null,
        referred_name: input.referredName,
        referred_phone: input.referredPhone,
        referred_email: input.referredEmail ?? null,
        message: input.message ?? null,
        status: "pending",
      };
      const { data, error } = await this.db.from("referrals").insert(row).select().single();
      if (!error) return rowToReferral(data);
      if (error.code !== "23505") throw new Error(error.message); // not a unique-code collision
      code = generateReferralCode();
    }
    throw new Error("Could not generate a unique referral code. Please try again.");
  }

  async updateReferral(id: string, input: Partial<Referral>): Promise<Referral | null> {
    const row: Record<string, unknown> = {};
    if (input.status !== undefined) row.status = input.status;
    if (input.referrerName !== undefined) row.referrer_name = input.referrerName;
    if (input.referrerPhone !== undefined) row.referrer_phone = input.referrerPhone;
    if (input.referrerEmail !== undefined) row.referrer_email = input.referrerEmail;
    if (input.referredName !== undefined) row.referred_name = input.referredName;
    if (input.referredPhone !== undefined) row.referred_phone = input.referredPhone;
    if (input.referredEmail !== undefined) row.referred_email = input.referredEmail;
    if (input.message !== undefined) row.message = input.message;
    const { data, error } = await this.db.from("referrals").update(row).eq("id", id).select().maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToReferral(data) : null;
  }

  async deleteReferral(id: string): Promise<boolean> {
    const { data, error } = await this.db.from("referrals").delete().eq("id", id).select();
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  }

  async getSettings(): Promise<SiteSettings> {
    const { data, error } = await this.db.from("settings").select("*").eq("id", 1).single();
    if (error) throw new Error(error.message);
    return rowToSettings(data);
  }

  async updateSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
    const { data, error } = await this.db
      .from("settings")
      .update(settingsToRow(input))
      .eq("id", 1)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rowToSettings(data);
  }

  async listProjects(): Promise<Project[]> {
    const { data, error } = await this.db.from("projects").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToProject);
  }

  async getProject(idOrSlug: string): Promise<Project | null> {
    const { data, error } = await this.db
      .from("projects")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToProject(data) : null;
  }

  async createProject(input: Omit<Project, "id" | "createdAt">): Promise<Project> {
    const baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name);
    let slug = baseSlug;
    let suffix = 1;
    while ((await this.getProject(slug)) !== null) {
      slug = `${baseSlug}-${suffix++}`;
    }
    const row = { ...projectToRow(input), id: makeId(), slug };
    const { data, error } = await this.db.from("projects").insert(row).select().single();
    if (error) throw new Error(error.message);
    return rowToProject(data);
  }

  async updateProject(id: string, input: Partial<Project>): Promise<Project | null> {
    const { data, error } = await this.db
      .from("projects")
      .update(projectToRow(input))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToProject(data) : null;
  }

  async deleteProject(id: string): Promise<boolean> {
    const { data, error } = await this.db.from("projects").delete().eq("id", id).select();
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  }

  async listPosts(): Promise<BlogPost[]> {
    const { data, error } = await this.db.from("blog_posts").select("*").order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(rowToPost);
  }

  async getPost(idOrSlug: string): Promise<BlogPost | null> {
    const { data, error } = await this.db
      .from("blog_posts")
      .select("*")
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToPost(data) : null;
  }

  async createPost(input: Omit<BlogPost, "id" | "publishedAt">): Promise<BlogPost> {
    const baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
    let slug = baseSlug;
    let suffix = 1;
    while ((await this.getPost(slug)) !== null) {
      slug = `${baseSlug}-${suffix++}`;
    }
    const row = { ...postToRow(input), id: makeId(), slug };
    const { data, error } = await this.db.from("blog_posts").insert(row).select().single();
    if (error) throw new Error(error.message);
    return rowToPost(data);
  }

  async updatePost(id: string, input: Partial<BlogPost>): Promise<BlogPost | null> {
    const { data, error } = await this.db
      .from("blog_posts")
      .update(postToRow(input))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToPost(data) : null;
  }

  async deletePost(id: string): Promise<boolean> {
    const { data, error } = await this.db.from("blog_posts").delete().eq("id", id).select();
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  }

  async listContent<K extends ContentSection>(section: K): Promise<ContentMap[K][]> {
    const { data, error } = await this.db
      .from("content_items")
      .select("id, data")
      .eq("section", section)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({ ...(row.data as object), id: row.id }) as ContentMap[K]);
  }

  async createContentItem<K extends ContentSection>(
    section: K,
    input: Omit<ContentMap[K], "id">
  ): Promise<ContentMap[K]> {
    const id = makeId();
    const { error } = await this.db.from("content_items").insert({ id, section, data: input });
    if (error) throw new Error(error.message);
    return { ...input, id } as ContentMap[K] & { id: string };
  }

  async updateContentItem<K extends ContentSection>(
    section: K,
    id: string,
    input: Partial<ContentMap[K]>
  ): Promise<ContentMap[K] | null> {
    const { data: existing, error: readError } = await this.db
      .from("content_items")
      .select("data")
      .eq("id", id)
      .eq("section", section)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!existing) return null;
    const merged = { ...(existing.data as object), ...input };
    const { error } = await this.db.from("content_items").update({ data: merged }).eq("id", id);
    if (error) throw new Error(error.message);
    return { ...merged, id } as ContentMap[K];
  }

  async deleteContentItem(section: ContentSection, id: string): Promise<boolean> {
    const { data, error } = await this.db
      .from("content_items")
      .delete()
      .eq("id", id)
      .eq("section", section)
      .select();
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  }

  async getPageCopy(): Promise<PageCopy> {
    const { data, error } = await this.db.from("page_copy").select("data").eq("id", 1).single();
    if (error) throw new Error(error.message);
    return data.data as PageCopy;
  }

  async updatePageCopy(input: Partial<PageCopy>): Promise<PageCopy> {
    const current = await this.getPageCopy();
    const merged = { ...current, ...input };
    const { error } = await this.db.from("page_copy").update({ data: merged }).eq("id", 1);
    if (error) throw new Error(error.message);
    return merged;
  }
}

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const repo: DataRepository = supabaseConfigured ? new SupabaseRepository() : new JsonFileRepository();
