import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { saveMember } from './api'
import MemberList from './MemberList'
import { Member, Result } from './type'
import { schema } from './type/Member'

export default function AddMember() {
  const form = useForm<Member>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: null,
      familyName: '',
      name: '',
      formattedAddress: '',
      phone: '',
      address1: '',
      address2: '',
      city: 'Vista',
      state: 'CA',
      postalCode: null,
      lat: null,
      lng: null,
    },
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
    const address = await resolveAddress(
      `${data.address1},${data.address2 === '' ? '' : data.address2 + ','}${data.city},${data.state}`,
    )

    data.id = crypto.randomUUID()
    data.formattedAddress = address.formatted_address
    data.lat = address.geometry.location.lat
    data.lng = address.geometry.location.lng
    data.postalCode = parseInt(
      address?.address_components?.find(
        (addressComponent) => addressComponent.types[0] === 'postal_code',
      )?.long_name ?? '0',
    )
    // save to firestore
    await saveMember(data)
    form.reset()
  }

  if (Object.keys(form?.formState?.errors).length > 0) {
    console.log('Errors', form?.formState?.errors)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="familyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family Name</FormLabel>
                <FormControl>
                  <Input placeholder="Family name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="760-555-1212" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address2</FormLabel>
                <FormControl>
                  <Input placeholder="Apt 23" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Vista" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting} type="submit">
            Submit
          </Button>
        </form>
      </Form>
      <MemberList />
    </>
  )
}
