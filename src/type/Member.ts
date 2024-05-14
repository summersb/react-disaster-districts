import {z} from "zod"
import {BaseObject} from "@/type/SharedTypes.ts";

export const MemberSchema = z.object({
  id: z.string().uuid(),
  familyName: z.string().min(1),
  formattedAddress: z.string().optional(),
  name: z.string().min(1),
  address1: z.string().min(1).optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.number().optional(),
  phone: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

export type Member = z.infer<typeof MemberSchema> & BaseObject

export type Changed = {
  old: Member
  updated: Member
}
