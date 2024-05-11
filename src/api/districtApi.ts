import { QuerySnapshot, collection, doc, deleteDoc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore'
import { converter } from './converter'
import { db } from "./firebase"
import type { District, DistrictDbType } from '@/type'

const wardDoc = `${import.meta.env.VITE_ward}`
const topCollection = import.meta.env.VITE_top_collection

const getDistricts = async (): Promise<QuerySnapshot<DistrictDbType>> => {
  return await getDocs(collection(db, `${topCollection}/${wardDoc}/districts`).withConverter(converter<DistrictDbType>()))
}

const getDistrict = async (id: string): Promise<DistrictDbType> => {
  const docRef = doc(db, `${topCollection}/${wardDoc}/districts/${id}`)
  const districtSnap = await getDoc(docRef)
  if (districtSnap.exists()) {
    return districtSnap.data() as DistrictDbType
  }
  else {
    throw new Error("District not found")
  }
}

const deleteDistrict = async (id: string): Promise<void> => {
  return deleteDoc(doc(db, `${topCollection}/${wardDoc}/districts`, id))
}

const createDistrict = async (district: District): Promise<DistrictDbType> => {
  const districtIn: DistrictDbType = {
    id: crypto.randomUUID(),
    name: district.name,
    leaderId: district.leader.id,
    members: [],
  }

  // check if this district name already exists
  // lets verify that we don't have a district with that name yet
  const districtCollection = collection(db, `${topCollection}/${wardDoc}/districts`)
  const q = query(districtCollection, where("name", "==", district.name));
  const snap = await getDocs(q)

  if (snap.size > 0) {
    districtIn.id = snap.docs[0].data().id
  }

  if (district.assistant) {
    districtIn.assistantId = district.assistant.id
  }

  await setDoc(doc(districtCollection, districtIn.id), {
    ...districtIn
  })
  return districtIn
}

//const saveMemberToDistrict = async (id: string, district: District): Promise<void> => {
//  const districtCollection = collection(db, `${topCollection}/${wardDoc}/districts`)
//  await setDoc(doc(districtCollection, id), {
//    ...district
//  })
//}

export { createDistrict, getDistrict, getDistricts, deleteDistrict }
