# User Mention Feature

## Overview
This feature allows users to tag other users in their posts and comments using the @ symbol. When users type @, they get real-time suggestions with debouncing for better performance.

## Features

### 1. User Tagging with @
- Users can type @ followed by a username to mention other users
- Real-time search suggestions appear as users type
- Debounced search (300ms delay) for optimal performance
- Keyboard navigation support (arrow keys, enter, escape)

### 2. User Search & Suggestions
- Searches both username and display name
- Shows user avatar, name, and username in suggestions
- Limits to 10 suggestions for performance
- Click or keyboard selection to choose users

### 3. Visual Feedback
- Mentioned users are highlighted in posts/comments
- Shows chips of mentioned users below the input
- Clickable mentions that link to user profiles
- Proper styling with primary color theme

### 4. Database Integration
- Stores mentioned users in thread/comment documents
- Populates mentioned user data when fetching threads
- Supports mentions in both main posts and comments

## Implementation Details

### Components Added
- `UserMention` - Main mention input component with search
- `MentionRenderer` - Renders mentions in thread content
- Updated `PostThread` and `Comment` forms to use mentions
- Updated `ThreadCard` to display mentions properly

### Database Changes
- Added `mentionedUsers` field to Thread model
- Updated thread validation schema
- Modified create/comment functions to handle mentions
- Updated fetch functions to populate mentioned user data

### API Functions
- `searchUsersForMention()` - Searches users for mention suggestions
- Updated `createThread()` and `addCommentToThread()` to handle mentions
- Updated all thread fetching functions to include mentioned users

## Usage

### Creating a Post with Mentions
1. Go to create thread page
2. Type your content
3. Use @ to mention users (e.g., @john)
4. Select from the dropdown suggestions
5. Submit the post

### Viewing Mentions
- Mentioned usernames appear as clickable links in posts
- Click on a mention to visit the user's profile
- Mentions are highlighted with the primary theme color

## Technical Notes
- Uses debouncing to prevent excessive API calls
- Supports keyboard navigation for accessibility
- Handles edge cases like invalid usernames
- Maintains backward compatibility with existing posts
- Optimized database queries with proper population