import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMemberList, deleteMember, getDistrictList } from '@/api'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Link, useNavigate } from 'react-router-dom'
import CsvDownloader from 'react-csv-downloader'
import { FilePenLine, Trash2 } from 'lucide-react'
import {
  Dialog, DialogClose,
  DialogContent, DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog.tsx'
import { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import type { District } from '@/type'

const MemberList = () => {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState<string>()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList
  })

  const { data: districts } = useQuery({
    queryKey: ['districts'],
    queryFn: getDistrictList
  })

  const deleteMembe = () => {
    if (id) {
      deleteMember(id).then(() => {
        setOpen(false)
        queryClient.invalidateQueries({ queryKey: ['members'] })
      })
        .catch(e => {
          setOpen(false)
          alert(e.message)

        })
    }
  }

  const districtClicked = (district: District) => {
    navigate(`/district/${district.id}`)
  }

  const columns = [
    {
      id: 'familyName',
      displayName: 'Surname'
    },
    {
      id: 'name',
      displayName: 'Name'
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
      displayName: 'Latitude'
    },
    {
      id: 'lng',
      displayName: 'Longitude'
    }
  ]
  return (
    <>
      <div className="text-xl flex justify-around">Members</div>
      <div className="flex justify-end">
        <CsvDownloader
          filename="memberlist"
          separator=";"
          columns={columns}
          datas={data ?? []}
          text="Download CSV"
          className="p-2 mr-4 rounded outline outline-offset-2"
        />
      </div>
      <Table>
        <TableCaption>List of members</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Edit</TableHead>
            <TableHead>District</TableHead>
            <TableHead>Surname</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Formatted Address</TableHead>
            <TableHead>Address1</TableHead>
            <TableHead>Address2</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Zip</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.sort((m1, m2) => {
              if (m1.familyName.toLowerCase() < m2.familyName.toLowerCase()) {
                return -1
              }
              if (m1.familyName.toLowerCase() > m2.familyName.toLowerCase()) {
                return 1
              }
              return 0
            }).map((m) => {
              const district = districts?.find(d => d.members.includes(m.id))
              const districtName = district?.name
              return (
                <TableRow key={m.id}
                          className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <TableCell><Link to={`/editmember/${m.id}`}><FilePenLine /></Link></TableCell>
                  <TableCell onClick={() => districtClicked(district)}>{districtName}</TableCell>
                  <TableCell>{m.familyName}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.formattedAddress}</TableCell>
                  <TableCell>{m.address1}</TableCell>
                  <TableCell>{m.address2}</TableCell>
                  <TableCell>{m.city}</TableCell>
                  <TableCell>{m.state}</TableCell>
                  <TableCell>{m.postalCode}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell>{m.lat}</TableCell>
                  <TableCell>{m.lng}</TableCell>
                  <TableCell><Trash2 onClick={() => {
                    setId(m.id)
                    setOpen(true)
                  }} /></TableCell>
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
