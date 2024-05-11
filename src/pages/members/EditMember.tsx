import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { getMember, saveMember } from '@/api'
import { MemberSchema } from '@/type'
import type { Member } from '@/type'
import MemberForm from './MemberForm'

const EditMember = () => {
  const { memberId } = useParams()
  const navigate = useNavigate()
  const { data } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => getMember(memberId as string),
    enabled: memberId !== undefined,
    retry: false
  })

  const form = useForm({
    resolver: zodResolver(MemberSchema),
    values: data || {
    }
  })

  const [error, setError] = useState<string>()

  const onSubmit: SubmitHandler<Partial<Member>> = (data: Partial<Member>) => {
    saveMember(data as Member).then(() => {
      navigate('/members')
    }).catch((e: Error) => {
      setError(e.message)
    })
  }

  return (
    <>
      <div className="text-xl flex justify-around">Edit Member</div>
      <div className="text-xl text-red-900">{error && error}</div>
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
            Save Member
          </Button>
          <Link to='/members'>
            <Button
              variant="outline"
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
          </Link>
        </form>
      </Form >
      <Link to='/members'><Button>Back</Button></Link>
    </>

  )
}

export default EditMember
