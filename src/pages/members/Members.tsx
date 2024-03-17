import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Member } from '@/type'

type MembersProps = {
  members: Member[]
}

const Members = ({ members }: MembersProps): React.ReactElement => {
  return (
    <>
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
          {members.map((m) => {
            return (
              <TableRow key={m.id}>
                <TableCell>{m.familyName}</TableCell>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.formattedAddress}</TableCell>
                <TableCell>{m.phone}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default Members
