import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type { BlogPost, Inquiry, Project, Property, SiteSettings } from "./types";

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
}

const DATA_DIR = path.join(process.cwd(), "src", "lib", "data");
const PROPERTIES_FILE = path.join(DATA_DIR, "properties.json");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

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
}

export const repo: DataRepository = new JsonFileRepository();
