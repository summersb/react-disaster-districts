import type { DistrictDbType } from '@/type'
import {
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { FilePenLine, Trash2 } from "lucide-react";

type DistrictProps = {
  district: DistrictDbType
}
export default function District(props: DistrictProps) {
  const { district: d } = props

  return (
    <TableRow>
      <TableCell><FilePenLine /></TableCell>
      <TableCell>{d.name}</TableCell>
      <TableCell>{d.leaderId}</TableCell>
      <TableCell>{d.assistantId}</TableCell>
      <TableCell><Trash2 /></TableCell>
    </TableRow>
  )
}
