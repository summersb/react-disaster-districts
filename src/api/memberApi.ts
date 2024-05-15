import {collection, doc, getDoc, setDoc,} from 'firebase/firestore'
import {db} from "./firebase"
import type {Member} from '@/type'
import {filterNullUndefined, toList, toMap} from './arrayUtils'

const wardDoc = `${import.meta.env.VITE_ward}`
const topCollection = import.meta.env.VITE_top_collection
const memberListDocName = 'member_list'


export const saveMemberList = async (members: Member[]): Promise<void> => {
  const map = toMap(members)
  return saveMemberMap(map)
}

export const saveMemberMap = async (members: Map<string, Partial<Member>>): Promise<void> => {
  const cleanMemberMap = filterNullUndefined(members)
  const holderObject: {
    [key: string]: Partial<Member>
  } = Object.fromEntries(Array.from(cleanMemberMap.entries()));
  const wardCollection = collection(db, `${topCollection}/${wardDoc}/members`)
  await setDoc(doc(wardCollection, memberListDocName), holderObject)
}

export const getMemberList = async (): Promise<Partial<Member>[]> => {
  const map = await getMemberMap()
  return toList(map)
}

export const getMemberMap = async (): Promise<Map<string, Partial<Member>>> => {
  const docRef = doc(db, `${topCollection}/${wardDoc}/members`, memberListDocName)
  const memberListSnap = await getDoc(docRef)
  if (memberListSnap.exists()) {
    const map: { [key: string]: Member } = memberListSnap.data()
    return new Map(Object.entries(map))
  } else {
    return new Map()
  }
}

export const saveMember = async (member: Partial<Member>): Promise<void> => {
  const map = await getMemberMap()
  map.set(member.id as string, member)
  return saveMemberMap(map)
}

export const getMember = async (id: string): Promise<Member> => {
  const map = await getMemberMap()
  return map.get(id) as Member
}

export const deleteMember = async (id: string): Promise<void> => {
  const map = await getMemberMap()
  map.delete(id)
  return saveMemberMap(map)
}
