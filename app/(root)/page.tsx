// import { UserButton } from "@clerk/nextjs";

import { currentUser, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Feed from "@/components/shared/Feed";

import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { orgId } = auth();

  const result = await fetchPosts(1, 30, user.id, orgId || "");

  return (
    <>
      <h1 className='head-text text-left'>Home</h1>

      <Feed
        key={orgId || "personal"}
        initialPosts={result.posts}
        userId={user.id}
        communityId={orgId || ""}
      />
    </>
  );
}

export default Home;