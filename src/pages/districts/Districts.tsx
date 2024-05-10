import { getDistricts } from '@/api'
import { useQuery } from '@tanstack/react-query'
import District from './District'
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Districts() {
  const { data } = useQuery({
    queryKey: ['districts'],
    queryFn: getDistricts,
  })

  return (
    <Table>
      <TableCaption>List of districts</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Edit</TableHead>
          <TableHead>District Name</TableHead>
          <TableHead>Leader</TableHead>
          <TableHead>Assistant</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.docs.map(d => (
          <District key={d.data().id} district={d.data()} />
        ))}
      </TableBody>
    </Table>
  )
}
