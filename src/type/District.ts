import type { Member } from './index'

export interface District {
  id: string;
  name: string
  members: Member[]
}

export interface DistrictRecord {
  id: string
  member: District
}

export type DistrictMap = Record<string, string>