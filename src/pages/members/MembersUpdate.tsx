import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type {Changed} from '@/type'

type MembersProps = {
  members: Changed[]
}

const MembersUpdate = ({members}: MembersProps): React.ReactElement => {
  return (
    <>
      <Table>
        <TableCaption>List of members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Surname</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => {
            return (
              <TableRow key={m.old.id}
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <TableCell>
                  {m.old.familyName}|{m.updated.familyName}
                </TableCell>
                <TableCell>
                  {m.old.name}|{m.updated.name}
                </TableCell>
                <TableCell>
                  {m.old.address1}|{m.updated.address1},{m.old.address2}|{m.updated.address2}
                </TableCell>
                <TableCell>
                  {m.old.city}|{m.updated.city}
                </TableCell>
                <TableCell>
                  {m.old.state}|{m.updated.state}
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
