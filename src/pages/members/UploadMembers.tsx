import { Form } from '@/components/ui/form'
import { deleteMember, saveMember, getMembers } from '@/api'
import type { Member } from '@/type'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import UploadMembersDetail from './UploadMembersDetail'
import MembersUpdate from './MembersUpdate'
import { Button } from '@/components/ui/button';
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

  const { data: oldMembers } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFile(e.target.files[0])
  }

  const onSubmit = (data: FormType) => {
    const parsedPersons = parseData(data.data);
    console.log("parsedPerson", parsedPersons)
    setMembers(parsedPersons)
    form.setValue("people", parsedPersons)
  }

  const csvFileToArray = (str: string) => {
    //const csvHeader = str.slice(0, str.indexOf('\n')).split(';')
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

  if (members && oldMembers) {
    const dbMemberList = oldMembers.docs.map((d) => d.data())
    members.forEach((m: Member) => {
      const found = dbMemberList.find((old) => {
        return old.familyName === m.familyName && old.name === m.name
      })
      if (found) {
        existingMembers.push(m)
      } else {
        console.log("Did not match member", m.familyName, m.name)
        m.id = crypto.randomUUID()
        newMembers.push(m)
      }
    })
    dbMemberList.forEach((dbMember) => {
      const found = members.find(
        (uploadedMember) => uploadedMember.familyName === dbMember.familyName && uploadedMember.name === dbMember.name,
      )
      if (!found) {
        removedMembers.push(dbMember)
      }
    })
  }

  const insertNewMembers = () => {
    newMembers?.forEach(m => {
      console.log("Saving", m)
      saveMember(m)
        .catch(err => {
          console.error(err, m)
        })
    })
    queryClient.invalidateQueries({ queryKey: ['members'] })
    newMembers.length = 0
  }

  const deleteMembers = () => {
    removedMembers?.forEach(m => {
      console.log("Deleting", m)
      deleteMember(m.id)
        .catch(err => {
          console.error(err, m)
        })
    })
    newMembers.length = 0
  }

  console.log("Matching members", existingMembers?.length ?? 0)

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
          <Button onClick={insertNewMembers} className="p-2 mr-4 rounded outline outline-offset-2">Insert</Button>
        </>
      )}
      {(changedMembers.length ?? 0) > 0 && (
        <>
          Changed Members
          <MembersUpdate members={changedMembers} />
          <Button onClick={insertNewMembers} className="p-2 mr-4 rounded outline outline-offset-2">Update</Button>
        </>
      )}
      {(removedMembers.length ?? 0) > 0 && (
        <>
          Removed Members
          <UploadMembersDetail members={removedMembers} />
          <Button onClick={deleteMembers} className="p-2 mr-4 rounded outline outline-offset-2">Delete</Button>
        </>)}
      {(members?.length ?? 0) > 0 && (
        <Button onClick={() => setMembers([])} className="p-2 mr-4 rounded outline outline-offset-2">Cancel</Button>
      )}
    </div>
  )
}

export default UploadMembers
