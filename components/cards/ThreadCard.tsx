"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { formatDateString } from "@/lib/utils";
import DeleteThread from "../forms/DeleteThread";
import { likeThread, checkIfUserLikedThread } from "@/lib/actions/like.actions";
import { MentionRenderer } from "@/components/shared/MentionRenderer";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  communities: {
    id: string;
    name: string;
    image: string;
  }[] | null;
  createdAt: string;
  comments: {
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
  isComment?: boolean;
}

function ThreadCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  communities,
  createdAt,
  comments,
  likedBy,
  mentionedUsers = [],
  isComment,
}: Props) {
  // Note: likedBy contains MongoDB ObjectIds, but currentUserId is a Clerk ID
  // We'll handle the comparison in the like action instead
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likedBy?.length || 0);
  const [isLiking, setIsLiking] = useState(false);

  // Check initial like state
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const liked = await checkIfUserLikedThread(id, currentUserId);
        setIsLiked(liked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [id, currentUserId]);

  const handleLike = async () => {
    if (isLiking) return; // Prevent multiple clicks

    setIsLiking(true);
    try {
      const result = await likeThread(id, currentUserId);
      if (result.success) {
        // Update the UI with the response from the server
        setIsLiked(result.isLiked);
        setLikeCount(result.likeCount);
      }
    } catch (error) {
      console.error("Error liking thread:", error);
      // Keep current state on error
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
        }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <div className="mt-2 text-small-regular text-light-2">
              <MentionRenderer content={content} mentionedUsers={mentionedUsers} />
            </div>

            <div
              className={`${isComment ? "mb-10" : ""
                } mt-5 flex flex-col gap-3`}
            >
              <div className="flex items-center justify-between">
                {/* Left: icons */}
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1">
                    <Image
                      src={isLiked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}
                      alt="like"
                      width={24}
                      height={24}
                      className={`cursor-pointer object-contain ${isLiking ? 'opacity-50' : ''}`}
                      onClick={handleLike}
                    />
                    <span className="text-subtle-medium text-gray-1">
                      {likeCount}
                    </span>
                  </div>

                  <Link href={`/thread/${id}`}>
                    <Image
                      src="/assets/reply.svg"
                      alt="reply"
                      width={24}
                      height={24}
                      className="cursor-pointer object-contain"
                    />
                  </Link>
                </div>

                {/* Right: timestamp */}
                <p className="text-subtle-medium text-gray-1">
                  {formatDateString(createdAt)}
                </p>
              </div>

            </div>
          </div>
        </div>

        <DeleteThread
          threadId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && communities && communities.length > 0 && (
        <div className="mt-5 flex items-center flex-wrap gap-1">
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)} -{" "}
          </p>
          {communities.map((community, index) => (
            <Link
              key={community.id}
              href={`/communities/${community.id}`}
              className="flex items-center hover:underline"
            >
              <p className="text-subtle-medium text-gray-1">
                {community.name}
                {index < communities.length - 1 && ", "}
              </p>
              {index === 0 && (
                <Image
                  src={community.image}
                  alt={community.name}
                  width={14}
                  height={14}
                  className="ml-1 rounded-full object-cover"
                />
              )}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

export default ThreadCard;
