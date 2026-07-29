-- Run in Supabase SQL Editor to fix "permission denied for table cms_products"

grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on table public.cms_products to postgres, service_role;
grant select on table public.cms_products to anon, authenticated;
grant insert, update, delete on table public.cms_products to authenticated;

grant all on table public.cms_articles to postgres, service_role;
grant select on table public.cms_articles to anon, authenticated;
grant insert, update, delete on table public.cms_articles to authenticated;

-- Make sure RLS policies still exist for public read / admin write
alter table public.cms_products enable row level security;
alter table public.cms_articles enable row level security;

notify pgrst, 'reload schema';
