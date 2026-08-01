# Mini Product Requirements Document (PRD)

## Project Status

- **Project:** Volunteer Social Hub
- **Document:** Mini PRD
- **Status:** Approved
- **Course:** CodePath WEB102 — Unit 8 Final Project: HobbyHub
- **Primary priority:** Complete all required CodePath features before adding stretch features
- **Implementation constraint:** Approximately 5–6 hours of focused development time
- **Platform:** Desktop-first responsive web application

---

## 1. Product Overview

Volunteer Social Hub is a lightweight social forum for people who are interested in volunteering, community service, social impact, and community activities.

Members can share volunteer experiences, questions, photos, personal updates, achievements, travel stories, or other appropriate social content. Posts do not have to be directly related to volunteering.

The application provides a simple social experience inspired by Reddit and Facebook Groups:

- A home feed
- Individual post pages
- Comments
- An unlimited support action represented by an upward arrow
- Search
- Sorting
- Create, edit, and delete operations

The CodePath version is designed for a general volunteer community. The application may later serve as a foundation for a private internal community for U.S. Hunger employees.

---

## 2. Problem Statement

People who are interested in volunteering and community service may want a simple place to share experiences, ask questions, discuss personal interests, and connect with others who have similar values.

Chronological chat platforms are useful for immediate conversations, but older posts can become difficult to rediscover. Users may also want to:

- Search for a specific post by title
- View the newest posts
- View the most-supported posts
- Keep comments attached to a persistent post page
- Revisit content after it is no longer recent

Volunteer Social Hub addresses this need through persistent posts, individual discussion pages, search, sorting, comments, and community support.

---

## 3. Target Users and Actors

### 3.1 Guest

A guest is a visitor who is not signed in.

When authentication is implemented, a guest can:

- View the home feed
- Search posts by title
- Sort posts
- Open and read individual posts
- View post images
- Read comments
- View author display names and avatars when available
- See the same interaction controls as signed-in users

A guest cannot complete the following actions:

- Create a post
- Submit a comment
- Support a post
- Edit a post
- Delete a post

When a guest attempts a protected action, the application displays a sign-in prompt.

### 3.2 Registered Member

A registered member can:

- Create posts
- Comment on posts
- Support posts
- Edit their own posts
- Delete their own posts
- Use a display name

### 3.3 Post Author

A post author is a registered member who created a post.

When authentication and ownership are implemented, only the post author can edit or delete that post.

### 3.4 Coursework Demo User

Authentication is part of the intended MVP because all write interactions require an account.

The implementation must use the simplest reliable email/password flow so authentication does not consume time needed for the required CodePath features.

---

## 4. User Pain Points

### 4.1 Older content becomes difficult to rediscover

Interesting posts can disappear from view as newer content is added.

### 4.2 Users cannot easily discover the most relevant posts

Users may want to view either:

- The newest posts
- The most-supported posts

### 4.3 Finding a specific post can require too much scrolling

Users need a direct way to search for posts by title.

### 4.4 Conversations need a persistent location

Each post should have a dedicated page where its content, image, support count, and comments remain together.

### 4.5 Content ownership should be clear

When authentication is available, posts and comments should be associated with a user, and only the original author should be able to modify or delete their post.

---

## 5. Desired Outcomes

Users should be able to:

1. Browse recent community posts.
2. Discover highly supported posts.
3. Search for a post by title.
4. Open a post to view its complete content.
5. Support a post by clicking an upward arrow.
6. Participate in discussions through comments.
7. Create, update, and delete posts.
8. Continue using the application after refreshing the browser without losing stored data.
9. Identify content authors when authentication is implemented.

---

## 6. Goals

### G1 — Complete the CodePath rubric

All required HobbyHub features must work end to end.

### G2 — Persist application data

Posts, comments, and support counts must remain available after a page refresh.

### G3 — Provide a clear forum experience

Users should understand how to:

- Browse posts
- Search and sort the feed
- Open a post
- Create a post
- Comment
- Support a post
- Edit or delete a post

### G4 — Keep the MVP small

The core post model includes only:

- Title
- Content
- External image URL
- Creation time
- Support count

### G5 — Preserve a path for future expansion

The MVP should not prevent future additions such as:

- Authentication
- Profiles
- Tags
- Google sign-in
- Private organization membership

---

## 7. Non-Goals

The following features are not part of the core MVP:

- Direct messaging
- Inbox
- Friend requests
- Following or followers
- Notifications
- Real-time chat
- Emoji reactions
- Multiple reaction types
- Tags
- Project metadata
- Location metadata
- Status metadata
- Full profile pages
- Bio and social links
- Google sign-in
- U.S. Hunger email-domain restrictions
- Direct image uploads
- Multiple-image galleries
- Admin dashboards
- Moderation workflows
- Public/internal visibility controls
- Recently active sorting
- Mobile-first design

---

## 8. MVP Scope

### 8.1 P0 — Required Submission MVP

The following features must be completed:

1. Home feed
2. Create-post form
3. Required post title
4. Optional post content
5. Optional external image URL
6. Individual post page
7. Comments
8. Unlimited support clicks using an upward-arrow control
9. Edit post
10. Delete post
11. Search posts by title
12. Sort posts by creation time
13. Sort posts by support count
14. Supabase authentication with email and password
15. Email confirmation disabled for the demo
16. Display name collected during registration or first sign-in
17. Guest read-only behavior
18. Protected create, comment, and support actions
19. Author information on posts and comments
20. Ownership-based edit and delete permissions
21. Sign out
22. Loading states
23. Empty states
24. Basic error states
25. Sample posts, comments, and support counts
26. README using the required CodePath template
27. GIF walkthrough

### 8.2 P1 — Post-MVP Enhancements

After all P0 features are complete:

1. Profile editing for display name
2. Avatar editing
3. Bio editing
4. Improved authorization policies
5. Mobile responsiveness improvements

### 8.3 P2 — Stretch Features

Only after P0 and important P1 work are stable:

1. Profile page
2. Avatar
3. Bio
4. Editable display name
5. Facebook, Instagram, and LinkedIn links
6. Author profile pages showing that user's posts
7. Google sign-in
8. Tags and filters

---

## 9. Future Scope

### 9.1 General Community Version

Possible future additions include:

- Full user profiles
- Social links
- Saved or bookmarked posts
- Reposting
- Tag filtering
- Multiple images
- Content reporting
- Deleting one's own comments
- Improved mobile responsiveness

### 9.2 Future U.S. Hunger Version

A future internal version may include:

- Access limited to verified `@ushunger.org` accounts
- Google Workspace sign-in
- A members-only feed
- Employee profiles
- Organization-specific community guidelines
- Optional project and location tags
- Stronger access-control policies
- Moderator or administrator roles

The CodePath project must not be presented as an official or approved U.S. Hunger product.

---

## 10. User Stories

### Feed and Discovery

- As a visitor, I want to browse posts so that I can discover community content.
- As a visitor, I want to sort by creation time so that I can see the newest posts.
- As a visitor, I want to sort by support count so that I can see popular posts.
- As a visitor, I want to search by title so that I can find a specific post.
- As a visitor, I want to open a post so that I can view its full content.

### Posting

- As a member, I want to create a post with a required title.
- As a member, I want to add optional text content.
- As a member, I want to add an optional external image URL.
- As a post author, I want to edit my post after publishing it.
- As a post author, I want to delete my post.

### Interaction

- As a member, I want to click an upward arrow to support a post.
- As a member, I want to support the same post multiple times.
- As a member, I want to comment beneath a post.
- As a visitor, I want to read existing comments.

### Authentication Extension

- As a guest, I want to read content without creating an account.
- As a guest, I want the application to explain that I must sign in before interacting.
- As a member, I want my display name associated with my content.
- As a post author, I want other users to be prevented from editing or deleting my post.

---

## 11. Happy Paths

### 11.1 Browse and Search

1. The user opens the application.
2. The home feed loads posts.
3. The user enters a title keyword.
4. Matching posts appear.
5. The user opens a result.
6. The individual post page is displayed.

### 11.2 Sort the Feed

1. The user opens the home feed.
2. The user selects either **Newest** or **Most Supported**.
3. The feed refreshes in the selected order.

### 11.3 Create a Post

1. The user opens the create-post page.
2. The user enters a title.
3. The user optionally enters content and an image URL.
4. The user submits the form.
5. The post is saved.
6. The application redirects to the new post or the home feed.

### 11.4 Support a Post

1. The user opens an individual post.
2. The user clicks the upward arrow.
3. The support count increases by one.
4. The new count is saved.

### 11.5 Add a Comment

1. The user opens an individual post.
2. The user enters a comment.
3. The user submits it.
4. The comment is saved.
5. The new comment appears.
6. The input is cleared.

### 11.6 Edit a Post

1. The user opens an individual post.
2. The user selects **Edit**.
3. The edit form is prefilled.
4. The user changes the post.
5. The user saves the changes.
6. The updated post is displayed.

### 11.7 Delete a Post

1. The user opens an individual post.
2. The user selects **Delete**.
3. The application asks for confirmation.
4. The user confirms.
5. The post is deleted.
6. The application returns to the home feed.

### 11.8 Guest Attempts an Interaction

When authentication is implemented:

1. A guest opens a post.
2. The guest clicks the upward arrow, comment button, or create-post control.
3. The application displays a sign-in prompt.
4. No data is changed.

---

## 12. Unhappy Paths and Edge Cases

### Create and Update

- The title is empty.
- The title contains only whitespace.
- The content is empty.
- The image URL is empty.
- The image URL cannot be loaded.
- The database request fails.
- The user submits the form more than once.

### Feed

- No posts exist.
- Search returns no results.
- Fetching posts fails.
- Posts are still loading.
- Multiple posts have the same creation time or support count.

### Individual Post

- The requested post ID does not exist.
- The post was deleted while its page was open.
- The post has no content.
- The post has no image.
- The image URL is broken.

### Comments

- The comment is empty.
- The comment contains only whitespace.
- Saving the comment fails.
- The post is deleted before the comment is submitted.
- The post has no comments.

### Support Action

- Updating the count fails.
- The user clicks very quickly multiple times.
- The stored count is missing and must be treated as zero.

### Delete

- The user clicks delete accidentally.
- The delete request fails.
- The deleted post has related comments.

### Authentication Extension

- The email or password is invalid.
- The session expires.
- A guest attempts a protected action.
- A member attempts to edit or delete another user's post.
- The display name is empty.
- Authentication is not completed before the deadline.

---

## 13. Business Rules

### BR-01 — Post Title

Every post must have a non-empty title after leading and trailing whitespace is removed.

### BR-02 — Optional Post Fields

Content and external image URL may be empty.

### BR-03 — Home Feed Card Content

Each home-feed card must display only:

- Creation time
- Title
- Support count

The feed card must not display the post body or image.

### BR-04 — Individual Post Content

The full content, image, and comments are displayed on the individual post page.

### BR-05 — Support Behavior

- The UI uses an upward-arrow control.
- The UI does not need to display the word “Upvote.”
- Each click increases the stored count by exactly one.
- Users may click the control any number of times.
- The count must persist in the database.

### BR-06 — Sorting

The feed must support:

- Sorting by creation time
- Sorting by support count

The default order should be newest first.

### BR-07 — Search

The required search behavior applies to post titles only.

### BR-08 — Comments

- Empty comments cannot be saved.
- Every comment must belong to one post.
- Comments are displayed on the individual post page.

### BR-09 — Edit and Delete

- Edit and delete actions originate from the individual post page.
- When authentication is implemented, only the author may edit or delete a post.
- If authentication is not completed, the required edit and delete functionality must still be testable.

### BR-10 — Login Email

When authentication is implemented:

- Email is used only as a sign-in credential.
- Login email is not displayed publicly.
- Email confirmation is not required for the CodePath demo.

### BR-11 — Guest Controls

When authentication is implemented:

- Guests see the same interaction controls as members.
- A protected action by a guest must not change data.
- The application displays a sign-in prompt.

### BR-12 — Images

The MVP stores only external image URLs. It does not upload image files.

---

## 14. Functional Requirements

### FR-01 — Retrieve Posts

The system must retrieve posts from a persistent database.

### FR-02 — Render the Home Feed

The system must render one card per post using the feed-card content required by the rubric.

### FR-03 — Create a Post

The system must allow a valid post to be created.

### FR-04 — Navigate to a Post

Selecting a post card must open the corresponding individual post page.

### FR-05 — Retrieve One Post

The individual post page must retrieve the correct post using its URL identifier.

### FR-06 — Search Posts

The user must be able to search posts by title.

### FR-07 — Sort Posts

The user must be able to sort posts by creation time or support count.

### FR-08 — Support a Post

Selecting the upward-arrow control must increase and save the support count.

### FR-09 — Retrieve Comments

The individual post page must retrieve comments belonging to the selected post.

### FR-10 — Create a Comment

The system must save a non-empty comment for the correct post.

### FR-11 — Edit a Post

The edit form must load existing data and save valid changes.

### FR-12 — Delete a Post

The system must delete a selected post and return the user to the home feed.

### FR-13 — Loading State

The application must communicate when data is loading.

### FR-14 — Error State

The application must show a basic message when a database operation fails.

### FR-15 — Empty State

The application must handle:

- No posts
- No search results
- A missing post
- No comments

### FR-16 — Authentication Extension

When implemented, the system must support:

- Email/password registration and sign-in
- Persistent session handling
- Sign out
- Guest restrictions on write actions
- User identity or display name associated with created content

---

## 15. Non-Functional Requirements

### NFR-01 — Usability

Users should easily recognize how to:

- Create a post
- Search
- Sort
- Open a post
- Comment
- Support a post

### NFR-02 — Performance

For the small demo dataset, feed and post pages should normally load within a few seconds on a standard internet connection.

Large-scale performance is not a requirement for this coursework MVP.

### NFR-03 — Persistence

Refreshing the browser must not remove saved posts, comments, or support counts.

### NFR-04 — Desktop-First Design

The application must work well on desktop browsers.

Mobile support is secondary, but the layout should not become severely unusable on a smaller screen.

### NFR-05 — Basic Accessibility

- Use semantic buttons.
- Give form inputs visible labels.
- Give the upward-arrow control an accessible name such as `Upvote post`.
- Preserve visible keyboard focus.
- Use sufficient text contrast.

### NFR-06 — Visual Simplicity

The application should use:

- A consistent and constrained color scheme
- Clear visual hierarchy
- Minimal unnecessary interface elements
- A readable post and comment layout

### NFR-07 — Cost

The database and optional hosting should use free tiers or cost approximately $0.

### NFR-08 — Maintainability

The React code should be divided into reasonable pages and reusable components without introducing unnecessary architecture.

---

## 16. Privacy and Security Requirements

### Core MVP

- Do not collect phone numbers.
- Do not collect home addresses.
- Do not collect residential-area information.
- Do not require personal profile details to use the core forum.
- Users provide external image URLs at their own discretion.
- Do not store passwords in application tables.

### Authentication

- Supabase Auth manages credentials.
- Login email must not be rendered publicly.
- The client must not store raw passwords.
- Protected actions must check for a valid session.
- Ownership should not rely only on hiding buttons in the UI.
- Environment configuration and credentials must not be committed to the repository.

### Coursework Limitation

If simplified database permissions are used to meet the deadline, the project must not be described as production-secure.

---

## 17. Acceptance Criteria

### AC-01 — Create Post

- A post cannot be submitted with an empty title.
- A valid post is saved.
- The post remains after refresh.
- Content and image URL may be omitted.

### AC-02 — Home Feed

- All posts are retrieved.
- Each card displays creation time, title, and support count.
- Cards do not display body content or images.
- Selecting a card opens the correct post.

### AC-03 — Search

- Search matches post titles.
- Clearing the search returns the full feed.
- No matching results display an empty-state message.

### AC-04 — Sort

- **Newest** orders posts by creation time descending.
- **Most Supported** orders posts by support count descending.
- Changing the sort updates the feed.

### AC-05 — Individual Post

- The correct title is displayed.
- Content is displayed when available.
- An image is displayed when a valid URL is available.
- Comments are displayed.
- A missing post shows an appropriate message.

### AC-06 — Support

- The control is represented by an upward arrow.
- Each click increases the count by one.
- Multiple clicks are allowed.
- The count remains after refresh.

### AC-07 — Comments

- A non-empty comment is saved.
- The comment appears under the correct post.
- The comment remains after refresh.
- An empty comment is rejected.

### AC-08 — Edit

- The edit form is prefilled.
- Saving updates the database.
- The individual post page displays the updated data.

### AC-09 — Delete

- Delete is available from the individual post page.
- The user is asked to confirm.
- The post disappears from the feed.
- The deleted post URL no longer displays the post.

### AC-10 — Authentication Extension

When authentication is implemented:

- Guests can read all visible content.
- Guests receive a sign-in prompt when attempting a write action.
- Signed-in members can complete write actions.
- Login email remains hidden.
- Ownership-based edit and delete behavior works.

---

## 18. Definition of Done

The core MVP is complete when:

1. All required CodePath HobbyHub features work end to end.
2. Posts are stored in a persistent database.
3. Comments are saved and retrieved for the correct post.
4. Support counts are saved.
5. Search works by title.
6. Both required sorting options work.
7. Edit and delete work.
8. Happy-path demo flows have no blocking errors.
9. The application contains sample posts.
10. The application contains sample comments and varied support counts.
11. The README follows the required CodePath template.
12. All completed features are marked with `[x]`.
13. A GIF walkthrough is included.
14. Git history contains meaningful milestone commits.
15. The application runs locally.
16. Deployment is completed only if time remains after the submission requirements are satisfied.

---

## 19. Success Metrics

### Primary Metrics

- 100% of required CodePath features are implemented and checked in the README.
- The GIF walkthrough contains no blocking errors.
- Post create, read, update, and delete operations all work.
- Search and sorting can both be demonstrated.
- Comments and support counts remain after refresh.

### Minimum Demo Content

The application should include:

- 4–6 sample posts
- At least 2 posts with body content
- At least 2 posts with external images
- At least 3 comments
- Different support counts so that sorting is easy to observe

### Optional Success Indicators

- Authentication is completed without breaking required flows.
- The application is deployed successfully.
- At least one person other than the developer tests the application.
- The layout remains usable on a mobile-sized screen.

---

## 20. Remaining Non-Blocking Questions

The following decisions do not block the approved product scope:

1. What is the final product name?
2. What visual style and color scheme will be used?
3. After creating a post, should the app redirect to the new post or the home feed?
4. Should search update while typing or after form submission?
5. Should editing use a dedicated route or an inline form?
6. Will authentication be completed for the submitted version?
7. Will the application be deployed after the README and GIF are complete?

These questions should be resolved during user-flow, technical-design, or implementation planning.
