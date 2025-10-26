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
}

function PostThread({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentionedUsers, setMentionedUsers] = useState<MentionUser[]>([]);

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

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    setIsSubmitting(true);
    try {
      await createThread({
        text: values.thread,
        author: userId,
        communityId: organization ? organization.id : null,
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