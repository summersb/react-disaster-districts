import { z } from "zod";
import { MemberSchema } from "./Member"

export const DistrictSchema = z.object({
  id: z.string(),
  name: z.string(),
  leader: MemberSchema,
  assistant: MemberSchema,
  members: z.array(MemberSchema),
})

export type District = z.infer<typeof DistrictSchema>

export type DistrictMap = Record<string, string>
