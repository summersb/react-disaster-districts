import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getMembers } from './api'

const MemberList = () => {
  const { data } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })

  return (
    <>
      <div>MemberList</div>
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
