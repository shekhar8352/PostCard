import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";

async function PostThreadWrapper() {
    const user = await currentUser();
    if (!user) return null;

    // fetch organization list created by user
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <PostThread
            userId={userInfo._id.toString()}
            availableCommunities={userInfo.communities.map((community: any) => ({
                id: community.id,
                name: community.name,
                image: community.image,
            }))}
        />
    );
}

export default PostThreadWrapper;
