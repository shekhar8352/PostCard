"use client";

import { z } from "zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Button } from "../ui/button";
import { UserMention } from "@/components/ui/user-mention";

import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface MentionUser {
  _id: string;
  id: string;
  username: string;
  name: string;
  image: string;
}

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

function Comment({ threadId, currentUserImg, currentUserId }: Props) {
  const pathname = usePathname();
  const [mentionedUsers, setMentionedUsers] = useState<MentionUser[]>([]);

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const handleMentionSelect = (users: MentionUser[]) => {
    setMentionedUsers(users);
  };

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname,
      mentionedUsers.map(user => user._id)
    );

    form.reset();
    setMentionedUsers([]);
  };

  return (
    <Form {...form}>
      <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full items-start gap-3'>
              <FormLabel className="flex-shrink-0">
                <Image
                  src={currentUserImg}
                  alt='current_user'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='flex-1 min-w-0'>
                <UserMention
                  value={field.value}
                  onChange={field.onChange}
                  onMentionSelect={handleMentionSelect}
                  placeholder="Comment... Use @ to mention users"
                  className="no-focus text-light-1 outline-none bg-transparent border-none resize-none p-2 min-h-[40px] w-full"
                  rows={1}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn'>
          Reply
        </Button>
      </form>
    </Form>
  );
}

export default Comment;