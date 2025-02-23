import { z } from 'zod'
import { Member } from './Member'
import { BaseObject } from './SharedTypes'

export const DistrictSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  leader: z.custom<Member>(),
  assistant: z.custom<Member>().optional(),
  members: z.array(z.custom<Member>()).optional(),
  color: z.string(),
})

export const DistrictDB = z.object({
  id: z.string(),
  name: z.string(),
  leaderId: z.string(),
  assistantId: z.string().optional(),
  members: z.array(z.string()).optional(),
  color: z.string(),
})

export type DistrictDbType = z.infer<typeof DistrictDB> & BaseObject

export type District = z.infer<typeof DistrictSchema> & BaseObject
