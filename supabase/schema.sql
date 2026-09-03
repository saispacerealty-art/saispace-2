-- Sai Space Realty — Supabase schema
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Mirrors src/lib/types.ts. RLS is enabled with no public policies, so only
-- the service_role key (used server-side in src/lib/supabase.ts) can read/write.

create table if not exists properties (
  id text primary key,
  title text not null,
  slug text not null unique,
  type text not null,
  status text not null,
  price numeric not null default 0,
  price_unit text not null default 'total',
  city text not null default '',
  locality text not null default '',
  address text not null default '',
  bedrooms int not null default 0,
  bathrooms int not null default 0,
  area_sqft int not null default 0,
  description text not null default '',
  features text[] not null default '{}',
  images text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id text primary key,
  name text not null,
  slug text not null unique,
  location text not null default '',
  detail text not null default '',
  status text not null default 'Under Construction',
  description text not null default '',
  image text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id text primary key,
  title text not null,
  slug text not null unique,
  category text not null default '',
  excerpt text not null default '',
  content text not null default '',
  cover_image text not null default '',
  published_at timestamptz not null default now()
);

create table if not exists inquiries (
  id text primary key,
  name text not null,
  email text not null default '',
  phone text not null default '',
  message text not null default '',
  property_id text,
  property_title text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Single-row table: always id = 1.
create table if not exists settings (
  id int primary key default 1,
  site_name text not null default '',
  tagline text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  address text not null default '',
  office_hours text not null default '',
  hero_eyebrow text not null default '',
  hero_title text not null default '',
  hero_accent text not null default '',
  hero_tagline text not null default '',
  about_text text not null default '',
  happy_clients int not null default 0,
  years_experience int not null default 0,
  socials jsonb not null default '{}'::jsonb,
  constraint settings_singleton check (id = 1)
);

-- Generic store for the admin "content list" sections (testimonials, whyChooseUs,
-- propertyTypes, values, team, services, navLinks) — one row per list item.
create table if not exists content_items (
  id text primary key,
  section text not null,
  position bigint generated always as identity,
  data jsonb not null default '{}'::jsonb
);
create index if not exists content_items_section_idx on content_items (section, position);

create table if not exists referrals (
  id text primary key,
  code text not null unique,
  referrer_name text not null,
  referrer_phone text not null,
  referrer_email text,
  referred_name text not null,
  referred_phone text not null,
  referred_email text,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Single-row table: always id = 1.
create table if not exists page_copy (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  constraint page_copy_singleton check (id = 1)
);

alter table properties enable row level security;
alter table projects enable row level security;
alter table blog_posts enable row level security;
alter table inquiries enable row level security;
alter table settings enable row level security;
alter table content_items enable row level security;
alter table referrals enable row level security;
alter table page_copy enable row level security;
-- No policies are created, so only requests using the service_role key
-- (server-side only, see src/lib/supabase.ts) can read or write these tables.
