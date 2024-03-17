import { saveMember } from '@/api'
import { Button } from '@/components/ui/button'
import { Member } from '@/type'

const AddFakeMember = () => {
  const loadData = async () => {
    const json = await fetch('https://randomuser.me/api/?results=10', {
      headers: {
        'Content-type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
    json.results.forEach((results) => {
      const addr = results.location
      const member: Member = {
        id: results.name.last + results.name.first,
        familyName: results.name.last,
        name: results.name.first,
        formattedAddress: `${addr.street.number} ${addr.street.name}, ${addr.city},${addr.city}, ${addr.state} ${addr.postcode}, ${addr.country}`,
        address1: results.location.street.name,
        address2: null,
        city: results.location.city,
        state: results.location.state,
        postalCode: results.location.postcode,
        phone: results.phone,
        lat: results.location.coordinates.latitude,
        lng: results.location.coordinates.longitude,
      }
      saveMember(member)
    })
  }

  return (
    <div>
      <Button onClick={loadData}>Add Data</Button>
    </div>
  )
}

export default AddFakeMember
