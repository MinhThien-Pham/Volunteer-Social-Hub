-- Add ordered post image URLs.

alter table public.posts
add column if not exists image_urls text[]
not null
default '{}'::text[];

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'posts_image_urls_max_six'
      and conrelid = 'public.posts'::regclass
  ) then
    alter table public.posts
    add constraint posts_image_urls_max_six
    check (cardinality(image_urls) <= 6);
  end if;
end
$$;

-- Remove the previous single-image field.
-- All post images are now stored in image_urls.

alter table public.posts
drop column if exists image_url;

-- Supabase Storage requires an INSERT policy for browser uploads.

drop policy if exists "authenticated_upload_own_media"
on storage.objects;

create policy "authenticated_upload_own_media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'community-media'
  and (storage.foldername(name))[1] =
      (select auth.uid()::text)
);

-- Dashboard bucket configuration:
-- Bucket: community-media
-- Public: true
-- Maximum file size: 5 MB
-- Allowed MIME types: image/*