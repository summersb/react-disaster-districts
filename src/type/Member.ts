import { z } from "zod"

export const schema = z.object({
  id: z.string().uuid().nullable(),
  familyName: z.string().min(1),
  formattedAddress: z.string(),
  name: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  postalCode: z.number().nullable(),
  phone: z.string(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
})

export type Member = z.infer<typeof schema>

export interface MemberRecord {
  id: string
  member: Member
}

export type Changed = {
  old: Member
  updated: Member
}

export type MemberMap = Record<string, string>