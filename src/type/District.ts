import {z} from "zod";

export const DistrictSchema = z.object({
  id: z.string(),
  name: z.string(),
  leaderId: z.string(),
  membersIds: z.string().array(),
})

export type District = z.infer<typeof DistrictSchema>

export type DistrictMap = Record<string, string>
