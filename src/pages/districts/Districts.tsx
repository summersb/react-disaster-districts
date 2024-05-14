import {getDistrictList} from '@/api'
import {useQuery} from '@tanstack/react-query'
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
  const {data} = useQuery({
    queryKey: ['districts'],
    queryFn: getDistrictList,
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
        {data && data.map(d => (
          <District key={d.id} district={d}/>
        ))}
      </TableBody>
    </Table>
  )
}
