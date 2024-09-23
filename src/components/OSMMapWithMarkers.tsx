import React from 'react'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { District, Member } from '@/type'

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
  districts: District[]
  members: Member[]
  center: Position
  markerClicked?: (member: Member) => void
}

const OSMMapWithMarkers = (props: MapWithMarkersProps): React.ReactElement => {
  const markerClicked = (member: Member) => {
    if (props.markerClicked) {
      props.markerClicked(member)
    }
  }

  const getMemberColor = (memberId: string): string => {
    // check if member is leader
    const leaderColor = props.districts?.find(d => d.leaderId === memberId)?.color
    const color = props.districts?.find(d => d.members.includes(memberId))?.color
    return leaderColor ?? color ?? 'Blue'
  }

  function getMemberIcon(member: Member): L.Icon {
    const color = getMemberColor(member.id)

    return new L.Icon({
      iconUrl: `/images/${color}.svg`,
      iconSize: [25, 41], // size of the icon
      iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
      popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
      shadowUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    })
  }

  return (
    <MapContainer
      center={[props.center.lat, props.center.lng]}
      style={{ height: '100%', width: '100%' }}
      zoom={14}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView lat={props.center.lat} lng={props.center.lng} />
      {props.members.map((member: Member) => (
        <Marker
          key={member.id}
          position={[member.lat ?? 0, member.lng ?? 0]}
          eventHandlers={{ click: () => markerClicked(member) }}
          icon={getMemberIcon(member)}
        > <Tooltip direction="right" offset={[0, 20]} opacity={.5} permanent
                   onClick={() => markerClicked(member)}>{member.familyName}</Tooltip></Marker>
      ))}
    </MapContainer>
  )
}

export default OSMMapWithMarkers
