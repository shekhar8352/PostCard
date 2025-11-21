import { fetchTrendingTags } from "@/lib/actions/tag.actions";
import Link from "next/link";

async function Page() {
    const trendingTags = await fetchTrendingTags();

    return (
        <section>
            <h1 className="head-text mb-10">Trending Tags</h1>

            <div className="flex flex-col gap-5">
                {trendingTags.length > 0 ? (
                    <>
                        {trendingTags.map((tag: any) => (
                            <Link
                                href={`/tags/${tag.name.replace("#", "")}`}
                                key={tag._id}
                                className="w-full rounded-lg bg-dark-2 p-5 hover:bg-dark-3 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <p className="text-heading4-medium text-light-1">{tag.name}</p>
                                    <p className="text-small-medium text-gray-1">
                                        {tag.threadCount} {tag.threadCount === 1 ? "Post" : "Posts"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className="no-result">No trending tags found</p>
                )}
            </div>
        </section>
    );
}

export default Page;
