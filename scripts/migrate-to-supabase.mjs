// One-time migration: pushes the existing JSON-file data (src/lib/data/*.json)
// into Supabase tables created by supabase/schema.sql.
//
// Usage:
//   1. Run supabase/schema.sql in the Supabase SQL editor first.
//   2. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
//   3. node scripts/migrate-to-supabase.mjs
//
// Safe to re-run: every table is upserted on its primary key, so running this
// twice just overwrites rows with the same data instead of duplicating them.

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

async function loadEnvLocal() {
  try {
    const raw = await readFile(path.join(root, ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env.local not found — rely on already-set environment variables.
  }
}

await loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const dataDir = path.join(root, "src", "lib", "data");

async function readJson(file) {
  const raw = await readFile(path.join(dataDir, file), "utf-8");
  return JSON.parse(raw);
}

async function upsert(table, rows, label) {
  if (rows.length === 0) {
    console.log(`- ${label}: nothing to migrate`);
    return;
  }
  const { error } = await supabase.from(table).upsert(rows);
  if (error) throw new Error(`${label}: ${error.message}`);
  console.log(`- ${label}: migrated ${rows.length} row(s)`);
}

async function main() {
  console.log(`Migrating JSON data from ${dataDir} into Supabase (${url})\n`);

  const properties = await readJson("properties.json");
  await upsert(
    "properties",
    properties.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      type: p.type,
      status: p.status,
      price: p.price,
      price_unit: p.priceUnit,
      city: p.city,
      locality: p.locality,
      address: p.address,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area_sqft: p.areaSqft,
      description: p.description,
      features: p.features,
      images: p.images,
      featured: p.featured,
      created_at: p.createdAt,
    })),
    "properties"
  );

  const projects = await readJson("projects.json");
  await upsert(
    "projects",
    projects.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      location: p.location,
      detail: p.detail,
      status: p.status,
      description: p.description,
      image: p.image,
      created_at: p.createdAt,
    })),
    "projects"
  );

  const posts = await readJson("posts.json");
  await upsert(
    "blog_posts",
    posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      excerpt: p.excerpt,
      content: p.content,
      cover_image: p.coverImage,
      published_at: p.publishedAt,
    })),
    "blog_posts"
  );

  const inquiries = await readJson("inquiries.json");
  await upsert(
    "inquiries",
    inquiries.map((i) => ({
      id: i.id,
      name: i.name,
      email: i.email,
      phone: i.phone,
      message: i.message,
      property_id: i.propertyId ?? null,
      property_title: i.propertyTitle ?? null,
      status: i.status,
      created_at: i.createdAt,
    })),
    "inquiries"
  );

  const settings = await readJson("settings.json");
  await upsert(
    "settings",
    [
      {
        id: 1,
        site_name: settings.siteName,
        tagline: settings.tagline,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        address: settings.address,
        office_hours: settings.officeHours,
        hero_eyebrow: settings.heroEyebrow,
        hero_title: settings.heroTitle,
        hero_accent: settings.heroAccent,
        hero_tagline: settings.heroTagline,
        about_text: settings.aboutText,
        happy_clients: settings.happyClients,
        years_experience: settings.yearsExperience,
        socials: settings.socials,
      },
    ],
    "settings"
  );

  const pageCopy = await readJson("page-copy.json");
  await upsert("page_copy", [{ id: 1, data: pageCopy }], "page_copy");

  const content = await readJson("content.json");
  const contentRows = [];
  for (const [section, items] of Object.entries(content)) {
    for (const item of items) {
      const { id, ...data } = item;
      contentRows.push({ id, section, data });
    }
  }
  await upsert("content_items", contentRows, "content_items (all sections)");

  console.log("\nDone. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and restart the dev server to switch over.");
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
