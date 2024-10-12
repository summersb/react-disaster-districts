import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import { useQuery } from '@tanstack/react-query'
import type { District, DistrictDbType } from '@/type'
import { getDistrict, getMemberList } from '@/api'
import ShowOneDistrictMap from '@/pages/districts/ShowOneDistrictMap'
import MemberDisplayName from '@/components/MemberDisplayName.tsx'

type DistrictProps = {
  district: District
}

const PrintDistrict = (props: DistrictProps) => {

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList
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
          {props.district.members?.sort((m1, m2) => m1.familyName.localeCompare(m2.familyName))
            .map(m => (
              <TableRow key={m.id}>
                <TableCell><MemberDisplayName member={m} /></TableCell>
                <TableCell>{m.address1} {m.address2}, {m.city}</TableCell>
                <TableCell>{m.phone}</TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3}><ShowOneDistrictMap district={props.district} /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default PrintDistrict