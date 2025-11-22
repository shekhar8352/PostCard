"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ThreadCard from "../cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import Image from "next/image";

interface Props {
    initialPosts: any[];
    userId: string;
}

const Feed = ({ initialPosts, userId }: Props) => {
    const [posts, setPosts] = useState<any[]>(initialPosts);
    const [page, setPage] = useState(1);
    const [isNext, setIsNext] = useState(true);
    const [ref, inView] = useInView();

    useEffect(() => {
        if (inView && isNext) {
            loadMorePosts();
        }
    }, [inView, isNext]);

    const loadMorePosts = async () => {
        const nextPage = page + 1;
        const result = await fetchPosts(nextPage, 30, userId);

        setPosts((prev) => [...prev, ...result.posts]);
        setPage(nextPage);
        setIsNext(result.isNext);
    };

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {posts.length === 0 ? (
                <p className='no-result'>No cards found</p>
            ) : (
                <>
                    {posts.map((post) => (
                        <ThreadCard
                            key={post._id}
                            id={post._id}
                            currentUserId={userId}
                            parentId={post.parentId}
                            content={post.text}
                            author={post.author}
                            community={post.community}
                            createdAt={post.createdAt}
                            comments={post.children}
                            likedBy={post.likedBy}
                            mentionedUsers={post.mentionedUsers}
                        />
                    ))}
                </>
            )}

            {isNext && (
                <div ref={ref} className='flex justify-center p-4'>
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
                </div>
            )}
        </section>
    );
};

export default Feed;
