-- Add explicit description_image column to the existing cms_products catalog.
-- Run this in Supabase → SQL Editor.

alter table public.cms_products
add column if not exists description_image jsonb;

-- Backfill from about.image when present.
update public.cms_products
set description_image = about -> 'image'
where description_image is null
  and about is not null
  and about ? 'image';
