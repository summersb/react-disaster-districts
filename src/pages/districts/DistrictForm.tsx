import { useState } from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { CommandInput } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import MapDisplay from '@/pages/map/MapDisplay'
import { useQuery } from "@tanstack/react-query"
import { getMembers } from "@/api"
import type { Member } from "@/type"

const DistrictForm = () => {
  const [openLeader, setOpenLeader] = useState(false)
  const [openAssistant, setOpenAssistant] = useState(false)
  const form = useFormContext()
  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  const leader = form.getValues("leader")
  const assistant = form.getValues("assistant")

  const memberList: Member[] = data?.docs.map((d) => d.data()) ?? []
  return (
    <>
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
                      keywords={[member.familyName, member.name, member?.formattedAddress ?? '']}
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
          <MapDisplay lat={leader?.lat ?? 33.1928423} lng={leader?.lng ?? -117.2413057} />
        </div>
      </div>
    </>
  )
}
export default DistrictForm
