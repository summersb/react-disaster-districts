import { z } from 'zod'
import { MemberSchema } from './Member'
import { BaseObject } from './SharedTypes'

export const DistrictSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  leader: MemberSchema,
  assistant: MemberSchema.optional(),
  members: z.array(MemberSchema).optional(),
  color: z.string()
})

export const DistrictDB = z.object({
  id: z.string(),
  name: z.string(),
  leaderId: z.string(),
  assistantId: z.string().optional(),
  members: z.array(z.string()).optional(),
  color: z.string()
})

export type DistrictDbType = z.infer<typeof DistrictDB> & BaseObject

export type District = z.infer<typeof DistrictSchema> & BaseObject
