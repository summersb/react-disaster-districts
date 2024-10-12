import React from 'react'
import { Member } from '@/type'

type MemberDisplayNameProps = {
  member: Member
}

const MemberDisplayName = (props: MemberDisplayNameProps): React.ReaactElement => {
  const name = `${props?.member?.familyName}`
  const f = props?.member?.name ? `, ${props.member.name}` : ''
  return (
    <span>{name}{f}</span>
  )
}

export default MemberDisplayName