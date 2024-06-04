import {
  Form,
} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import {SubmitHandler, useForm} from "react-hook-form"
import type {DistrictDbType} from "@/type"
import {DistrictSchema} from "@/type"
import React from 'react'
import {getDistrictList, saveDistrict} from "@/api"
import DistrictForm from './DistrictForm'
import {useQuery} from "@tanstack/react-query";

const AddDistrict = (): React.ReactElement => {

  const form = useForm<DistrictDbType>({
    resolver: zodResolver(DistrictSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      name: "",
      leader: undefined,
      assistant: undefined,
      members: []
    } as Partial<DistrictDbType>
  })

  const onSubmit: SubmitHandler<DistrictDbType> = async (data) => {
    saveDistrict(data)
    .then(d => {
      console.log("created", d)
    })
    .catch(err => {
      form.setError("name", {
        type: 'custom',
        message: err.message
      })
    })
  }

  if (Object.keys(form.formState.errors).length > 0) {
    console.log("errors", form.formState.errors)
  }

  return (
    <div className="h-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full bg-white rounded p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create District</h2>

        <Form {...form}>

          <form action="#"
                onSubmit={form.handleSubmit(onSubmit)}
                method="POST">

            <DistrictForm/>

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
