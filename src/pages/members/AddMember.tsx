import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { saveMember } from '@/api'
import type { Member, Result } from '@/type'
import { MemberSchema } from '@/type'
import MemberForm from './MemberForm'

export default function AddMember() {

  const form = useForm<Member>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      familyName: '',
      name: '',
      formattedAddress: '',
      phone: undefined,
      address1: undefined,
      address2: undefined,
      city: 'Vista',
      state: 'CA',
      postalCode: undefined,
      lat: undefined,
      lng: undefined,
    }
  })

  const resolveAddress = async (address: string): Promise<Result> =>
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`,
    )
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error('Error resolving ' + res.statusText)
        }
      })
      .then((json) => {
        if (json.status === 'OK') {
          return json.results[0]
        } else {
          throw new Error('Could not resolve address' + address)
        }
      })
      .catch((e) => {
        alert(e.message)
      })

  const onSubmit: SubmitHandler<Member> = async (data) => {
    if (data.lat === undefined || data.lng === undefined) {
      const address = await resolveAddress(
        `${data.address1},${data.address2 === '' ? '' : data.address2 + ','}${data.city},${data.state}`,
      )

      data.formattedAddress = address.formatted_address
      data.lat = address.geometry.location.lat
      data.lng = address.geometry.location.lng
      data.postalCode = parseInt(
        address?.address_components?.find(
          (addressComponent) => addressComponent.types[0] === 'postal_code',
        )?.long_name ?? '0',
      )
    }
    // save to firestore
    await saveMember(data)
    form.reset()
  }

  if (Object.keys(form.formState.errors).length > 0) {
    console.log("errors", form.formState.errors)
  }

  
  return (
    <>
      <div className="text-xl flex justify-around">Add Member</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <MemberForm />
          <Button
            variant="outline"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            Add Member
          </Button>
        </form>
      </Form>
    </>
  )
}
