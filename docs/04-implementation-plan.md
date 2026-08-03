# Implementation Plan

## Project

- **Project:** Volunteer Social Hub
- **Document:** Implementation Plan
- **Status:** Approved
- **Branch:** `master`
- **Related documents:**
  - `docs/01-mini-prd.md`
  - `docs/02-data-model-and-erd.md`
  - `docs/03-technical-design.md`

---

## 1. Implementation Strategy

The project will be built in small, working milestones.

Each milestone must:

1. Add one coherent group of functionality.
2. Keep the application runnable.
3. Be manually tested before committing.
4. Avoid stretch features until all required product features work.
5. Follow the concrete implementation conventions defined in the Technical Design.

The implementation order is designed to reduce rework:

```text
Project shell
→ Supabase database and client
→ Basic authentication and profiles
→ Post feed and post CRUD
→ Post detail
→ Comments and upward-arrow count
→ Search and sort
→ UI states and styling
→ README, GIF, and final testing
```

---

## 2. Time Budget

Target implementation time: approximately 5–6 focused hours.

| Milestone | Target Time |
|---|---:|
| 0. Preserve docs and prepare repository | 10–15 min |
| 1. React/Vite setup and routes | 25–35 min |
| 2. Supabase project, tables, and client | 30–45 min |
| 3. Basic Auth and profile creation | 35–50 min |
| 4. Post feed and create flow | 40–55 min |
| 5. Post detail, edit, and delete | 40–55 min |
| 6. Comments and upward-arrow count | 35–50 min |
| 7. Search, sort, and UI states | 30–40 min |
| 8. Styling, testing, README, and GIF | 45–60 min |

These are target timeboxes, not promises. When a timebox is exceeded, use the fallback rules in Section 13.

---

## 3. Milestone 0 — Repository Preparation

### Goal

Prepare the repository for the React application without losing the existing README or documentation.

### Tasks

1. Confirm the repository is on `master`.
2. Confirm the approved documents are present:
   - `docs/01-mini-prd.md`
   - `docs/02-data-model-and-erd.md`
   - `docs/03-technical-design.md`
3. Add this implementation-plan document as:
   - `docs/04-implementation-plan.md`
4. Preserve the existing README structure and required submission sections.
5. Confirm the working tree is clean before scaffolding the app.

### Completion Gate

```text
README exists
docs exist
git status is clean
```

### Commit Point

If documents 03 and 04 have not been committed yet:

```bash
git add docs/03-technical-design.md docs/04-implementation-plan.md
git commit -m "docs: add technical design and implementation plan"
git push origin master
```

Do not create a separate commit when the files are already committed and unchanged.

---

## 4. Milestone 1 — React/Vite Shell and Routing

### Goal

Create a runnable React application with the required page routes and a shared layout.

### Tasks

1. Initialize React with Vite at the repository root while preserving `README.md` and `docs/`.
2. Install dependencies:
   - `react-router`
   - `@supabase/supabase-js`
3. Remove unused Vite starter content.
4. Create the initial folders:
   - `src/components`
   - `src/pages`
   - `src/routes`
5. Create:
   - `Layout.jsx`
   - `ReadPosts.jsx`
   - `CreatePost.jsx`
   - `PostDetail.jsx`
   - `EditPost.jsx`
   - `Login.jsx`
   - `Signup.jsx`
   - `NotFound.jsx`
6. Configure routes:
   - `/`
   - `/posts/new`
   - `/posts/:id`
   - `/posts/:id/edit`
   - `/login`
   - `/signup`
   - `*`
7. Add a simple navigation bar with `Link`.
8. Confirm every route renders a temporary page label.

### Implementation Conventions

- Functional components and explicit imports
- `BrowserRouter`, `Routes`, `Route`, `Layout`, `Outlet`, and `Link`

### Completion Gate

- `npm run dev` starts without errors.
- Every route renders.
- Navigation works.
- Refreshing the home page works locally.

### Commit and Push

```bash
git add .
git commit -m "chore: scaffold React app and page routes"
git push origin master
```

This is the first implementation commit and should be pushed immediately after the routing shell works.

---

## 5. Milestone 2 — Supabase Database and Client

### Goal

Create the persistent data foundation before building feature pages.

### Tasks

1. Create the Supabase project.
2. Disable email confirmation for the MVP demo.
3. Create the `profiles` table.
4. Create the `posts` table.
5. Create the `comments` table.
6. Add foreign keys:
   - `posts.author_id → profiles.id`
   - `comments.author_id → profiles.id`
   - `comments.post_id → posts.id`
7. Configure `comments.post_id` with cascade delete.
8. Keep RLS disabled on the three application tables.
9. Do not enable Realtime unless later required.
10. Create `.env` or `.env.local` with:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_PUBLISHABLE_KEY`
11. Add `.env.example` with variable names only.
12. Confirm the real environment file is ignored by Git.
13. Create `src/client.js`.
14. Test one simple read request from the application.

### Database Fields

#### `profiles`

```text
id
display_name
avatar_url
bio
created_at
```

#### `posts`

```text
id
author_id
title
content
image_url
upvotes
created_at
```

#### `comments`

```text
id
post_id
author_id
content
created_at
```

### Completion Gate

- React connects to Supabase.
- A test query returns without a configuration error.
- No secret/service-role key appears in tracked files.
- Foreign-key relationships exist.
- Deleting a test post also deletes its test comments.

### Commit and Push

```bash
git add .
git commit -m "chore: connect Supabase and document environment setup"
git push origin master
```

Do not commit the real `.env` file.

---

## 6. Milestone 3 — Basic Authentication and Profiles

### Goal

Implement the smallest account flow required for member interactions.

### Signup Tasks

1. Create controlled inputs for:
   - Display name
   - Email
   - Password
2. Validate that no required field is empty.
3. Call Supabase `signUp`.
4. Read the returned Auth user ID.
5. Insert a profile using the same ID.
6. Show a simple error when signup or profile creation fails.
7. Redirect to the home page after success.

### Login Tasks

1. Create controlled email and password inputs.
2. Call `signInWithPassword`.
3. Display a simple error for invalid credentials.
4. Redirect home after success.

### Session Tasks

1. Read the initial session in `App.jsx`.
2. Listen for Auth state changes.
3. Fetch the current profile when a user is signed in.
4. Pass `session` and `currentProfile` through props.
5. Add a sign-out button.
6. Display either:
   - Login/Signup links, or
   - Display name/Sign Out

### Scope Limits

Do not add:

- Google OAuth
- Password reset
- Email verification UI
- Auth Context
- Protected-route abstractions
- Complex profile recovery

### Completion Gate

- A new account can be created.
- A matching profile row appears.
- The user can log out and log back in.
- The display name appears in the navigation.
- Login email is not displayed publicly.

### Commit and Push

```bash
git add .
git commit -m "feat: add email authentication and user profiles"
git push origin master
```

Do not continue to post ownership until signup, login, and logout all work.

---

## 7. Milestone 4 — Home Feed and Create Post

### Goal

Complete the first vertical slice: a signed-in member creates a post and sees it in the feed.

### Home Feed Tasks

1. Fetch posts in `ReadPosts.jsx` with `useEffect`.
2. Store posts in state.
3. Render posts with `.map()`.
4. Create a reusable `Card.jsx`.
5. Display only:
   - Creation time
   - Title
   - Upward-arrow count
6. Link each card to `/posts/:id`.
7. Add a basic loading message.
8. Add a no-posts message.

### Create Post Tasks

1. Create controlled object state:

```text
title
content
image_url
```

2. Require and trim the title.
3. Keep content and image URL optional.
4. Before submission, confirm a session exists.
5. Insert:
   - Form fields
   - `author_id`
   - Initial `upvotes`
6. Prevent duplicate submission while saving.
7. Redirect to the created post or home page.

### Guest Behavior

- Keep the Create Post control visible.
- When a guest attempts to use it, show a login-required message or redirect to login.
- Do not build a modal unless time remains.

### Completion Gate

- Guest can view the feed.
- Member can create a post.
- New post appears after redirect or refresh.
-  Feed cards contain only the fields defined in BR-03.
- Empty title is rejected.

### Commit and Push

```bash
git add .
git commit -m "feat: add post feed and create-post flow"
git push origin master
```

---

## 8. Milestone 5 — Post Detail, Edit, and Delete

### Goal

Complete all required post CRUD operations.

### Post Detail Tasks

1. Use `useParams()` to read the post ID.
2. Fetch the selected post.
3. Fetch or include the post author profile.
4. Display:
   - Author display name
   - Optional avatar
   - Creation time
   - Title
   - Optional content
   - Optional image
   - Upward-arrow count
5. Handle a missing post.
6. Prevent a broken image from breaking the page.

### Edit Tasks

1. Fetch the current post.
2. Confirm:
   - A session exists.
   - Current user ID equals `author_id`.
3. Prefill controlled form state.
4. Update title, content, and image URL.
5. Redirect to the post detail page.

### Delete Tasks

1. Show Delete only to the author in the normal UI.
2. Confirm with `window.confirm()`.
3. Delete the post.
4. Rely on cascade delete for comments.
5. Redirect home.

### Completion Gate

- A post has a unique detail URL.
- Author can edit the post.
- Edited data persists.
- Author can delete the post.
- Deleted post is removed from the feed.
- Deleted post URL shows a not-found state.
- A different account does not see normal edit/delete controls.

### Commit and Push

```bash
git add .
git commit -m "feat: add post details editing and deletion"
git push origin master
```

---

## 9. Milestone 6 — Comments and Upward-Arrow Count

### Goal

Complete the required post interactions.

### Comment Tasks

1. Fetch comments for the selected post.
2. Order comments by creation time.
3. Display each comment with author information.
4. Create controlled comment input.
5. Reject empty comments.
6. Require a session in the normal UI.
7. Insert `post_id`, `author_id`, and content.
8. Clear the form after success.
9. Refresh or append the new comment.
10. Show `No comments yet` when appropriate.

### Upward-Arrow Tasks

1. Display one upward-arrow button and count.
2. Require a session in the normal UI.
3. Update `upvotes` to the displayed count plus one.
4. Update local state after success.
5. Allow unlimited repeated clicks.
6. Add an accessible label to the button.

### Stretch Preparation

- Keep `comments.author_id`.
- Do not implement comment edit/delete UI yet.
- Do not add an upvote-history table.

### Completion Gate

- Member can comment.
- Comment appears under the correct post.
- Comment persists after refresh.
- Guest receives a login-required message.
- Each member click increases the count by one.
- Repeated clicks work.
- Count persists after refresh.

### Commit and Push

```bash
git add .
git commit -m "feat: add post comments and persistent upvotes"
git push origin master
```

---

## 10. Milestone 7 — Search, Sort, and UI States

### Goal

Finish the remaining P0 features.

### Search Tasks

1. Add `searchInput` state.
2. Use `.filter()` on loaded posts.
3. Match title without case sensitivity.
4. Restore the full list when search is cleared.
5. Show a no-results message.

### Sort Tasks

1. Add controls for:
   - Newest
   - Most Supported
2. Store the selected sort in state.
3. Query Supabase with `.order()`.
4. Default to newest first.

### UI State Tasks

Add simple states for:

- Loading posts
- Loading post detail
- Loading comments
- Saving form
- No posts
- No comments
- No search results
- Post not found
- Database operation failure

### Completion Gate

- Search works by title.
- Newest sort works.
- Most Supported sort works.
- Search and sort can be demonstrated together.
- Normal loading and empty conditions do not show a blank page.

### Commit and Push

```bash
git add .
git commit -m "feat: add post search sorting and UI states"
git push origin master
```

---

## 11. Milestone 8 — Styling, Demo Data, README, and GIF

### Goal

Prepare the final project deliverables without introducing new functional risk.

### Styling Tasks

1. Use a small, consistent color palette.
2. Create clear visual hierarchy.
3. Keep feed cards minimal.
4. Make post detail and comments readable.
5. Preserve visible focus states.
6. Ensure buttons and inputs have labels.
7. Perform a quick smaller-screen check.

### Demo Data

Prepare:

- 4–6 posts
- At least 2 posts with content
- At least 2 posts with external images
- At least 3 comments
- Different upward-arrow counts
- At least 2 accounts when practical

### Final Manual Test

Test in this order:

1. Guest feed
2. Search
3. Both sorts
4. Guest interaction prompt
5. Signup
6. Login
7. Create post
8. Open post
9. Repeated upward-arrow clicks
10. Add comment
11. Edit own post
12. Different-account ownership UI
13. Delete post
14. Refresh and persistence
15. Invalid or missing post route

### README Tasks

1. Replace `insert description`.
2. Record approximate time spent.
3. Mark completed required features with `[x]`.
4. Mark only actually completed optional features.
5. Add the GIF walkthrough.
6. Add known limitations:
   - RLS disabled for the initial MVP
   - UI checks are not production-grade authorization
7. Describe challenges encountered.
8. Add a deployment link only if deployed.

### GIF Tasks

The walkthrough should show:

1. Home feed
2. Search
3. Both sorts
4. Signup or login
5. Create post
6. Open post detail
7. Upward-arrow interaction
8. Comment
9. Edit
10. Delete

### Completion Gate

- `npm run build` succeeds.
- README accurately represents completed work.
- GIF demonstrates all required features.
- No secret is committed.
- No `[x]` is used for an incomplete feature.
- `git status` is clean after the final commit.

### Final Submission Commit and Push

```bash
git add .
git commit -m "docs: complete project documentation and walkthrough"
git push origin master
```

---

## 12. Commit and Push Policy

### Commit When

Commit after a coherent feature group works:

- Routing shell
- Supabase connection
- Authentication
- Feed/create
- Detail/edit/delete
- Comments/upvotes
- Search/sort/states
- Final submission docs

### Do Not Commit When

Do not commit when:

- The application does not start.
- A route crashes.
- The current milestone is half implemented.
- Environment secrets are staged.
- Temporary debug files are present.

### Push Policy

Push after each successful milestone.

Reasons:

- Protect work from local loss.
- Maintain visible project progress.
- Make rollback easier.
- Preserve a meaningful development history.

Before every commit:

```bash
git status
git diff
npm run build
```

During early milestones, `npm run dev` plus focused manual tests may be used before the build command. From the first functional feature onward, prefer running the build before committing.

---

## 13. Fallback Rules When Behind Schedule

Use these rules in order.

### Keep

Never cut:

- Create post
- Home feed
- Post detail
- Search
- Both sorts
- Comments
- Unlimited upward-arrow count
- Edit post
- Delete post
- Persistent Supabase data
- README and GIF

### Simplify First

1. Use `alert()` for login-required and action errors.
2. Use simple text loading states.
3. Use basic CSS.
4. Redirect with `window.location`.
5. Fetch related profile data with the simplest working method.
6. Skip avatar display when relationship queries become a blocker.
7. Skip profile editing.
8. Skip comment edit/delete.
9. Skip Netlify deployment.
10. Skip Google sign-in.

### Authentication Fallback

Authentication remains intentionally basic:

- Email/password only
- Display name only
- No email confirmation
- No password reset
- No OAuth
- No RLS for the initial MVP

If profile creation becomes the only blocker, fix or manually create the matching profile before removing account ownership from the product.

---

## 14. Stop Conditions

Stop adding features and move to submission preparation when:

- All required product features work.
- Basic signup/login/logout work.
- Guest and author UI behavior works.
- The app has sufficient demo data.
- Less than 60 minutes remain.

At that point, prioritize:

```text
Testing
→ Fixing blockers
→ README
→ GIF
→ Final commit and push
```

Do not start stretch features during the final hour.

---

## 15. Stretch Feature Order

Only after the Definition of Done is satisfied:

1. Profile page, display name, avatar, and bio editing
2. Edit/delete own comments
3. Post categories and filtering
4. Dark theme
5. Netlify deployment
6. RLS and ownership policies
7. Safer atomic upvote handling
8. Google sign-in

Security hardening should occur before using real users or private organizational data.

### Profile Stretch Completion Gate

- Guest can open a member profile.
- Profile shows the member's posts.
- Signed-in member can edit only their own profile through the normal UI.
- Display name updates in the navigation.
- Post and comment author names link to profiles.
- Avatar and bio persist after refresh.
