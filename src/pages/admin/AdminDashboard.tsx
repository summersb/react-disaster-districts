import React, { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db, saveMemberList } from '@/api'
import { Button } from '@/components/ui/button'
import {
  createWard,
  getWardList,
  savePermissions,
  saveWardList
} from '@/api/wardApi.ts'
import { saveDistrictList } from '@/api/districtApi.ts'
import { UserRequest, UserRoles } from '@/type/User.ts'
import { DistrictDbType, Member } from '@/type'
import DownloadWard from '@/pages/home/DownloadWard.tsx'
import CreateWard from '@/pages/home/CreateWard.tsx'
import useAuth from '@/hooks/useAuth.tsx'
import { useLocalStorageState } from '@/hooks/useLocalStorageState.tsx'
import { WardConfig } from '@/type/Ward.ts'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type WardDoc = {
  id: string
  name: string
  members: Member[]
  districts: DistrictDbType[]
  permissions: UserRoles
}

const AdminDashboard = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [requests, setRequests] = useState<UserRequest[]>([])
  const [file, setFile] = useState()
  const fileReader = new FileReader()
  const [, setActiveWard] = useLocalStorageState<WardConfig>('ward', undefined)
  const { data } = useQuery({ queryKey: ['wardList'], queryFn: getWardList })
  const select = (ward: string, name: string) => {
    setActiveWard({ wardId: ward, wardName: name })
    queryClient.invalidateQueries()
  }

  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, 'accessRequests'))
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setRequests(data)
    }

    fetchRequests()
  }, [])

  const handleApprove = async (id: string) => {
    const requestRef = doc(db, 'accessRequests', id)
    await updateDoc(requestRef, {
      status: 'approved'
    })
  }

  const handleReject = async (id: string) => {
    const requestRef = doc(db, 'accessRequests', id)
    await updateDoc(requestRef, {
      status: 'rejected'
    })
  }

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFile(e.target.files[0])
  }

  const handleOnSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    if (file) {
      fileReader.onload = async function(event) {
        const text = event.target?.result
        if (text) {
          const wardData: WardDoc = JSON.parse(text as string)
          const wardList = await getWardList()
          saveWardList([
            ...(wardList || []),
            { wardId: wardData.id, wardName: wardData.name }
          ])
          createWard(wardData.id, wardData.name, user)
          saveMemberList(wardData.members)
          saveDistrictList(wardData.districts)
          savePermissions(wardData.permissions)
        }
      }

      fileReader.readAsText(file)
    }
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li>
          Choose Ward
          {data?.map((wc) => (
            <Button
              key={wc.wardId}
              onClick={() => select(wc.wardId, wc.wardName)}
            >
              {wc.wardName}
            </Button>
          ))}
        </li>
        {requests.map((request) => (
          <li key={request.id}>
            {request.email} - {request.status}
            {request.status === 'pending' && (
              <>
                <button onClick={() => handleApprove(request.id)}>
                  Approve
                </button>
                <button onClick={() => handleReject(request.id)}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <CreateWard />
      <DownloadWard />
      <form>
        <input
          type={'file'}
          id={'wardimport'}
          accept={'.json'}
          onChange={handleOnChange}
        />

        <Button onClick={handleOnSubmit}>Import Ward</Button>
      </form>
    </div>
  )
}

export default AdminDashboard
