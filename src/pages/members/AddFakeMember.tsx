import { saveMember } from '@/api'
import { Button } from '@/components/ui/button'
import { Member } from '@/type'

type FakePerson = {
  location: {
    street: {
      number: string
      name: string
    }
    city: string
    state: string
    country: string
    postcode: number
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  name: {
    first: string
    last: string
  }
  phone: string
}

const AddFakeMember = () => {
  const loadData = async () => {
    const json = await fetch('https://randomuser.me/api/?results=5', {
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
    json.results.forEach((result: FakePerson) => {
      const addr = result.location
      const member: Member = {
        id: result.name.last + result.name.first,
        familyName: result.name.last,
        name: result.name.first,
        formattedAddress: `${addr.street.number} ${addr.street.name}, ${addr.city},${addr.city}, ${addr.state} ${addr.postcode}, ${addr.country}`,
        address1: result.location.street.name,
        city: result.location.city,
        state: result.location.state,
        postalCode: result.location.postcode,
        phone: result.phone,
        lat: result.location.coordinates.latitude,
        lng: result.location.coordinates.longitude,
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
