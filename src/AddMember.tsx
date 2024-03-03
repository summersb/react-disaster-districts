import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'

const schema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string(),
  lat: z.string().nullable(),
  lng: z.string().nullable(),
})

type Member = z.infer<typeof schema>

export default function AddMember() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Member>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<Member> = (data) => {
    // convert to firestore Member object
    // save to firestore
    // show any errors
    console.log(data)
  }

  //  const onSubmit: SubmitHandler<Member> = (data) => {
  //    // get lat/lng from google
  //    // add to firebase
  //    // trigger map update
  //    fetch(
  //      `https://maps.googleapis.com/maps/api/geocode/json?address=${data.address}&key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`,
  //    )
  //      .then((res) => {
  //        if (res.ok) {
  //          return res.json()
  //        } else {
  //          throw Error('Did not succeed ' + res.statusText)
  //        }
  //      })
  //      .then((json) => {
  //        if (json.status === 'OK') {
  //          console.log(json)
  //        }
  //        if (json.status === 'ZERO_RESULTS') {
  //          alert('No address found')
  //        }
  //      })
  //      .catch((e: Error) => {
  //        console.log(e.message)
  //      })
  //    console.log(data)
  //  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} type="text" placeholder="name" />
      {errors.name && <span>{errors.name.message}</span>}
      <br />
      <input
        {...register('address')}
        placeholder="123 My Street, City, State, Zip"
      />
      <br />
      {errors.address && <span>{errors.address.message}</span>}
      <input {...register('phone')} type="text" placeholder="phone" />
      {errors.phone && <span>{errors.phone.message}</span>}
      <br />
      <input {...register('lat')} type="text" placeholder="lat" />
      <br />
      <input {...register('lng')} type="text" placeholder="lng" />
      <br />
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving' : 'Save'}
      </button>
    </form>
  )
}
