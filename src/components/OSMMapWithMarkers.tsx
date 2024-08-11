import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Member } from '@/type'

type Position = {
  lat: number
  lng: number
}

function ChangeView(center: Position) {
  const map = useMap()
  map.setView(center)
  return null
}

type MapWithMarkersProps = {
  members: Member[],
  center: Position
  markerClicked?: (member: Member) => void
}

const OSMMapWithMarkers = (props: MapWithMarkersProps): React.ReactElement => {
  const markerClicked = (member: Member) => {
    console.log(member)
    if (props.markerClicked) {
      props.markerClicked(member)
    }
  }
  return (
    <MapContainer
      center={[props.center.lat, props.center.lng]} style={{ height: '100%', width: '100%' }}
      zoom={14}
      zoomControl={false}>
      <TileLayer
        attribution='&copy: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView lat={props.center.lat} lng={props.center.lng} />
      {props.members.map((member: Member) => (
        <Marker key={member.id} position={[member.lat ?? 0, member.lng ?? 0]}
                eventHandlers={{ click: () => markerClicked(member) }}
        >
        </Marker>
      ))}
    </MapContainer>
  )
}

export default OSMMapWithMarkers