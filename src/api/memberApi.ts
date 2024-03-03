import { QuerySnapshot, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { converter } from './converter'
import { db } from "./firebase"
import type { Member } from '@/type/Member'

const wardDoc = `${import.meta.env.VITE_ward}`
const topCollection = import.meta.env.VITE_top_collection

const getMembers = async (): Promise<QuerySnapshot<Member>> => {
  return await getDocs(collection(db, `${topCollection}/${wardDoc}/members`).withConverter(converter<Member>()))
}

const saveMember = async (member: Member): Promise<void> => {
  const memberCollection = collection(db, `${topCollection}/${wardDoc}/members`)
  await setDoc(doc(memberCollection, `${member.familyName}-${member.name}`), {
    ...member
  })
}

export { getMembers, saveMember }
