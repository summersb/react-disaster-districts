import { QuerySnapshot, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { converter } from './converter'
import { db } from "./firebase"
import type { District } from '@/type'

const districtCollectionName = "districts"

const getDistrict = async (): Promise<QuerySnapshot<District>> => {
  return await getDocs(collection(db, districtCollectionName).withConverter(converter<District>()))
}

const createDistrict = async (id: string, name: string): Promise<void> => {
  const district: District = {
    id,
    name,
    members: []
  }

  const districtCollection = collection(db, districtCollectionName)
  await setDoc(doc(districtCollection, id), {
    ...district
  })
}

const saveMemberToDistrict = async (id: string, district: District): Promise<void> => {
  const districtCollection = collection(db, districtCollectionName)
  await setDoc(doc(districtCollection, id), {
    ...district
  })
}

export { createDistrict, getDistrict, saveMemberToDistrict }