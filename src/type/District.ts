import { z } from "zod";
import { MemberSchema } from "./Member"

export const DistrictSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  leader: MemberSchema,
  assistant: MemberSchema.optional(),
  members: z.array(MemberSchema),
})

export const DistrictDB = z.object({
  id: z.string(),
  name: z.string(),
  leaderId: z.string(),
  assistantId: z.string().optional(),
  members: z.array(z.string())
})

export type DistrictDbType = z.infer<typeof DistrictDB>

export type District = z.infer<typeof DistrictSchema>

export type DistrictMap = Record<string, string>
