import * as z from "zod";

export const OpinionValidation = z.object({
  opinion: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  opinion: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});
