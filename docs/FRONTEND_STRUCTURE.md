# Frontend Structure

The frontend is built with **Next.js 13** using the **App Router**. It leverages React Server Components (RSC) for performance and Client Components for interactivity.

## Directory Structure (`app/`)

- **`(root)/`**: The main application layout.
    - **`layout.tsx`**: Contains the global `<html>` structure, `ClerkProvider`, and the main app shell (Topbar, LeftSidebar, Main Content, RightSidebar, Bottombar).
    - **`page.tsx`**: The Home feed.
    - **`create-thread/`**: Page for creating new posts.
    - **`activity/`**: Notifications page.
    - **`communities/`**: Community discovery and details.
    - **`profile/`**: User profile pages.
    - **`search/`**: User and community search.
- **`(auth)/`**: Authentication layout (centered box).
    - **`sign-in/`**: Clerk sign-in page.
    - **`sign-up/`**: Clerk sign-up page.
    - **`onboarding/`**: User profile setup.
- **`api/`**: Backend API routes (Webhooks, UploadThing).

## Key Components (`components/`)

### Shared
- **`Topbar`**: Top navigation bar with logo and mobile menu trigger.
- **`LeftSidebar`**: Desktop navigation menu.
- **`RightSidebar`**: Suggested users and communities.
- **`Bottombar`**: Mobile navigation menu.
- **`Feed`**: Handles the infinite scroll list of posts.

### Cards
- **`ThreadCard`**: Displays a single post, including author info, content, and interaction buttons.
- **`UserCard`**: Displays a user summary (for search/suggestions).
- **`CommunityCard`**: Displays a community summary.

### Forms
- **`PostThread`**: Form for creating a new thread.
- **`AccountProfile`**: Form for editing user profile.
- **`Comment`**: Form for adding a reply.

## Styling

We use **Tailwind CSS** for all styling.
- **`tailwind.config.js`**: Defines our design system, including the custom color palette (Primary Orange: `#FF7000`) and fonts (Outfit).
- **`globals.css`**: Contains global styles and Tailwind directives.
- **Responsive Design**: The layout adapts to mobile (`Bottombar` visible, `LeftSidebar` hidden) and desktop (`LeftSidebar` visible, `Bottombar` hidden).
