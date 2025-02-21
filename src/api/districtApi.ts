import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { DistrictDbType, Member } from '@/type'
import { filterNullUndefined, toList, toMap } from './arrayUtils'
import { getActiveWard } from '@/utils/ward.ts'

const topCollection = import.meta.env.VITE_top_collection
const districtListDocName = 'district_list'

export const saveDistrictList = async (
  district: DistrictDbType[],
): Promise<void> => {
  const map = toMap(district)
  return saveDistrictMap(map)
}

export const saveDistrictMap = async (
  district: Map<string, DistrictDbType>,
): Promise<void> => {
  const wardDoc = getActiveWard().wardName
  const cleanDistrictMap = filterNullUndefined(district)
  const holderObject: {
    [key: string]: Partial<Member>
  } = Object.fromEntries(Array.from(cleanDistrictMap.entries()))
  const wardCollection = collection(db, `${topCollection}/${wardDoc}/districts`)
  await setDoc(doc(wardCollection, districtListDocName), holderObject)
}

export const getDistrictList = async (): Promise<DistrictDbType[]> => {
  const map = await getDistrictMap()
  return toList(map)
}

export const getDistrictMap = async (): Promise<
  Map<string, DistrictDbType>
> => {
  const wardDoc = getActiveWard().wardName
  try {
    const docRef = doc(
      db,
      `${topCollection}/${wardDoc}/districts`,
      districtListDocName,
    )
    const districtSnap = await getDoc(docRef)
    if (districtSnap.exists()) {
      const map: { [key: string]: DistrictDbType } = districtSnap.data()
      return new Map(Object.entries(map))
    } else {
      return new Map()
    }
  } catch (error) {
    console.log('error', `${error}`)
    throw error
  }
}

export const saveDistrict = async (district: DistrictDbType): Promise<void> => {
  const map = await getDistrictMap()
  map.set(district.id, district)
  return saveDistrictMap(map)
}

export const getDistrict = async (id: string): Promise<DistrictDbType> => {
  const map = await getDistrictMap()
  return map.get(id) as DistrictDbType
}

export const deleteDistrict = async (id: string): Promise<void> => {
  const map = await getDistrictMap()
  map.delete(id)
  return saveDistrictMap(map)
}
