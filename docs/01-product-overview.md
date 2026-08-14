# Volunteer Social Hub — Product Overview

## Overview

Volunteer Social Hub is a social web application for people interested in volunteering, community service, and community activities.

The project was built as a CodePath web development final project to practice building a complete React application with authentication, persistent data, reusable components, and user-facing CRUD workflows.

Users can share volunteer experiences, questions, photos, personal updates, achievements, travel stories, and other appropriate community content.

## Core Experience

### Guests

Visitors can:

- Browse the public feed
- Search posts by title
- Sort posts by newest or most supported
- Filter posts by category
- Open individual posts
- View post images and image carousels
- Read comments
- View public member profiles

Write actions require an account.

### Members

Signed-in members can:

- Create posts
- Edit and delete their own posts
- Comment on posts
- Edit and delete their own comments
- Support posts
- Maintain a public profile with a display name, bio, and avatar

## Post Features

Posts support:

- A required title
- Optional text content
- Categories
- Up to six ordered images
- Local image uploads
- Direct external image URLs
- Image previews before submission
- Manual image carousel navigation
- Search and sorting
- Persistent support counts

Uploaded images are validated for file type, file size, and image dimensions before being accepted.

## Profiles

Each authenticated user has a public profile associated with their account.

Profiles include:

- Display name
- Avatar
- Bio
- Posts created by that member

Login email and password are not displayed as public profile information.

## Project Scope

Volunteer Social Hub is intentionally a lightweight community application rather than a full social network.

Features such as direct messaging, followers, notifications, real-time chat, moderation dashboards, and organization administration are outside the project scope.
