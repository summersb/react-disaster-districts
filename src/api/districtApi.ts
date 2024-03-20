import { QuerySnapshot, collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { converter } from './converter'
import { db } from "./firebase"
import type { District } from '@/type'

const wardDoc = `${import.meta.env.VITE_ward}`
const topCollection = import.meta.env.VITE_top_collection

const getDistrict = async (): Promise<QuerySnapshot<District>> => {
  return await getDocs(collection(db, `${topCollection}/${wardDoc}/districts`).withConverter(converter<District>()))
}

const createDistrict = async (id: string, name: string, leaderId: string): Promise<void> => {
  const district: District = {
    id,
    name,
    leaderId,
    membersIds: [],
  }

  const districtCollection = collection(db, `${topCollection}/${wardDoc}/districts`)
  await setDoc(doc(districtCollection, id), {
    ...district
  })
}

const saveMemberToDistrict = async (id: string, district: District): Promise<void> => {
  const districtCollection = collection(db, `${topCollection}/${wardDoc}/districts`)
  await setDoc(doc(districtCollection, id), {
    ...district
  })
}

export { createDistrict, getDistrict, saveMemberToDistrict }
