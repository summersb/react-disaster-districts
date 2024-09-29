import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import { useQuery } from '@tanstack/react-query'
import type { District, DistrictDbType } from '@/type'
import { getDistrict, getMemberList } from '@/api'

type DistrictProps = {
  districtId: string
}

const ViewDistrict = (props: DistrictProps) => {

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList
  })

  const convertDbDistrict = (): Promise<District> =>
    getDistrict(props.districtId as string).then((db: DistrictDbType) => {
      return {
        id: db.id,
        name: db.name,
        leader: members?.find((m) => m.id == db.leaderId),
        assistant: members?.find((m) => m.id == db.assistantId),
        color: db.color,
        members: members?.filter((m) => db.members?.includes(m.id))
      } as District
    })

  const { data } = useQuery({
    queryKey: ['district', props.districtId],
    queryFn: convertDbDistrict,
    enabled: props.districtId !== undefined && members !== undefined,
    retry: false
  })

  return (
    <div className="page">

      <Table className="print:visible">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.members.sort((m1, m2) => m1.familyName.localeCompare(m2.familyName))
            .map(m => (
              <TableRow key={m.id}>
                <TableCell>{m.familyName}, {m.name}</TableCell>
                <TableCell>{m.address1} {m.address2}, {m.city}</TableCell>
                <TableCell>{m.phone_number}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ViewDistrict