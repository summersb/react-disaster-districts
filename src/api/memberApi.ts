import { QuerySnapshot, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { converter } from './converter'
import { db } from "./firebase"
import { Member } from '@/type/Member'

const memberCollectionName = "members"

const getMembers = async (): Promise<QuerySnapshot<Member>> => {
  return await getDocs(collection(db, memberCollectionName).withConverter(converter<Member>()))
}

const saveMember = async (id: string, member: Member): Promise<void> => {
  const memberCollection = collection(db, memberCollectionName)
  await setDoc(doc(memberCollection, id), {
    ...member
  })
}

export { getMembers, saveMember }
