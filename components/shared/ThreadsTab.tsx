import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";

import ThreadCard from "../cards/ThreadCard";

interface Result {
  name: string;
  image: string;
  id: string;
  threads: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
    likedBy: string[];
    mentionedUsers?: Array<{
      _id: string;
      id: string;
      username: string;
      name: string;
    }>;
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
  let result: Result | null;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) {
    redirect("/");
  }

  const validResult = result as Result;

  // Sort threads so latest createdAt comes first
  const sortedThreads = [...validResult.threads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section className="mt-9 flex flex-col gap-10">
      {sortedThreads.map((thread) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: validResult.name, image: validResult.image, id: validResult.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: validResult.name, id: validResult.id, image: validResult.image }
              : thread.community
          }
          createdAt={thread.createdAt}
          comments={thread.children}
          likedBy={thread.likedBy}
          mentionedUsers={thread.mentionedUsers}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;