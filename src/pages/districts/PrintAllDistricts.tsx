import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDistrictList, getMemberList } from '@/api'
import PrintDistrict from '@/pages/districts/PrintDistrict.tsx'
import { District, DistrictDbType, Member } from '@/type'
import MemberDisplayName from '@/components/MemberDisplayName.tsx'

const PrintAllDistricts = () => {

  const { districtId } = useParams()

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList
  })

  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: getDistrictList
  })

  console.log('d', districts)
  const convertDbDistrict = (db: DistrictDbType): District => {
    return {
      id: db.id,
      name: db.name,
      leader: members?.find((m) => m.id == db.leaderId),
      assistant: members?.find((m) => m.id == db.assistantId),
      color: db.color,
      members: members?.filter((m) => db.members?.includes(m.id))
    }
  }

  return (
    <>
      {districts?.sort((d1, d2) => d1.name.localeCompare(d2.name))
        .map((district) => (
          <div key={district.id} className="new-right-page mb-4">
            <h1>District Name: {district.name}</h1>
            <h2>Leader <MemberDisplayName member={members?.find(m => m.id === district.leaderId)} /></h2>
            <h2>Assistant Leader <MemberDisplayName member={members?.find(m => m.id === district.assistantId)} /></h2>

            <PrintDistrict districtId={district.id} />
          </div>
        ))}
    </>
  )
}

export default PrintAllDistricts