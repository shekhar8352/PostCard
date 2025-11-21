"use client";

import Link from "next/link";

interface MentionRendererProps {
  content: string;
  mentionedUsers?: Array<{
    _id: string;
    id: string;
    username: string;
    name: string;
  }>;
}

export function MentionRenderer({ content, mentionedUsers = [] }: MentionRendererProps) {
  // Create a map of usernames to user data for quick lookup
  const userMap = new Map(
    mentionedUsers.map(user => [user.username.toLowerCase(), user])
  );

  // Split content by @ mentions and # hashtags
  const renderContent = () => {
    const parts = content.split(/((?:@\w+)|(?:#[a-zA-Z0-9_]+))/g);

    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const username = part.slice(1).toLowerCase();
        const user = userMap.get(username);

        if (user) {
          return (
            <Link
              key={index}
              href={`/profile/${user.id}`}
              className="text-primary-500 hover:text-primary-400 font-medium"
            >
              @{user.username}
            </Link>
          );
        }

        // If user not found in mentioned users, render as plain text
        return <span key={index} className="text-primary-500">@{username}</span>;
      }

      if (part.startsWith('#')) {
        const tag = part.slice(1);
        return (
          <Link
            key={index}
            href={`/tags/${tag}`}
            className="text-primary-500 hover:text-primary-400 font-medium"
          >
            #{tag}
          </Link>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return <>{renderContent()}</>;
}