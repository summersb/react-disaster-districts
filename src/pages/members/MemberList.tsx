import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getMembers } from '../../api'
import { Button } from '../../components/ui/button'

const MemberList = () => {
  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  const onSubmit = (e) => {
    console.log(e)
  }
  return (
    <>
      <div>MemberList</div>
      <Button variant="ghost" onSubmit={onSubmit}>
        Download CSV
      </Button>
      {data && (
        <ul>
          {data.docs.map((m) => (
            <li key={m.id}>{m.data().name}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export default MemberList
