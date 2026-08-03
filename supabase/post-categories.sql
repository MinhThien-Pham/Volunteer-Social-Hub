-- Add a fixed category to every post.

alter table public.posts
add column if not exists category text
not null
default 'General';


-- Limit categories to the values supported by the application.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'posts_category_allowed'
      and conrelid = 'public.posts'::regclass
  ) then
    alter table public.posts
    add constraint posts_category_allowed
    check (
      category in (
        'General',
        'Question',
        'Event',
        'Story',
        'Resource'
      )
    );
  end if;
end
$$;