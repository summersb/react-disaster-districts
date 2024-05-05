import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import MapDisplay from '@/pages/map/MapDisplay'
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import type { District, Member } from "@/type"
import { DistrictSchema } from "@/type"
import React, { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { CommandInput } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useQuery } from "@tanstack/react-query"
import { getMember, getMembers, createDistrict } from "@/api"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"

const AddDistrict = (): React.ReactElement => {
  const [openLeader, setOpenLeader] = useState(false)
  const [openAssistant, setOpenAssistant] = useState(false)

  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

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

  const leader = form.getValues("leader")
  const assistant = form.getValues("assistant")

  const onSubmit: SubmitHandler<District> = async (data) => {
    createDistrict(data)
      .then(d => {
        console.log("created", d)
        form.setValue("id", d.id)
//        if(d.assistantId) {
//          const m = getMember(d.assistantId)
//          if (m != null) {
//            form.setValue("assistant",  m)
//          }
//        }
        // need to update the rest of  the form data with what came back from the db
      })
      .catch(err => {
        form.setError("name", {
          type:'custom',
          message: err.message
        })
      })
  }
  console.log("Data", form.getValues())

  if (Object.keys(form.formState.errors).length > 0) {
    console.log("errors", form.formState.errors)
  }

  const memberList: Member[] = data?.docs.map((d) => d.data()) ?? []

  return (
    <div className="h-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full bg-white rounded p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create District</h2>

        <Form {...form}>

          <form action="#"
            onSubmit={form.handleSubmit(onSubmit)}
            method="POST">
            <div className="text-gray-700 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District Name</FormLabel>
                    <FormControl>
                      <Input placeholder="District name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-gray-700 mb-4">
              <FormLabel className={cn(form.formState.errors.leader && "text-destructive")} >Leader</FormLabel>
              <Popover open={openLeader} onOpenChange={setOpenLeader}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    {leader?.id ? (
                      <>
                        {`${leader.familyName}, ${leader.name}`}
                      </>
                    ) : (
                      <>Select district leader</>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                  <Command>
                    <CommandInput placeholder="Leader" />
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {memberList?.filter(m => m.id !== assistant?.id ?? "").map((member) => (
                          <CommandItem
                            key={member.id}
                            value={member.id}
                            keywords={[member.familyName, member.name, member.formattedAddress]}
                            onSelect={() => {
                              form.setValue('leader', member)
                              setOpenLeader(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                leader?.id === member.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span>{member.familyName}, {member.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {form.formState.errors.leader && <div className="text-sm font-medium text-destructive">Leader must be selected</div>}
            </div>

            <div className="text-gray-700 mb-4">
              <FormLabel>Assistant Leader</FormLabel>
              <Popover open={openAssistant} onOpenChange={setOpenAssistant}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    {assistant?.id ? (
                      <>
                        {`${assistant.familyName}, ${assistant.name}`}
                      </>
                    ) : (
                      <>Select district assistant leader</>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                  <Command>
                    <CommandInput placeholder="Assistant Leader" />
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {memberList?.filter(m => m.id !== leader?.id ?? "").map((member) => (
                          <CommandItem
                            key={member.id}
                            value={member.id}
                            keywords={[member.familyName, member.name, member.formattedAddress]}
                            onSelect={() => {
                              form.setValue('assistant', member)
                              setOpenAssistant(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                assistant?.id === member.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span>{member.familyName}, {member.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex text-gray-700 mb-4">
              <div className="w-1/2 mr-2">
                <label htmlFor="districtMembers" className="block text-gray-700 font-bold mb-2">
                  Members
                </label>
              </div>
              <div className="w-1/2 mr-2">
                <label htmlFor="map" className="block text-gray-700 font-bold mb-2">
                  Map
                </label>
              </div>
            </div>

            <div className="flex text-gray-700 mb-4 h-[500px]">
              <div className="w-1/2 mr-2">
                <textarea
                  id="districtMembers"
                  name="districtMembers"
                  className="w-full px-3 py-2 border rounded-md text-gray-700 h-full resize-none focus:outline-none focus:border-blue-500"
                  placeholder="Add from map"
                ></textarea>
              </div>
              <div className="w-1/2 ml-2">
                <MapDisplay lat={leader?.lat ?? 33.1928423} lng ={leader?.lng ?? -117.2413057}/>
              </div>
            </div>

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
