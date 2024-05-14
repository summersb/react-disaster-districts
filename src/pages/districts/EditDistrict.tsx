import {
  Form,
} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod"
import {SubmitHandler, useForm, UseFormReset} from "react-hook-form"
import type {District, DistrictDbType} from "@/type"
import {DistrictSchema} from "@/type"
import React, {useEffect} from 'react'
import {saveDistrict, getDistrict, getMember} from "@/api"
import DistrictForm from './DistrictForm'
import {useQuery} from '@tanstack/react-query'
import {useParams} from 'react-router-dom';

const getStuff = async (reset: UseFormReset<District>, d: DistrictDbType): Promise<void> => {
  console.log("Get Stuff", d)
  const leader = await getMember(d.leaderId)
  if (leader === undefined) {
    console.log("Error, no leader found")
    return
  }
  const newDistrict = {
    id: d.id,
    name: d.name,
    leader,
    members: []
  }
  reset(newDistrict)
}

const EditDistrict = (): React.ReactElement => {
  const {districtId} = useParams();

  const form = useForm<District>({
    resolver: zodResolver(DistrictSchema),
    defaultValues: {
      id: undefined,
      name: undefined,
      leader: undefined,
      assistant: undefined,
      members: []
    }
  })

  const {data} = useQuery({
    queryKey: ["district", districtId],
    queryFn: () => getDistrict(districtId as string),
    enabled: districtId !== undefined,
    retry: false
  })

  useEffect(() => {
    if (data) {
      getStuff(form.reset, data)
    }
  }, [data, form])

  const onSubmit: SubmitHandler<District> = async (data) => {
    const dbDistrict: DistrictDbType = {
      id: data.id,
      name: data.name,
      leaderId: data.leader.id
    }
    dbDistrict.assistantId = data?.assistant?.id ?? undefined
    saveDistrict(dbDistrict)
    .then(d => {
      console.log("created", d)
    })
    .catch((err: Error) => {
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
                Save
              </button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditDistrict

