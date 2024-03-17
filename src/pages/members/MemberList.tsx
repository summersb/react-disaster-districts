import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMembers, deleteMember } from '@/api'
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
import {FilePenLine, Trash2} from "lucide-react";
import {
  Dialog, DialogClose,
  DialogContent, DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";

const MemberList = () => {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState<string>()
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  const deleteMembe = () => {
    if (id) {
      deleteMember(id).then(() => {
        setOpen(false)
        queryClient.invalidateQueries({queryKey: ['members']})
      })
      .catch(e => {
        setOpen(false)
        alert(e.message)

      })
    }
  }

  const columns = [
    {
      id: 'familyName',
      displayName: 'Surname',
    },
    {
      id: 'name',
      displayName: 'Name',
    },
    { id: 'formattedAddress', displayName: 'Formatted Address' },
    { id: 'address1', displayName: 'Address1' },
    { id: 'address2', displayName: 'Address2' },
    { id: 'city', displayName: 'City' },
    { id: 'state', displayName: 'State' },
    { id: 'postalCode', displayName: 'Postal Code' },
    { id: 'phone', displayName: 'Phone' },
    {
      id: 'lat',
      displayName: 'Latitude',
    },
    {
      id: 'lng',
      displayName: 'Longitude',
    },
  ]
  const datas = data?.docs.map((d) => d.data())

  return (
    <>
      <div className="text-xl flex justify-around">Members</div>
      <div className="flex justify-end">
        <CsvDownloader
          filename="memberlist"
          separator=";"
          columns={columns}
          datas={datas ?? []}
          text="Download CSV"
          className="p-2 mr-4 rounded outline outline-offset-2"
        />
      </div>
      <Table>
        <TableCaption>List of members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Edit</TableHead>
            <TableHead>Surname</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.docs.map((m) => {
              return (
                <TableRow key={m.data().id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <TableCell><FilePenLine /></TableCell>
                  <TableCell>{m.data().familyName}</TableCell>
                  <TableCell>{m.data().name}</TableCell>
                  <TableCell>{m.data().formattedAddress}</TableCell>
                  <TableCell>{m.data().phone}</TableCell>
                  <TableCell><Trash2 onClick={() => { setId(m.id);setOpen(true);}}/></TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this member.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <>
                <Button type="button" variant="destructive" onClick={() => deleteMembe()}>
                  Delete
                </Button>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MemberList
