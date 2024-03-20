import {Button} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {zodResolver} from "@hookform/resolvers/zod"
import {SubmitHandler, useForm} from "react-hook-form"
import type {District, Member} from "@/type"
import {DistrictSchema} from "@/type"
import React, { useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList, CommandSeparator
} from "@/components/ui/command"
import {CommandInput} from "@/components/ui/command"
import {
  CaretSortIcon, CheckIcon
} from "@radix-ui/react-icons";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {useQuery} from "@tanstack/react-query"
import {getMembers} from "@/api"
import {cn} from "@/lib/utils.ts"

const AddDistrict = (): React.ReactElement => {
  const [open, setOpen] = useState(false)
  const [leader, setLeader] = React.useState("")

  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  const form = useForm<District>({
    resolver: zodResolver(DistrictSchema),
    defaultValues: {
      id: '',
      name: '',
      leaderId: '',
      membersIds: []
    }
  })

  const onSubmit: SubmitHandler<District> = async (data) => {
     console.log("Data", data)


  }

  if(Object.keys(form.formState.errors).length > 0) {
    console.log("errors", form.formState.errors)
  }

  const memberList: Member[] = data?.docs.map((d) => d.data())

  return (
    <>
      <div className="text-xl flex justify-around">Add District</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
          <FormField
            control={form.control}
            name="leaderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leader Name</FormLabel>
                <FormControl>
                  <Input placeholder="Leader name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {leader ? leader : "Select leader ..."}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    {memberList?.map((member) => (
                      <CommandItem
                        key={member.id}
                        value={member.familyName}
                        onSelect={(currentValue) => {
                          setLeader(currentValue === leader ? "" : currentValue)
                          setOpen(false)
                        }}
                      >
                        {member.familyName}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            leader === member.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
      Add Member to District
    </>
  )
}

export default AddDistrict
