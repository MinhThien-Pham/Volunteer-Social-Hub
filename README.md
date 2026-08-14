# Volunteer Social Hub

A responsive volunteer-focused community app for sharing opportunities, experiences, questions, photos, and resources.

**Live demo:** https://volunteer-social-hub.netlify.app/  
**Built for:** CodePath WEB102 final project

## Features

### Public experience

- Browse the community feed without an account
- Search posts by title
- Sort by newest or most supported
- Filter by category
- Open post details, comments, and public member profiles
- View posts with up to six ordered images in a custom carousel

### Member experience

- Sign up and log in with Supabase Auth
- Create, edit, and delete owned posts
- Add, edit, and delete owned comments
- Support posts with persistent upvote counts
- Maintain a public profile with display name, bio, and avatar
- Upload local images or use external image URLs

## Tech Stack

- **Frontend:** React, Vite, React Router, JavaScript, CSS
- **Backend services:** Supabase PostgreSQL, Auth, Storage, Data API
- **Deployment:** Netlify
- **Code quality:** ESLint, Prettier

The application is client-side and communicates directly with Supabase; it does not use a separate custom backend server.

## Security

The public Supabase tables use Row Level Security (RLS) and least-privilege grants.

- Guests can read public profiles, posts, and comments.
- Authenticated users can create posts and comments only as themselves.
- Profiles, posts, and comments can only be updated or deleted by their owners.
- Client writes are restricted to the specific columns required by each workflow.
- Public profiles are created automatically from new Supabase Auth users through a database trigger.
- Post support counts cannot be set directly by the client; authenticated users increment them through a scoped database RPC.
- Supabase Storage upload policies restrict uploads to paths owned by the authenticated user.

## Project Structure

```text
src/
├── components/          Reusable UI components
├── constants/           Shared post-category values
├── pages/               Route-level screens
├── routes/              Shared layout and protected-route logic
├── utils/               Image validation and upload helpers
├── App.jsx              Routes, auth state, and profile state
└── client.js             Supabase client configuration
```

## Local Development

```bash
npm install
npm run dev
```

Create a `.env` file based on `.env.example`:

```text
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Never place a Supabase service-role or secret key in the client application.

Useful checks:

```bash
npm run format:check
npm run lint
npm run build
```

## Documentation

- [Product overview](./docs/01-product-overview.md)
- [Data model and ERD](./docs/02-data-model-and-erd.md)
- [Technical overview](./docs/03-technical-overview.md)

## Walkthrough

<img src="./walkthrough.gif" alt="Volunteer Social Hub walkthrough" />

Backup walkthrough: https://imgur.com/a/udIuvKC

## CodePath

Volunteer Social Hub was built as a CodePath WEB102 final project. The project applies the course's React and Supabase concepts in a complete deployed application, including routing, authentication, CRUD workflows, relational data, image storage, responsive UI, and database-enforced authorization.

## License

Copyright 2026 Minh Thien Pham

Licensed under the Apache License, Version 2.0.