import { getMembers } from '@/api'
import type { Member } from '@/type'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import Members from './Members'
import MembersUpdate from './MembersUpdate'
import {Button} from "@/components/ui/button.tsx";

const UploadMembers = () => {
  const [file, setFile] = useState()
  const [members, setMembers] = useState<Member[]>()

  const fileReader = new FileReader()

  const { data: oldMembers } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  const handleOnChange = (e) => {
    setFile(e.target.files[0])
  }

  const csvFileToArray = (str: string) => {
    const csvHeader = str.slice(0, str.indexOf('\n')).split(';')
    const csvRows = str.slice(str.indexOf('\n') + 1).split('\n')

    const array: Member[] = csvRows.map((i) => {
      const values = i.split(';')
      const member: Member = {
        id: '0',
        familyName: values[0],
        name: values[1],
        formattedAddress: values[2],
        address1: values[3],
        address2: values[4],
        city: values[5],
        state: values[6],
        postalCode: Number(values[7]),
        phone: values[8],
        lat: Number(values[9]),
        lng: Number(values[10]),
      }
      return member
    })

    setMembers(array)
  }

  const handleOnSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result
        csvFileToArray(text)
      }

      fileReader.readAsText(file)
    }
  }

  //const headerKeys = Object.keys(Object.assign({}, ...members))

  // compare data with members
  // create three lists
  type Changed = {
    old: Member
    updated: Member
  }

  const newMembers: Member[] = []
  const existingMembers: Member[] = []
  const removedMembers: Member[] = []
  const changedMembers: Changed[] = []

  if (members && oldMembers) {
    const list = oldMembers.docs.map((d) => d.data())
    members.forEach((m: Member) => {
      const found = list.find((old) => {
        return old.familyName === m.familyName && old.name === m.name
      })
      if (found) {
        existingMembers.push(m)
      } else {
        newMembers.push(m)
      }
    })
    list.forEach((m) => {
      const found = members.find(
        (n) => n.familyName === m.familyName && n.name === m.name,
      )
      if (!found) {
        removedMembers.push(m)
      }
    })
  }

  return (
    <div className="p-4">
      <div className="text-xl flex justify-around">Upload Member CSV</div>
      {(members?.length ?? 0) === 0 && (

        <div className="flex justify-start">
          <form>
            <input
              type={'file'}
              id={'csvFileInput'}
              accept={'.csv'}
              onChange={handleOnChange}
            />

            <button
              className="p-2 mr-4 rounded outline outline-offset-2"
              onClick={(e) => {
                handleOnSubmit(e)
              }}
            >
              IMPORT CSV
            </button>
          </form></div>
      )}
      {(newMembers.length ?? 0) > 0 && (
        <>
          New members
          <Members members={newMembers} />
        </>
      )}
      {(changedMembers.length ?? 0) > 0 && (
        <>
          Changed Members
          <MembersUpdate members={changedMembers} />
        </>
      )}
      {(removedMembers.length ?? 0) > 0 && (
        <>
          Removed Members
          <Members members={removedMembers} />
        </>)}
      {(members?.length ?? 0) > 0 && (
        <Button onClick={() => setMembers([])} className="p-2 mr-4 rounded outline outline-offset-2">Cancel</Button>
      )}
    </div>
  )
}

export default UploadMembers
