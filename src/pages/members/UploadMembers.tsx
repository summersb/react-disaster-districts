import { Form } from '@/components/ui/form'
import { getMemberList, saveMemberList } from '@/api'
import type { Member } from '@/type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import UploadMembersDetail from './UploadMembersDetail'
import MembersUpdate from './MembersUpdate'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ImportDirectoryList from './ImportDirectoryList'
import { useForm } from 'react-hook-form'
import { parseData } from './process.ts'

type FormType = {
  data: string
  people?: Member[]
}

const UploadMembers = () => {
  const queryClient = useQueryClient()
  const form = useForm<FormType>()
  const [file, setFile] = useState()
  const [members, setMembers] = useState<Member[]>()

  const fileReader = new FileReader()

  const { data: dbMemberList } = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList
  })

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFile(e.target.files[0])
  }

  const onSubmit = (data: FormType) => {
    const parsedPersons = parseData(data.data)
    setMembers(parsedPersons as Member[])
    form.setValue('people', parsedPersons)
  }

  const csvFileToArray = (str: string) => {
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
        lng: Number(values[10])
      }
      return member
    })

    setMembers(array)
  }

  const handleOnSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    if (file) {
      fileReader.onload = function(event) {
        const text = event.target?.result
        if (text) {
          csvFileToArray(text as string)
        }
      }

      fileReader.readAsText(file)
    }
  }

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

  if (members && dbMemberList) {
    members.forEach((m: Member) => {
      const found = dbMemberList.find((old) => {
        return old.familyName === m.familyName && old.name === m.name
      })
      if (found) {
        if (found.address1 === m.address1) {
          existingMembers.push(m)
        } else {
          changedMembers.push({ old: found, updated: m })
        }
      } else {
        console.log('Did not match member', m.familyName, m.name)
        m.id = crypto.randomUUID()
        newMembers.push(m)
      }
    })
    dbMemberList.forEach((dbMember) => {
      const found = members.find(
        (uploadedMember) => uploadedMember.familyName === dbMember.familyName && uploadedMember.name === dbMember.name
      )
      if (!found) {
        removedMembers.push(dbMember)
      }
    })
  }

  const insertNewMembers = () => {
    const updateList = dbMemberList ?? []
    newMembers?.forEach(m => {
      console.log('Saving', m)
      updateList.push(m)
      saveMemberList(updateList)
        .catch(err => {
          console.error(err, m)
        })
    })
    queryClient.invalidateQueries({ queryKey: ['members'] })
    newMembers.length = 0
  }

  const deleteMembers = () => {
    const updateList: Member[] = dbMemberList ?? []
    const ids = removedMembers.map(m => m.id)
    console.log('Deleting', ids)
    saveMemberList(updateList.filter((m: Member) => !ids.includes(m.id)))
      .catch(err => {
        console.error(err, updateList, ids)
      })
    queryClient.invalidateQueries({ queryKey: ['members'] })
    newMembers.length = 0
    removedMembers.length = 0
  }

  console.log('Matching members', existingMembers?.length ?? 0)
  console.log('Changed members', changedMembers?.length ?? 0)

  return (
    <div className="p-4">
      <div className="text-xl flex justify-around">Upload Member CSV</div>
      {(members?.length ?? 0) === 0 && (

        <div className="flex justify-start">
          <Tabs defaultValue="web" className="w-full">
            <TabsList className="grid w-fill grid-cols-2">
              <TabsTrigger value="web">Web</TabsTrigger>
              <TabsTrigger value="csv">CVS</TabsTrigger>
            </TabsList>
            <TabsContent value="web">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
                  <ImportDirectoryList />
                  <Button type="submit">Process</Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="csv">
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
              </form>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {(newMembers.length ?? 0) > 0 && (
        <>
          New members
          <UploadMembersDetail members={newMembers} />
          <Button onClick={insertNewMembers}
                  className="p-2 mr-4 rounded outline outline-offset-2">Insert</Button>
        </>
      )}
      {(changedMembers.length ?? 0) > 0 && (
        <>
          Changed Members
          <MembersUpdate members={changedMembers} />
          <Button onClick={insertNewMembers}
                  className="p-2 mr-4 rounded outline outline-offset-2">Update</Button>
        </>
      )}
      {(removedMembers.length ?? 0) > 0 && (
        <>
          Removed Members
          <UploadMembersDetail members={removedMembers} />
          <Button onClick={deleteMembers}
                  className="p-2 mr-4 rounded outline outline-offset-2">Delete</Button>
        </>)}
      {(members?.length ?? 0) > 0 && (
        <Button onClick={() => setMembers([])}
                className="p-2 mr-4 rounded outline outline-offset-2">Cancel</Button>
      )}
    </div>
  )
}

export default UploadMembers
