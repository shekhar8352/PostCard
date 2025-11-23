import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";
import { fetchPostsByTag } from "@/lib/actions/tag.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: { [key: string]: string | undefined };
}) {
    const user = await currentUser();
    if (!user) return null;

    const tagName = `#${params.id}`;

    const result = await fetchPostsByTag(
        tagName,
        searchParams.page ? +searchParams.page : 1,
        30
    );

    return (
        <section>
            <h1 className="head-text mb-10">#{params.id}</h1>

            <div className="flex flex-col gap-10">
                {result.posts.length > 0 ? (
                    <>
                        {result.posts.map((post: any) => (
                            <ThreadCard
                                key={post._id}
                                id={post._id}
                                currentUserId={user.id}
                                parentId={post.parentId}
                                content={post.text}
                                author={post.author}
                                communities={post.communities}
                                createdAt={post.createdAt}
                                comments={post.children}
                                likedBy={post.likedBy}
                                mentionedUsers={post.mentionedUsers}
                            />
                        ))}
                    </>
                ) : (
                    <p className="no-result">No posts found with this tag</p>
                )}
            </div>

            <Pagination
                path={`/tags/${params.id}`}
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNext}
            />
        </section>
    );
}

export default Page;
