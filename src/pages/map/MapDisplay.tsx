import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getMemberList } from '@/api'
import { DistrictDbType, Member } from '@/type'
import OSMMapWithMarkers from '@/components/OSMMapWithMarkers.tsx'

type MapDisplayProps = {
  lat?: number
  lng?: number
  districts?: DistrictDbType[]
  members?: Member[]
}

const MapDisplay = ({
  members,
  lat = 33.1928423,
  lng = -117.2413057,
}: MapDisplayProps): React.ReactElement => {
  const { data, isError, error } = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList,
    retry: false,
  })

  if (isError) {
    alert(error)
  }

  const m = (members ?? data)?.filter((m) => m.lat !== undefined)
  console.log('Center', lat, lng)
  const center = {
    lat: lat ?? 0,
    lng: lng ?? 0,
  }
  return (
    <div className="h-full">
      {m && <OSMMapWithMarkers members={m} center={center} />}
    </div>
  )
}

export default MapDisplay
