-- Optional: grant table access to Supabase roles
-- (Admin app now also uses service_role after login, but these grants help RLS policies.)

grant usage on schema public to anon, authenticated;

grant select on public.cms_products to anon, authenticated;
grant insert, update, delete on public.cms_products to authenticated;

grant select on public.cms_articles to anon, authenticated;
grant insert, update, delete on public.cms_articles to authenticated;
