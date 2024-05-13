import {
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import {db} from "./firebase"
import type {Member, MemberMap} from '@/type'

const wardDoc = `${import.meta.env.VITE_ward}`
const topCollection = import.meta.env.VITE_top_collection
const memberListDocName = 'member_list'


const saveMemberList = async (members: Member[]): Promise<void> => {
  const map = toMap(members)
  return saveMemberMap(map)
}

const saveMemberMap = async (members: MemberMap): Promise<void> => {
  const cleanMemberMap = filterNullUndefined(members)
  const wardCollection = collection(db, `${topCollection}/${wardDoc}/members`)
  await setDoc(doc(wardCollection, memberListDocName), cleanMemberMap)
}

const getMemberList = async (): Promise<Member[]> => {
  const map = await getMemberMap()
  return toList(map)
}

const getMemberMap = async (): Promise<MemberMap> => {
  const docRef = doc(db, `${topCollection}/${wardDoc}/members`, `${memberListDocName}`)
  const memberListSnap = await getDoc(docRef)
  if (memberListSnap.exists()) {
    return memberListSnap.data()
  } else {
    return {}
  }
}

const saveMember = async (member: Member): Promise<void> => {
  const map = await getMemberMap()
  map[member.id] = member
  return saveMemberMap(map)
}

const getMember = async (id: string): Promise<Member> => {
  const map = await getMemberMap()
  return map[id]
}

const deleteMember = async (id: string): Promise<void> => {
  const map = await getMemberMap()
  delete map[id]
  return saveMemberMap(map)
}

type FilterOutNullUndefined<T> = {
  [K in keyof T]: T[K] extends (infer U) | null | undefined ? U extends null | undefined ? never : U : T[K];
};

const filterNullUndefined = (memberMap: MemberMap):
  { [K in keyof MemberMap]: FilterOutNullUndefined<MemberMap[K]>; } => {
  const filtered: MemberMap = {}

  for (const key in memberMap) {
    if (Object.prototype.hasOwnProperty.call(memberMap, key)) {
      const member: Member = memberMap[key];
      const filteredMember: FilterOutNullUndefined<Member> = {} as FilterOutNullUndefined<Member>;

      for (const prop in member) {
        if (Object.prototype.hasOwnProperty.call(member, prop)) {
          const value = member[prop as keyof Member];
          if (value !== null && value !== undefined) {
            filteredMember[prop] = value;
          }
        }
      }

      filtered[key] = filteredMember;
    }
  }

  return filtered
}

const toList = (memberMap: MemberMap): Member[] => {
  // Initialize an empty array to store the extracted Person objects
  const personsArray: Member[] = [];

  // Iterate over each key-value pair in the PersonMap
  for (const key in memberMap) {
    if (Object.prototype.hasOwnProperty.call(memberMap, key)) {
      // Retrieve the Person object corresponding to the current key
      const person: Member = memberMap[key];

      // Push the Person object into the array
      personsArray.push(person);
    }
  }

  // Return the array containing all the Person objects
  return personsArray;
}

const toMap = (members: Member[]): MemberMap => {
  const map: MemberMap = {}
  members.forEach(m => map[m.id] = m)
  return map
}

export {
  deleteMember,
  getMember,
  saveMember,
  saveMemberMap,
  saveMemberList,
  getMemberMap,
  getMemberList
}
