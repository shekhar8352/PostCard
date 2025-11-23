import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

import UserCard from "../cards/UserCard";

import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUsers } from "@/lib/actions/user.actions";
import { fetchTrendingTags } from "@/lib/actions/tag.actions";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;

  const similarMinds = await fetchUsers({
    userId: user.id,
    pageSize: 4,
  });

  const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 });
  const trendingTags = await fetchTrendingTags(5);

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Trending Topics</h3>
        <div className='mt-7 flex w-[300px] flex-col gap-4'>
          {trendingTags.length > 0 ? (
            <>
              {trendingTags.map((tag: any) => (
                <Link
                  href={`/tags/${tag.name}`}
                  key={tag.name}
                  className='flex justify-between gap-4'
                >
                  <p className='text-small-medium text-light-1'>#{tag.name}</p>
                  <p className='text-small-regular text-light-3'>
                    {tag.threadCount} posts
                  </p>
                </Link>
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>No trending tags</p>
          )}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Similar Minds</h3>
        <div className='mt-7 flex w-[300px] flex-col gap-10'>
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType='User'
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>No users yet</p>
          )}
        </div>
      </div>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>
          Suggested Communities
        </h3>

        <div className='mt-7 flex w-[300px] flex-col gap-9'>
          {suggestedCOmmunities.communities.length > 0 ? (
            <>
              {suggestedCOmmunities.communities.map((community) => (
                <UserCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  personType='Community'
                />
              ))}
            </>
          ) : (
            <p className='!text-base-regular text-light-3'>
              No communities yet
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;