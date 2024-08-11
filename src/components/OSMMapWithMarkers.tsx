import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Member } from '@/type'

type MapWithMarkersProps = {
  members: Member[],
  center: {
    lat: number
    lng: number
  }
}

const OSMMapWithMarkers = (props: MapWithMarkersProps): React.ReactElement => {
  return (
      <MapContainer
        center={[props.center.lat, props.center.lng]} style={{ height: '100%', width: '100%' }}
        zoom={14}
        zoomControl={false}>
        <TileLayer
          attribution='&copy: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.members.map((member: Member) => (
          <Marker key={member.id} position={[member.lat ?? 0, member.lng ?? 0]}>
           <Popup>
             A marker at {member.lat}, {member.lng}
           </Popup>
         </Marker>
        ))}
      </MapContainer>
  )
}

export default OSMMapWithMarkers