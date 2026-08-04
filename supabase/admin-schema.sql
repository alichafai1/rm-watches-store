-- Run this in Supabase → SQL Editor
-- Solo admin UID (your account)
-- 1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.cms_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  price numeric(12, 2) not null default 0,
  compare_at_price numeric(12, 2),
  currency text not null default 'USD',
  collection_id text not null default '',
  collection_name text not null default '',
  collection_slug text not null default '',
  gender text not null default 'unisex',
  movement text not null default 'automatic',
  style text not null default 'sport',
  stock text not null default 'in_stock',
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  images jsonb not null default '[]'::jsonb,
  description_image jsonb,
  specification_details jsonb not null default '{}'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  about jsonb not null default '{}'::jsonb,
  reviews jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_products_status_idx on public.cms_products (status);
create index if not exists cms_products_updated_at_idx on public.cms_products (updated_at desc);

-- ---------------------------------------------------------------------------
-- Articles (blogs / guides)
-- ---------------------------------------------------------------------------
create table if not exists public.cms_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  content_blocks jsonb,
  cover_image jsonb,
  category text not null default 'company',
  type text not null default 'blog' check (type in ('blog', 'guide', 'pillar', 'cluster')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backwards-compatible migration for databases created before structured content.
alter table public.cms_articles
add column if not exists content_blocks jsonb;

create index if not exists cms_articles_status_idx on public.cms_articles (status);
create index if not exists cms_articles_type_status_idx on public.cms_articles (type, status);

-- ---------------------------------------------------------------------------
-- Updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_products_set_updated_at on public.cms_products;
create trigger cms_products_set_updated_at
before update on public.cms_products
for each row execute function public.set_updated_at();

drop trigger if exists cms_articles_set_updated_at on public.cms_articles;
create trigger cms_articles_set_updated_at
before update on public.cms_articles
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.cms_products enable row level security;
alter table public.cms_articles enable row level security;

-- Public read: published only
drop policy if exists "Public read published products" on public.cms_products;
create policy "Public read published products"
on public.cms_products
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public read published articles" on public.cms_articles;
create policy "Public read published articles"
on public.cms_articles
for select
to anon, authenticated
using (status = 'published');

-- Admin full access (your UID only)
drop policy if exists "Admin manage products" on public.cms_products;
create policy "Admin manage products"
on public.cms_products
for all
to authenticated
using (auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid)
with check (auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid);

drop policy if exists "Admin manage articles" on public.cms_articles;
create policy "Admin manage articles"
on public.cms_articles
for all
to authenticated
using (auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid)
with check (auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid);

-- ---------------------------------------------------------------------------
-- Storage: website-media (admin upload, public read)
-- ---------------------------------------------------------------------------
-- Ensure bucket exists (skip if already created in dashboard)
insert into storage.buckets (id, name, public)
values ('website-media', 'website-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read website-media" on storage.objects;
create policy "Public read website-media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'website-media');

drop policy if exists "Admin upload website-media" on storage.objects;
create policy "Admin upload website-media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'website-media'
  and auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid
);

drop policy if exists "Admin update website-media" on storage.objects;
create policy "Admin update website-media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'website-media'
  and auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid
)
with check (
  bucket_id = 'website-media'
  and auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid
);

drop policy if exists "Admin delete website-media" on storage.objects;
create policy "Admin delete website-media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'website-media'
  and auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid
);
