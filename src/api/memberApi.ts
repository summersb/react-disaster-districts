import { QuerySnapshot, collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore'
import { converter } from './converter'
import { db } from "./firebase"
import type { Member } from '@/type/Member'

const wardDoc = `${import.meta.env.VITE_ward}`
const topCollection = import.meta.env.VITE_top_collection

const getMembers = async (): Promise<QuerySnapshot<Member>> => {
  return await getDocs(collection(db, `${topCollection}/${wardDoc}/members`).withConverter(converter<Member>()))
}

const getMember = async (id: string): Promise<Member|null> => {
  const docRef = doc(db, `${topCollection}/${wardDoc}/members/${id}`)
  const memberSnap = await getDoc(docRef)
  if (memberSnap.exists()) {
    return memberSnap.data().withConverter(converter<Member>())
  }
  else {
    return null
  }
}

const saveMember = async (member: Member): Promise<void> => {
  const memberCollection = collection(db, `${topCollection}/${wardDoc}/members`)
  await setDoc(doc(memberCollection, member.id), {
    ...member
  })
}

const deleteMember = async (id: string): Promise<void> => {
  return deleteDoc(doc(db, `${topCollection}/${wardDoc}/members`, id))
}

export { getMember, getMembers, saveMember, deleteMember }
