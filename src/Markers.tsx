import { AdvancedMarker } from '@vis.gl/react-google-maps'
import type { Member } from '~/type/index'
import React from 'react'

type Props = { members: Member[] }

export default function Markers({ members }: Props) {
  return (
    <div>
      {members.map((member) => (
        <AdvancedMarker
          position={new google.maps.LatLng(member.lat, member.lng)}
          key={member.familyName}
        >
          <span>🏠</span>
        </AdvancedMarker>
      ))}
    </div>
  )
}
