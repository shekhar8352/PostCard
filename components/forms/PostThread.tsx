"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UserMention } from "@/components/ui/user-mention";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

interface MentionUser {
  _id: string;
  id: string;
  username: string;
  name: string;
  image: string;
}

interface Props {
  userId: string;
  availableCommunities: {
    id: string;
    name: string;
    image: string;
  }[];
}

function PostThread({ userId, availableCommunities }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentionedUsers, setMentionedUsers] = useState<MentionUser[]>([]);
  const [selectedCommunityIds, setSelectedCommunityIds] = useState<string[]>([]);
  const [postType, setPostType] = useState<'public' | 'community'>('public');

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
      mentionedUsers: [],
    },
  });

  const handleMentionSelect = (users: MentionUser[]) => {
    setMentionedUsers(users);
    form.setValue('mentionedUsers', users.map(user => user._id));
  };

  const handlePostTypeChange = (type: 'public' | 'community') => {
    setPostType(type);
    if (type === 'public') {
      setSelectedCommunityIds([]);
    }
  };

  const handleCommunityToggle = (communityId: string) => {
    setSelectedCommunityIds((prev) =>
      prev.includes(communityId)
        ? prev.filter((id) => id !== communityId)
        : [...prev, communityId]
    );
  };

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    setIsSubmitting(true);
    try {
      if (postType === 'community' && selectedCommunityIds.length === 0) {
        // You might want to show an error here or just return
        // For now, let's just not submit if community is selected but no community chosen
        // Or we could default to public if none selected, but explicit is better.
        // Ideally show a toast or form error.
        console.error("Please select at least one community");
        setIsSubmitting(false);
        return;
      }

      await createThread({
        text: values.thread,
        author: userId,
        communityIds: selectedCommunityIds,
        path: pathname,
        mentionedUsers: mentionedUsers.map(user => user._id),
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 w-full">
                <UserMention
                  value={field.value}
                  onChange={field.onChange}
                  onMentionSelect={handleMentionSelect}
                  placeholder="What's on your mind? Use @ to mention users..."
                  className="no-focus border-none bg-transparent text-light-1 resize-none p-3 w-full min-h-[300px]"
                  rows={15}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3">
          <label className="text-base-semibold text-light-2">
            Where do you want to post?
          </label>

          <div className="flex gap-4 p-1 bg-dark-3 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => handlePostTypeChange('public')}
              className={`px-6 py-2 rounded-md text-small-medium transition-all ${postType === 'public'
                  ? 'bg-primary-500 text-light-1 shadow-sm'
                  : 'text-light-2 hover:text-light-1'
                }`}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => handlePostTypeChange('community')}
              className={`px-6 py-2 rounded-md text-small-medium transition-all ${postType === 'community'
                  ? 'bg-primary-500 text-light-1 shadow-sm'
                  : 'text-light-2 hover:text-light-1'
                }`}
            >
              Community
            </button>
          </div>

          {postType === 'community' && (
            <div className="mt-2 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-small-medium text-light-2">
                Select Communities
              </label>
              <div className="flex flex-wrap gap-3">
                {availableCommunities.length === 0 ? (
                  <p className="text-subtle-medium text-gray-1">
                    You are not part of any communities yet.
                  </p>
                ) : (
                  availableCommunities.map((community) => (
                    <div
                      key={community.id}
                      className={`cursor-pointer rounded-lg px-4 py-2 border transition-all ${selectedCommunityIds.includes(community.id)
                          ? "bg-primary-500 border-primary-500 text-light-1"
                          : "bg-dark-3 border-dark-4 text-light-2 hover:border-gray-1"
                        }`}
                      onClick={() => handleCommunityToggle(community.id)}
                    >
                      {community.name}
                    </div>
                  ))
                )}
              </div>
              {selectedCommunityIds.length === 0 && (
                <p className="text-tiny-medium text-red-500">
                  * Please select at least one community
                </p>
              )}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="bg-primary-500 flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Card"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;