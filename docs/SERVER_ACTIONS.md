# Server Actions

Postcard relies heavily on **Next.js Server Actions** to handle data mutations and fetching. This allows us to write backend logic directly in TypeScript functions that can be called from Client Components.

## Pattern

All actions are defined in `lib/actions/` and follow a similar pattern:
1.  **Connect to DB**: Ensure Mongoose connection is established.
2.  **Perform Operation**: Execute Mongoose queries (find, create, update).
3.  **Revalidate**: Use `revalidatePath` to update the cached data on the frontend.

## Key Actions

### Thread Actions (`lib/actions/thread.actions.ts`)
- **`createThread`**: Creates a new post. Handles hashtag extraction and updates User/Community/Tag models.
- **`fetchPosts`**: Retrieves a paginated list of posts. Supports filtering by user and infinite scrolling.
- **`fetchThreadById`**: Gets a single thread and its comment tree.
- **`addCommentToThread`**: Adds a reply to an existing thread.
- **`deleteThread`**: Recursively deletes a thread and its children.

### User Actions (`lib/actions/user.actions.ts`)
- **`updateUser`**: Updates user profile data.
- **`fetchUser`**: Gets user details.
- **`fetchUsers`**: Searches for users.
- **`getActivity`**: Retrieves notifications (replies to user's posts).

### Community Actions (`lib/actions/community.actions.ts`)
- **`createCommunity`**: Creates a new community.
- **`fetchCommunityDetails`**: Gets community info and members.
- **`addMemberToCommunity`**: Adds a user to a community.

### Tag Actions (`lib/actions/tag.actions.ts`)
- **`fetchTrendingTags`**: Gets the top 10 most used tags.
- **`fetchPostsByTag`**: Gets all posts containing a specific tag.
