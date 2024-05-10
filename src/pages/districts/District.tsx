import type { DistrictDbType } from '@/type'
import {
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FilePenLine, Trash2 } from "lucide-react";
import { Link } from 'react-router-dom'

type DistrictProps = {
  district: DistrictDbType
}
export default function District(props: DistrictProps) {
  const { district: d } = props

  return (
    <TableRow>
      <TableCell><Link to={`/district/${d.id}`}><Button size="icon"><FilePenLine/></Button></Link></TableCell>
      <TableCell>{d.name}</TableCell>
      <TableCell>{d.leaderId}</TableCell>
      <TableCell>{d.assistantId}</TableCell>
      <TableCell><Trash2 /></TableCell>
    </TableRow>
  )
}
