-- Volunteer Social Hub demo seed
-- Prerequisite: create these Auth users first through the app Sign Up flow
-- or Supabase Dashboard Authentication > Users:
--   maya.demo@example.com
--   jordan.demo@example.com
--   sofia.demo@example.com
--
-- This script keeps the existing "Bo" profile and existing posts.
-- It is safe to rerun: it removes only the six demo posts listed below.

begin;

do $$
declare
  bo_id uuid;
  maya_id uuid;
  jordan_id uuid;
  sofia_id uuid;

  care_boxes_post_id bigint;
  cleanup_post_id bigint;
  first_shift_post_id bigint;
  checklist_post_id bigint;
  grocery_kits_post_id bigint;
  sorting_post_id bigint;
begin
  select id
  into bo_id
  from public.profiles
  where lower(display_name) = 'bo'
  order by created_at
  limit 1;

  select id
  into maya_id
  from auth.users
  where lower(email) = 'maya.demo@example.com'
  limit 1;

  select id
  into jordan_id
  from auth.users
  where lower(email) = 'jordan.demo@example.com'
  limit 1;

  select id
  into sofia_id
  from auth.users
  where lower(email) = 'sofia.demo@example.com'
  limit 1;

  if bo_id is null then
    raise exception 'Could not find the existing profile named Bo.';
  end if;

  if maya_id is null or jordan_id is null or sofia_id is null then
    raise exception
      'Create maya.demo@example.com, jordan.demo@example.com, and sofia.demo@example.com in Supabase Auth before running this seed.';
  end if;

  insert into public.profiles (
    id,
    display_name,
    avatar_url,
    bio
  )
  values
    (
      maya_id,
      'Maya Chen',
      'https://api.dicebear.com/10.x/notionists/svg?seed=Maya%20Chen',
      'Weekend volunteer, coffee enthusiast, and the person who always brings extra tape.'
    ),
    (
      jordan_id,
      'Jordan Lee',
      'https://api.dicebear.com/10.x/notionists/svg?seed=Jordan%20Lee',
      'I organize neighborhood cleanups and help wherever an extra pair of hands is needed.'
    ),
    (
      sofia_id,
      'Sofia Martinez',
      'https://api.dicebear.com/10.x/notionists/svg?seed=Sofia%20Martinez',
      'Food pantry volunteer sharing practical tips, small wins, and upcoming opportunities.'
    )
  on conflict (id) do update
  set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    bio = excluded.bio;

  -- Remove only previous copies of this demo set.
  -- Comments are deleted automatically through ON DELETE CASCADE.
  delete from public.posts
  where title = any (
    array[
      'We packed 120 care boxes in one afternoon',
      'Lake Eola cleanup this Sunday — extra hands welcome',
      'First food-bank shift: what should I bring?',
      'A simple checklist for your first volunteer shift',
      'Small team, big result: 40 grocery kits packed',
      'Saturday donation sorting — two spots just opened'
    ]::text[]
  );

  insert into public.posts (
    author_id,
    title,
    content,
    category,
    image_urls,
    upvotes,
    created_at
  )
  values (
    sofia_id,
    'We packed 120 care boxes in one afternoon',
    'Yesterday our group packed 120 boxes with canned food, bread, hygiene items, and handwritten notes. We started with a messy room and no real system, but after splitting into stations everything moved quickly. The best part was seeing new volunteers become confident enough to teach the next person in line.',
    'Story',
    array[
      'https://images.pexels.com/photos/6995201/pexels-photo-6995201.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/6995220/pexels-photo-6995220.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ]::text[],
    21,
    now() - interval '5 days'
  )
  returning id into care_boxes_post_id;

  insert into public.posts (
    author_id,
    title,
    content,
    category,
    image_urls,
    upvotes,
    created_at
  )
  values (
    jordan_id,
    'Lake Eola cleanup this Sunday — extra hands welcome',
    'We are meeting near the northeast corner of the lake at 9:00 AM. Bags and grabbers are covered. Bring water, sunscreen, closed-toe shoes, and gloves if you already own a pair. We should finish before noon, so this is an easy first event for anyone who has not volunteered before.',
    'Event',
    array[
      'https://images.pexels.com/photos/36713458/pexels-photo-36713458.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/6647014/pexels-photo-6647014.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ]::text[],
    14,
    now() - interval '3 days'
  )
  returning id into cleanup_post_id;

  insert into public.posts (
    author_id,
    title,
    content,
    category,
    image_urls,
    upvotes,
    created_at
  )
  values (
    maya_id,
    'First food-bank shift: what should I bring?',
    'I signed up for my first packing shift next week. The confirmation email says comfortable clothes and closed-toe shoes, but I am not sure what people normally bring. Water bottle? Gloves? A small bag? I would appreciate any advice from people who have done this before.',
    'Question',
    array[
      'https://images.pexels.com/photos/6591165/pexels-photo-6591165.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ]::text[],
    11,
    now() - interval '2 days'
  )
  returning id into first_shift_post_id;

  insert into public.posts (
    author_id,
    title,
    content,
    category,
    image_urls,
    upvotes,
    created_at
  )
  values (
    bo_id,
    'A simple checklist for your first volunteer shift',
    'This is the checklist I wish I had before my first event: confirm the address and parking plan, wear closed-toe shoes, bring water, arrive ten minutes early, ask where personal items should go, and tell the team lead that you are new. Most roles are easy once someone demonstrates the first cycle.',
    'Resource',
    array[]::text[],
    17,
    now() - interval '1 day'
  )
  returning id into checklist_post_id;

  insert into public.posts (
    author_id,
    title,
    content,
    category,
    image_urls,
    upvotes,
    created_at
  )
  values (
    jordan_id,
    'Small team, big result: 40 grocery kits packed',
    'Only five people showed up, so we expected a slow evening. Instead, everyone chose a station and kept the line moving. We packed forty grocery kits, cleaned the room, and finished early. A small team can do a lot when the setup is simple and everyone communicates.',
    'Story',
    array[
      'https://images.pexels.com/photos/7156179/pexels-photo-7156179.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/6646862/pexels-photo-6646862.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ]::text[],
    9,
    now() - interval '10 hours'
  )
  returning id into grocery_kits_post_id;

  insert into public.posts (
    author_id,
    title,
    content,
    category,
    image_urls,
    upvotes,
    created_at
  )
  values (
    maya_id,
    'Saturday donation sorting — two spots just opened',
    'Two volunteers had to cancel, so we have two openings for Saturday from 10:00 AM to 12:30 PM. The work is indoors and mostly involves sorting donated items, checking labels, and packing boxes. No experience is needed. Comment here if you are interested.',
    'Event',
    array[
      'https://images.pexels.com/photos/6995220/pexels-photo-6995220.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ]::text[],
    6,
    now() - interval '2 hours'
  )
  returning id into sorting_post_id;

  insert into public.comments (
    post_id,
    author_id,
    content,
    created_at
  )
  values
    (
      care_boxes_post_id,
      bo_id,
      'This looks amazing. The handwritten notes are a great idea.',
      now() - interval '4 days 22 hours'
    ),
    (
      care_boxes_post_id,
      jordan_id,
      'Did your team pre-sort the items before the packing line started?',
      now() - interval '4 days 18 hours'
    ),
    (
      care_boxes_post_id,
      maya_id,
      'I would love to join the next one. Please post when registration opens.',
      now() - interval '4 days 12 hours'
    ),

    (
      cleanup_post_id,
      sofia_id,
      'I can bring an extra box of gloves.',
      now() - interval '2 days 20 hours'
    ),
    (
      cleanup_post_id,
      bo_id,
      'Count me in for 9:00 AM.',
      now() - interval '2 days 16 hours'
    ),
    (
      cleanup_post_id,
      maya_id,
      'Is the closest parking garage the one by Central Boulevard?',
      now() - interval '2 days 8 hours'
    ),

    (
      first_shift_post_id,
      bo_id,
      'Closed-toe shoes and water are the important ones. Keep the bag small because storage space can be limited.',
      now() - interval '1 day 20 hours'
    ),
    (
      first_shift_post_id,
      sofia_id,
      'I also bring a light jacket. Some packing rooms get cold.',
      now() - interval '1 day 16 hours'
    ),
    (
      first_shift_post_id,
      jordan_id,
      'Arrive about ten minutes early and tell the lead it is your first shift. They will walk you through everything.',
      now() - interval '1 day 12 hours'
    ),

    (
      checklist_post_id,
      maya_id,
      'Saving this for next week. The personal-items question is something I would not have thought about.',
      now() - interval '20 hours'
    ),
    (
      checklist_post_id,
      jordan_id,
      'Good list. I would add sunscreen for outdoor events even when the shift is short.',
      now() - interval '17 hours'
    ),
    (
      checklist_post_id,
      sofia_id,
      'A photo ID is also worth bringing in case the organization checks volunteers in at the front desk.',
      now() - interval '14 hours'
    ),

    (
      grocery_kits_post_id,
      bo_id,
      'Nice work. Clear stations make such a big difference.',
      now() - interval '8 hours'
    ),
    (
      grocery_kits_post_id,
      maya_id,
      'How long did the full packing session take?',
      now() - interval '7 hours'
    ),
    (
      grocery_kits_post_id,
      sofia_id,
      'The labeled boxes look great. That probably saved a lot of time.',
      now() - interval '5 hours'
    ),

    (
      sorting_post_id,
      jordan_id,
      'I can take one of the open spots.',
      now() - interval '90 minutes'
    ),
    (
      sorting_post_id,
      sofia_id,
      'I am sharing this with a friend who lives nearby.',
      now() - interval '55 minutes'
    ),
    (
      sorting_post_id,
      bo_id,
      'Great timing. This should be an easy event for a first-time volunteer.',
      now() - interval '25 minutes'
    );
end
$$;

commit;


-- Review the seeded data.
select
  p.id,
  p.title,
  p.category,
  pr.display_name as author,
  p.upvotes,
  cardinality(p.image_urls) as image_count,
  count(c.id) as comment_count,
  p.created_at
from public.posts p
join public.profiles pr
  on pr.id = p.author_id
left join public.comments c
  on c.post_id = p.id
where p.title = any (
  array[
    'We packed 120 care boxes in one afternoon',
    'Lake Eola cleanup this Sunday — extra hands welcome',
    'First food-bank shift: what should I bring?',
    'A simple checklist for your first volunteer shift',
    'Small team, big result: 40 grocery kits packed',
    'Saturday donation sorting — two spots just opened'
  ]::text[]
)
group by
  p.id,
  p.title,
  p.category,
  pr.display_name,
  p.upvotes,
  p.image_urls,
  p.created_at
order by p.created_at desc;

-- Image source pages used for the demo:
-- https://www.pexels.com/photo/volunteers-preparing-donations-6995201/
-- https://www.pexels.com/photo/people-donating-food-to-a-charity-6995220/
-- https://www.pexels.com/photo/community-volunteers-cleaning-up-forest-area-36713458/
-- https://www.pexels.com/photo/volunteers-cleaning-the-street-6647014/
-- https://www.pexels.com/photo/volunteers-boxing-foods-to-be-distributed-6591165/
-- https://www.pexels.com/photo/volunteers-packing-up-goods-7156179/
-- https://www.pexels.com/photo/volunteer-holding-box-of-food-aid-6646862/
