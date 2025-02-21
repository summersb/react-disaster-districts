import React, { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/api'
import { Button } from '@/components/ui/button'
import { getWardList } from '@/api/wardApi.ts'
import { UserRequest } from '@/type/User.ts'
import DownloadWard from '@/pages/home/DownloadWard.tsx'
import CreateWard from '@/pages/home/CreateWard.tsx'
import { useLocalStorageState } from '@/hooks/useLocalStorageState.tsx'
import { WardConfig } from '@/type/Ward.ts'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import UploadWard from '@/pages/admin/UploadWard.tsx'

const AdminDashboard = () => {
  const queryClient = useQueryClient()
  const [requests, setRequests] = useState<UserRequest[]>([])
  const [, setActiveWard] = useLocalStorageState<WardConfig>('ward', undefined)
  const { data } = useQuery({ queryKey: ['wardList'], queryFn: getWardList })
  const select = (name: string) => {
    setActiveWard({ wardName: name })
    queryClient.invalidateQueries()
  }

  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, 'accessRequests'))
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setRequests(data)
    }

    fetchRequests()
  }, [])

  const handleApprove = async (id: string) => {
    const requestRef = doc(db, 'accessRequests', id)
    await updateDoc(requestRef, {
      status: 'approved',
    })
  }

  const handleReject = async (id: string) => {
    const requestRef = doc(db, 'accessRequests', id)
    await updateDoc(requestRef, {
      status: 'rejected',
    })
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li>
          Choose Ward
          {data?.map((wc) => (
            <Button key={wc.wardName} onClick={() => select(wc.wardName)}>
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
      <hr />
      <CreateWard />
      <hr />
      <DownloadWard />
      <hr />
      <UploadWard />
    </div>
  )
}

export default AdminDashboard
