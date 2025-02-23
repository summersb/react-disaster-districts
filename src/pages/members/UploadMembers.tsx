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
import UploadPdf from '@/pages/members/UploadPdf.tsx'
import UploadCsv from '@/pages/members/UploadCsv.tsx'

type FormType = {
  data: string
  people?: Member[]
}

const UploadMembers = () => {
  const queryClient = useQueryClient()
  const form = useForm<FormType>()
  const [members, setMembers] = useState<Member[]>()

  const { data: dbMemberList } = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList,
  })

  const onSubmit = (data: FormType) => {
    const parsedPersons = parseData(data.data)
    setMembers(parsedPersons as Member[])
    form.setValue('people', parsedPersons)
  }

  // compare data with members
  // create three lists
  type Changed = {
    old: Member
    updated: Member
  }

  let newMembers: Member[] = []
  //  const existingMembers: Member[] = []
  const removedMembers: Member[] = []
  const changedMembers: Changed[] = []

  if (members && members.length > 0 && dbMemberList) {
    members.forEach((m: Member) => {
      const found = dbMemberList.find((old) => {
        return old.familyName === m.familyName && old.name === m.name
      })
      if (found) {
        if (found.address1 === m.address1) {
          //        existingMembers.push(m)
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
        (uploadedMember) =>
          uploadedMember.familyName === dbMember.familyName &&
          uploadedMember.name === dbMember.name,
      )
      if (!found) {
        removedMembers.push(dbMember)
      }
    })
  }

  const insertNewMembers = () => {
    const updateList = dbMemberList ?? []
    newMembers?.forEach((m) => {
      updateList.push(m)
      saveMemberList(updateList).catch((err) => {
        console.error(err, m)
      })
    })
    queryClient.invalidateQueries({ queryKey: ['members'] })
    newMembers = []
    newMembers.length = 0
  }

  const deleteMembers = () => {
    const updateList: Member[] = dbMemberList ?? []
    const ids = removedMembers.map((m) => m.id)
    console.log('Deleting', ids)
    saveMemberList(updateList.filter((m: Member) => !ids.includes(m.id))).catch(
      (err) => {
        console.error(err, updateList, ids)
      },
    )
    queryClient.invalidateQueries({ queryKey: ['members'] })
    newMembers.length = 0
    removedMembers.length = 0
  }

  return (
    <div className="p-4">
      <div className="text-xl flex justify-around">Upload Members</div>
      {(members?.length ?? 0) === 0 && (
        <div className="flex justify-start">
          <Tabs defaultValue="pdf" className="w-full">
            <TabsList className="grid w-fill grid-cols-3">
              <TabsTrigger value="pdf">PDF</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
              <TabsTrigger value="csv">CSV</TabsTrigger>
            </TabsList>
            <TabsContent value="pdf">
              <UploadPdf setMembers={setMembers} />
            </TabsContent>
            <TabsContent value="web">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
                  <ImportDirectoryList />
                  <Button type="submit">Process</Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="csv">
              <UploadCsv setMembers={setMembers} />
            </TabsContent>
          </Tabs>
        </div>
      )}
      {(newMembers?.length > 0 ||
        changedMembers?.length > 0 ||
        deleteMembers?.length > 0) && (
        <Tabs defaultValue="new" className="w-full mt-10 mb-10">
          <TabsList className="grid w-fill grid-cols-3">
            <TabsTrigger value="new">New Members</TabsTrigger>
            <TabsTrigger value="update">Changed Members</TabsTrigger>
            <TabsTrigger value="delete">Deleted Members</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            {(newMembers.length ?? 0) > 0 && (
              <>
                New members
                <UploadMembersDetail members={newMembers} />
                <Button
                  onClick={insertNewMembers}
                  className="p-2 mr-4 rounded outline outline-offset-2"
                >
                  Insert
                </Button>
              </>
            )}
          </TabsContent>
          <TabsContent value="update">
            {(changedMembers.length ?? 0) > 0 && (
              <>
                Changed Members
                <MembersUpdate members={changedMembers} />
                <Button
                  onClick={insertNewMembers}
                  className="p-2 mr-4 rounded outline outline-offset-2"
                >
                  Update
                </Button>
              </>
            )}
          </TabsContent>
          <TabsContent value="delete">
            {(removedMembers.length ?? 0) > 0 && (
              <>
                Removed Members
                <UploadMembersDetail members={removedMembers} />
                <Button
                  onClick={deleteMembers}
                  className="p-2 mr-4 rounded outline outline-offset-2"
                >
                  Delete
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
      {(members?.length ?? 0) > 0 && (
        <Button
          onClick={() => setMembers([])}
          className="p-2 mr-4 rounded outline outline-offset-2"
        >
          Cancel
        </Button>
      )}
    </div>
  )
}

export default UploadMembers
