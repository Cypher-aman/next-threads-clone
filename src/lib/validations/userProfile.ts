import * as zod from "zod";

export const accountProfileSchema = zod.object({
  profile_photo: zod.string().url().nonempty(),
  name: zod.string().min(3).max(100),
  username: zod.string().min(3).max(100),
  bio: zod.string().min(3).max(1000),
});
