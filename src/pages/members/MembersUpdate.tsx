import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Changed, Member } from '@/type'

type MembersProps = {
  members: Changed[]
}

const MembersUpdate = ({ members }: MembersProps): React.ReactElement => {
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
              <TableRow key={m.old.id}>
                <TableCell>
                  {m.old.familyName}|{m.updated.familyName}
                </TableCell>
                <TableCell>
                  {m.old.name}|{m.updated.name}
                </TableCell>
                <TableCell>
                  {m.old.formattedAddress}|{m.updated.formattedAddress}
                </TableCell>
                <TableCell>
                  {m.old.phone}|{m.updated.phone}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}

export default MembersUpdate
