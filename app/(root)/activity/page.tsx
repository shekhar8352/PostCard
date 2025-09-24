import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getActivity, fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);

  const replies = (activity.replies || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const likes = (activity.likes || []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-10">
        {/* Replies Section */}
        <div>
          <h2 className="text-light-2 text-lg font-semibold mb-4">Replies</h2>
          {replies.length > 0 ? (
            <div className="flex flex-col gap-4">
              {replies.map((reply) => (
                <Link key={reply._id} href={`/thread/${reply.parentId}`}>
                  <article className="activity-card">
                    <Image
                      src={reply.author.image}
                      alt="user_logo"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {reply.author.name}
                      </span>
                      replied to your postcard
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <p className="!text-base-regular text-light-3">No replies yet</p>
          )}
        </div>


       {/* Likes Section */}
        <div>
          <h2 className="text-light-2 text-lg font-semibold mb-4">Likes</h2>
          {likes.length > 0 ? (
            <div className="flex flex-col gap-4">
              {likes.map((like) => (
                <Link key={like._id} href={`/thread/${like.threadId}`}>
                  <article className="activity-card">
                    <Image
                      src={like.author.image}
                      alt="user_logo"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">{like.author.name}</span>
                      liked your postcard
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <p className="!text-base-regular text-light-3">No likes yet</p>
          )}
        </div>

      </section>
    </>
  );
}

export default Page;
