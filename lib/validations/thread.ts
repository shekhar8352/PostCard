import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }).refine((val) => {
    const tags = val.match(/#[a-z0-9_]+/g);
    if (tags) {
      return tags.every((tag) => tag.length <= 30);
    }
    return true;
  }, { message: "Tags must be less than 30 characters." }),
  accountId: z.string(),
  mentionedUsers: z.array(z.string()).optional().default([]),
});

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});