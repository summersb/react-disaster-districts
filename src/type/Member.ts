import { GeoPoint } from "firebase/firestore"
import { z } from "zod"


const obj = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  location: z.string(),
})

export interface Member {
  name: string
  address: string
  phone: string
  location: GeoPoint
}

export interface MemberRecord {
  id: string
  member: Member
}

export type MemberMap = Record<string, string>