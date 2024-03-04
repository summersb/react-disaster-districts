import { useQuery } from '@tanstack/react-query'
import { getMembers } from '../../api'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CsvDownloader from 'react-csv-downloader'

const MemberList = () => {
  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  const columns = [
    {
      id: 'familyName',
      displayName: 'Surname',
    },
    {
      id: 'name',
      displayName: 'Name',
    },
    { id: 'formattedAddress', displayName: 'Address' },
    {
      id: 'lat',
      displayName: 'Lat',
    },
    {
      id: 'lng',
      displayName: 'Lng',
    },
  ]
  const datas = data?.docs.map((d) => d.data())

  return (
    <>
      <div>MemberList</div>
      <CsvDownloader
        filename="memberlist"
        separator=";"
        columns={columns}
        datas={datas ?? []}
        text="Download"
      />
      <Table>
        <TableCaption>List of members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Surname</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.docs.map((m) => {
              return (
                <TableRow key={m.data().id}>
                  <TableCell>{m.data().familyName}</TableCell>
                  <TableCell>{m.data().name}</TableCell>
                  <TableCell>{m.data().formattedAddress}</TableCell>
                  <TableCell>{m.data().phone}</TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </>
  )
}

export default MemberList
