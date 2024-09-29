import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDistrictList, getMemberList } from '@/api'
import ViewDistrict from '@/pages/districts/ViewDistrict.tsx'
import { Member } from '@/type'

const ViewAllDistricts = () => {

  const { districtId } = useParams()

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList
  })

  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: getDistrictList
  })

  return (
    <>
      {districts?.sort((d1, d2) => d1.name.localeCompare(d2.name))
        .map((district) => (
          <div key={district.id} className="break-before-always mb-4">
            <h1>District Name: {district.name}</h1>
            <h2>Leader {members?.find(m => m.id === district.leaderId).familyName}</h2>
            <h2>Assistant Leader {members?.find(m => m.id === district.assistantId)?.familyName}</h2>

            <ViewDistrict districtId={district.id} />
          </div>
        ))}
    </>
  )
}

export default ViewAllDistricts