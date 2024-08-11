import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { District, DistrictDbType } from '@/type'
import { DistrictSchema } from '@/type'
import React from 'react'
import { saveDistrict } from '@/api'
import DistrictForm from './DistrictForm'

const DEFAULT: Partial<DistrictDbType> = {
  id: crypto.randomUUID(),
  name: '',
  leaderId: undefined,
  assistantId: undefined,
  color: '#FF5733',
  members: []
}

const AddDistrict = (): React.ReactElement => {
  const form = useForm<DistrictDbType>({
    resolver: zodResolver(DistrictSchema),
    defaultValues: DEFAULT
  })

  const onSubmit = (data: DistrictDbType): Promise<void> =>
    saveDistrict(data)
      .then((d) => {
        form.reset(DEFAULT)
        console.log('created', d)
      })
      .catch((err) => {
        form.setError('name', {
          type: 'custom',
          message: err.message
        })
      })

  if (Object.keys(form.formState.errors).length > 0) {
    console.log('errors', form.formState.errors)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full rounded p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create District</h2>

        <Form {...form}>
          <form action="#" onSubmit={form.handleSubmit(onSubmit)} method="POST">
            <DistrictForm />

            <div className="text-gray-700 mb-4">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AddDistrict
