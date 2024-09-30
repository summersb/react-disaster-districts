import React from 'react'
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { District, Member } from '@/type'
import haversine from 'haversine'
import { useQuery } from '@tanstack/react-query'
import { getDistrictList } from '@/api'
import { useNavigate } from 'react-router-dom'

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
  showLabel: boolean
}

const declutter = (members: Member[]): Member[] => {
  return members.map(m => {
    const start = { latitude: m.lat, longitude: m.lng }
    const toClose = members.filter(mm => mm.id !== m.id)
      .find(otherM => {
        const end = { latitude: otherM.lat, longitude: otherM.lng }
        const distance = haversine(start, end)
        return distance < 0.01
      })
    if (toClose) {
      m.lat += .0005
    }
    return m
  })
}

const OSMMapWithMarkers = (props: MapWithMarkersProps): React.ReactElement => {
  const navigate = useNavigate()
  const markerClicked = (member: Member) => {
    if (props.markerClicked) {
      props.markerClicked(member)
    }
  }

  const districtClicked = (district: District) => {
    navigate(`/district/${district.id}`)
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

  function getGroupIcon(district: District): L.Icon {
    const color = district.color

    return new L.Icon({
      iconUrl: `/images/Group.svg`,
      iconSize: [50, 80], // size of the icon
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
      {declutter(props.members).map((member: Member) => (
        <Marker
          key={member.id}
          position={[member.lat ?? 0, member.lng ?? 0]}
          eventHandlers={{ click: () => markerClicked(member) }}
          icon={getMemberIcon(member)}
        >
          {props.showLabel && <Tooltip direction="right" offset={[0, 20]} opacity={.5}
                                       permanent>{member.familyName}, {member.name}</Tooltip>
          }
        </Marker>
      ))}
      {props.districts?.map(d => {
        // get average lat/lng for a district
        const distMembers = d.members.map(id => props.members.find(m => m.id === id))
        const lats = distMembers.map(m => m.lat ?? 0)
        const lngs = distMembers.map(m => m.lng ?? 0)

        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length
        return (<Marker key={d.id} position={[avgLat, avgLng]} icon={getGroupIcon(d)}
                        eventHandlers={{ click: () => districtClicked(d) }}>
          <Tooltip opacity={1} direction="right" offset={[0, 20]} permanent>{d.name}</Tooltip>
        </Marker>)
      })}
    </MapContainer>
  )
}

export default OSMMapWithMarkers
