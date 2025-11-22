# Authentication Flow

Postcard uses **Clerk** for authentication and user management. This provides a secure and feature-rich auth system out of the box, including support for social logins (Google, GitHub, etc.).

## Overview

1.  **Client-Side Auth**: Clerk handles sign-in, sign-up, and session management on the frontend using pre-built components (`<SignIn />`, `<SignUp />`, `<UserButton />`).
2.  **Middleware Protection**: Next.js Middleware (`middleware.ts`) protects private routes, redirecting unauthenticated users to the sign-in page.
3.  **Database Sync**: A Webhook is used to synchronize user data from Clerk to our MongoDB database.

## Webhook Synchronization

Since we need to store application-specific data (like posts and communities) linked to users, we maintain a `User` collection in MongoDB. To keep this in sync with Clerk:

1.  **Event Trigger**: When a user signs up or updates their profile in Clerk, a webhook event (`user.created`, `user.updated`) is triggered.
2.  **API Route**: The event is sent to our API route `/api/webhook/clerk`.
3.  **Processing**:
    - The route verifies the webhook signature using `svix`.
    - It extracts the user data.
    - It calls `createUser` or `updateUser` server actions to update MongoDB.

## Middleware Configuration

The `middleware.ts` file configures which routes are public and which are ignored by Clerk.

```typescript
export default authMiddleware({
  // Routes that can be accessed without authentication
  publicRoutes: ["/", "/api/webhook/clerk", "/api/uploadthing"],
  
  // Routes that Clerk should not intercept
  ignoredRoutes: ["/api/webhook/clerk"],
});
```

## User Onboarding

After signing up, users are redirected to `/onboarding`. This page checks if the user has completed their profile (bio, profile image) in our database. If not, they are prompted to fill out the `AccountProfile` form.
