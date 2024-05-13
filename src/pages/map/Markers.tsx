import { AdvancedMarker, Marker } from '@vis.gl/react-google-maps'
import type { Member } from '@/type/index'

type Props = { members: Member[] }

export default function Markers({ members }: Props) {
  return (
    <div>
      {members.filter(m => m.lat !== undefined && m.lng !== undefined).map((member) => (
        <Marker
          position={{ lat: member.lat as number, lng: member.lng as number}}
          key={member.id}
          fillColor="green"
          onClick={(e) => console.log(e)}
        />
      ))}
    </div>
  )
}
