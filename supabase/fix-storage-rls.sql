-- Fix website-media upload RLS (run in Supabase SQL Editor)
-- Your admin UID: 1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0

insert into storage.buckets (id, name, public)
values ('website-media', 'website-media', true)
on conflict (id) do update set public = true;

-- Remove old conflicting policies on this bucket (safe re-run)
do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and (
        policyname ilike '%website-media%'
        or policyname in (
          'Public read website-media',
          'Admin upload website-media',
          'Admin update website-media',
          'Admin delete website-media'
        )
      )
  loop
    execute format('drop policy if exists %I on storage.objects', pol.policyname);
  end loop;
end $$;

create policy "Public read website-media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'website-media');

create policy "Admin upload website-media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'website-media'
  and auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid
);

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

create policy "Admin delete website-media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'website-media'
  and auth.uid() = '1af1a2fb-ebaf-4d60-a34c-83f886a3ebc0'::uuid
);
