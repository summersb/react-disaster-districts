import React, { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import {
  createWard,
  getWardList,
  savePermissions,
  saveWardList,
} from '@/api/wardApi.ts'
import { saveMemberList } from '@/api'
import { saveDistrictList } from '@/api/districtApi.ts'
import useAuth from '@/hooks/useAuth.tsx'
import { DistrictDbType, Member } from '@/type'
import { UserRoles } from '@/type/User.ts'

type WardDoc = {
  id: string
  name: string
  members: Member[]
  districts: DistrictDbType[]
  permissions: UserRoles
}

const UploadWard = (): React.ReactElement => {
  const [file, setFile] = useState<File | null>()
  const { user } = useAuth()
  const fileReader = new FileReader()

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0])
  }

  const handleOnSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()

    if (file) {
      fileReader.onload = async function (event) {
        const text = event.target?.result
        if (text) {
          const wardData: WardDoc = JSON.parse(text as string)
          const wardList = await getWardList()
          await saveWardList([...(wardList || []), { wardName: wardData.name }])
            .then(() => createWard(wardData.name, user))
            .then(() => savePermissions(wardData.permissions))
            .then(() => saveMemberList(wardData.members))
            .then(() => saveDistrictList(wardData.districts))
            .catch((err) => console.log(err))
        }
      }

      fileReader.readAsText(file)
    }
  }

  return (
    <form>
      <input
        type={'file'}
        id={'wardimport'}
        accept={'.json'}
        onChange={handleOnChange}
      />

      <Button onClick={handleOnSubmit}>Import Ward</Button>
    </form>
  )
}

export default UploadWard
