import { AdvancedMarker } from '@vis.gl/react-google-maps'
import type { Member } from '~/type/index'
import React from 'react'

type Props = { members: Member[] }

export default function Markers({ members }: Props) {
  return (
    <div>
      {members.map((member) => (
        <AdvancedMarker
          position={
            new google.maps.LatLng(member.location._lat, member.location._long)
          }
          key={member.id}
        >
          <span>🏠</span>
        </AdvancedMarker>
      ))}
    </div>
  )
}
