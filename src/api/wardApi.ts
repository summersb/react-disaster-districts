import { db } from './firebase'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { WardConfig } from '@/type/Ward.ts'
import { UserRoles } from '@/type/User.ts'
import { getActiveWard } from '@/utils/ward.ts'
import { UserType } from '@/context/AuthProvider.tsx'

const topCollection = import.meta.env.VITE_top_collection

type WardDoc = {
  list: WardConfig[]
}

export const getWardList = async (): Promise<WardConfig[]> => {
  const docRef = doc(db, `${topCollection}`, 'wardList')
  const wardList = await getDoc(docRef)
  if (wardList.exists()) {
    const wardDoc = wardList.data() as WardDoc
    return wardDoc.list
  }
  return []
}

export const saveWardList = async (wardList: WardConfig[]): Promise<void> => {
  const docRef = doc(db, `${topCollection}`, 'wardList')
  const wardDoc = { list: wardList } as WardDoc
  await setDoc(docRef, wardDoc)
}

export const getPerms = async (): Promise<UserRoles> => {
  const wardId = getActiveWard().wardId
  const unit1Ref = doc(db, `${topCollection}`, wardId)
  const permDoc = await getDoc(unit1Ref)
  return permDoc.data() as UserRoles
}

export const savePermissions = async (data: UserRoles): Promise<void> => {
  const wardId = getActiveWard().wardId
  const wardDoc = doc(db, `${topCollection}`, wardId)
  setDoc(wardDoc, data)
}

export const createWard = async (
  id: string,
  name: string,
  user: UserType,
): Promise<void> => {
  //doc(db, `${topCollection}/districts`)
  await setDoc(doc(db, `${topCollection}`, id), {
    name: name,
    createdBy: user.name,
    users: {
      [user.uid as string]: {
        role: 'editor',
        name: user.name as string,
      },
    },
    createdAt: new Date(),
  })

  await setDoc(
    doc(collection(db, topCollection, id, 'members'), 'member_list'),
    {},
  )
  await setDoc(
    doc(collection(db, topCollection, id, 'districts'), 'district_list'),
    {},
  )
}
